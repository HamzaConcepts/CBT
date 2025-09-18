"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Users,
  BookOpen,
  BarChart3,
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  Download,
  AlertTriangle,
  CheckCircle,
  XCircle,
} from "lucide-react"
import { ClassroomSystem } from "@/components/classroom-system"

// Mock data
const mockStudents = [
  { id: 1, name: "Alice Johnson", email: "alice@example.com", status: "active", examsCompleted: 5, avgScore: 85 },
  { id: 2, name: "Bob Smith", email: "bob@example.com", status: "active", examsCompleted: 3, avgScore: 78 },
  { id: 3, name: "Carol Davis", email: "carol@example.com", status: "inactive", examsCompleted: 2, avgScore: 92 },
  { id: 4, name: "David Wilson", email: "david@example.com", status: "active", examsCompleted: 4, avgScore: 73 },
]

const mockExams = [
  {
    id: 1,
    title: "Mathematics Quiz 1",
    type: "quiz",
    duration: 30,
    students: 25,
    completed: 20,
    avgScore: 82,
    status: "active",
  },
  {
    id: 2,
    title: "Physics Midterm",
    type: "midterm",
    duration: 90,
    students: 30,
    completed: 28,
    avgScore: 76,
    status: "completed",
  },
  {
    id: 3,
    title: "Chemistry Final",
    type: "final",
    duration: 120,
    students: 22,
    completed: 0,
    avgScore: 0,
    status: "draft",
  },
]

const mockAlerts = [
  { id: 1, type: "warning", message: "Suspicious activity detected for student Alice Johnson", time: "2 min ago" },
  { id: 2, type: "info", message: "New exam submission from Bob Smith", time: "5 min ago" },
  { id: 3, type: "error", message: "Potential cheating attempt flagged in Physics Midterm", time: "10 min ago" },
]

export function TeacherDashboard() {
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      {/* Header */}
      <header className="border-b bg-card/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Teacher Dashboard
              </h1>
              <p className="text-muted-foreground">Manage students, exams, and monitor performance</p>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="flex items-center gap-2 border-primary/20">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                Secure Mode Active
              </Badge>
              <Button className="gradient-primary">
                <Plus className="h-4 w-4 mr-2" />
                Create Exam
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-6 bg-card/50 backdrop-blur-sm">
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
              Classrooms
            </TabsTrigger>
            <TabsTrigger
              value="students"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Students
            </TabsTrigger>
            <TabsTrigger
              value="exams"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Exams
            </TabsTrigger>
            <TabsTrigger
              value="monitoring"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Monitoring
            </TabsTrigger>
            <TabsTrigger
              value="analytics"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Analytics
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">124</div>
                  <p className="text-xs text-muted-foreground">+12 from last month</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Exams</CardTitle>
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">8</div>
                  <p className="text-xs text-muted-foreground">3 scheduled today</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Average Score</CardTitle>
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">78.5%</div>
                  <p className="text-xs text-muted-foreground">+2.1% from last week</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Security Alerts</CardTitle>
                  <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">3</div>
                  <p className="text-xs text-muted-foreground">2 resolved today</p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Exams</CardTitle>
                  <CardDescription>Latest exam activity and results</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockExams.slice(0, 3).map((exam) => (
                      <div key={exam.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">{exam.title}</p>
                          <p className="text-sm text-muted-foreground">
                            {exam.completed}/{exam.students} completed • Avg: {exam.avgScore}%
                          </p>
                        </div>
                        <Badge
                          variant={
                            exam.status === "active" ? "default" : exam.status === "completed" ? "secondary" : "outline"
                          }
                        >
                          {exam.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Security Alerts</CardTitle>
                  <CardDescription>Real-time monitoring and alerts</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockAlerts.map((alert) => (
                      <div key={alert.id} className="flex items-start gap-3 p-3 border rounded-lg">
                        <div
                          className={`h-2 w-2 rounded-full mt-2 ${
                            alert.type === "error"
                              ? "bg-destructive"
                              : alert.type === "warning"
                                ? "bg-yellow-500"
                                : "bg-blue-500"
                          }`}
                        />
                        <div className="flex-1">
                          <p className="text-sm">{alert.message}</p>
                          <p className="text-xs text-muted-foreground">{alert.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Classrooms Tab */}
          <TabsContent value="classrooms" className="space-y-6">
            <ClassroomSystem userRole="teacher" />
          </TabsContent>

          {/* Students Tab */}
          <TabsContent value="students" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold">Student Management</h2>
                <p className="text-muted-foreground">Add, remove, and manage your students</p>
              </div>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Student
              </Button>
            </div>

            <div className="flex items-center gap-4">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search students..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </div>

            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b">
                      <tr>
                        <th className="text-left p-4 font-medium">Student</th>
                        <th className="text-left p-4 font-medium">Status</th>
                        <th className="text-left p-4 font-medium">Exams Completed</th>
                        <th className="text-left p-4 font-medium">Average Score</th>
                        <th className="text-left p-4 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mockStudents.map((student) => (
                        <tr key={student.id} className="border-b">
                          <td className="p-4">
                            <div>
                              <p className="font-medium">{student.name}</p>
                              <p className="text-sm text-muted-foreground">{student.email}</p>
                            </div>
                          </td>
                          <td className="p-4">
                            <Badge variant={student.status === "active" ? "default" : "secondary"}>
                              {student.status}
                            </Badge>
                          </td>
                          <td className="p-4">{student.examsCompleted}</td>
                          <td className="p-4">{student.avgScore}%</td>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <Button size="sm" variant="outline">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="outline">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="outline">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Exams Tab */}
          <TabsContent value="exams" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold">Exam Management</h2>
                <p className="text-muted-foreground">Create, edit, and manage your exams</p>
              </div>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create New Exam
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockExams.map((exam) => (
                <Card key={exam.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{exam.title}</CardTitle>
                      <Badge
                        variant={
                          exam.status === "active" ? "default" : exam.status === "completed" ? "secondary" : "outline"
                        }
                      >
                        {exam.status}
                      </Badge>
                    </div>
                    <CardDescription>
                      {exam.type.charAt(0).toUpperCase() + exam.type.slice(1)} • {exam.duration} minutes
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Students:</span>
                        <span>{exam.students}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Completed:</span>
                        <span>{exam.completed}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Average Score:</span>
                        <span>{exam.avgScore}%</span>
                      </div>
                      <div className="flex items-center gap-2 pt-2">
                        <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Monitoring Tab */}
          <TabsContent value="monitoring" className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold">Real-time Monitoring</h2>
              <p className="text-muted-foreground">Monitor active exams and detect suspicious activities</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Active Exam Sessions</CardTitle>
                  <CardDescription>Students currently taking exams</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
                        <div>
                          <p className="font-medium">Alice Johnson</p>
                          <p className="text-sm text-muted-foreground">Mathematics Quiz 1</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">15:23 remaining</p>
                        <p className="text-xs text-muted-foreground">Question 8/20</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="h-2 w-2 bg-yellow-500 rounded-full animate-pulse" />
                        <div>
                          <p className="font-medium">Bob Smith</p>
                          <p className="text-sm text-muted-foreground">Physics Midterm</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">45:12 remaining</p>
                        <p className="text-xs text-muted-foreground">Question 12/30</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Security Monitoring</CardTitle>
                  <CardDescription>AI-powered cheat detection alerts</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-3 border border-red-200 rounded-lg bg-red-50">
                      <XCircle className="h-5 w-5 text-red-500" />
                      <div>
                        <p className="font-medium text-red-900">Tab Switch Detected</p>
                        <p className="text-sm text-red-700">Carol Davis - Physics Midterm</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 border border-yellow-200 rounded-lg bg-yellow-50">
                      <AlertTriangle className="h-5 w-5 text-yellow-500" />
                      <div>
                        <p className="font-medium text-yellow-900">Unusual Activity</p>
                        <p className="text-sm text-yellow-700">David Wilson - Copy-paste detected</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 border border-green-200 rounded-lg bg-green-50">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <div>
                        <p className="font-medium text-green-900">All Clear</p>
                        <p className="text-sm text-green-700">Alice Johnson - No issues detected</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold">Performance Analytics</h2>
                <p className="text-muted-foreground">Detailed insights and reports</p>
              </div>
              <Button>
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Class Performance</CardTitle>
                  <CardDescription>Overall class statistics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Highest Score:</span>
                      <span className="font-medium">95%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Lowest Score:</span>
                      <span className="font-medium">62%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Class Average:</span>
                      <span className="font-medium">78.5%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Pass Rate:</span>
                      <span className="font-medium">87%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Exam Difficulty</CardTitle>
                  <CardDescription>Question analysis</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Easy Questions:</span>
                      <span className="font-medium">12 (60%)</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Medium Questions:</span>
                      <span className="font-medium">6 (30%)</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Hard Questions:</span>
                      <span className="font-medium">2 (10%)</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Avg. Time per Q:</span>
                      <span className="font-medium">2.5 min</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Security Summary</CardTitle>
                  <CardDescription>Cheating detection results</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Clean Sessions:</span>
                      <span className="font-medium text-green-600">89%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Flagged Activities:</span>
                      <span className="font-medium text-yellow-600">8%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Disqualified:</span>
                      <span className="font-medium text-red-600">3%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">AI Confidence:</span>
                      <span className="font-medium">94%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
