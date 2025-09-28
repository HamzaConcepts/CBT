"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useCurrentUser } from "@/hooks/useCurrentUser"
import { useRouter } from "next/navigation"

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
  const { user, isLoading: userLoading } = useCurrentUser()
  const router = useRouter()

  useEffect(() => {
    if (userLoading) return

    if (!user) {
      setProfile(null)
      setLoading(false)
      router.replace("/")
      return
    }

    let active = true

    const load = async () => {
      setLoading(true)
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("user_id,email,name,role,phone")
          .eq("user_id", user.id)
          .single()

        if (!active) return

        if (error) {
          console.error("Failed to load profile", error)
          setProfile(null)
        } else {
          setProfile(data as Profile)
        }
      } finally {
        if (active) setLoading(false)
      }
    }

    load()

    return () => {
      active = false
    }
  }, [user?.id, userLoading, router])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.replace("/")
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


