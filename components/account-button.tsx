"use client"

import { useEffect, useState } from "react"
import useSWR from 'swr'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { supabase } from "@/lib/supabaseClient"
import { useCurrentUser } from "@/hooks/useCurrentUser"
import { useRouter } from "next/navigation"

type Profile = {
  user_id: string
  email: string | null
  name: string | null
}

export function AccountButton() {
  const [open, setOpen] = useState(false)
  const { user, isLoading: userLoading } = useCurrentUser()
  const router = useRouter()
  
  // Use SWR for profile data with proper caching
  const { data: profile } = useSWR(
    !userLoading && user?.id ? `profile-${user.id}` : null,
    async () => {
      if (!user?.id) return null
      const { data } = await supabase
        .from("profiles")
        .select("user_id,email,name")
        .eq("user_id", user.id)
        .single()
      return data as Profile
    },
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 300000, // 5 minutes - profile rarely changes
      revalidateIfStale: false,
      errorRetryCount: 0,
    }
  )

  const signOut = async () => {
    await supabase.auth.signOut()
    router.replace("/")
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


