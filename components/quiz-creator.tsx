"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Plus, Trash2, Eye, Shield } from "lucide-react"

interface Question {
  id: string
  type: "mcq" | "short" | "essay"
  question: string
  options?: string[]
  correctAnswer?: string
  points: number
}

interface QuizSettings {
  duration: number
  randomizeQuestions: boolean
  preventCopyPaste: boolean
  fullscreenRequired: boolean
  webcamRequired: boolean
  tabSwitchLimit: number
  showResults: boolean
  allowReview: boolean
}

export default function QuizCreator() {
  const [quizTitle, setQuizTitle] = useState("")
  const [quizDescription, setQuizDescription] = useState("")
  const [questions, setQuestions] = useState<Question[]>([])
  const [settings, setSettings] = useState<QuizSettings>({
    duration: 60,
    randomizeQuestions: false,
    preventCopyPaste: true,
    fullscreenRequired: true,
    webcamRequired: true,
    tabSwitchLimit: 3,
    showResults: true,
    allowReview: false,
  })
  const [currentStep, setCurrentStep] = useState(1)

  const addQuestion = (type: Question["type"]) => {
    const newQuestion: Question = {
      id: Date.now().toString(),
      type,
      question: "",
      points: 5,
      ...(type === "mcq" && { options: ["", "", "", ""], correctAnswer: "" }),
    }
    setQuestions([...questions, newQuestion])
  }

  const updateQuestion = (id: string, updates: Partial<Question>) => {
    setQuestions(questions.map((q) => (q.id === id ? { ...q, ...updates } : q)))
  }

  const deleteQuestion = (id: string) => {
    setQuestions(questions.filter((q) => q.id !== id))
  }

  const updateOption = (questionId: string, optionIndex: number, value: string) => {
    const question = questions.find((q) => q.id === questionId)
    if (question && question.options) {
      const newOptions = [...question.options]
      newOptions[optionIndex] = value
      updateQuestion(questionId, { options: newOptions })
    }
  }

  const totalPoints = questions.reduce((sum, q) => sum + q.points, 0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Create Secure Quiz
          </h1>
          <p className="text-gray-600 mt-2">Build a comprehensive quiz with advanced anti-cheat features</p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-4">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                    currentStep >= step
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {step}
                </div>
                {step < 3 && (
                  <div
                    className={`w-16 h-1 mx-2 ${
                      currentStep > step ? "bg-gradient-to-r from-blue-600 to-purple-600" : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step 1: Basic Information */}
        {currentStep === 1 && (
          <Card>
            <CardHeader>
              <CardTitle>Quiz Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="title">Quiz Title</Label>
                <Input
                  id="title"
                  value={quizTitle}
                  onChange={(e) => setQuizTitle(e.target.value)}
                  placeholder="Enter quiz title..."
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={quizDescription}
                  onChange={(e) => setQuizDescription(e.target.value)}
                  placeholder="Enter quiz description..."
                  rows={3}
                  className="mt-1"
                />
              </div>

              <div className="flex justify-end">
                <Button
                  onClick={() => setCurrentStep(2)}
                  disabled={!quizTitle.trim()}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  Next: Add Questions
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Questions */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Quiz Questions</CardTitle>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline">{questions.length} Questions</Badge>
                    <Badge variant="outline">{totalPoints} Points</Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex space-x-2 mb-6">
                  <Button onClick={() => addQuestion("mcq")} variant="outline" size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Multiple Choice
                  </Button>
                  <Button onClick={() => addQuestion("short")} variant="outline" size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Short Answer
                  </Button>
                  <Button onClick={() => addQuestion("essay")} variant="outline" size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Essay
                  </Button>
                </div>

                <div className="space-y-6">
                  {questions.map((question, index) => (
                    <Card key={question.id} className="border-l-4 border-l-blue-500">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Badge variant="secondary">Q{index + 1}</Badge>
                            <Badge variant="outline">{question.type.toUpperCase()}</Badge>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Input
                              type="number"
                              value={question.points}
                              onChange={(e) =>
                                updateQuestion(question.id, { points: Number.parseInt(e.target.value) || 0 })
                              }
                              className="w-20"
                              min="1"
                            />
                            <span className="text-sm text-gray-600">pts</span>
                            <Button onClick={() => deleteQuestion(question.id)} variant="outline" size="sm">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <Label>Question</Label>
                          <Textarea
                            value={question.question}
                            onChange={(e) => updateQuestion(question.id, { question: e.target.value })}
                            placeholder="Enter your question..."
                            rows={2}
                            className="mt-1"
                          />
                        </div>

                        {question.type === "mcq" && question.options && (
                          <div>
                            <Label>Answer Options</Label>
                            <div className="space-y-2 mt-2">
                              {question.options.map((option, optionIndex) => (
                                <div key={optionIndex} className="flex items-center space-x-2">
                                  <Input
                                    value={option}
                                    onChange={(e) => updateOption(question.id, optionIndex, e.target.value)}
                                    placeholder={`Option ${optionIndex + 1}`}
                                  />
                                  <input
                                    type="radio"
                                    name={`correct-${question.id}`}
                                    checked={question.correctAnswer === option}
                                    onChange={() => updateQuestion(question.id, { correctAnswer: option })}
                                    className="text-green-600"
                                  />
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {question.type === "short" && (
                          <div>
                            <Label>Correct Answer (Optional)</Label>
                            <Input
                              value={question.correctAnswer || ""}
                              onChange={(e) => updateQuestion(question.id, { correctAnswer: e.target.value })}
                              placeholder="Enter correct answer for auto-grading..."
                              className="mt-1"
                            />
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="flex justify-between pt-6">
                  <Button onClick={() => setCurrentStep(1)} variant="outline">
                    Back
                  </Button>
                  <Button
                    onClick={() => setCurrentStep(3)}
                    disabled={questions.length === 0}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    Next: Security Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Step 3: Security Settings */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="h-5 w-5 mr-2" />
                  Security & Anti-Cheat Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="duration">Quiz Duration (minutes)</Label>
                    <Input
                      id="duration"
                      type="number"
                      value={settings.duration}
                      onChange={(e) => setSettings({ ...settings, duration: Number.parseInt(e.target.value) || 60 })}
                      min="1"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="tabLimit">Tab Switch Limit</Label>
                    <Input
                      id="tabLimit"
                      type="number"
                      value={settings.tabSwitchLimit}
                      onChange={(e) =>
                        setSettings({ ...settings, tabSwitchLimit: Number.parseInt(e.target.value) || 3 })
                      }
                      min="0"
                      max="10"
                      className="mt-1"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <Label className="font-medium">Randomize Questions</Label>
                      <p className="text-sm text-gray-600">Shuffle question order for each student</p>
                    </div>
                    <Switch
                      checked={settings.randomizeQuestions}
                      onCheckedChange={(checked) => setSettings({ ...settings, randomizeQuestions: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <Label className="font-medium">Prevent Copy/Paste</Label>
                      <p className="text-sm text-gray-600">Block copy and paste operations</p>
                    </div>
                    <Switch
                      checked={settings.preventCopyPaste}
                      onCheckedChange={(checked) => setSettings({ ...settings, preventCopyPaste: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <Label className="font-medium">Require Fullscreen</Label>
                      <p className="text-sm text-gray-600">Force fullscreen mode during quiz</p>
                    </div>
                    <Switch
                      checked={settings.fullscreenRequired}
                      onCheckedChange={(checked) => setSettings({ ...settings, fullscreenRequired: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <Label className="font-medium">Webcam Monitoring</Label>
                      <p className="text-sm text-gray-600">Enable webcam proctoring</p>
                    </div>
                    <Switch
                      checked={settings.webcamRequired}
                      onCheckedChange={(checked) => setSettings({ ...settings, webcamRequired: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <Label className="font-medium">Show Results</Label>
                      <p className="text-sm text-gray-600">Display results after submission</p>
                    </div>
                    <Switch
                      checked={settings.showResults}
                      onCheckedChange={(checked) => setSettings({ ...settings, showResults: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <Label className="font-medium">Allow Review</Label>
                      <p className="text-sm text-gray-600">Let students review answers before submission</p>
                    </div>
                    <Switch
                      checked={settings.allowReview}
                      onCheckedChange={(checked) => setSettings({ ...settings, allowReview: checked })}
                    />
                  </div>
                </div>

                <div className="flex justify-between pt-6">
                  <Button onClick={() => setCurrentStep(2)} variant="outline">
                    Back
                  </Button>
                  <div className="space-x-2">
                    <Button variant="outline">
                      <Eye className="h-4 w-4 mr-2" />
                      Preview Quiz
                    </Button>
                    <Button className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800">
                      Create Quiz
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
