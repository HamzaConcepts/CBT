"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import SecureQuizInterface from "@/components/secure-quiz-interface"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Shield, Clock, Camera, Eye, AlertTriangle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

// Mock quiz data - in real app, fetch from API
const mockQuiz = {
  id: "1",
  title: "Advanced Mathematics Quiz",
  duration: 60, // minutes
  questions: [
    {
      id: "1",
      type: "mcq" as const,
      question: "What is the derivative of x²?",
      options: ["2x", "x²", "2", "x"],
      correctAnswer: "2x",
      points: 5,
    },
    {
      id: "2",
      type: "short" as const,
      question: "Solve for x: 2x + 5 = 13",
      correctAnswer: "4",
      points: 5,
    },
    {
      id: "3",
      type: "essay" as const,
      question: "Explain the concept of limits in calculus and provide an example.",
      points: 10,
    },
  ],
  settings: {
    randomizeQuestions: true,
    preventCopyPaste: true,
    fullscreenRequired: true,
    webcamRequired: true,
    tabSwitchLimit: 3,
  },
}

export default function TakeQuizPage() {
  const params = useParams()
  const [quizStarted, setQuizStarted] = useState(false)
  const [systemCheck, setSystemCheck] = useState({
    webcam: false,
    microphone: false,
    fullscreen: false,
    browser: true,
  })
  const [checkingSystem, setCheckingSystem] = useState(false)

  const runSystemCheck = async () => {
    setCheckingSystem(true)

    // Check webcam access
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      setSystemCheck((prev) => ({ ...prev, webcam: true, microphone: true }))
      stream.getTracks().forEach((track) => track.stop()) // Stop the stream
    } catch (error) {
      console.error("Media access error:", error)
    }

    // Check fullscreen capability
    setSystemCheck((prev) => ({ ...prev, fullscreen: !!document.documentElement.requestFullscreen }))

    setCheckingSystem(false)
  }

  useEffect(() => {
    runSystemCheck()
  }, [])

  const startQuiz = () => {
    if (mockQuiz.settings.fullscreenRequired) {
      document.documentElement.requestFullscreen()
    }
    setQuizStarted(true)
  }

  const allChecksPass = Object.values(systemCheck).every((check) => check)

  if (quizStarted) {
    return <SecureQuizInterface quiz={mockQuiz} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {mockQuiz.title}
          </CardTitle>
          <p className="text-gray-600 mt-2">Secure Computer-Based Testing Environment</p>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Quiz Information */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <Clock className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <div className="font-semibold text-blue-800">Duration</div>
              <div className="text-blue-600">{mockQuiz.duration} minutes</div>
            </div>

            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="font-semibold text-green-800">Questions</div>
              <div className="text-green-600">{mockQuiz.questions.length} questions</div>
            </div>

            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <Shield className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <div className="font-semibold text-purple-800">Security</div>
              <div className="text-purple-600">High Level</div>
            </div>
          </div>

          {/* System Requirements Check */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Shield className="h-5 w-5 mr-2" />
                System Requirements Check
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Camera className="h-5 w-5 text-gray-600" />
                    <span>Webcam Access</span>
                  </div>
                  <Badge variant={systemCheck.webcam ? "default" : "destructive"}>
                    {systemCheck.webcam ? "Ready" : "Required"}
                  </Badge>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Eye className="h-5 w-5 text-gray-600" />
                    <span>Microphone Access</span>
                  </div>
                  <Badge variant={systemCheck.microphone ? "default" : "destructive"}>
                    {systemCheck.microphone ? "Ready" : "Required"}
                  </Badge>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Shield className="h-5 w-5 text-gray-600" />
                    <span>Fullscreen Mode</span>
                  </div>
                  <Badge variant={systemCheck.fullscreen ? "default" : "destructive"}>
                    {systemCheck.fullscreen ? "Supported" : "Not Supported"}
                  </Badge>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="h-5 w-5 bg-green-500 rounded-full"></div>
                    <span>Browser Compatibility</span>
                  </div>
                  <Badge variant="default">Ready</Badge>
                </div>
              </div>

              <Button
                onClick={runSystemCheck}
                disabled={checkingSystem}
                variant="outline"
                className="w-full bg-transparent"
              >
                {checkingSystem ? "Checking..." : "Re-check System"}
              </Button>
            </CardContent>
          </Card>

          {/* Security Rules */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center text-red-600">
                <AlertTriangle className="h-5 w-5 mr-2" />
                Security Rules & Warnings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <Alert>
                  <AlertDescription>
                    <strong>Zero Tolerance Policy:</strong> Any attempt to cheat will result in automatic quiz
                    submission and disciplinary action.
                  </AlertDescription>
                </Alert>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <h4 className="font-semibold text-red-800 mb-2">Prohibited Actions:</h4>
                    <ul className="text-red-700 space-y-1 text-xs">
                      <li>• Switching tabs or windows</li>
                      <li>• Copy/paste operations</li>
                      <li>• Right-clicking or developer tools</li>
                      <li>• Leaving fullscreen mode</li>
                      <li>• Using external devices</li>
                    </ul>
                  </div>

                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <h4 className="font-semibold text-blue-800 mb-2">Monitoring Features:</h4>
                    <ul className="text-blue-700 space-y-1 text-xs">
                      <li>• Real-time webcam monitoring</li>
                      <li>• Face detection technology</li>
                      <li>• Tab switch detection</li>
                      <li>• Keystroke monitoring</li>
                      <li>• Screen recording</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Start Quiz Button */}
          <div className="text-center pt-4">
            <Button
              onClick={startQuiz}
              disabled={!allChecksPass}
              size="lg"
              className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-8 py-3 text-lg"
            >
              {allChecksPass ? "Start Secure Quiz" : "Complete System Check First"}
            </Button>

            {!allChecksPass && (
              <p className="text-red-600 text-sm mt-2">
                Please ensure all system requirements are met before starting the quiz.
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
