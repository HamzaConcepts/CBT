"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, Clock, Shield } from "lucide-react"
import { SecurityMonitor } from "./security-monitor"
import { LockdownBrowser } from "./lockdown-browser"

interface ExamInterfaceProps {
  examId: string
}

// Mock exam data
const mockExam = {
  id: "1",
  title: "Mathematics Quiz 1",
  duration: 30,
  questions: [
    {
      id: 1,
      type: "mcq",
      question: "What is the value of x in the equation 2x + 5 = 15?",
      options: ["x = 5", "x = 10", "x = 7.5", "x = 2.5"],
      correctAnswer: 0,
    },
    {
      id: 2,
      type: "mcq",
      question: "Which of the following is a prime number?",
      options: ["15", "21", "17", "25"],
      correctAnswer: 2,
    },
    {
      id: 3,
      type: "short",
      question: "Explain the Pythagorean theorem in your own words.",
    },
  ],
}

export function ExamInterface({ examId }: ExamInterfaceProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [timeRemaining, setTimeRemaining] = useState(mockExam.duration * 60) // in seconds
  const [examStarted, setExamStarted] = useState(false)
  const [showWarning, setShowWarning] = useState(false)
  const [securityViolations, setSecurityViolations] = useState<any[]>([])
  const [lockdownEnabled, setLockdownEnabled] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (examStarted && timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            handleSubmitExam()
            return 0
          }
          return prev - 1
        })
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [examStarted, timeRemaining])

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  const handleStartExam = () => {
    setExamStarted(true)
  }

  const handleAnswerChange = (questionId: number, answer: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }))
  }

  const handleSubmitExam = () => {
    // Submit exam logic
    console.log("[v0] Exam submitted with answers:", answers)
    console.log("[v0] Security violations:", securityViolations)
    // Redirect to results
    router.replace("/student/dashboard")
  }

  const handleSecurityViolation = (event: any) => {
    setSecurityViolations((prev) => [...prev, event])
    setShowWarning(true)

    // Auto-dismiss warning after 5 seconds
    setTimeout(() => setShowWarning(false), 5000)
  }

  const currentQ = mockExam.questions[currentQuestion]
  const progress = ((currentQuestion + 1) / mockExam.questions.length) * 100

  if (!examStarted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-4xl space-y-6">
          <Card className="w-full">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <Shield className="h-16 w-16 text-primary" />
              </div>
              <CardTitle className="text-2xl">{mockExam.title}</CardTitle>
              <p className="text-muted-foreground">Secure Exam Environment</p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div className="p-4 border rounded-lg">
                  <Clock className="h-8 w-8 mx-auto mb-2 text-primary" />
                  <p className="font-medium">{mockExam.duration} Minutes</p>
                  <p className="text-sm text-muted-foreground">Duration</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <Badge className="h-8 w-8 mx-auto mb-2 flex items-center justify-center text-lg">
                    {mockExam.questions.length}
                  </Badge>
                  <p className="font-medium">Questions</p>
                  <p className="text-sm text-muted-foreground">Total</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <Shield className="h-8 w-8 mx-auto mb-2 text-primary" />
                  <p className="font-medium">Proctored</p>
                  <p className="text-sm text-muted-foreground">AI Monitoring</p>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-yellow-900">Important Instructions</p>
                    <ul className="text-sm text-yellow-700 mt-2 space-y-1">
                      <li>• The exam will enter fullscreen lockdown mode</li>
                      <li>• Tab switching will be detected and flagged</li>
                      <li>• Copy-paste operations are disabled</li>
                      <li>• Your webcam will be used for monitoring</li>
                      <li>• The exam will auto-submit when time expires</li>
                      <li>• All activities are logged for security review</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Security Setup */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <LockdownBrowser
                  examId={examId}
                  onLockdownEnabled={() => setLockdownEnabled(true)}
                  onLockdownDisabled={() => setLockdownEnabled(false)}
                />

                <SecurityMonitor
                  examId={examId}
                  studentId="student-123"
                  onSecurityViolation={handleSecurityViolation}
                />
              </div>

              <Button onClick={handleStartExam} className="w-full" size="lg" disabled={!lockdownEnabled}>
                {lockdownEnabled ? "Start Secure Exam" : "Enable Lockdown First"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Warning Banner */}
      {showWarning && (
        <div className="bg-red-50 border-b border-red-200 p-3">
          <div className="flex items-center justify-center gap-2 text-red-800">
            <AlertTriangle className="h-4 w-4" />
            <span className="text-sm font-medium">
              Security violation detected and logged. Continued violations may result in exam termination.
            </span>
            <Button size="sm" variant="outline" onClick={() => setShowWarning(false)} className="ml-4">
              Dismiss
            </Button>
          </div>
        </div>
      )}

      {/* Exam Header */}
      <header className="border-b bg-card p-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">{mockExam.title}</h1>
            <p className="text-sm text-muted-foreground">
              Question {currentQuestion + 1} of {mockExam.questions.length}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              {formatTime(timeRemaining)}
            </Badge>
            <Badge variant="outline" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Monitored
            </Badge>
            <Badge variant={securityViolations.length === 0 ? "default" : "destructive"}>
              Violations: {securityViolations.length}
            </Badge>
          </div>
        </div>
        <div className="mt-4">
          <Progress value={progress} />
        </div>
      </header>

      {/* Question Content */}
      <main className="container mx-auto px-4 py-6 max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Question {currentQuestion + 1}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-lg leading-relaxed">{currentQ.question}</p>

            {currentQ.type === "mcq" && currentQ.options && (
              <RadioGroup
                value={answers[currentQ.id] || ""}
                onValueChange={(value) => handleAnswerChange(currentQ.id, value)}
              >
                {currentQ.options.map((option, index) => (
                  <div key={index} className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-muted/50">
                    <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                    <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                      {option}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            )}

            {currentQ.type === "short" && (
              <Textarea
                placeholder="Type your answer here..."
                value={answers[currentQ.id] || ""}
                onChange={(e) => handleAnswerChange(currentQ.id, e.target.value)}
                className="min-h-32"
              />
            )}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-6">
          <Button
            variant="outline"
            onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
            disabled={currentQuestion === 0}
          >
            Previous
          </Button>

          <div className="flex items-center gap-2">
            {mockExam.questions.map((_, index) => (
              <Button
                key={index}
                size="sm"
                variant={
                  index === currentQuestion
                    ? "default"
                    : answers[mockExam.questions[index].id]
                      ? "secondary"
                      : "outline"
                }
                onClick={() => setCurrentQuestion(index)}
                className="w-10 h-10"
              >
                {index + 1}
              </Button>
            ))}
          </div>

          {currentQuestion === mockExam.questions.length - 1 ? (
            <Button onClick={handleSubmitExam} className="bg-green-600 hover:bg-green-700">
              Submit Exam
            </Button>
          ) : (
            <Button onClick={() => setCurrentQuestion(Math.min(mockExam.questions.length - 1, currentQuestion + 1))}>
              Next
            </Button>
          )}
        </div>
      </main>
    </div>
  )
}
