"use client"

import { useEffect } from "react"
import { ClassroomSystem } from "@/components/classroom-system"
import DatabaseDebug from "@/components/database-debug"
import { supabase } from "@/lib/supabaseClient"

export default function DashboardPage() {
  useEffect(() => {
    const check = async () => {
      const { data } = await supabase.auth.getSession()
      if (!data.session?.user) {
        window.location.href = "/"
      }
    }
    check()
  }, [])
  return (
    <div className="container mx-auto px-4 py-8">
      <DatabaseDebug />
      <div className="mt-8">
        <ClassroomSystem />
      </div>
    </div>
  )
}


