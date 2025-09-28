"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Upload, 
  Download, 
  MoreVertical,
  Mail,
  UserMinus,
  GraduationCap
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

type DbRosterRow = {
  user_id: string
  status: string
  joined_at: string
  role: string
  profiles: { 
    user_id: string
    name: string | null
    email: string 
  }
}

interface RosterTableProps {
  roster: DbRosterRow[]
  isLoading?: boolean
}

export function RosterTable({ roster, isLoading = false }: RosterTableProps) {
  const handleEmailStudent = (email: string) => {
    window.location.href = `mailto:${email}`
  }

  const handleRemoveStudent = (studentId: string, studentName: string) => {
    if (confirm(`Are you sure you want to remove ${studentName} from the class?`)) {
      // TODO: Implement remove student functionality
      console.log("Remove student:", studentId)
    }
  }

  const handleExportRoster = () => {
    // TODO: Implement export functionality
    console.log("Export roster")
  }

  const handleImportRoster = () => {
    // TODO: Implement import functionality
    console.log("Import roster")
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">Class Roster</h2>
            <p className="text-muted-foreground">Loading students...</p>
          </div>
        </div>
        
        <Card>
          <CardContent className="p-0">
            <div className="animate-pulse">
              <div className="border-b bg-muted/50 p-4">
                <div className="flex gap-4">
                  <div className="h-4 bg-gray-200 rounded w-24"></div>
                  <div className="h-4 bg-gray-200 rounded w-20"></div>
                  <div className="h-4 bg-gray-200 rounded w-28"></div>
                  <div className="h-4 bg-gray-200 rounded w-24"></div>
                  <div className="h-4 bg-gray-200 rounded w-20"></div>
                </div>
              </div>
              {[1, 2, 3].map((i) => (
                <div key={i} className="border-b p-4">
                  <div className="flex gap-4">
                    <div className="h-4 bg-gray-200 rounded w-32"></div>
                    <div className="h-4 bg-gray-200 rounded w-16"></div>
                    <div className="h-4 bg-gray-200 rounded w-24"></div>
                    <div className="h-4 bg-gray-200 rounded w-20"></div>
                    <div className="h-4 bg-gray-200 rounded w-16"></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Class Roster</h2>
          <p className="text-muted-foreground">
            Manage enrolled students ({roster.length} student{roster.length !== 1 ? 's' : ''})
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleImportRoster}>
            <Upload className="w-4 h-4 mr-2" />
            Import
          </Button>
          <Button variant="outline" onClick={handleExportRoster}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Roster Table */}
      {roster.length === 0 ? (
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                <GraduationCap className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No students enrolled</h3>
              <p className="text-muted-foreground mb-4">
                Students will appear here once they join your classroom using the class code
              </p>
              <Badge variant="outline" className="font-mono text-lg px-3 py-1">
                Share your class code to get started
              </Badge>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b bg-muted/50">
                  <tr>
                    <th className="text-left p-4 font-medium">Student</th>
                    <th className="text-left p-4 font-medium">Status</th>
                    <th className="text-left p-4 font-medium">Join Date</th>
                    <th className="text-left p-4 font-medium">Last Active</th>
                    <th className="text-left p-4 font-medium">Avg. Score</th>
                    <th className="text-left p-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {roster.map((student) => (
                    <tr key={student.user_id} className="border-b hover:bg-muted/30 transition-colors">
                      <td className="p-4">
                        <div>
                          <div className="font-medium">
                            {student.profiles.name || `Student ${student.user_id.slice(0, 8)}`}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {student.profiles.email}
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <Badge variant={student.status === "active" ? "default" : "secondary"}>
                          {student.status}
                        </Badge>
                      </td>
                      <td className="p-4 text-sm">
                        {new Date(student.joined_at).toLocaleDateString()}
                      </td>
                      <td className="p-4 text-sm text-muted-foreground">
                        N/A
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">—%</span>
                          <div className="w-16 h-2 bg-muted rounded-full">
                            <div className="w-0 h-full bg-primary rounded-full"></div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem 
                              onClick={() => handleEmailStudent(student.profiles.email)}
                              className="cursor-pointer"
                            >
                              <Mail className="w-4 h-4 mr-2" />
                              Send Email
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => window.location.href = `/student/${student.user_id}/progress`}
                              className="cursor-pointer"
                            >
                              <GraduationCap className="w-4 h-4 mr-2" />
                              View Progress
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              onClick={() => handleRemoveStudent(
                                student.user_id, 
                                student.profiles.name || student.profiles.email
                              )}
                              className="cursor-pointer text-red-600 focus:text-red-600"
                            >
                              <UserMinus className="w-4 h-4 mr-2" />
                              Remove Student
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}