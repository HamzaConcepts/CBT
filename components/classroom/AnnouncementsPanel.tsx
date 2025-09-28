"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Bell, Plus } from "lucide-react"
import { mutate } from 'swr'
import { supabase } from '@/lib/supabaseClient'
import { useCurrentUser } from '@/hooks/useCurrentUser'

type DbAnnouncement = {
  id: string
  title: string
  content: string
  author: string | null
  created_at: string
}

interface AnnouncementsPanelProps {
  announcements: DbAnnouncement[]
  userRole: string | null
  classroomId: string
  isLoading?: boolean
}

export function AnnouncementsPanel({ 
  announcements, 
  userRole, 
  classroomId,
  isLoading = false 
}: AnnouncementsPanelProps) {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: "",
    content: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { user } = useCurrentUser()

  const handleCreateAnnouncement = async () => {
    if (!newAnnouncement.title || !newAnnouncement.content) return
    if (!user) {
      alert("You must be signed in to create an announcement.")
      return
    }
    
    setIsSubmitting(true)
    try {
      // Get current user for author
      const { data: profile } = await supabase
        .from("profiles")
        .select("name")
        .eq("user_id", user.id)
        .maybeSingle()

      const { error } = await supabase
        .from("announcements")
        .insert({
          classroom_id: classroomId,
          title: newAnnouncement.title,
          content: newAnnouncement.content,
          author: profile?.name || user.email || "Teacher",
        })

      if (error) throw error

      // Revalidate the announcements cache
      mutate(`announcements-${classroomId}`)
      
      setNewAnnouncement({ title: "", content: "" })
      setIsCreateDialogOpen(false)
    } catch (error) {
      console.error("Error creating announcement:", error)
      alert("Failed to create announcement. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Announcements
              </CardTitle>
              <CardDescription>Latest updates and news</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="p-4 border rounded-lg animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-full mb-1"></div>
                <div className="h-3 bg-gray-200 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Announcements
            </CardTitle>
            <CardDescription>Latest updates and news</CardDescription>
          </div>
          {userRole === 'TEACHER' && (
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="gradient-primary">
                  <Plus className="w-4 h-4 mr-2" />
                  New
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create Announcement</DialogTitle>
                  <DialogDescription>Share important information with your students</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="announcementTitle">Title</Label>
                    <Input
                      id="announcementTitle"
                      placeholder="Announcement title"
                      value={newAnnouncement.title}
                      onChange={(e) => setNewAnnouncement((prev) => ({ ...prev, title: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="announcementContent">Message</Label>
                    <Textarea
                      id="announcementContent"
                      placeholder="Your announcement message..."
                      rows={4}
                      value={newAnnouncement.content}
                      onChange={(e) => setNewAnnouncement((prev) => ({ ...prev, content: e.target.value }))}
                    />
                  </div>
                  <div className="flex gap-2 pt-4">
                    <Button 
                      variant="outline" 
                      onClick={() => setIsCreateDialogOpen(false)} 
                      className="flex-1"
                      disabled={isSubmitting}
                    >
                      Cancel
                    </Button>
                    <Button 
                      onClick={handleCreateAnnouncement} 
                      className="flex-1 gradient-primary"
                      disabled={isSubmitting || !newAnnouncement.title || !newAnnouncement.content}
                    >
                      {isSubmitting ? "Creating..." : "Create"}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {announcements.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Bell className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No announcements yet</p>
              {userRole === 'TEACHER' && (
                <p className="text-sm mt-1">Create your first announcement to share updates with students</p>
              )}
            </div>
          ) : (
            announcements.map((announcement) => (
              <div key={announcement.id} className="p-4 border rounded-lg hover:bg-muted/30 transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium">{announcement.title}</h4>
                  <span className="text-xs text-muted-foreground">
                    {new Date(announcement.created_at).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mb-2 whitespace-pre-wrap">
                  {announcement.content}
                </p>
                <p className="text-xs text-muted-foreground">
                  By {announcement.author || "Teacher"}
                </p>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}