"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Upload,
  FileText,
  Clock,
  Send,
  Save,
  AlertCircle,
  CheckCircle,
  X,
  Eye,
  Download,
  Calendar,
  Target,
} from "lucide-react"

interface SubmissionFile {
  id: string
  name: string
  size: number
  type: string
  uploadedAt: Date
}

interface Answer {
  questionId: string
  answer: string | number
  textAnswer?: string
}

interface Assignment {
  id: string
  title: string
  description: string
  type: "assignment" | "quiz" | "exam"
  dueDate: string
  dueTime: string
  points: number
  timeLimit?: number
  attempts: number
  allowLateSubmission: boolean
  questions: any[]
  attachments: any[]
}

// Mock assignment data
const mockAssignment: Assignment = {
  id: "1",
  title: "Calculus Problem Set 1",
  description: "Complete the following problems from Chapter 3. Show all work and explain your reasoning.",
  type: "assignment",
  dueDate: "2024-01-25",
  dueTime: "23:59",
  points: 100,
  timeLimit: 120,
  attempts: 2,
  allowLateSubmission: false,
  questions: [
    {
      id: "q1",
      type: "multiple-choice",
      question: "What is the derivative of x²?",
      options: ["x", "2x", "x²", "2"],
      points: 10,
    },
    {
      id: "q2",
      type: "short-answer",
      question: "Solve the integral ∫x dx",
      points: 15,
    },
    {
      id: "q3",
      type: "essay",
      question: "Explain the fundamental theorem of calculus and provide an example.",
      points: 25,
    },
  ],
  attachments: [],
}

export function AssignmentSubmission({ assignmentId }: { assignmentId: string }) {
  const [assignment] = useState<Assignment>(mockAssignment)
  const [answers, setAnswers] = useState<Answer[]>([])
  const [submissionFiles, setSubmissionFiles] = useState<SubmissionFile[]>([])
  const [timeRemaining, setTimeRemaining] = useState(7200) // 2 hours in seconds
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isDraft, setIsDraft] = useState(false)
  const [isSubmitDialogOpen, setIsSubmitDialogOpen] = useState(false)

  const handleAnswerChange = (questionId: string, answer: string | number, textAnswer?: string) => {
    setAnswers((prev) => {
      const existing = prev.find((a) => a.questionId === questionId)
      if (existing) {
        return prev.map((a) => (a.questionId === questionId ? { ...a, answer, textAnswer } : a))
      }
      return [...prev, { questionId, answer, textAnswer }]
    })
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    const newFiles: SubmissionFile[] = files.map((file) => ({
      id: Date.now().toString() + Math.random().toString(),
      name: file.name,
      size: file.size,
      type: file.type,
      uploadedAt: new Date(),
    }))
    setSubmissionFiles((prev) => [...prev, ...newFiles])
  }

  const removeFile = (fileId: string) => {
    setSubmissionFiles((prev) => prev.filter((f) => f.id !== fileId))
  }

  const saveAsDraft = () => {
    setIsDraft(true)
    console.log("Saving as draft:", { answers, submissionFiles })
    // In a real app, this would save to backend
  }

  const submitAssignment = () => {
    setIsSubmitted(true)
    setIsSubmitDialogOpen(false)
    console.log("Submitting assignment:", { answers, submissionFiles })
    // In a real app, this would submit to backend
  }

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`
  }

  const progress = (answers.length / assignment.questions.length) * 100
  const isOverdue = new Date() > new Date(`${assignment.dueDate}T${assignment.dueTime}`)

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        <div className="container mx-auto px-4 py-6">
          <Card className="max-w-2xl mx-auto">
            <CardContent className="py-12 text-center">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Assignment Submitted!</h2>
              <p className="text-muted-foreground mb-6">
                Your submission has been received and will be graded by your instructor.
              </p>
              <div className="space-y-2 text-sm">
                <p>
                  <strong>Submitted:</strong> {new Date().toLocaleString()}
                </p>
                <p>
                  <strong>Questions Answered:</strong> {answers.length} of {assignment.questions.length}
                </p>
                <p>
                  <strong>Files Uploaded:</strong> {submissionFiles.length}
                </p>
              </div>
              <div className="flex gap-2 justify-center mt-6">
                <Button variant="outline">View Submission</Button>
                <Button>Return to Class</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">{assignment.title}</h1>
            <p className="text-muted-foreground">{assignment.description}</p>
          </div>
          <div className="flex items-center gap-4">
            {assignment.timeLimit && (
              <div className="flex items-center gap-2 px-3 py-2 bg-card rounded-lg border">
                <Clock className="w-4 h-4 text-orange-500" />
                <span className="font-mono text-sm">{formatTime(timeRemaining)}</span>
              </div>
            )}
            <Badge variant={isOverdue ? "destructive" : "default"}>{isOverdue ? "Overdue" : "Active"}</Badge>
          </div>
        </div>

        {/* Assignment Info */}
        <Card className="mb-6">
          <CardContent className="py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6 text-sm">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span>Due: {new Date(`${assignment.dueDate}T${assignment.dueTime}`).toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Target className="w-4 h-4 text-muted-foreground" />
                  <span>Points: {assignment.points}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span>Time: {assignment.timeLimit ? `${assignment.timeLimit} min` : "No limit"}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Progress:</span>
                <Progress value={progress} className="w-24" />
                <span className="text-sm font-medium">{Math.round(progress)}%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Questions */}
            {assignment.questions.map((question, index) => (
              <Card key={question.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Question {index + 1}</CardTitle>
                    <Badge variant="outline">{question.points} pts</Badge>
                  </div>
                  <CardDescription>{question.question}</CardDescription>
                </CardHeader>
                <CardContent>
                  {question.type === "multiple-choice" && (
                    <RadioGroup
                      value={answers.find((a) => a.questionId === question.id)?.answer?.toString() || ""}
                      onValueChange={(value) => handleAnswerChange(question.id, Number.parseInt(value))}
                    >
                      {question.options.map((option: string, optionIndex: number) => (
                        <div key={optionIndex} className="flex items-center space-x-2">
                          <RadioGroupItem value={optionIndex.toString()} id={`${question.id}-${optionIndex}`} />
                          <Label htmlFor={`${question.id}-${optionIndex}`} className="flex-1 cursor-pointer">
                            {String.fromCharCode(65 + optionIndex)}. {option}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  )}

                  {question.type === "short-answer" && (
                    <Input
                      placeholder="Enter your answer..."
                      value={answers.find((a) => a.questionId === question.id)?.textAnswer || ""}
                      onChange={(e) => handleAnswerChange(question.id, e.target.value, e.target.value)}
                    />
                  )}

                  {question.type === "essay" && (
                    <Textarea
                      placeholder="Write your essay response..."
                      rows={6}
                      value={answers.find((a) => a.questionId === question.id)?.textAnswer || ""}
                      onChange={(e) => handleAnswerChange(question.id, e.target.value, e.target.value)}
                    />
                  )}
                </CardContent>
              </Card>
            ))}

            {/* File Upload */}
            <Card>
              <CardHeader>
                <CardTitle>File Submissions</CardTitle>
                <CardDescription>Upload any required files or supporting documents</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                    <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground mb-2">Drag and drop files here, or click to browse</p>
                    <Input type="file" multiple onChange={handleFileUpload} className="hidden" id="file-upload" />
                    <Button variant="outline" asChild>
                      <label htmlFor="file-upload" className="cursor-pointer">
                        Choose Files
                      </label>
                    </Button>
                  </div>

                  {submissionFiles.length > 0 && (
                    <div className="space-y-2">
                      {submissionFiles.map((file) => (
                        <div key={file.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <FileText className="w-4 h-4 text-muted-foreground" />
                            <div>
                              <p className="text-sm font-medium">{file.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {(file.size / 1024).toFixed(1)} KB • Uploaded {file.uploadedAt.toLocaleTimeString()}
                              </p>
                            </div>
                          </div>
                          <Button size="sm" variant="ghost" onClick={() => removeFile(file.id)}>
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Submission Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Questions Answered</span>
                    <span className="font-medium">
                      {answers.length}/{assignment.questions.length}
                    </span>
                  </div>
                  <Progress value={progress} />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Files Uploaded</span>
                    <span className="font-medium">{submissionFiles.length}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Draft Saved</span>
                    <span className="font-medium">{isDraft ? "Yes" : "No"}</span>
                  </div>
                </div>

                {isOverdue && !assignment.allowLateSubmission && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-red-600" />
                      <p className="text-sm text-red-800 font-medium">Assignment Overdue</p>
                    </div>
                    <p className="text-xs text-red-700 mt-1">Late submissions are not allowed for this assignment.</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" onClick={saveAsDraft} className="w-full bg-transparent">
                  <Save className="w-4 h-4 mr-2" />
                  Save Draft
                </Button>

                <Dialog open={isSubmitDialogOpen} onOpenChange={setIsSubmitDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="w-full gradient-primary" disabled={isOverdue && !assignment.allowLateSubmission}>
                      <Send className="w-4 h-4 mr-2" />
                      Submit Assignment
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Submit Assignment</DialogTitle>
                      <DialogDescription>
                        Are you sure you want to submit this assignment? You cannot make changes after submission.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="p-4 bg-muted rounded-lg">
                        <h4 className="font-medium mb-2">Submission Summary</h4>
                        <div className="space-y-1 text-sm">
                          <p>
                            Questions answered: {answers.length} of {assignment.questions.length}
                          </p>
                          <p>Files uploaded: {submissionFiles.length}</p>
                          <p>Completion: {Math.round(progress)}%</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" onClick={() => setIsSubmitDialogOpen(false)} className="flex-1">
                          Cancel
                        </Button>
                        <Button onClick={submitAssignment} className="flex-1 gradient-primary">
                          Submit
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>

                <Button variant="ghost" className="w-full">
                  <Eye className="w-4 h-4 mr-2" />
                  Preview Submission
                </Button>
              </CardContent>
            </Card>

            {assignment.attachments.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Assignment Files</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {assignment.attachments.map((file: any, index: number) => (
                      <div key={index} className="flex items-center justify-between p-2 border rounded">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm">{file.name}</span>
                        </div>
                        <Button size="sm" variant="ghost">
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
