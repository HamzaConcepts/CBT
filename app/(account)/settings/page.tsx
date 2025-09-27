"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

type Profile = {
  user_id: string
  email: string | null
  name: string | null
  role: string
  phone: string | null
}

export default function SettingsPage() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const { data: userData } = await supabase.auth.getUser()
      const userId = userData.user?.id
      if (!userId) {
        window.location.href = "/"
        return
      }
      const { data } = await supabase.from("profiles").select("user_id,email,name,role,phone").eq("user_id", userId).single()
      setProfile(data as Profile)
      setLoading(false)
    }
    load()
  }, [])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    window.location.href = "/"
  }

  if (loading) return null

  return (
    <div className="container mx-auto p-6">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Account Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-muted-foreground">Name</div>
              <div className="font-medium">{profile?.name ?? "-"}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Email</div>
              <div className="font-medium">{profile?.email ?? "-"}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Role</div>
              <div className="font-medium">{profile?.role}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Phone</div>
              <div className="font-medium">{profile?.phone ?? "-"}</div>
            </div>
          </div>
          <div className="pt-4">
            <Button variant="destructive" onClick={handleSignOut}>Sign Out</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}


