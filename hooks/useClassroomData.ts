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
      // First get the classroom memberships
      const { data: memberships, error: membershipsError } = await supabase
        .from("classroom_memberships")
        .select("user_id, status, joined_at, role")
        .eq("classroom_id", classroomId)
        .eq("status", "active")
        .eq("role", "STUDENT")
      
      if (membershipsError) throw membershipsError
      if (!memberships || memberships.length === 0) return []
      
      // Then get the profiles for those users
      const userIds = memberships.map(m => m.user_id)
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("user_id, name, email")
        .in("user_id", userIds)
      
      if (profilesError) throw profilesError
      
      // Handle missing profiles
      const missingProfileUserIds = userIds.filter(id => 
        !profiles?.find(p => p.user_id === id)
      )
      
      // Create fallback profiles for missing users
      let allProfiles = profiles || []
      if (missingProfileUserIds.length > 0) {
        const missingProfiles = await Promise.all(
          missingProfileUserIds.map(async (userId) => {
            // Try to create a profile for this user
            const { data: newProfile, error } = await supabase
              .from("profiles")
              .insert({
                user_id: userId,
                email: `user-${userId.slice(0, 8)}@unknown.com`,
                name: `User ${userId.slice(0, 8)}`,
                role: 'STUDENT'
              })
              .select()
              .single()
            
            if (error) {
              return {
                user_id: userId,
                name: `Student ${userId.slice(0, 8)}`,
                email: `unknown-${userId.slice(0, 8)}@student.com`
              }
            }
            return newProfile
          })
        )
        
        allProfiles.push(...missingProfiles)
      }
      
      // Combine the data
      const rosterData = memberships.map(membership => {
        const profile = allProfiles.find(p => p.user_id === membership.user_id)
        return {
          ...membership,
          profiles: profile || {
            user_id: membership.user_id,
            name: `Student ${membership.user_id.slice(0, 8)}`,
            email: `unknown-${membership.user_id.slice(0, 8)}@student.com`
          }
        }
      })
      
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