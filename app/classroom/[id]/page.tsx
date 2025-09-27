import { ClassroomDetail } from "@/components/classroom-detail"
import { supabase } from "@/lib/supabaseClient"

async function authorize(classroomId: string) {
  const { data: userData } = await supabase.auth.getUser()
  const userId = userData.user?.id
  if (!userId) {
    if (typeof window !== "undefined") window.location.href = "/"
    return false
  }
  const { data: membership } = await supabase
    .from("classroom_memberships")
    .select("id")
    .eq("classroom_id", classroomId)
    .eq("user_id", userId)
    .maybeSingle()
  if (!membership) {
    if (typeof window !== "undefined") window.location.href = "/dashboard"
    return false
  }
  return true
}

export default function ClassroomPage({ params }: { params: { id: string } }) {
  // Client-side guard; Next.js route segment is client by default here
  authorize(params.id)
  return <ClassroomDetail classroomId={params.id} />
}
