import useSWR from 'swr'
import { supabase } from '@/lib/supabaseClient'
import { useCurrentUser } from './useCurrentUser'

type DbClassroom = {
  id: string
  name: string
  subject: string | null
  code: string
  description: string | null
  color: string | null
  teacher_id: string
}

// Hook for created classrooms (teacher role)
export function useCreatedClassrooms() {
  const { user, isLoading: userLoading } = useCurrentUser()
  
  return useSWR(
    !userLoading && user?.id ? `created-classrooms-${user.id}` : null,
    async () => {
      if (!user?.id) return []
      
      const { data, error } = await supabase
        .from("classrooms")
        .select("id,name,subject,code,description,color,teacher_id")
        .eq("teacher_id", user.id)
        .order("created_at", { ascending: false })

      if (error) throw error
      return data || []
    },
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 120000, // 2 minutes
      revalidateIfStale: false,
      errorRetryCount: 0
    }
  )
}

// Hook for joined classrooms (student role)
export function useJoinedClassrooms() {
  const { user, isLoading: userLoading } = useCurrentUser()
  
  return useSWR(
    !userLoading && user?.id ? `joined-classrooms-${user.id}` : null,
    async () => {
      if (!user?.id) return []
      
      const { data: studentMemberships, error } = await supabase
        .from("classroom_memberships")
        .select("classrooms(id,name,subject,code,description,color,teacher_id)")
        .eq("user_id", user.id)
        .eq("role", "STUDENT")
        .eq("status", "active")

      if (error) throw error
      
      const studentClasses = (studentMemberships || [])
        .map((r: any) => r.classrooms)
        .filter(Boolean) // Remove any null classrooms

      return studentClasses
    },
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false, 
      dedupingInterval: 120000, // 2 minutes
      revalidateIfStale: false,
      errorRetryCount: 0
    }
  )
}

// Hook for creating a classroom
export function useCreateClassroom() {
  const { user } = useCurrentUser()
  
  const createClassroom = async (classroomData: {
    name: string
    subject: string
    description?: string
    code?: string
  }) => {
    if (!user?.id) throw new Error("User must be authenticated")
    
    const colors = [
      "bg-gradient-to-br from-blue-500 to-purple-600",
      "bg-gradient-to-br from-green-500 to-teal-600",
      "bg-gradient-to-br from-orange-500 to-red-600",
      "bg-gradient-to-br from-pink-500 to-rose-600",
      "bg-gradient-to-br from-indigo-500 to-blue-600",
    ]
    
    const color = colors[Math.floor(Math.random() * colors.length)]
    const code = classroomData.code || Math.random().toString(36).substring(2, 8).toUpperCase()

    const { data, error } = await supabase
      .from("classrooms")
      .insert({ 
        name: classroomData.name, 
        subject: classroomData.subject, 
        description: classroomData.description, 
        code, 
        color, 
        teacher_id: user.id 
      })
      .select("id,name,subject,code,description,color,teacher_id")
      .single()

    if (error) throw error
    
    // Ensure creator is teacher member
    await supabase
      .from("classroom_memberships")
      .upsert({ 
        classroom_id: data.id, 
        user_id: user.id, 
        role: "TEACHER", 
        status: "active" 
      }, { 
        onConflict: "classroom_id,user_id" 
      })

    return data
  }

  return { createClassroom }
}

// Hook for joining a classroom
export function useJoinClassroom() {
  const { user } = useCurrentUser()
  
  const joinClassroom = async (joinCode: string) => {
    if (!user?.id) throw new Error("User must be authenticated")
    if (!joinCode.trim()) throw new Error("Please enter a class code")

    // Check if classroom exists with this code
    const { data: classRow, error: fetchError } = await supabase
      .from("classrooms")
      .select("id,name,subject,code,description,color,teacher_id")
      .eq("code", joinCode.trim().toUpperCase())
      .maybeSingle()

    if (fetchError) throw new Error("Error checking class code. Please try again.")
    if (!classRow) throw new Error("Invalid class code. No classroom found with this code.")

    // Check if user is already a member
    const { data: existingMembership } = await supabase
      .from("classroom_memberships")
      .select("id")
      .eq("classroom_id", classRow.id)
      .eq("user_id", user.id)
      .maybeSingle()

    if (existingMembership) {
      throw new Error("You are already a member of this classroom.")
    }

    // Join the classroom
    const { error: joinError } = await supabase
      .from("classroom_memberships")
      .insert({
        classroom_id: classRow.id,
        user_id: user.id,
        role: "STUDENT",
        status: "active"
      })

    if (joinError) throw new Error("Failed to join classroom. Please try again.")

    return classRow
  }

  return { joinClassroom }
}

// Hook for leaving a classroom
export function useLeaveClassroom() {
  const { user } = useCurrentUser()
  
  const leaveClassroom = async (classroomId: string) => {
    if (!user?.id) throw new Error("User must be authenticated")
    
    const { error } = await supabase
      .from("classroom_memberships")
      .delete()
      .eq("classroom_id", classroomId)
      .eq("user_id", user.id)

    if (error) {
      throw new Error("Failed to leave classroom. Please try again.")
    }
  }

  return { leaveClassroom }
}

// Utility hook for generating class codes
export function useGenerateClassCode() {
  const generateCode = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase()
  }

  return { generateCode }
}