"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  BookOpen, 
  Plus, 
  FileText, 
  Download, 
  ExternalLink,
  Video,
  Image as ImageIcon,
  FileIcon,
  Upload
} from "lucide-react"
import { mutate } from 'swr'
import { supabase } from '@/lib/supabaseClient'

type DbMaterial = {
  id: string
  title: string
  description: string | null
  file_url: string | null
  uploaded_at: string
  type: string
}

interface MaterialsSectionProps {
  materials: DbMaterial[]
  userRole: string | null
  classroomId: string
  isLoading?: boolean
}

export function MaterialsSection({ 
  materials, 
  userRole, 
  classroomId,
  isLoading = false 
}: MaterialsSectionProps) {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [newMaterial, setNewMaterial] = useState({
    title: "",
    description: "",
    type: "document",
    file_url: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const getFileIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'video':
        return <Video className="w-5 h-5" />
      case 'image':
        return <ImageIcon className="w-5 h-5" />
      case 'document':
        return <FileText className="w-5 h-5" />
      default:
        return <FileIcon className="w-5 h-5" />
    }
  }

  const getFileTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'video':
        return 'bg-red-100 text-red-700 border-red-200'
      case 'image':
        return 'bg-green-100 text-green-700 border-green-200'
      case 'document':
        return 'bg-blue-100 text-blue-700 border-blue-200'
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  const handleCreateMaterial = async () => {
    if (!newMaterial.title) return
    
    setIsSubmitting(true)
    try {
      const { error } = await supabase
        .from("materials")
        .insert({
          classroom_id: classroomId,
          title: newMaterial.title,
          description: newMaterial.description,
          type: newMaterial.type,
          file_url: newMaterial.file_url || null,
        })

      if (error) throw error

      // Revalidate the materials cache
      mutate(`materials-${classroomId}`)
      
      setNewMaterial({ title: "", description: "", type: "document", file_url: "" })
      setIsCreateDialogOpen(false)
    } catch (error) {
      console.error("Error creating material:", error)
      alert("Failed to create material. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDownload = (material: DbMaterial) => {
    if (material.file_url) {
      window.open(material.file_url, '_blank')
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Course Materials
              </CardTitle>
              <CardDescription>Loading materials...</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between p-3 border rounded-lg animate-pulse">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-200 rounded"></div>
                  <div>
                    <div className="h-4 bg-gray-200 rounded w-32 mb-1"></div>
                    <div className="h-3 bg-gray-200 rounded w-24"></div>
                  </div>
                </div>
                <div className="h-8 bg-gray-200 rounded w-20"></div>
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
              <BookOpen className="w-5 h-5" />
              Course Materials
            </CardTitle>
            <CardDescription>
              {userRole === 'STUDENT' 
                ? 'Resources and files shared by your teacher'
                : 'Share resources and files with your students'
              }
            </CardDescription>
          </div>
          {userRole === 'TEACHER' && (
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="gradient-primary">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Material
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Course Material</DialogTitle>
                  <DialogDescription>Share a new resource with your students</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="materialTitle">Title</Label>
                    <Input
                      id="materialTitle"
                      placeholder="Material title"
                      value={newMaterial.title}
                      onChange={(e) => setNewMaterial((prev) => ({ ...prev, title: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="materialType">Type</Label>
                    <Select
                      value={newMaterial.type}
                      onValueChange={(value) => setNewMaterial((prev) => ({ ...prev, type: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="document">Document</SelectItem>
                        <SelectItem value="video">Video</SelectItem>
                        <SelectItem value="image">Image</SelectItem>
                        <SelectItem value="link">Link</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="materialUrl">File URL (optional)</Label>
                    <Input
                      id="materialUrl"
                      placeholder="https://..."
                      value={newMaterial.file_url}
                      onChange={(e) => setNewMaterial((prev) => ({ ...prev, file_url: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="materialDescription">Description</Label>
                    <Textarea
                      id="materialDescription"
                      placeholder="Brief description of this material..."
                      rows={3}
                      value={newMaterial.description}
                      onChange={(e) => setNewMaterial((prev) => ({ ...prev, description: e.target.value }))}
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
                      onClick={handleCreateMaterial} 
                      className="flex-1 gradient-primary"
                      disabled={isSubmitting || !newMaterial.title}
                    >
                      {isSubmitting ? "Adding..." : "Add Material"}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {materials.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <h3 className="font-medium mb-1">No materials available</h3>
              <p className="text-sm">
                {userRole === 'TEACHER' 
                  ? "Add your first course material to share resources with students"
                  : "Your teacher hasn't shared any materials yet"
                }
              </p>
            </div>
          ) : (
            materials.map((material) => (
              <div 
                key={material.id} 
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/30 transition-colors"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className={`p-2 rounded-lg ${getFileTypeColor(material.type)}`}>
                    {getFileIcon(material.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium truncate">{material.title}</h4>
                      <Badge variant="outline" className="text-xs">
                        {material.type}
                      </Badge>
                    </div>
                    {material.description && (
                      <p className="text-sm text-muted-foreground line-clamp-1">
                        {material.description}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground mt-1">
                      Added {new Date(material.uploaded_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDownload(material)}
                    disabled={!material.file_url}
                    className="bg-transparent"
                  >
                    {material.type === 'link' ? (
                      <>
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Open
                      </>
                    ) : (
                      <>
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </>
                    )}
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}