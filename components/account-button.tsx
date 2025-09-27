"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { supabase } from "@/lib/supabaseClient"

type Profile = {
  user_id: string
  email: string | null
  name: string | null
}

export function AccountButton() {
  const [open, setOpen] = useState(false)
  const [profile, setProfile] = useState<Profile | null>(null)

  useEffect(() => {
    const load = async () => {
      const { data: userData } = await supabase.auth.getUser()
      const userId = userData.user?.id
      if (!userId) return
      const { data } = await supabase.from("profiles").select("user_id,email,name").eq("user_id", userId).single()
      setProfile(data as Profile)
    }
    load()
  }, [])

  const signOut = async () => {
    await supabase.auth.signOut()
    window.location.href = "/"
  }

  if (!profile) return null

  return (
    <div className="fixed left-4 bottom-4 z-50">
      {!open ? (
        <Button variant="outline" className="bg-card/80 transition-transform hover:-translate-y-0.5 hover:shadow" onClick={() => setOpen(true)}>
          {profile.name || profile.email || "Account"}
        </Button>
      ) : (
        <Card className="w-72 shadow-lg">
          <CardContent className="p-4 space-y-3">
            <div>
              <div className="text-sm text-muted-foreground">Signed in as</div>
              <div className="font-medium">{profile.name || "—"}</div>
              <div className="text-sm">{profile.email || "—"}</div>
            </div>
            <div className="flex gap-2 pt-2">
              <Button variant="outline" className="flex-1 transition-colors hover:border-primary" onClick={() => setOpen(false)}>
                Close
              </Button>
              <Button variant="destructive" className="flex-1 transition-transform hover:-translate-y-0.5" onClick={signOut}>
                Log out
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}


