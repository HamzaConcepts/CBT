"use client"

import { Button } from "@/components/ui/button"
import { Plus, UserPlus, GraduationCap } from "lucide-react"

interface EmptyClassroomStateProps {
  searchTerm?: string
  onCreateClass?: () => void
  onJoinClass?: () => void
}

export function EmptyClassroomState({ 
  searchTerm, 
  onCreateClass, 
  onJoinClass 
}: EmptyClassroomStateProps) {
  return (
    <div className="text-center py-12">
      <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
        <GraduationCap className="w-12 h-12 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold mb-2">
        {searchTerm ? "No classes found" : "No classes yet"}
      </h3>
      <p className="text-muted-foreground mb-4">
        {searchTerm ? "Try adjusting your search terms" : "Create a class or join one using a code"}
      </p>
      {!searchTerm && (
        <div className="space-y-4">
          {onCreateClass && (
            <Button
              className="gradient-primary transition-transform hover:-translate-y-0.5 hover:shadow-lg"
              onClick={onCreateClass}
            >
              <Plus className="w-4 h-4 mr-2" />
              Create First Class
            </Button>
          )}
          {onJoinClass && (
            <div>
              <Button 
                variant="default" 
                onClick={onJoinClass}
                className="gradient-primary transition-transform hover:-translate-y-0.5 hover:shadow-lg"
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Join a Class
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}