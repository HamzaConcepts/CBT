"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Plus, Trash2, Save, Eye, Clock, Users, AlertTriangle, CheckCircle } from "lucide-react"

interface Question {
  id: string
  type: "mcq" | "short" | "essay" | "problem"
  question: string
  options?: string[]
  correctAnswer?: number | string
  points: number
  difficulty: "easy" | "medium" | "hard"
}

interface ExamSettings {
  title: string
  description: string
  type: "quiz" | "midterm" | "final"
  duration: number
  totalPoints: number
  passingScore: number
  randomizeQuestions: boolean
  randomizeOptions: boolean
  negativeMarking: boolean
  negativeMarkingValue: number
  allowReview: boolean
  showResults: boolean
  maxAttempts: number
  timeLimit: boolean
  proctoring: boolean
  lockdownBrowser: boolean
}

export function ExamCreator() {
  const [activeTab, setActiveTab] = useState("settings")
  const [questions, setQuestions] = useState<Question[]>([])
  const [examSettings, setExamSettings] = useState<ExamSettings>({
    title: "",
    description: "",
    type: "quiz",
    duration: 30,
    totalPoints: 0,
    passingScore: 60,
    randomizeQuestions: false,
    randomizeOptions: false,
    negativeMarking: false,
    negativeMarkingValue: 0.25,
    allowReview: true,
    showResults: true,
    maxAttempts: 1,
    timeLimit: true,
    proctoring: true,
    lockdownBrowser: true,
  })

  const addQuestion = (type: Question["type"]) => {
    const newQuestion: Question = {
      id: Date.now().toString(),
      type,
      question: "",
      points: type === "essay" ? 10 : type === "problem" ? 15 : 5,
      difficulty: "medium",
      ...(type === "mcq" && { options: ["", "", "", ""], correctAnswer: 0 }),
    }
    setQuestions([...questions, newQuestion])
    setActiveTab("questions")
  }

  const updateQuestion = (id: string, updates: Partial<Question>) => {
    setQuestions(questions.map((q) => (q.id === id ? { ...q, ...updates } : q)))
  }

  const deleteQuestion = (id: string) => {
    setQuestions(questions.filter((q) => q.id !== id))
  }

  const updateExamSettings = (updates: Partial<ExamSettings>) => {
    setExamSettings({ ...examSettings, ...updates })
  }

  const calculateTotalPoints = () => {
    return questions.reduce((total, q) => total + q.points, 0)
  }

  const saveExam = () => {
    const examData = {
      ...examSettings,
      totalPoints: calculateTotalPoints(),
      questions,
      createdAt: new Date().toISOString(),
    }
    console.log("[v0] Saving exam:", examData)
    // Here you would typically save to a database
    alert("Exam saved successfully!")
  }

  const previewExam = () => {
    // Navigate to exam preview
    window.location.href = "/teacher/exam/preview"
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Create New Exam</h1>
              <p className="text-muted-foreground">Design and configure your assessment</p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={previewExam}>
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </Button>
              <Button onClick={saveExam}>
                <Save className="h-4 w-4 mr-2" />
                Save Exam
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="settings">Settings</TabsTrigger>
            <TabsTrigger value="questions">Questions ({questions.length})</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="review">Review</TabsTrigger>
          </TabsList>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>Configure the fundamental exam details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Exam Title</Label>
                    <Input
                      id="title"
                      value={examSettings.title}
                      onChange={(e) => updateExamSettings({ title: e.target.value })}
                      placeholder="Enter exam title"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="type">Exam Type</Label>
                    <Select
                      value={examSettings.type}
                      onValueChange={(value: any) => updateExamSettings({ type: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="quiz">Quiz</SelectItem>
                        <SelectItem value="midterm">Midterm</SelectItem>
                        <SelectItem value="final">Final Exam</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={examSettings.description}
                    onChange={(e) => updateExamSettings({ description: e.target.value })}
                    placeholder="Describe the exam content and objectives"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="duration">Duration (minutes)</Label>
                    <Input
                      id="duration"
                      type="number"
                      value={examSettings.duration}
                      onChange={(e) => updateExamSettings({ duration: Number.parseInt(e.target.value) || 0 })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="passingScore">Passing Score (%)</Label>
                    <Input
                      id="passingScore"
                      type="number"
                      value={examSettings.passingScore}
                      onChange={(e) => updateExamSettings({ passingScore: Number.parseInt(e.target.value) || 0 })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="maxAttempts">Max Attempts</Label>
                    <Input
                      id="maxAttempts"
                      type="number"
                      value={examSettings.maxAttempts}
                      onChange={(e) => updateExamSettings({ maxAttempts: Number.parseInt(e.target.value) || 1 })}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Exam Behavior</CardTitle>
                <CardDescription>Configure how the exam behaves for students</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Randomize Questions</Label>
                    <p className="text-sm text-muted-foreground">Shuffle question order for each student</p>
                  </div>
                  <Switch
                    checked={examSettings.randomizeQuestions}
                    onCheckedChange={(checked) => updateExamSettings({ randomizeQuestions: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Randomize Options</Label>
                    <p className="text-sm text-muted-foreground">Shuffle answer choices in MCQs</p>
                  </div>
                  <Switch
                    checked={examSettings.randomizeOptions}
                    onCheckedChange={(checked) => updateExamSettings({ randomizeOptions: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Allow Review</Label>
                    <p className="text-sm text-muted-foreground">Let students review answers before submission</p>
                  </div>
                  <Switch
                    checked={examSettings.allowReview}
                    onCheckedChange={(checked) => updateExamSettings({ allowReview: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Show Results</Label>
                    <p className="text-sm text-muted-foreground">Display results immediately after submission</p>
                  </div>
                  <Switch
                    checked={examSettings.showResults}
                    onCheckedChange={(checked) => updateExamSettings({ showResults: checked })}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Negative Marking</CardTitle>
                <CardDescription>Configure penalty for incorrect answers</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Enable Negative Marking</Label>
                    <p className="text-sm text-muted-foreground">Deduct points for wrong answers</p>
                  </div>
                  <Switch
                    checked={examSettings.negativeMarking}
                    onCheckedChange={(checked) => updateExamSettings({ negativeMarking: checked })}
                  />
                </div>

                {examSettings.negativeMarking && (
                  <div className="space-y-2">
                    <Label htmlFor="negativeValue">Penalty (fraction of question points)</Label>
                    <Input
                      id="negativeValue"
                      type="number"
                      step="0.25"
                      min="0"
                      max="1"
                      value={examSettings.negativeMarkingValue}
                      onChange={(e) =>
                        updateExamSettings({ negativeMarkingValue: Number.parseFloat(e.target.value) || 0 })
                      }
                    />
                    <p className="text-xs text-muted-foreground">
                      Example: 0.25 means 1/4 of the question points will be deducted for wrong answers
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Questions Tab */}
          <TabsContent value="questions" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold">Question Bank</h2>
                <p className="text-muted-foreground">
                  Total Points: {calculateTotalPoints()} | Questions: {questions.length}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" onClick={() => addQuestion("mcq")}>
                  <Plus className="h-4 w-4 mr-2" />
                  MCQ
                </Button>
                <Button variant="outline" onClick={() => addQuestion("short")}>
                  <Plus className="h-4 w-4 mr-2" />
                  Short Answer
                </Button>
                <Button variant="outline" onClick={() => addQuestion("essay")}>
                  <Plus className="h-4 w-4 mr-2" />
                  Essay
                </Button>
                <Button variant="outline" onClick={() => addQuestion("problem")}>
                  <Plus className="h-4 w-4 mr-2" />
                  Problem Solving
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              {questions.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <div className="text-center space-y-2">
                      <p className="text-lg font-medium">No questions added yet</p>
                      <p className="text-muted-foreground">
                        Start by adding your first question using the buttons above
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                questions.map((question, index) => (
                  <Card key={question.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">Q{index + 1}</Badge>
                          <Badge
                            variant={
                              question.type === "mcq" ? "default" : question.type === "short" ? "secondary" : "outline"
                            }
                          >
                            {question.type.toUpperCase()}
                          </Badge>
                          <Badge
                            variant={
                              question.difficulty === "easy"
                                ? "secondary"
                                : question.difficulty === "hard"
                                  ? "destructive"
                                  : "default"
                            }
                          >
                            {question.difficulty}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">{question.points} pts</span>
                          <Button size="sm" variant="outline" onClick={() => deleteQuestion(question.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label>Question</Label>
                        <Textarea
                          value={question.question}
                          onChange={(e) => updateQuestion(question.id, { question: e.target.value })}
                          placeholder="Enter your question here..."
                          rows={3}
                        />
                      </div>

                      {question.type === "mcq" && question.options && (
                        <div className="space-y-2">
                          <Label>Answer Options</Label>
                          {question.options.map((option, optionIndex) => (
                            <div key={optionIndex} className="flex items-center gap-2">
                              <input
                                type="radio"
                                name={`correct-${question.id}`}
                                checked={question.correctAnswer === optionIndex}
                                onChange={() => updateQuestion(question.id, { correctAnswer: optionIndex })}
                              />
                              <Input
                                value={option}
                                onChange={(e) => {
                                  const newOptions = [...question.options!]
                                  newOptions[optionIndex] = e.target.value
                                  updateQuestion(question.id, { options: newOptions })
                                }}
                                placeholder={`Option ${optionIndex + 1}`}
                              />
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Points</Label>
                          <Input
                            type="number"
                            value={question.points}
                            onChange={(e) =>
                              updateQuestion(question.id, { points: Number.parseInt(e.target.value) || 0 })
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Difficulty</Label>
                          <Select
                            value={question.difficulty}
                            onValueChange={(value: any) => updateQuestion(question.id, { difficulty: value })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="easy">Easy</SelectItem>
                              <SelectItem value="medium">Medium</SelectItem>
                              <SelectItem value="hard">Hard</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Security Settings
                </CardTitle>
                <CardDescription>Configure anti-cheating and monitoring features</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Enable Proctoring</Label>
                    <p className="text-sm text-muted-foreground">AI-powered monitoring during exam</p>
                  </div>
                  <Switch
                    checked={examSettings.proctoring}
                    onCheckedChange={(checked) => updateExamSettings({ proctoring: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Lockdown Browser</Label>
                    <p className="text-sm text-muted-foreground">Restrict browser functionality during exam</p>
                  </div>
                  <Switch
                    checked={examSettings.lockdownBrowser}
                    onCheckedChange={(checked) => updateExamSettings({ lockdownBrowser: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Time Limit Enforcement</Label>
                    <p className="text-sm text-muted-foreground">Automatically submit when time expires</p>
                  </div>
                  <Switch
                    checked={examSettings.timeLimit}
                    onCheckedChange={(checked) => updateExamSettings({ timeLimit: checked })}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Monitoring Features</CardTitle>
                <CardDescription>Advanced security and cheating detection</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="font-medium">Webcam Monitoring</span>
                    </div>
                    <p className="text-sm text-muted-foreground">Face detection and multiple person alerts</p>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="font-medium">Tab Switch Detection</span>
                    </div>
                    <p className="text-sm text-muted-foreground">Alert when students leave the exam window</p>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="font-medium">Copy-Paste Prevention</span>
                    </div>
                    <p className="text-sm text-muted-foreground">Disable clipboard operations during exam</p>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="font-medium">Keystroke Analysis</span>
                    </div>
                    <p className="text-sm text-muted-foreground">Detect unusual typing patterns</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Review Tab */}
          <TabsContent value="review" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Exam Summary</CardTitle>
                <CardDescription>Review your exam configuration before publishing</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="text-center p-4 border rounded-lg">
                    <Clock className="h-8 w-8 mx-auto mb-2 text-primary" />
                    <p className="font-medium">{examSettings.duration} min</p>
                    <p className="text-sm text-muted-foreground">Duration</p>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <Users className="h-8 w-8 mx-auto mb-2 text-primary" />
                    <p className="font-medium">{questions.length}</p>
                    <p className="text-sm text-muted-foreground">Questions</p>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <Badge className="h-8 w-8 mx-auto mb-2 flex items-center justify-center text-lg">
                      {calculateTotalPoints()}
                    </Badge>
                    <p className="font-medium">Total Points</p>
                    <p className="text-sm text-muted-foreground">Maximum Score</p>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <AlertTriangle className="h-8 w-8 mx-auto mb-2 text-primary" />
                    <p className="font-medium">{examSettings.passingScore}%</p>
                    <p className="text-sm text-muted-foreground">Passing Score</p>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Configuration Summary</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="font-medium mb-2">Exam Behavior</p>
                      <ul className="space-y-1 text-muted-foreground">
                        <li>• Randomize Questions: {examSettings.randomizeQuestions ? "Yes" : "No"}</li>
                        <li>• Randomize Options: {examSettings.randomizeOptions ? "Yes" : "No"}</li>
                        <li>• Allow Review: {examSettings.allowReview ? "Yes" : "No"}</li>
                        <li>• Show Results: {examSettings.showResults ? "Yes" : "No"}</li>
                        <li>• Max Attempts: {examSettings.maxAttempts}</li>
                      </ul>
                    </div>
                    <div>
                      <p className="font-medium mb-2">Security Features</p>
                      <ul className="space-y-1 text-muted-foreground">
                        <li>• Proctoring: {examSettings.proctoring ? "Enabled" : "Disabled"}</li>
                        <li>• Lockdown Browser: {examSettings.lockdownBrowser ? "Enabled" : "Disabled"}</li>
                        <li>• Time Limit: {examSettings.timeLimit ? "Enforced" : "Flexible"}</li>
                        <li>• Negative Marking: {examSettings.negativeMarking ? "Enabled" : "Disabled"}</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="flex items-center justify-center gap-4">
                  <Button variant="outline" onClick={previewExam}>
                    <Eye className="h-4 w-4 mr-2" />
                    Preview Exam
                  </Button>
                  <Button onClick={saveExam} size="lg">
                    <Save className="h-4 w-4 mr-2" />
                    Publish Exam
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
