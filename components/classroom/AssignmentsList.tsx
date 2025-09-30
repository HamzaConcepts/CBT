"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  Plus, 
  Calendar, 
  Eye, 
  Edit, 
  Upload
} from "lucide-react"
import { mutate } from 'swr'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from "next/navigation"

type DbAssignment = {
  id: string
  title: string
  type: string
  due_at: string | null
  points: number | null
  status: string
  description: string | null
}

type DbSubmission = {
  id: string
  assignment_id: string
  user_id: string
  submitted_at: string
  score: number | null
  status: string
  content: string | null
  assignments: {
    title: string
    type: string
    due_at: string | null
    points: number | null
  }
}

interface AssignmentsListProps {
  assignments: DbAssignment[]
  submissions?: DbSubmission[]
  userRole: string | null
  classroomId: string
  rosterCount: number
  isLoading?: boolean
}

export function AssignmentsList({ 
  assignments, 
  submissions = [], 
  userRole, 
  classroomId,
  rosterCount,
  isLoading = false 
}: AssignmentsListProps) {
  const router = useRouter()
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [newAssignment, setNewAssignment] = useState({
    title: "",
    type: "assignment",
    dueDate: "",
    points: "",
    description: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleCreateAssignment = async () => {
    if (!newAssignment.title || !newAssignment.dueDate) return
    
    setIsSubmitting(true)
    try {
      const { error } = await supabase
        .from("assignments")
        .insert({
          classroom_id: classroomId,
          title: newAssignment.title,
          type: newAssignment.type,
          due_at: newAssignment.dueDate,
          points: newAssignment.points ? parseInt(newAssignment.points) : null,
          description: newAssignment.description,
          status: "active"
        })

      if (error) throw error

      // Revalidate the assignments cache
      mutate(`assignments-${classroomId}`)
      
      setNewAssignment({ title: "", type: "assignment", dueDate: "", points: "", description: "" })
      setIsCreateDialogOpen(false)
    } catch (error) {
      console.error("Error creating assignment:", error)
      alert("Failed to create assignment. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">Loading Assignments...</h2>
            <div className="h-4 bg-gray-200 rounded w-1/3 mt-1 animate-pulse"></div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="h-3 bg-gray-200 rounded w-full"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                  <div className="flex gap-2">
                    <div className="h-8 bg-gray-200 rounded flex-1"></div>
                    <div className="h-8 bg-gray-200 rounded w-16"></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">
            {userRole === 'STUDENT' ? 'My Assignments' : 'Assignments & Assessments'}
          </h2>
          <p className="text-muted-foreground">
            {userRole === 'STUDENT' 
              ? 'View your assignments and submission status' 
              : 'Manage homework, quizzes, and exams'
            }
          </p>
        </div>
        {userRole === 'TEACHER' && (
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gradient-primary">
                <Plus className="w-4 h-4 mr-2" />
                Create Assignment
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Assignment</DialogTitle>
                <DialogDescription>Set up a new assignment or assessment</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="assignmentTitle">Title</Label>
                  <Input
                    id="assignmentTitle"
                    placeholder="Assignment title"
                    value={newAssignment.title}
                    onChange={(e) => setNewAssignment((prev) => ({ ...prev, title: e.target.value }))}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="assignmentType">Type</Label>
                    <Select
                      value={newAssignment.type}
                      onValueChange={(value) => setNewAssignment((prev) => ({ ...prev, type: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="assignment">Assignment</SelectItem>
                        <SelectItem value="quiz">Quiz</SelectItem>
                        <SelectItem value="exam">Exam</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="assignmentPoints">Points</Label>
                    <Input
                      id="assignmentPoints"
                      type="number"
                      placeholder="100"
                      value={newAssignment.points}
                      onChange={(e) => setNewAssignment((prev) => ({ ...prev, points: e.target.value }))}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="assignmentDueDate">Due Date</Label>
                  <Input
                    id="assignmentDueDate"
                    type="datetime-local"
                    value={newAssignment.dueDate}
                    onChange={(e) => setNewAssignment((prev) => ({ ...prev, dueDate: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="assignmentDescription">Description</Label>
                  <Textarea
                    id="assignmentDescription"
                    placeholder="Assignment instructions..."
                    rows={3}
                    value={newAssignment.description}
                    onChange={(e) => setNewAssignment((prev) => ({ ...prev, description: e.target.value }))}
                  />
                </div>
                <div className="flex gap-2 pt-4">
                  <Button 
                    variant="outline" 
                    onClick={() => setIsCreateDialogOpen(false)} 
                    className="flex-1"
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleCreateAssignment} 
                    className="flex-1 gradient-primary"
                    disabled={isSubmitting || !newAssignment.title || !newAssignment.dueDate}
                  >
                    {isSubmitting ? "Creating..." : "Create Assignment"}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Assignment Grid */}
      {assignments.length === 0 ? (
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                <Calendar className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No assignments yet</h3>
              <p className="text-muted-foreground mb-4">
                {userRole === 'TEACHER' 
                  ? "Create your first assignment to get started"
                  : "Your teacher hasn't assigned any work yet"
                }
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {assignments.map((assignment) => {
            const submission = userRole === 'STUDENT' 
              ? submissions.find(s => s.assignment_id === assignment.id)
              : null
            const isOverdue = assignment.due_at && new Date(assignment.due_at) < new Date() && !submission
            
            return (
              <Card key={assignment.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{assignment.title}</CardTitle>
                      <CardDescription className="flex items-center gap-2">
                        <Badge variant="outline">{assignment.type}</Badge>
                        <span>{assignment.points || 0} pts</span>
                      </CardDescription>
                    </div>
                    {userRole === 'STUDENT' ? (
                      <Badge
                        variant={
                          submission?.status === "submitted" 
                            ? "default" 
                            : submission?.status === "graded"
                            ? "secondary"
                            : isOverdue
                            ? "destructive"
                            : "outline"
                        }
                      >
                        {submission?.status === "graded" 
                          ? "Graded" 
                          : submission?.status === "submitted"
                          ? "Submitted"
                          : isOverdue
                          ? "Overdue"
                          : "Not Submitted"
                        }
                      </Badge>
                    ) : (
                      <Badge
                        variant={
                          assignment.status === "active"
                            ? "default"
                            : assignment.status === "completed"
                              ? "secondary"
                              : "outline"
                        }
                      >
                        {assignment.status}
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {assignment.description || "No description provided"}
                    </p>

                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      <span>
                        Due: {assignment.due_at 
                          ? new Date(assignment.due_at).toLocaleDateString() + " " + 
                            new Date(assignment.due_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
                          : "TBD"
                        }
                      </span>
                    </div>

                    {userRole === 'STUDENT' && submission && (
                      <div className="space-y-2 p-3 bg-muted/30 rounded-lg">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Submitted:</span>
                          <span className="font-medium">
                            {new Date(submission.submitted_at).toLocaleDateString()}
                          </span>
                        </div>
                        {submission.score !== null && (
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Score:</span>
                            <Badge variant="secondary">
                              {submission.score}/{assignment.points || 100}
                            </Badge>
                          </div>
                        )}
                      </div>
                    )}

                    {userRole === 'TEACHER' && (
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Submitted:</span>
                          <span className="ml-1 font-medium">—/{rosterCount}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Graded:</span>
                          <span className="ml-1 font-medium">—/—</span>
                        </div>
                      </div>
                    )}

                    <div className="flex gap-2 pt-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="flex-1 bg-transparent"
                        onClick={() => router.push(`/assignment/${assignment.id}`)}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        View
                      </Button>
                      {userRole === 'STUDENT' && !submission && !isOverdue && (
                        <Button 
                          size="sm" 
                          className="flex-1 gradient-primary"
                          onClick={() => router.push(`/assignment/${assignment.id}/submit`)}
                        >
                          <Upload className="w-4 h-4 mr-2" />
                          Submit
                        </Button>
                      )}
                      {userRole === 'TEACHER' && (
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="flex-1 bg-transparent"
                        >
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}