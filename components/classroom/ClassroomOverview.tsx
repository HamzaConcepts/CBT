"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  Users, 
  BookOpen, 
  Award, 
  ArrowLeft, 
  Copy, 
  Check,
  TrendingUp,
  Target
} from "lucide-react"
import { useState } from "react"

type DbClassroom = {
  id: string
  name: string
  subject: string | null
  code: string
  description: string | null
  schedule: string | null
  room: string | null
  color: string | null
  teacher_id: string
}

type DbTeacher = {
  user_id: string
  name: string | null
  email: string
}

interface ClassroomOverviewProps {
  classroom: DbClassroom | null
  teacher: DbTeacher | null
  rosterCount: number
  assignmentsCount: number
  activeAssignmentsCount: number
  quizzesCount: number
}

export function ClassroomOverview({ 
  classroom, 
  teacher, 
  rosterCount, 
  assignmentsCount, 
  activeAssignmentsCount,
  quizzesCount 
}: ClassroomOverviewProps) {
  const [copiedCode, setCopiedCode] = useState(false)

  const copyClassCode = () => {
    if (!classroom) return
    navigator.clipboard.writeText(classroom.code)
    setCopiedCode(true)
    setTimeout(() => setCopiedCode(false), 2000)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <header className="border-b bg-card/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => window.history.back()} 
              className="hover:bg-primary/10"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>

            <div className={`${classroom?.color || "bg-gradient-to-br from-blue-500 to-purple-600"} p-4 rounded-lg text-white flex-1`}>
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold">{classroom?.name || "Classroom"}</h1>
                  <p className="text-white/90">
                    {classroom?.subject || ""}
                  </p>
                  <p className="text-white/80 text-sm">
                    {classroom?.schedule || ""} {classroom?.room ? `• ${classroom.room}` : ""}
                  </p>
                  {teacher && (
                    <p className="text-white/70 text-xs mt-1">
                      Instructor: {teacher.name || teacher.email}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right text-white/90">
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <span>{rosterCount}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <BookOpen className="w-4 h-4" />
                        <span>{assignmentsCount}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Award className="w-4 h-4" />
                        <span>{quizzesCount}</span>
                      </div>
                    </div>
                  </div>

                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={copyClassCode} 
                    className="text-white hover:bg-white/20"
                  >
                    {copiedCode ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    <span className="ml-2 font-mono">{classroom?.code}</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Quick Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Class Statistics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Total Students</span>
              <span className="font-medium">{rosterCount}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Active Assignments</span>
              <span className="font-medium">{activeAssignmentsCount}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Avg. Grade</span>
              <span className="font-medium">82.5%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Completion Rate</span>
              <span className="font-medium">89%</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Performance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Class Average</span>
              <span className="font-medium">82.5%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Pass Rate</span>
              <span className="font-medium">89%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Improvement</span>
              <Badge variant="secondary" className="bg-green-100 text-green-700">
                +2.3%
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Alice submitted assignment</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>New quiz created</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <span>Bob joined the class</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}