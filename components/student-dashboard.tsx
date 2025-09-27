"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BookOpen,
  Clock,
  Trophy,
  TrendingUp,
  Bell,
  Play,
  Target,
  Award,
  AlertCircle,
  CheckCircle,
  Lock,
} from "lucide-react"
import { ClassroomSystem } from "@/components/classroom-system"
import { supabase } from "@/lib/supabaseClient"

type DbExam = {
  id: string
  title: string
  type: string
  duration_min: number
  question_count: number
  status: string
  due_at: string
  max_attempts: number
}

type DbAttempt = {
  id: string
  exam_id: string
  user_id: string
  submitted_at: string | null
  score: number | null
}

type DbNotification = {
  id: number
  type: string
  message: string
  created_at: string
}

export function StudentDashboard() {
  const [examCode, setExamCode] = useState("")
  const [activeTab, setActiveTab] = useState("overview")

  const [exams, setExams] = useState<DbExam[]>([])
  const [attempts, setAttempts] = useState<DbAttempt[]>([])
  const [notifications, setNotifications] = useState<DbNotification[]>([])
  const [loading, setLoading] = useState(true)

  // Resolve current authenticated user
  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      const { data: userData } = await supabase.auth.getUser()
      const userId = userData.user?.id

      // 2) Fetch exams
      const { data: examRows, error: examErr } = await supabase
        .from("exams")
        .select("id,title,type,duration_min,question_count,status,due_at,max_attempts")
        .order("due_at", { ascending: true })

      if (examErr) {
        console.error(examErr)
      } else {
        setExams(examRows ?? [])
      }

      // 3) Fetch attempts for the user
      if (userId) {
        const { data: attemptRows, error: attemptErr } = await supabase
          .from("attempts")
          .select("id,exam_id,user_id,submitted_at,score")
          .eq("user_id", userId)
          .order("submitted_at", { ascending: false })

        if (attemptErr) {
          console.error(attemptErr)
        } else {
          setAttempts(attemptRows ?? [])
        }

        // 4) Notifications
        const { data: notifRows, error: notifErr } = await supabase
          .from("notifications")
          .select("id,type,message,created_at")
          .eq("user_id", userId)
          .order("created_at", { ascending: false })
          .limit(10)

        if (notifErr) {
          console.error(notifErr)
        } else {
          setNotifications(notifRows ?? [])
        }
      }

      setLoading(false)
    }
    loadData()
  }, [])

  const handleStartExam = (examId: string) => {
    // Navigate to exam taking interface
    window.location.href = `/student/exam/${examId}`
  }

  const handleEnterExamCode = () => {
    if (examCode.trim()) {
      // Navigate to exam with code
      window.location.href = `/student/exam/code/${examCode}`
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      {/* Header */}
      <header className="border-b bg-card/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Student Dashboard
              </h1>
              <p className="text-muted-foreground">Track your progress and take exams</p>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="flex items-center gap-2 border-primary/20">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                Secure Session
              </Badge>
              <Button variant="outline" className="border-primary/20 bg-transparent">
                <Bell className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5 bg-card/50 backdrop-blur-sm">
            <TabsTrigger
              value="overview"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="classrooms"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              My Classes
            </TabsTrigger>
            <TabsTrigger
              value="exams"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Exams
            </TabsTrigger>
            <TabsTrigger
              value="performance"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Performance
            </TabsTrigger>
            <TabsTrigger
              value="notifications"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Notifications
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Performance Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Exams Completed</CardTitle>
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{attempts.filter((a) => a.submitted_at).length}</div>
                  <p className="text-xs text-muted-foreground">of {exams.length} total</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Average Score</CardTitle>
                  <Trophy className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {(() => {
                      const scored = attempts.filter((a) => typeof a.score === "number")
                      if (!scored.length) return 0
                      const avg =
                        scored.reduce((sum, a) => sum + (a.score ?? 0), 0) / scored.length
                      return Math.round(avg)
                    })()}%
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Best: {(() => {
                      const scored = attempts.filter((a) => typeof a.score === "number")
                      if (!scored.length) return 0
                      return Math.max(...scored.map((a) => a.score || 0))
                    })()}%
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Study Time</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{Math.max(1, attempts.length)}h</div>
                  <p className="text-xs text-muted-foreground">This month</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{Math.min(5, attempts.filter((a) => a.submitted_at).length)}</div>
                  <p className="text-xs text-muted-foreground">Exams passed</p>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Quick Exam Access</CardTitle>
                  <CardDescription>Enter exam code to start immediately</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Enter exam code..."
                      value={examCode}
                      onChange={(e) => setExamCode(e.target.value)}
                      className="flex-1"
                    />
                    <Button onClick={handleEnterExamCode}>
                      <Play className="h-4 w-4 mr-2" />
                      Start
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Upcoming Exams</CardTitle>
                  <CardDescription>Your next scheduled assessments</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {exams
                      .filter((exam) => exam.status === "available" || exam.status === "upcoming")
                      .slice(0, 2)
                      .map((exam) => (
                        <div key={exam.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <p className="font-medium">{exam.title}</p>
                            <p className="text-sm text-muted-foreground">
                              Due: {new Date(exam.due_at).toLocaleDateString()}
                            </p>
                          </div>
                          <Badge variant={exam.status === "available" ? "default" : "secondary"}>{exam.status}</Badge>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Performance */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Scores</CardTitle>
                <CardDescription>Your latest exam results</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {(() => {
                    const byExamId = new Map(exams.map((e) => [e.id, e]))
                    const recent = attempts
                      .filter((a) => a.submitted_at && typeof a.score === "number")
                      .slice(0, 5)
                    return recent.map((a) => {
                      const exam = byExamId.get(a.exam_id)
                      const score = a.score || 0
                      return (
                        <div key={a.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <p className="font-medium">{exam?.title || "Exam"}</p>
                            <p className="text-sm text-muted-foreground">
                              {a.submitted_at ? new Date(a.submitted_at).toLocaleDateString() : ""}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold">{score}%</p>
                            <Badge
                              variant={score >= 80 ? "default" : score >= 70 ? "secondary" : "destructive"}
                            >
                              {score >= 80 ? "Excellent" : score >= 70 ? "Good" : "Needs Improvement"}
                            </Badge>
                          </div>
                        </div>
                      )
                    })
                  })()}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Classrooms Tab */}
          <TabsContent value="classrooms" className="space-y-6">
            <ClassroomSystem />
          </TabsContent>

          {/* Exams Tab */}
          <TabsContent value="exams" className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold">Available Exams</h2>
              <p className="text-muted-foreground">Take your scheduled assessments</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {exams.map((exam) => (
                <Card key={exam.id} className="relative">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{exam.title}</CardTitle>
                      <Badge
                        variant={
                          exam.status === "available"
                            ? "default"
                            : exam.status === "completed"
                              ? "secondary"
                              : "outline"
                        }
                      >
                        {exam.status}
                      </Badge>
                    </div>
                    <CardDescription>
                      {exam.type.charAt(0).toUpperCase() + exam.type.slice(1)} • {exam.duration_min} minutes •{" "}
                      {exam.question_count} questions
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Due Date:</span>
                        <span>{new Date(exam.due_at).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Attempts:</span>
                        <span>
                          {attempts.filter((a) => a.exam_id === exam.id).length}/{exam.max_attempts}
                        </span>
                      </div>
                      {(() => {
                        const last = attempts.find((a) => a.exam_id === exam.id && typeof a.score === "number")
                        if (!last) return null
                        return (
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Score:</span>
                          <span className="font-medium">{last.score}%</span>
                        </div>
                        )
                      })()}

                      <div className="pt-2">
                        {exam.status === "available" ? (
                          <Button onClick={() => handleStartExam(exam.id)} className="w-full">
                            <Play className="h-4 w-4 mr-2" />
                            Start Exam
                          </Button>
                        ) : exam.status === "completed" ? (
                          <Button variant="outline" className="w-full bg-transparent" disabled>
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Completed
                          </Button>
                        ) : (
                          <Button variant="outline" className="w-full bg-transparent" disabled>
                            <Lock className="h-4 w-4 mr-2" />
                            Not Available
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Performance Tab */}
          <TabsContent value="performance" className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold">Performance Analytics</h2>
              <p className="text-muted-foreground">Track your progress and identify areas for improvement</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Overall Progress</CardTitle>
                  <CardDescription>Your completion rate and performance</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Completion Rate</span>
                      <span className="text-sm text-muted-foreground">
                        {Math.round((attempts.filter((a) => a.submitted_at).length / Math.max(1, exams.length)) * 100)}%
                      </span>
                    </div>
                    <Progress value={(attempts.filter((a) => a.submitted_at).length / Math.max(1, exams.length)) * 100} />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Average Performance</span>
                      <span className="text-sm text-muted-foreground">{
                        (() => {
                          const scored = attempts.filter((a) => typeof a.score === "number")
                          if (!scored.length) return 0
                          const avg = scored.reduce((sum, a) => sum + (a.score ?? 0), 0) / scored.length
                          return Math.round(avg)
                        })()
                      }%</span>
                    </div>
                    <Progress value={(() => {
                      const scored = attempts.filter((a) => typeof a.score === "number")
                      if (!scored.length) return 0
                      const avg = scored.reduce((sum, a) => sum + (a.score ?? 0), 0) / scored.length
                      return Math.round(avg)
                    })()} />
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">{(() => {
                        const scored = attempts.filter((a) => typeof a.score === "number")
                        if (!scored.length) return 0
                        return Math.max(...scored.map((a) => a.score || 0))
                      })()}%</div>
                      <p className="text-sm text-muted-foreground">Best Score</p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">{Math.min(5, attempts.filter((a) => a.submitted_at).length)}</div>
                      <p className="text-sm text-muted-foreground">Current Streak</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Subject Performance</CardTitle>
                  <CardDescription>Performance breakdown by subject</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Mathematics</span>
                      <div className="flex items-center gap-2">
                        <Progress value={88} className="w-20" />
                        <span className="text-sm font-medium">88%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Physics</span>
                      <div className="flex items-center gap-2">
                        <Progress value={85} className="w-20" />
                        <span className="text-sm font-medium">85%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Chemistry</span>
                      <div className="flex items-center gap-2">
                        <Progress value={76} className="w-20" />
                        <span className="text-sm font-medium">76%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">English</span>
                      <div className="flex items-center gap-2">
                        <Progress value={92} className="w-20" />
                        <span className="text-sm font-medium">92%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* AI Feedback */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  AI-Powered Feedback
                </CardTitle>
                <CardDescription>Personalized recommendations for improvement</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border border-blue-200 rounded-lg bg-blue-50">
                    <div className="flex items-start gap-3">
                      <Award className="h-5 w-5 text-blue-600 mt-0.5" />
                      <div>
                        <p className="font-medium text-blue-900">Strength Identified</p>
                        <p className="text-sm text-blue-700">
                          You excel in mathematical problem-solving. Your algebra and geometry scores are consistently
                          above 85%.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 border border-yellow-200 rounded-lg bg-yellow-50">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                      <div>
                        <p className="font-medium text-yellow-900">Area for Improvement</p>
                        <p className="text-sm text-yellow-700">
                          Focus on chemistry concepts. Consider reviewing molecular structures and chemical equations.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 border border-green-200 rounded-lg bg-green-50">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                      <div>
                        <p className="font-medium text-green-900">Study Recommendation</p>
                        <p className="text-sm text-green-700">
                          Your performance improves when you take breaks between study sessions. Continue this pattern.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold">Notifications</h2>
              <p className="text-muted-foreground">Stay updated with exam schedules and results</p>
            </div>

            <Card>
              <CardContent className="p-0">
                <div className="divide-y">
                  {notifications.map((notification) => (
                    <div key={notification.id} className="p-4 flex items-start gap-3">
                      <div
                        className={`h-2 w-2 rounded-full mt-2 ${
                          notification.type === "exam"
                            ? "bg-blue-500"
                            : notification.type === "grade"
                              ? "bg-green-500"
                              : "bg-yellow-500"
                        }`}
                      />
                      <div className="flex-1">
                        <p className="text-sm font-medium">{notification.message}</p>
                        <p className="text-xs text-muted-foreground">{new Date(notification.created_at).toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
