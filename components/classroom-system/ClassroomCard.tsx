"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Users,
  BookOpen,
  Copy,
  Check,
  Award,
  Settings,
  GraduationCap,
  LogOut,
} from "lucide-react"

type DbClassroom = {
  id: string
  name: string
  subject: string | null
  code: string
  description: string | null
  color: string | null
  teacher_id: string
}

interface ClassroomCardProps {
  classroom: DbClassroom
  role: "TEACHER" | "STUDENT"
  onCopyCode?: (code: string) => void
  onLeave?: (classroomId: string, name: string) => void
  copiedCode?: string | null
  isLeavingClassroom?: boolean
}

export function ClassroomCard({ 
  classroom, 
  role, 
  onCopyCode, 
  onLeave, 
  copiedCode,
  isLeavingClassroom = false
}: ClassroomCardProps) {
  const router = useRouter()
  const handleCopyCode = () => {
    if (onCopyCode) {
      onCopyCode(classroom.code)
    }
  }

  const handleLeave = () => {
    if (onLeave) {
      onLeave(classroom.id, classroom.name)
    }
  }

  const handleOpenClassroom = () => {
    router.push(`/classroom/${classroom.id}`)
  }

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 group">
      {/* Class Header with Gradient */}
      <div className={`${classroom.color} p-6 text-white relative overflow-hidden`}>
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h4 className="text-xl font-bold text-balance">{classroom.name}</h4>
              <p className="text-white/90 text-sm">{classroom.subject}</p>
              <p className="text-white/80 text-xs mt-1 flex items-center gap-1">
                {role === "TEACHER" ? (
                  <>
                    <GraduationCap className="w-3 h-3" />
                    Teacher
                  </>
                ) : (
                  <>
                    <Users className="w-3 h-3" />
                    Student
                  </>
                )}
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopyCode}
              className="text-white hover:bg-white/20 p-2 transition-transform hover:-translate-y-0.5"
            >
              {copiedCode === classroom.code ? (
                <Check className="w-4 h-4" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </Button>
          </div>

          <div className="flex items-center gap-4 text-sm text-white/90">
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              <span>—</span>
            </div>
            <div className="flex items-center gap-1">
              <BookOpen className="w-4 h-4" />
              <span>—</span>
            </div>
            <div className="flex items-center gap-1">
              <Award className="w-4 h-4" />
              <span>—</span>
            </div>
          </div>
        </div>

        {/* Floating decoration */}
        <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
      </div>

      <CardContent className="p-6">
        <div className="space-y-4">
          {classroom.description && (
            <p className="text-sm text-muted-foreground">{classroom.description}</p>
          )}

          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Class Code:</span>
            <Badge variant="outline" className="font-mono">
              {classroom.code}
            </Badge>
          </div>

          <div className="flex gap-2 pt-2">
            <Button
              variant="outline"
              className="flex-1 group-hover:border-primary/50 transition-all bg-transparent hover:shadow-md hover:-translate-y-0.5"
              onClick={handleOpenClassroom}
            >
              <BookOpen className="w-4 h-4 mr-2" />
              {role === "TEACHER" ? "Manage" : "Enter"}
            </Button>
            
            {role === "STUDENT" && onLeave && (
              <Button
                variant="outline"
                size="sm"
                className="group-hover:border-primary/50 transition-all bg-red-100 border-red-300 hover:bg-red-200 hover:shadow-md hover:-translate-y-0.5"
                onClick={handleLeave}
                disabled={isLeavingClassroom}
                title="Leave class"
              >
                <LogOut className="w-4 h-4 text-red-600" />
                <span className="ml-1 text-xs text-red-600">
                  {isLeavingClassroom ? "LEAVING..." : "EXIT"}
                </span>
              </Button>
            )}
            
            <Button
              variant="outline"
              size="sm"
              className="group-hover:border-primary/50 transition-all bg-transparent hover:shadow-md hover:-translate-y-0.5"
            >
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}