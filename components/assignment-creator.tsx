"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Plus,
  FileText,
  Upload,
  Calendar,
  Clock,
  Eye,
  Save,
  Send,
  X,
  CheckCircle,
  AlertCircle,
  BookOpen,
  Target,
} from "lucide-react"

interface Question {
  id: string
  type: "multiple-choice" | "short-answer" | "essay" | "true-false"
  question: string
  options?: string[]
  correctAnswer?: string | number
  points: number
  explanation?: string
}

interface Assignment {
  title: string
  description: string
  type: "assignment" | "quiz" | "exam"
  dueDate: string
  dueTime: string
  points: number
  timeLimit?: number
  attempts: number
  allowLateSubmission: boolean
  showCorrectAnswers: boolean
  randomizeQuestions: boolean
  questions: Question[]
  attachments: File[]
}

export function AssignmentCreator() {
  const [assignment, setAssignment] = useState<Assignment>({
    title: "",
    description: "",
    type: "assignment",
    dueDate: "",
    dueTime: "",
    points: 100,
    timeLimit: 60,
    attempts: 1,
    allowLateSubmission: false,
    showCorrectAnswers: true,
    randomizeQuestions: false,
    questions: [],
    attachments: [],
  })

  const [currentQuestion, setCurrentQuestion] = useState<Question>({
    id: "",
    type: "multiple-choice",
    question: "",
    options: ["", "", "", ""],
    correctAnswer: "",
    points: 1,
    explanation: "",
  })

  const [isQuestionDialogOpen, setIsQuestionDialogOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("details")

  const addQuestion = () => {
    if (currentQuestion.question.trim()) {
      const newQuestion = {
        ...currentQuestion,
        id: Date.now().toString(),
      }
      setAssignment((prev) => ({
        ...prev,
        questions: [...prev.questions, newQuestion],
      }))
      setCurrentQuestion({
        id: "",
        type: "multiple-choice",
        question: "",
        options: ["", "", "", ""],
        correctAnswer: "",
        points: 1,
        explanation: "",
      })
      setIsQuestionDialogOpen(false)
    }
  }

  const removeQuestion = (questionId: string) => {
    setAssignment((prev) => ({
      ...prev,
      questions: prev.questions.filter((q) => q.id !== questionId),
    }))
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    setAssignment((prev) => ({
      ...prev,
      attachments: [...prev.attachments, ...files],
    }))
  }

  const removeAttachment = (index: number) => {
    setAssignment((prev) => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index),
    }))
  }

  const saveAsDraft = () => {
    console.log("Saving as draft:", assignment)
    // In a real app, this would save to backend
  }

  const publishAssignment = () => {
    console.log("Publishing assignment:", assignment)
    // In a real app, this would publish to students
  }

  const totalPoints = assignment.questions.reduce((sum, q) => sum + q.points, 0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Assignment Creator
            </h1>
            <p className="text-muted-foreground">Create engaging assignments and assessments</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={saveAsDraft}>
              <Save className="w-4 h-4 mr-2" />
              Save Draft
            </Button>
            <Button className="gradient-primary" onClick={publishAssignment}>
              <Send className="w-4 h-4 mr-2" />
              Publish
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4 bg-card/50 backdrop-blur-sm">
            <TabsTrigger
              value="details"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Details
            </TabsTrigger>
            <TabsTrigger
              value="questions"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Questions ({assignment.questions.length})
            </TabsTrigger>
            <TabsTrigger
              value="settings"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Settings
            </TabsTrigger>
            <TabsTrigger
              value="preview"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Preview
            </TabsTrigger>
          </TabsList>

          {/* Assignment Details Tab */}
          <TabsContent value="details" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Basic Information</CardTitle>
                    <CardDescription>Set up the fundamental details of your assignment</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Assignment Title</Label>
                      <Input
                        id="title"
                        placeholder="e.g., Chapter 5 Quiz - Calculus"
                        value={assignment.title}
                        onChange={(e) => setAssignment((prev) => ({ ...prev, title: e.target.value }))}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        placeholder="Provide instructions and context for students..."
                        rows={4}
                        value={assignment.description}
                        onChange={(e) => setAssignment((prev) => ({ ...prev, description: e.target.value }))}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="type">Assignment Type</Label>
                        <Select
                          value={assignment.type}
                          onValueChange={(value: "assignment" | "quiz" | "exam") =>
                            setAssignment((prev) => ({ ...prev, type: value }))
                          }
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
                        <Label htmlFor="points">Total Points</Label>
                        <Input
                          id="points"
                          type="number"
                          value={assignment.points}
                          onChange={(e) =>
                            setAssignment((prev) => ({ ...prev, points: Number.parseInt(e.target.value) || 0 }))
                          }
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="dueDate">Due Date</Label>
                        <Input
                          id="dueDate"
                          type="date"
                          value={assignment.dueDate}
                          onChange={(e) => setAssignment((prev) => ({ ...prev, dueDate: e.target.value }))}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="dueTime">Due Time</Label>
                        <Input
                          id="dueTime"
                          type="time"
                          value={assignment.dueTime}
                          onChange={(e) => setAssignment((prev) => ({ ...prev, dueTime: e.target.value }))}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Attachments</CardTitle>
                    <CardDescription>Add files, documents, or resources for students</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                        <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground mb-2">
                          Drag and drop files here, or click to browse
                        </p>
                        <Input type="file" multiple onChange={handleFileUpload} className="hidden" id="file-upload" />
                        <Button variant="outline" asChild>
                          <label htmlFor="file-upload" className="cursor-pointer">
                            Choose Files
                          </label>
                        </Button>
                      </div>

                      {assignment.attachments.length > 0 && (
                        <div className="space-y-2">
                          {assignment.attachments.map((file, index) => (
                            <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                              <div className="flex items-center gap-3">
                                <FileText className="w-4 h-4 text-muted-foreground" />
                                <span className="text-sm">{file.name}</span>
                                <Badge variant="outline" className="text-xs">
                                  {(file.size / 1024).toFixed(1)} KB
                                </Badge>
                              </div>
                              <Button size="sm" variant="ghost" onClick={() => removeAttachment(index)}>
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

              {/* Summary Sidebar */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="w-5 h-5" />
                      Assignment Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Type:</span>
                      <Badge variant="outline">{assignment.type}</Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Questions:</span>
                      <span className="font-medium">{assignment.questions.length}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Total Points:</span>
                      <span className="font-medium">{totalPoints}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Time Limit:</span>
                      <span className="font-medium">{assignment.timeLimit || "No limit"}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Attempts:</span>
                      <span className="font-medium">{assignment.attempts}</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5" />
                      Completion Status
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2">
                      {assignment.title ? (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-yellow-500" />
                      )}
                      <span className="text-sm">Title & Description</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {assignment.dueDate ? (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-yellow-500" />
                      )}
                      <span className="text-sm">Due Date</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {assignment.questions.length > 0 ? (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-yellow-500" />
                      )}
                      <span className="text-sm">Questions Added</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Questions Tab */}
          <TabsContent value="questions" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold">Questions</h2>
                <p className="text-muted-foreground">Add and manage assignment questions</p>
              </div>
              <Dialog open={isQuestionDialogOpen} onOpenChange={setIsQuestionDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="gradient-primary">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Question
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Add New Question</DialogTitle>
                    <DialogDescription>Create a question for your assignment</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="questionType">Question Type</Label>
                        <Select
                          value={currentQuestion.type}
                          onValueChange={(value: any) => setCurrentQuestion((prev) => ({ ...prev, type: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="multiple-choice">Multiple Choice</SelectItem>
                            <SelectItem value="true-false">True/False</SelectItem>
                            <SelectItem value="short-answer">Short Answer</SelectItem>
                            <SelectItem value="essay">Essay</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="questionPoints">Points</Label>
                        <Input
                          id="questionPoints"
                          type="number"
                          value={currentQuestion.points}
                          onChange={(e) =>
                            setCurrentQuestion((prev) => ({ ...prev, points: Number.parseInt(e.target.value) || 1 }))
                          }
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="questionText">Question</Label>
                      <Textarea
                        id="questionText"
                        placeholder="Enter your question..."
                        value={currentQuestion.question}
                        onChange={(e) => setCurrentQuestion((prev) => ({ ...prev, question: e.target.value }))}
                      />
                    </div>

                    {(currentQuestion.type === "multiple-choice" || currentQuestion.type === "true-false") && (
                      <div className="space-y-3">
                        <Label>Answer Options</Label>
                        {currentQuestion.type === "multiple-choice" ? (
                          <div className="space-y-2">
                            {currentQuestion.options?.map((option, index) => (
                              <div key={index} className="flex items-center gap-2">
                                <Input
                                  placeholder={`Option ${index + 1}`}
                                  value={option}
                                  onChange={(e) => {
                                    const newOptions = [...(currentQuestion.options || [])]
                                    newOptions[index] = e.target.value
                                    setCurrentQuestion((prev) => ({ ...prev, options: newOptions }))
                                  }}
                                />
                                <Button
                                  type="button"
                                  variant={currentQuestion.correctAnswer === index ? "default" : "outline"}
                                  size="sm"
                                  onClick={() => setCurrentQuestion((prev) => ({ ...prev, correctAnswer: index }))}
                                >
                                  Correct
                                </Button>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="flex gap-2">
                            <Button
                              type="button"
                              variant={currentQuestion.correctAnswer === "true" ? "default" : "outline"}
                              onClick={() => setCurrentQuestion((prev) => ({ ...prev, correctAnswer: "true" }))}
                            >
                              True
                            </Button>
                            <Button
                              type="button"
                              variant={currentQuestion.correctAnswer === "false" ? "default" : "outline"}
                              onClick={() => setCurrentQuestion((prev) => ({ ...prev, correctAnswer: "false" }))}
                            >
                              False
                            </Button>
                          </div>
                        )}
                      </div>
                    )}

                    <div className="space-y-2">
                      <Label htmlFor="explanation">Explanation (Optional)</Label>
                      <Textarea
                        id="explanation"
                        placeholder="Explain the correct answer..."
                        value={currentQuestion.explanation}
                        onChange={(e) => setCurrentQuestion((prev) => ({ ...prev, explanation: e.target.value }))}
                      />
                    </div>

                    <div className="flex gap-2 pt-4">
                      <Button variant="outline" onClick={() => setIsQuestionDialogOpen(false)} className="flex-1">
                        Cancel
                      </Button>
                      <Button onClick={addQuestion} className="flex-1 gradient-primary">
                        Add Question
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {assignment.questions.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No questions added yet</h3>
                  <p className="text-muted-foreground mb-4">Start building your assignment by adding questions</p>
                  <Button onClick={() => setIsQuestionDialogOpen(true)} className="gradient-primary">
                    <Plus className="w-4 h-4 mr-2" />
                    Add First Question
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {assignment.questions.map((question, index) => (
                  <Card key={question.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Badge variant="outline">Q{index + 1}</Badge>
                          <Badge variant="secondary">{question.type}</Badge>
                          <span className="text-sm text-muted-foreground">{question.points} pts</span>
                        </div>
                        <Button size="sm" variant="ghost" onClick={() => removeQuestion(question.id)}>
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="font-medium mb-3">{question.question}</p>
                      {question.options && (
                        <div className="space-y-1">
                          {question.options.map((option, optionIndex) => (
                            <div
                              key={optionIndex}
                              className={`p-2 rounded text-sm ${
                                question.correctAnswer === optionIndex
                                  ? "bg-green-100 text-green-800 border border-green-200"
                                  : "bg-muted"
                              }`}
                            >
                              {String.fromCharCode(65 + optionIndex)}. {option}
                              {question.correctAnswer === optionIndex && (
                                <CheckCircle className="w-4 h-4 inline ml-2" />
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                      {question.explanation && (
                        <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded">
                          <p className="text-sm text-blue-800">
                            <strong>Explanation:</strong> {question.explanation}
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Timing & Attempts</CardTitle>
                  <CardDescription>Configure time limits and attempt restrictions</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="timeLimit">Time Limit (minutes)</Label>
                    <Input
                      id="timeLimit"
                      type="number"
                      placeholder="60"
                      value={assignment.timeLimit || ""}
                      onChange={(e) =>
                        setAssignment((prev) => ({ ...prev, timeLimit: Number.parseInt(e.target.value) || undefined }))
                      }
                    />
                    <p className="text-xs text-muted-foreground">Leave empty for no time limit</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="attempts">Number of Attempts</Label>
                    <Select
                      value={assignment.attempts.toString()}
                      onValueChange={(value) =>
                        setAssignment((prev) => ({ ...prev, attempts: Number.parseInt(value) }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 Attempt</SelectItem>
                        <SelectItem value="2">2 Attempts</SelectItem>
                        <SelectItem value="3">3 Attempts</SelectItem>
                        <SelectItem value="-1">Unlimited</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Allow Late Submissions</Label>
                      <p className="text-xs text-muted-foreground">Students can submit after due date</p>
                    </div>
                    <Switch
                      checked={assignment.allowLateSubmission}
                      onCheckedChange={(checked) =>
                        setAssignment((prev) => ({ ...prev, allowLateSubmission: checked }))
                      }
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Display Options</CardTitle>
                  <CardDescription>Control how questions and answers are shown</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Show Correct Answers</Label>
                      <p className="text-xs text-muted-foreground">Display answers after submission</p>
                    </div>
                    <Switch
                      checked={assignment.showCorrectAnswers}
                      onCheckedChange={(checked) => setAssignment((prev) => ({ ...prev, showCorrectAnswers: checked }))}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Randomize Questions</Label>
                      <p className="text-xs text-muted-foreground">Show questions in random order</p>
                    </div>
                    <Switch
                      checked={assignment.randomizeQuestions}
                      onCheckedChange={(checked) => setAssignment((prev) => ({ ...prev, randomizeQuestions: checked }))}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Preview Tab */}
          <TabsContent value="preview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="w-5 h-5" />
                  Student View Preview
                </CardTitle>
                <CardDescription>See how students will view this assignment</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border rounded-lg p-6 bg-muted/30">
                  <div className="space-y-4">
                    <div>
                      <h2 className="text-2xl font-bold">{assignment.title || "Untitled Assignment"}</h2>
                      <p className="text-muted-foreground">{assignment.description || "No description provided"}</p>
                    </div>

                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>Due: {assignment.dueDate || "No due date"}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>Time: {assignment.timeLimit ? `${assignment.timeLimit} min` : "No limit"}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Target className="w-4 h-4" />
                        <span>Points: {totalPoints}</span>
                      </div>
                    </div>

                    {assignment.questions.length > 0 && (
                      <div className="space-y-4 pt-4 border-t">
                        <h3 className="font-semibold">Questions Preview</h3>
                        {assignment.questions.slice(0, 3).map((question, index) => (
                          <div key={question.id} className="p-4 border rounded-lg bg-background">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant="outline">Q{index + 1}</Badge>
                              <span className="text-sm text-muted-foreground">{question.points} pts</span>
                            </div>
                            <p className="font-medium">{question.question}</p>
                            {question.options && (
                              <div className="mt-2 space-y-1">
                                {question.options.map((option, optionIndex) => (
                                  <div key={optionIndex} className="flex items-center gap-2">
                                    <div className="w-4 h-4 border rounded-full"></div>
                                    <span className="text-sm">{option}</span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                        {assignment.questions.length > 3 && (
                          <p className="text-sm text-muted-foreground text-center">
                            ... and {assignment.questions.length - 3} more questions
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
