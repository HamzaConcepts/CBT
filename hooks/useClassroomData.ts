import useSWR from 'swr'
import { supabase } from '@/lib/supabaseClient'

// Custom fetcher function for Supabase queries
const fetcher = async (key: string) => {
  // This function will be customized per hook
  throw new Error('Fetcher function must be implemented per hook')
}

export function useClassroom(classroomId: string) {
  return useSWR(
    classroomId ? `classroom-${classroomId}` : null,
    async () => {
      const { data, error } = await supabase
        .from("classrooms")
        .select("id,name,subject,code,description,schedule,room,color,teacher_id")
        .eq("id", classroomId)
        .maybeSingle()
      
      if (error) throw error
      return data
    }
  )
}

export function useTeacher(teacherId?: string) {
  return useSWR(
    teacherId ? `teacher-${teacherId}` : null,
    async () => {
      if (!teacherId) return null
      
      const { data, error } = await supabase
        .from("profiles")
        .select("user_id,name,email")
        .eq("user_id", teacherId)
        .maybeSingle()
      
      if (error) throw error
      return data
    }
  )
}

export function useUserRole(classroomId: string, userId?: string) {
  return useSWR(
    userId ? `user-role-${classroomId}-${userId}` : null,
    async () => {
      if (!userId) return null
      
      const { data, error } = await supabase
        .from("classroom_memberships")
        .select("role")
        .eq("classroom_id", classroomId)
        .eq("user_id", userId)
        .maybeSingle()
      
      if (error) throw error
      return data?.role || "STUDENT"
    }
  )
}

export function useAnnouncements(classroomId: string) {
  return useSWR(
    `announcements-${classroomId}`,
    async () => {
      const { data, error } = await supabase
        .from("announcements")
        .select("id,title,content,author,created_at")
        .eq("classroom_id", classroomId)
        .order("created_at", { ascending: false })
      
      if (error) throw error
      return data || []
    }
  )
}

export function useAssignments(classroomId: string) {
  return useSWR(
    `assignments-${classroomId}`,
    async () => {
      const { data, error } = await supabase
        .from("assignments")
        .select("id,title,type,due_at,points,status,description")
        .eq("classroom_id", classroomId)
        .order("created_at", { ascending: false })
      
      if (error) throw error
      return data || []
    }
  )
}

export function useExams(classroomId: string) {
  return useSWR(
    classroomId ? `exams-${classroomId}` : null,
    async () => {
      const { data, error } = await supabase
        .from("exams")
        .select(
          "id,classroom_id,created_by,title,description,type,duration_min,question_count,total_marks,status,available_from,available_until,due_at,max_attempts,lock_on_start,created_at"
        )
        .eq("classroom_id", classroomId)
        .order("available_from", { ascending: true, nullsFirst: true })
        .order("created_at", { ascending: false })

      if (error) throw error
      return data || []
    }
  )
}

export function useMaterials(classroomId: string) {
  return useSWR(
    `materials-${classroomId}`,
    async () => {
      const { data, error } = await supabase
        .from("materials")
        .select("id,title,description,file_url,uploaded_at,type")
        .eq("classroom_id", classroomId)
        .order("uploaded_at", { ascending: false })
      
      if (error) throw error
      return data || []
    }
  )
}

export function useRoster(classroomId: string, userRole?: string) {
  return useSWR(
    userRole === "TEACHER" ? `roster-${classroomId}` : null,
    async () => {
      // Use the classroom_roster view that combines memberships with auth.users data
      const { data, error } = await supabase
        .from("classroom_roster")
        .select("user_id, status, joined_at, role, email, name")
        .eq("classroom_id", classroomId)
        .eq("status", "active")
        .eq("role", "STUDENT")
      
      if (error) {
        console.error("Error fetching roster:", error)
        throw error
      }
      
      if (!data || data.length === 0) return []
      
      // Transform the data to match the expected structure
      const rosterData = data.map(student => ({
        user_id: student.user_id,
        status: student.status,
        joined_at: student.joined_at,
        role: student.role,
        profiles: {
          user_id: student.user_id,
          name: student.name,
          email: student.email
        }
      }))
      
      return rosterData
    }
  )
}

export function useSubmissions(classroomId: string, userId?: string, assignments?: any[]) {
  return useSWR(
    userId && assignments?.length ? `submissions-${classroomId}-${userId}` : null,
    async () => {
      if (!userId || !assignments?.length) return []
      
      const { data, error } = await supabase
        .from("submissions")
        .select(`
          id,assignment_id,user_id,submitted_at,score,status,content,
          assignments!inner(title,type,due_at,points)
        `)
        .eq("user_id", userId)
        .in("assignment_id", assignments.map(a => a.id))
      
      if (error) throw error
      
      // Transform the data to match expected structure
      return (data || []).map(submission => ({
        ...submission,
        assignments: Array.isArray(submission.assignments) 
          ? submission.assignments[0] 
          : submission.assignments
      }))
    }
  )
}