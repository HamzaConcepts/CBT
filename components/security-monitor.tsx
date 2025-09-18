"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { Camera, Eye, AlertTriangle, Shield, Monitor, Wifi, CheckCircle } from "lucide-react"

interface SecurityEvent {
  id: string
  type: "tab_switch" | "copy_paste" | "face_detection" | "multiple_faces" | "suspicious_activity" | "network_change"
  severity: "low" | "medium" | "high" | "critical"
  timestamp: Date
  description: string
  studentId: string
  examId: string
}

interface SecurityMonitorProps {
  examId: string
  studentId: string
  onSecurityViolation: (event: SecurityEvent) => void
}

export function SecurityMonitor({ examId, studentId, onSecurityViolation }: SecurityMonitorProps) {
  const [isMonitoring, setIsMonitoring] = useState(false)
  const [webcamActive, setWebcamActive] = useState(false)
  const [screenRecording, setScreenRecording] = useState(false)
  const [securityScore, setSecurityScore] = useState(100)
  const [violations, setViolations] = useState<SecurityEvent[]>([])
  const [faceDetected, setFaceDetected] = useState(false)
  const [multipleFaces, setMultipleFaces] = useState(false)

  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (isMonitoring) {
      initializeSecurityMonitoring()
    }
    return () => {
      stopMonitoring()
    }
  }, [isMonitoring])

  const initializeSecurityMonitoring = async () => {
    try {
      // Initialize webcam
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      })

      if (videoRef.current) {
        videoRef.current.srcObject = stream
        setWebcamActive(true)
      }

      // Start face detection simulation
      startFaceDetection()

      // Add event listeners for security monitoring
      addSecurityEventListeners()

      console.log("[v0] Security monitoring initialized")
    } catch (error) {
      console.error("[v0] Failed to initialize security monitoring:", error)
      logSecurityEvent("network_change", "critical", "Failed to access camera/microphone")
    }
  }

  const startFaceDetection = () => {
    // Simulate AI face detection
    const faceDetectionInterval = setInterval(() => {
      // Simulate face detection results
      const hasFace = Math.random() > 0.1 // 90% chance of detecting face
      const hasMultipleFaces = Math.random() > 0.95 // 5% chance of multiple faces

      setFaceDetected(hasFace)
      setMultipleFaces(hasMultipleFaces)

      if (!hasFace) {
        logSecurityEvent("face_detection", "high", "No face detected in camera feed")
      } else if (hasMultipleFaces) {
        logSecurityEvent("multiple_faces", "critical", "Multiple faces detected in camera feed")
      }
    }, 3000)

    return () => clearInterval(faceDetectionInterval)
  }

  const addSecurityEventListeners = () => {
    // Tab switch detection
    const handleVisibilityChange = () => {
      if (document.hidden) {
        logSecurityEvent("tab_switch", "high", "Student switched away from exam tab")
      }
    }

    // Copy-paste detection
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        if (["c", "v", "a", "s", "p"].includes(e.key.toLowerCase())) {
          e.preventDefault()
          logSecurityEvent("copy_paste", "medium", `Attempted ${e.key.toUpperCase()} operation`)
        }
      }

      // Detect suspicious key combinations
      if (e.altKey && e.key === "Tab") {
        e.preventDefault()
        logSecurityEvent("suspicious_activity", "high", "Alt+Tab detected")
      }
    }

    // Right-click prevention
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault()
      logSecurityEvent("suspicious_activity", "low", "Right-click attempted")
    }

    // Network change detection
    const handleOnline = () => {
      logSecurityEvent("network_change", "medium", "Network connection restored")
    }

    const handleOffline = () => {
      logSecurityEvent("network_change", "high", "Network connection lost")
    }

    document.addEventListener("visibilitychange", handleVisibilityChange)
    document.addEventListener("keydown", handleKeyDown)
    document.addEventListener("contextmenu", handleContextMenu)
    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange)
      document.removeEventListener("keydown", handleKeyDown)
      document.removeEventListener("contextmenu", handleContextMenu)
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }

  const logSecurityEvent = (type: SecurityEvent["type"], severity: SecurityEvent["severity"], description: string) => {
    const event: SecurityEvent = {
      id: Date.now().toString(),
      type,
      severity,
      timestamp: new Date(),
      description,
      studentId,
      examId,
    }

    setViolations((prev) => [event, ...prev].slice(0, 10)) // Keep last 10 events
    onSecurityViolation(event)

    // Update security score
    const penaltyMap = { low: 2, medium: 5, high: 10, critical: 20 }
    setSecurityScore((prev) => Math.max(0, prev - penaltyMap[severity]))

    console.log("[v0] Security event logged:", event)
  }

  const stopMonitoring = () => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream
      stream.getTracks().forEach((track) => track.stop())
    }
    setWebcamActive(false)
    setScreenRecording(false)
  }

  const startMonitoring = () => {
    setIsMonitoring(true)
  }

  const getSeverityColor = (severity: SecurityEvent["severity"]) => {
    switch (severity) {
      case "low":
        return "text-blue-600"
      case "medium":
        return "text-yellow-600"
      case "high":
        return "text-orange-600"
      case "critical":
        return "text-red-600"
      default:
        return "text-gray-600"
    }
  }

  const getSeverityBadge = (severity: SecurityEvent["severity"]) => {
    switch (severity) {
      case "low":
        return "secondary"
      case "medium":
        return "outline"
      case "high":
        return "destructive"
      case "critical":
        return "destructive"
      default:
        return "outline"
    }
  }

  return (
    <div className="space-y-4">
      {/* Security Status Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Security Monitor
              </CardTitle>
              <CardDescription>AI-powered exam security and proctoring</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={securityScore > 80 ? "default" : securityScore > 60 ? "secondary" : "destructive"}>
                Security Score: {securityScore}%
              </Badge>
              {!isMonitoring ? (
                <Button onClick={startMonitoring}>Start Monitoring</Button>
              ) : (
                <Button variant="destructive" onClick={() => setIsMonitoring(false)}>
                  Stop Monitoring
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-2">
              <Camera className={`h-4 w-4 ${webcamActive ? "text-green-600" : "text-gray-400"}`} />
              <span className="text-sm">Webcam: {webcamActive ? "Active" : "Inactive"}</span>
            </div>
            <div className="flex items-center gap-2">
              <Eye className={`h-4 w-4 ${faceDetected ? "text-green-600" : "text-red-600"}`} />
              <span className="text-sm">Face: {faceDetected ? "Detected" : "Not Detected"}</span>
            </div>
            <div className="flex items-center gap-2">
              <Monitor className={`h-4 w-4 ${isMonitoring ? "text-green-600" : "text-gray-400"}`} />
              <span className="text-sm">Screen: {isMonitoring ? "Monitored" : "Not Monitored"}</span>
            </div>
            <div className="flex items-center gap-2">
              <Wifi className="h-4 w-4 text-green-600" />
              <span className="text-sm">Network: Stable</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Webcam Feed */}
      {isMonitoring && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Live Proctoring Feed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <video
                ref={videoRef}
                autoPlay
                muted
                className="w-full max-w-sm rounded-lg border"
                style={{ transform: "scaleX(-1)" }} // Mirror effect
              />
              <canvas ref={canvasRef} className="hidden" />

              {/* Overlay indicators */}
              <div className="absolute top-2 left-2 flex gap-2">
                {faceDetected && (
                  <Badge variant="default" className="text-xs">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Face OK
                  </Badge>
                )}
                {multipleFaces && (
                  <Badge variant="destructive" className="text-xs">
                    <AlertTriangle className="h-3 w-3 mr-1" />
                    Multiple Faces
                  </Badge>
                )}
              </div>

              <div className="absolute top-2 right-2">
                <Badge variant="outline" className="text-xs">
                  <div className="h-2 w-2 bg-red-500 rounded-full animate-pulse mr-1" />
                  LIVE
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Security Events Log */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Security Events</CardTitle>
          <CardDescription>Real-time security violations and alerts</CardDescription>
        </CardHeader>
        <CardContent>
          {violations.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <CheckCircle className="h-8 w-8 mx-auto mb-2 text-green-600" />
              <p>No security violations detected</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {violations.map((violation) => (
                <Alert key={violation.id} className="py-2">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription className="flex items-center justify-between">
                    <div>
                      <span className={`font-medium ${getSeverityColor(violation.severity)}`}>
                        {violation.type.replace("_", " ").toUpperCase()}:
                      </span>
                      <span className="ml-2">{violation.description}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={getSeverityBadge(violation.severity)} className="text-xs">
                        {violation.severity}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{violation.timestamp.toLocaleTimeString()}</span>
                    </div>
                  </AlertDescription>
                </Alert>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Security Score */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Security Assessment</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Overall Security Score</span>
              <span className="text-sm font-bold">{securityScore}%</span>
            </div>
            <Progress
              value={securityScore}
              className={`h-2 ${securityScore > 80 ? "" : securityScore > 60 ? "bg-yellow-100" : "bg-red-100"}`}
            />
            <p className="text-xs text-muted-foreground">
              {securityScore > 80
                ? "Excellent security compliance"
                : securityScore > 60
                  ? "Moderate security concerns detected"
                  : "Multiple security violations detected"}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
