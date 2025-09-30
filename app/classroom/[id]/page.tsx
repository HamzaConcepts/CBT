"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { ClassroomDetail } from "@/components/classroom-detail-new"
import { supabase } from "@/lib/supabaseClient"

export default function ClassroomPage({ params }: { params: { id: string } }) {
  const router = useRouter()

  useEffect(() => {
    let isActive = true

    const authorize = async (classroomId: string) => {
      try {
        const { data: userData } = await supabase.auth.getUser()
        if (!isActive) return

        const userId = userData.user?.id
        if (!userId) {
          router.replace("/")
          return
        }

        const { data: membership } = await supabase
          .from("classroom_memberships")
          .select("id")
          .eq("classroom_id", classroomId)
          .eq("user_id", userId)
          .maybeSingle()

        if (!isActive) return

        if (!membership) {
          router.replace("/dashboard")
        }
      } catch (error) {
        console.error("Failed to authorize classroom access", error)
        if (isActive) {
          router.replace("/dashboard")
        }
      }
    }

    authorize(params.id)

    return () => {
      isActive = false
    }
  }, [params.id, router])

  return <ClassroomDetail classroomId={params.id} />
}
