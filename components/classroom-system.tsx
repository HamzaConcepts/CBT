"use client"

import { useState } from "react"
import { mutate } from 'swr'
import { 
  useCreatedClassrooms, 
  useJoinedClassrooms, 
  useCreateClassroom, 
  useJoinClassroom, 
  useLeaveClassroom 
} from "@/hooks/useClassroomSystem"
import { ClassroomCard } from "@/components/classroom-system/ClassroomCard"
import { CreateClassDialog } from "@/components/classroom-system/CreateClassDialog"
import { JoinClassDialog } from "@/components/classroom-system/JoinClassDialog"
import { EmptyClassroomState } from "@/components/classroom-system/EmptyClassroomState"
import { ClassroomSection, SearchBar } from "@/components/classroom-system/ClassroomSection"

export function ClassroomSystem() {
  const [searchTerm, setSearchTerm] = useState("")
  const [copiedCode, setCopiedCode] = useState<string | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [isJoining, setIsJoining] = useState(false)
  const [leavingClassroomId, setLeavingClassroomId] = useState<string | null>(null)

  // Data fetching with SWR
  const { data: createdClasses = [], isLoading: createdLoading, mutate: mutateCreated } = useCreatedClassrooms()
  const { data: joinedClasses = [], isLoading: joinedLoading, mutate: mutateJoined } = useJoinedClassrooms()

  // Operations
  const { createClassroom } = useCreateClassroom()
  const { joinClassroom } = useJoinClassroom()
  const { leaveClassroom } = useLeaveClassroom()

  // Filter classrooms based on search term
  const filterClassrooms = (classList: any[]) => {
    if (!searchTerm) return classList
    return classList.filter((cls) => {
      const subject = (cls.subject || "").toLowerCase()
      return (
        cls.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        subject.includes(searchTerm.toLowerCase()) ||
        cls.code.toLowerCase().includes(searchTerm.toLowerCase())
      )
    })
  }

  const filteredCreatedClasses = filterClassrooms(createdClasses)
  const filteredJoinedClasses = filterClassrooms(joinedClasses)
  const hasAnyClasses = createdClasses.length > 0 || joinedClasses.length > 0
  const hasFilteredClasses = filteredCreatedClasses.length > 0 || filteredJoinedClasses.length > 0

  // Handlers
  const handleCreateClass = async (classData: {
    name: string
    subject: string
    description?: string
    code?: string
  }) => {
    setIsCreating(true)
    try {
      const newClassroom = await createClassroom(classData)
      
      // Optimistic update - add to UI immediately
      mutateCreated(
        (currentData) => [newClassroom, ...(currentData || [])],
        false // Don't revalidate immediately
      )
      
      // Revalidate to confirm
      setTimeout(() => mutateCreated(), 1000)
    } catch (error) {
      console.error("Failed to create class:", error)
      throw error // Let the dialog component handle the error display
    } finally {
      setIsCreating(false)
    }
  }

  const handleJoinClass = async (joinCode: string) => {
    setIsJoining(true)
    try {
      const newClassroom = await joinClassroom(joinCode)
      
      // Optimistic update - add to UI immediately
      mutateJoined(
        (currentData) => [newClassroom, ...(currentData || [])],
        false // Don't revalidate immediately
      )
      
      // Revalidate to confirm
      setTimeout(() => mutateJoined(), 1000)
    } catch (error) {
      console.error("Failed to join class:", error)
      throw error // Let the dialog component handle the error display
    } finally {
      setIsJoining(false)
    }
  }

  const handleLeaveClass = async (classroomId: string, className: string) => {
    const confirmed = window.confirm(`Are you sure you want to leave "${className}"? You'll need a class code to rejoin.`)
    if (!confirmed) return

    setLeavingClassroomId(classroomId) // Show loading state for this specific classroom

    try {
      // Wait for successful database operation before updating UI
      await leaveClassroom(classroomId)
      console.log(`Successfully left classroom: ${classroomId}`)
      
      // Only update UI after successful database operation
      mutateJoined()
    } catch (error) {
      console.error("Failed to leave class:", error)
      alert("Failed to leave classroom. Please try again.")
    } finally {
      setLeavingClassroomId(null) // Clear loading state
    }
  }

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code)
    setCopiedCode(code)
    setTimeout(() => setCopiedCode(null), 2000)
  }

  const isLoading = createdLoading || joinedLoading

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Your Classrooms</h2>
          <p className="text-muted-foreground">Create new classes or join existing ones with a code</p>
        </div>

        <div className="flex items-center gap-3">
          <CreateClassDialog onCreateClass={handleCreateClass} isCreating={isCreating} />
          <JoinClassDialog onJoinClass={handleJoinClass} isJoining={isJoining} />
        </div>
      </div>

      {/* Search */}
      {hasAnyClasses && (
        <SearchBar searchTerm={searchTerm} onSearch={setSearchTerm} />
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="space-y-8">
          <ClassroomSection 
            title="My Classes" 
            description="Loading..." 
            classrooms={[]}
            isLoading={true}
          >
            {/* Loading skeleton will be handled inside ClassroomSection */}
          </ClassroomSection>
        </div>
      )}

      {/* Content */}
      {!isLoading && (
        <>
          {/* My Classes Section */}
          <ClassroomSection
            title="My Classes"
            description="Classes you created and manage as a teacher"
            classrooms={filteredCreatedClasses}
          >
            {filteredCreatedClasses.map((classroom) => (
              <ClassroomCard
                key={classroom.id}
                classroom={classroom}
                role="TEACHER"
                onCopyCode={handleCopyCode}
                copiedCode={copiedCode}
              />
            ))}
          </ClassroomSection>

          {/* Classes Joined Section */}
          <ClassroomSection
            title="Classes Joined"
            description="Classes you joined as a student"
            classrooms={filteredJoinedClasses}
          >
            {filteredJoinedClasses.map((classroom) => (
              <ClassroomCard
                key={classroom.id}
                classroom={classroom}
                role="STUDENT"
                onCopyCode={handleCopyCode}
                onLeave={handleLeaveClass}
                copiedCode={copiedCode}
                isLeavingClassroom={leavingClassroomId === classroom.id}
              />
            ))}
          </ClassroomSection>

          {/* Empty State */}
          {!hasFilteredClasses && (
            <EmptyClassroomState searchTerm={searchTerm} />
          )}
        </>
      )}
    </div>
  )
}