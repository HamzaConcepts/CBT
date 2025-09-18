"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { AlertTriangle, Eye, Shield, Clock, Camera } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface Question {
  id: string
  type: "mcq" | "short" | "essay"
  question: string
  options?: string[]
  correctAnswer?: string
  points: number
}

interface QuizData {
  id: string
  title: string
  duration: number
  questions: Question[]
  settings: {
    randomizeQuestions: boolean
    preventCopyPaste: boolean
    fullscreenRequired: boolean
    webcamRequired: boolean
    tabSwitchLimit: number
  }
}

export default function SecureQuizInterface({ quiz }: { quiz: QuizData }) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [timeRemaining, setTimeRemaining] = useState(quiz.duration * 60)
  const [violations, setViolations] = useState<string[]>([])
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [tabSwitches, setTabSwitches] = useState(0)
  const [webcamActive, setWebcamActive] = useState(false)
  const [faceDetected, setFaceDetected] = useState(true)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  // Timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          handleSubmit()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  // Anti-cheat monitoring
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setTabSwitches((prev) => prev + 1)
        setViolations((prev) => [...prev, `Tab switch detected at ${new Date().toLocaleTimeString()}`])

        if (tabSwitches >= quiz.settings.tabSwitchLimit) {
          alert("Too many tab switches detected. Quiz will be submitted automatically.")
          handleSubmit()
        }
      }
    }

    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
      if (!document.fullscreenElement && quiz.settings.fullscreenRequired) {
        setViolations((prev) => [...prev, `Fullscreen exited at ${new Date().toLocaleTimeString()}`])
      }
    }

    const handleCopyPaste = (e: Event) => {
      if (quiz.settings.preventCopyPaste) {
        e.preventDefault()
        setViolations((prev) => [...prev, `Copy/paste attempt at ${new Date().toLocaleTimeString()}`])
      }
    }

    const handleRightClick = (e: MouseEvent) => {
      e.preventDefault()
      setViolations((prev) => [...prev, `Right-click attempt at ${new Date().toLocaleTimeString()}`])
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent common cheat key combinations
      if (
        (e.ctrlKey && (e.key === "c" || e.key === "v" || e.key === "a" || e.key === "f")) ||
        e.key === "F12" ||
        (e.ctrlKey && e.shiftKey && e.key === "I")
      ) {
        e.preventDefault()
        setViolations((prev) => [...prev, `Prohibited key combination at ${new Date().toLocaleTimeString()}`])
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange)
    document.addEventListener("fullscreenchange", handleFullscreenChange)
    document.addEventListener("copy", handleCopyPaste)
    document.addEventListener("paste", handleCopyPaste)
    document.addEventListener("contextmenu", handleRightClick)
    document.addEventListener("keydown", handleKeyDown)

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange)
      document.removeEventListener("fullscreenchange", handleFullscreenChange)
      document.removeEventListener("copy", handleCopyPaste)
      document.removeEventListener("paste", handleCopyPaste)
      document.removeEventListener("contextmenu", handleRightClick)
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [tabSwitches, quiz.settings])

  // Webcam monitoring
  useEffect(() => {
    if (quiz.settings.webcamRequired) {
      startWebcam()
    }
  }, [])

  const startWebcam = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        setWebcamActive(true)

        // Simulate face detection
        setInterval(() => {
          setFaceDetected(Math.random() > 0.1) // 90% chance face is detected
        }, 2000)
      }
    } catch (error) {
      setViolations((prev) => [...prev, "Webcam access denied"])
    }
  }

  const enterFullscreen = () => {
    document.documentElement.requestFullscreen()
  }

  const handleAnswerChange = (questionId: string, answer: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }))
  }

  const handleSubmit = () => {
    setIsSubmitted(true)
    // Submit quiz with answers and violation log
    console.log("Quiz submitted:", { answers, violations, tabSwitches })
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const currentQ = quiz.questions[currentQuestion]
  const progress = ((currentQuestion + 1) / quiz.questions.length) * 100

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-green-600">Quiz Submitted Successfully</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <Shield className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <p className="text-gray-600">Your quiz has been submitted and is being processed.</p>
              <p className="text-sm text-gray-500 mt-2">Security violations: {violations.length}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Security Header */}
      <div className="bg-white border-b shadow-sm p-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-bold text-gray-800">{quiz.title}</h1>
            <Badge variant={violations.length > 0 ? "destructive" : "secondary"}>
              <Shield className="h-3 w-3 mr-1" />
              Secure Mode
            </Badge>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Clock className="h-4 w-4" />
              <span className={timeRemaining < 300 ? "text-red-600 font-bold" : ""}>{formatTime(timeRemaining)}</span>
            </div>

            {quiz.settings.webcamRequired && (
              <Badge variant={webcamActive && faceDetected ? "default" : "destructive"}>
                <Camera className="h-3 w-3 mr-1" />
                {webcamActive ? (faceDetected ? "Face Detected" : "No Face") : "No Camera"}
              </Badge>
            )}

            {!isFullscreen && quiz.settings.fullscreenRequired && (
              <Button onClick={enterFullscreen} size="sm" variant="outline">
                Enter Fullscreen
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Quiz Area */}
        <div className="lg:col-span-3">
          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">
                  Question {currentQuestion + 1} of {quiz.questions.length}
                </CardTitle>
                <Badge variant="outline">{currentQ.points} points</Badge>
              </div>
              <Progress value={progress} className="w-full" />
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="text-lg font-medium text-gray-800">{currentQ.question}</div>

              {currentQ.type === "mcq" && currentQ.options && (
                <div className="space-y-3">
                  {currentQ.options.map((option, index) => (
                    <label
                      key={index}
                      className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                    >
                      <input
                        type="radio"
                        name={currentQ.id}
                        value={option}
                        checked={answers[currentQ.id] === option}
                        onChange={(e) => handleAnswerChange(currentQ.id, e.target.value)}
                        className="text-blue-600"
                      />
                      <span>{option}</span>
                    </label>
                  ))}
                </div>
              )}

              {currentQ.type === "short" && (
                <input
                  type="text"
                  value={answers[currentQ.id] || ""}
                  onChange={(e) => handleAnswerChange(currentQ.id, e.target.value)}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your answer..."
                />
              )}

              {currentQ.type === "essay" && (
                <textarea
                  value={answers[currentQ.id] || ""}
                  onChange={(e) => handleAnswerChange(currentQ.id, e.target.value)}
                  rows={6}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  placeholder="Write your essay answer..."
                />
              )}

              <div className="flex justify-between pt-4">
                <Button
                  onClick={() => setCurrentQuestion((prev) => Math.max(0, prev - 1))}
                  disabled={currentQuestion === 0}
                  variant="outline"
                >
                  Previous
                </Button>

                {currentQuestion === quiz.questions.length - 1 ? (
                  <Button
                    onClick={handleSubmit}
                    className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
                  >
                    Submit Quiz
                  </Button>
                ) : (
                  <Button
                    onClick={() => setCurrentQuestion((prev) => Math.min(quiz.questions.length - 1, prev + 1))}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    Next
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Security Monitoring Panel */}
        <div className="space-y-4">
          {/* Webcam Feed */}
          {quiz.settings.webcamRequired && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center">
                  <Eye className="h-4 w-4 mr-2" />
                  Proctoring
                </CardTitle>
              </CardHeader>
              <CardContent>
                <video ref={videoRef} autoPlay muted className="w-full h-32 bg-gray-200 rounded-lg object-cover" />
                <div className="mt-2 text-xs text-center">
                  <Badge variant={faceDetected ? "default" : "destructive"}>
                    {faceDetected ? "Face Detected" : "No Face Detected"}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Security Status */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center">
                <Shield className="h-4 w-4 mr-2" />
                Security Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span>Tab Switches</span>
                <Badge variant={tabSwitches > 0 ? "destructive" : "default"}>
                  {tabSwitches}/{quiz.settings.tabSwitchLimit}
                </Badge>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span>Fullscreen</span>
                <Badge variant={isFullscreen ? "default" : "destructive"}>{isFullscreen ? "Active" : "Inactive"}</Badge>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span>Violations</span>
                <Badge variant={violations.length > 0 ? "destructive" : "default"}>{violations.length}</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Question Navigator */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Question Navigator</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-5 gap-2">
                {quiz.questions.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentQuestion(index)}
                    className={`w-8 h-8 rounded text-xs font-medium ${
                      index === currentQuestion
                        ? "bg-blue-600 text-white"
                        : answers[quiz.questions[index].id]
                          ? "bg-green-100 text-green-800 border border-green-300"
                          : "bg-gray-100 text-gray-600 border border-gray-300"
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Violations Log */}
          {violations.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center text-red-600">
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Security Alerts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {violations.slice(-5).map((violation, index) => (
                    <Alert key={index} className="py-2">
                      <AlertDescription className="text-xs">{violation}</AlertDescription>
                    </Alert>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
