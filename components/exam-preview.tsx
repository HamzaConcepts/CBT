"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, Clock, Shield, Edit } from "lucide-react"

// Mock exam data for preview
const mockExamPreview = {
  title: "Mathematics Quiz 1",
  description: "Basic algebra and geometry concepts",
  type: "quiz",
  duration: 30,
  totalPoints: 25,
  passingScore: 60,
  questions: [
    {
      id: "1",
      type: "mcq",
      question: "What is the value of x in the equation 2x + 5 = 15?",
      options: ["x = 5", "x = 10", "x = 7.5", "x = 2.5"],
      points: 5,
      difficulty: "medium",
    },
    {
      id: "2",
      type: "mcq",
      question: "Which of the following is a prime number?",
      options: ["15", "21", "17", "25"],
      points: 5,
      difficulty: "easy",
    },
    {
      id: "3",
      type: "short",
      question: "Explain the Pythagorean theorem in your own words.",
      points: 10,
      difficulty: "medium",
    },
    {
      id: "4",
      type: "problem",
      question: "A rectangle has a length of 12 cm and a width of 8 cm. Calculate its area and perimeter.",
      points: 5,
      difficulty: "easy",
    },
  ],
}

export function ExamPreview() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [viewMode, setViewMode] = useState<"student" | "teacher">("teacher")

  const currentQ = mockExamPreview.questions[currentQuestion]
  const progress = ((currentQuestion + 1) / mockExamPreview.questions.length) * 100

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="outline" onClick={() => window.history.back()}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Editor
              </Button>
              <div>
                <h1 className="text-xl font-bold">{mockExamPreview.title}</h1>
                <p className="text-sm text-muted-foreground">Exam Preview</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant={viewMode === "teacher" ? "default" : "outline"}
                  onClick={() => setViewMode("teacher")}
                >
                  Teacher View
                </Button>
                <Button
                  size="sm"
                  variant={viewMode === "student" ? "default" : "outline"}
                  onClick={() => setViewMode("student")}
                >
                  Student View
                </Button>
              </div>
              <Button>
                <Edit className="h-4 w-4 mr-2" />
                Edit Exam
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {viewMode === "teacher" ? (
          // Teacher View - Overview
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Exam Overview</CardTitle>
                <CardDescription>Complete exam configuration and question breakdown</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  <div className="text-center p-4 border rounded-lg">
                    <Clock className="h-8 w-8 mx-auto mb-2 text-primary" />
                    <p className="font-medium">{mockExamPreview.duration} min</p>
                    <p className="text-sm text-muted-foreground">Duration</p>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <Badge className="h-8 w-8 mx-auto mb-2 flex items-center justify-center text-lg">
                      {mockExamPreview.questions.length}
                    </Badge>
                    <p className="font-medium">Questions</p>
                    <p className="text-sm text-muted-foreground">Total</p>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <Badge className="h-8 w-8 mx-auto mb-2 flex items-center justify-center text-lg">
                      {mockExamPreview.totalPoints}
                    </Badge>
                    <p className="font-medium">Points</p>
                    <p className="text-sm text-muted-foreground">Maximum</p>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <Shield className="h-8 w-8 mx-auto mb-2 text-primary" />
                    <p className="font-medium">{mockExamPreview.passingScore}%</p>
                    <p className="text-sm text-muted-foreground">Passing</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Question Breakdown</h3>
                  {mockExamPreview.questions.map((question, index) => (
                    <div key={question.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
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
                        <span className="font-medium">{question.question.substring(0, 60)}...</span>
                      </div>
                      <span className="text-sm font-medium">{question.points} pts</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          // Student View - Question Interface
          <div className="max-w-4xl mx-auto space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>{mockExamPreview.title}</CardTitle>
                    <CardDescription>
                      Question {currentQuestion + 1} of {mockExamPreview.questions.length}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge variant="outline" className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      {mockExamPreview.duration}:00
                    </Badge>
                    <Badge variant="outline" className="flex items-center gap-2">
                      <Shield className="h-4 w-4" />
                      Preview Mode
                    </Badge>
                  </div>
                </div>
                <Progress value={progress} className="mt-4" />
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold">Question {currentQuestion + 1}</h2>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{currentQ.points} points</Badge>
                    <Badge
                      variant={
                        currentQ.difficulty === "easy"
                          ? "secondary"
                          : currentQ.difficulty === "hard"
                            ? "destructive"
                            : "default"
                      }
                    >
                      {currentQ.difficulty}
                    </Badge>
                  </div>
                </div>

                <p className="text-lg leading-relaxed">{currentQ.question}</p>

                {currentQ.type === "mcq" && "options" in currentQ && currentQ.options && (
                  <RadioGroup>
                    {currentQ.options.map((option, index) => (
                      <div key={index} className="flex items-center space-x-2 p-3 border rounded-lg">
                        <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                        <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                          {option}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                )}

                {(currentQ.type === "short" || currentQ.type === "problem") && (
                  <Textarea placeholder="Type your answer here..." className="min-h-32" disabled />
                )}
              </CardContent>
            </Card>

            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
                disabled={currentQuestion === 0}
              >
                Previous
              </Button>

              <div className="flex items-center gap-2">
                {mockExamPreview.questions.map((_, index) => (
                  <Button
                    key={index}
                    size="sm"
                    variant={index === currentQuestion ? "default" : "outline"}
                    onClick={() => setCurrentQuestion(index)}
                    className="w-10 h-10"
                  >
                    {index + 1}
                  </Button>
                ))}
              </div>

              <Button
                onClick={() => setCurrentQuestion(Math.min(mockExamPreview.questions.length - 1, currentQuestion + 1))}
                disabled={currentQuestion === mockExamPreview.questions.length - 1}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
