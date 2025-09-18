"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart,
} from "recharts"
import {
  TrendingUp,
  TrendingDown,
  Users,
  BookOpen,
  Target,
  AlertTriangle,
  Download,
  BarChart3,
  PieChartIcon,
} from "lucide-react"

// Mock analytics data
const performanceData = [
  { exam: "Math Quiz 1", average: 85, highest: 98, lowest: 62, participants: 28 },
  { exam: "Physics Test", average: 78, highest: 95, lowest: 45, participants: 30 },
  { exam: "Chemistry Lab", average: 82, highest: 96, lowest: 58, participants: 25 },
  { exam: "Biology Exam", average: 79, highest: 92, lowest: 51, participants: 32 },
  { exam: "Math Quiz 2", average: 88, highest: 99, lowest: 67, participants: 29 },
]

const trendData = [
  { month: "Jan", average: 75, participation: 85 },
  { month: "Feb", average: 78, participation: 88 },
  { month: "Mar", average: 82, participation: 92 },
  { month: "Apr", average: 79, participation: 89 },
  { month: "May", average: 85, participation: 94 },
  { month: "Jun", average: 87, participation: 96 },
]

const difficultyData = [
  { name: "Easy", value: 45, color: "#10b981" },
  { name: "Medium", value: 35, color: "#f59e0b" },
  { name: "Hard", value: 20, color: "#ef4444" },
]

const securityData = [
  { type: "Clean Sessions", count: 245, percentage: 89 },
  { type: "Minor Violations", count: 22, percentage: 8 },
  { type: "Major Violations", count: 6, percentage: 2 },
  { type: "Disqualified", count: 3, percentage: 1 },
]

const studentPerformanceData = [
  { name: "Alice Johnson", score: 92, improvement: 8, exams: 5, rank: 1 },
  { name: "Bob Smith", score: 88, improvement: 5, exams: 5, rank: 2 },
  { name: "Carol Davis", score: 85, improvement: -2, exams: 4, rank: 3 },
  { name: "David Wilson", score: 82, improvement: 12, exams: 5, rank: 4 },
  { name: "Emma Brown", score: 79, improvement: 3, exams: 4, rank: 5 },
]

export function AnalyticsDashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState("last-month")
  const [selectedExam, setSelectedExam] = useState("all")

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Analytics Dashboard</h1>
              <p className="text-muted-foreground">Comprehensive performance insights and reports</p>
            </div>
            <div className="flex items-center gap-4">
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="last-week">Last Week</SelectItem>
                  <SelectItem value="last-month">Last Month</SelectItem>
                  <SelectItem value="last-quarter">Last Quarter</SelectItem>
                  <SelectItem value="last-year">Last Year</SelectItem>
                </SelectContent>
              </Select>
              <Button>
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="students">Students</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="trends">Trends</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">156</div>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <TrendingUp className="h-3 w-3 mr-1 text-green-600" />
                    +12% from last month
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Exams Conducted</CardTitle>
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">24</div>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <TrendingUp className="h-3 w-3 mr-1 text-green-600" />
                    +8% from last month
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Average Score</CardTitle>
                  <Target className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">82.4%</div>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <TrendingUp className="h-3 w-3 mr-1 text-green-600" />
                    +3.2% from last month
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Security Incidents</CardTitle>
                  <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">31</div>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <TrendingDown className="h-3 w-3 mr-1 text-red-600" />
                    -15% from last month
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Exam Performance Overview
                  </CardTitle>
                  <CardDescription>Average scores across recent exams</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={performanceData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="exam" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="average" fill="hsl(var(--primary))" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChartIcon className="h-5 w-5" />
                    Question Difficulty Distribution
                  </CardTitle>
                  <CardDescription>Breakdown of question difficulty levels</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={difficultyData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percentage }) => `${name} ${percentage}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {difficultyData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Exam Activity</CardTitle>
                <CardDescription>Latest exam results and statistics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {performanceData.slice(0, 3).map((exam, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">{exam.exam}</p>
                        <p className="text-sm text-muted-foreground">{exam.participants} participants</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold">{exam.average}%</p>
                        <p className="text-sm text-muted-foreground">Average Score</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm">
                          Range: {exam.lowest}% - {exam.highest}%
                        </p>
                        <Badge variant={exam.average >= 80 ? "default" : exam.average >= 70 ? "secondary" : "outline"}>
                          {exam.average >= 80 ? "Excellent" : exam.average >= 70 ? "Good" : "Needs Review"}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Performance Tab */}
          <TabsContent value="performance" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Performance Analysis</h2>
              <Select value={selectedExam} onValueChange={setSelectedExam}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Select exam" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Exams</SelectItem>
                  <SelectItem value="math-quiz-1">Math Quiz 1</SelectItem>
                  <SelectItem value="physics-test">Physics Test</SelectItem>
                  <SelectItem value="chemistry-lab">Chemistry Lab</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Score Distribution</CardTitle>
                  <CardDescription>Distribution of student scores across grade ranges</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart
                      data={[
                        { range: "90-100%", count: 45 },
                        { range: "80-89%", count: 62 },
                        { range: "70-79%", count: 38 },
                        { range: "60-69%", count: 18 },
                        { range: "Below 60%", count: 12 },
                      ]}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="range" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" fill="hsl(var(--primary))" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Performance Metrics</CardTitle>
                  <CardDescription>Key performance indicators</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Pass Rate</span>
                      <span className="text-sm font-bold">87%</span>
                    </div>
                    <Progress value={87} />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Completion Rate</span>
                      <span className="text-sm font-bold">94%</span>
                    </div>
                    <Progress value={94} />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Average Time</span>
                      <span className="text-sm font-bold">23 min</span>
                    </div>
                    <Progress value={76} />
                  </div>

                  <div className="pt-4 space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Highest Score:</span>
                      <span className="font-medium">98%</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Lowest Score:</span>
                      <span className="font-medium">45%</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Standard Deviation:</span>
                      <span className="font-medium">12.4</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Question Analysis</CardTitle>
                <CardDescription>Performance breakdown by individual questions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { question: "Q1: Basic Algebra", correct: 89, difficulty: "Easy", avgTime: "1.2 min" },
                    { question: "Q2: Geometry Theorem", correct: 76, difficulty: "Medium", avgTime: "2.1 min" },
                    { question: "Q3: Complex Equations", correct: 54, difficulty: "Hard", avgTime: "3.8 min" },
                    { question: "Q4: Word Problems", correct: 68, difficulty: "Medium", avgTime: "2.9 min" },
                    { question: "Q5: Advanced Calculus", correct: 42, difficulty: "Hard", avgTime: "4.2 min" },
                  ].map((q, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium">{q.question}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge
                            variant={
                              q.difficulty === "Easy"
                                ? "secondary"
                                : q.difficulty === "Hard"
                                  ? "destructive"
                                  : "default"
                            }
                          >
                            {q.difficulty}
                          </Badge>
                          <span className="text-sm text-muted-foreground">Avg time: {q.avgTime}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold">{q.correct}%</p>
                        <p className="text-sm text-muted-foreground">Correct</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Students Tab */}
          <TabsContent value="students" className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold">Student Performance Analysis</h2>
              <p className="text-muted-foreground">Individual student progress and rankings</p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Top Performers</CardTitle>
                <CardDescription>Students with highest average scores</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {studentPerformanceData.map((student, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <Badge variant="outline" className="w-8 h-8 flex items-center justify-center">
                          {student.rank}
                        </Badge>
                        <div>
                          <p className="font-medium">{student.name}</p>
                          <p className="text-sm text-muted-foreground">{student.exams} exams completed</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-lg font-bold">{student.score}%</p>
                          <p className="text-sm text-muted-foreground">Average</p>
                        </div>
                        <div className="text-right">
                          <div
                            className={`flex items-center gap-1 ${
                              student.improvement > 0 ? "text-green-600" : "text-red-600"
                            }`}
                          >
                            {student.improvement > 0 ? (
                              <TrendingUp className="h-4 w-4" />
                            ) : (
                              <TrendingDown className="h-4 w-4" />
                            )}
                            <span className="text-sm font-medium">
                              {student.improvement > 0 ? "+" : ""}
                              {student.improvement}%
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground">Change</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Performance Distribution</CardTitle>
                  <CardDescription>Student performance across different score ranges</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <AreaChart
                      data={[
                        { score: "0-20", students: 2 },
                        { score: "21-40", students: 5 },
                        { score: "41-60", students: 18 },
                        { score: "61-80", students: 45 },
                        { score: "81-100", students: 86 },
                      ]}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="score" />
                      <YAxis />
                      <Tooltip />
                      <Area
                        type="monotone"
                        dataKey="students"
                        stroke="hsl(var(--primary))"
                        fill="hsl(var(--primary))"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Improvement Tracking</CardTitle>
                  <CardDescription>Students showing most improvement</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {studentPerformanceData
                      .sort((a, b) => b.improvement - a.improvement)
                      .slice(0, 5)
                      .map((student, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <span className="text-sm font-medium">{student.name}</span>
                          <div className="flex items-center gap-2">
                            <div className="w-20 bg-muted rounded-full h-2">
                              <div
                                className="bg-primary h-2 rounded-full"
                                style={{ width: `${Math.max(0, (student.improvement + 20) * 2.5)}%` }}
                              />
                            </div>
                            <span
                              className={`text-sm font-medium ${
                                student.improvement > 0 ? "text-green-600" : "text-red-600"
                              }`}
                            >
                              {student.improvement > 0 ? "+" : ""}
                              {student.improvement}%
                            </span>
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security" className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold">Security Analytics</h2>
              <p className="text-muted-foreground">Exam security monitoring and violation analysis</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {securityData.map((item, index) => (
                <Card key={index}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">{item.type}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{item.count}</div>
                    <div className="text-sm text-muted-foreground">{item.percentage}% of total sessions</div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Security Violations by Type</CardTitle>
                  <CardDescription>Breakdown of different violation categories</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart
                      data={[
                        { type: "Tab Switch", count: 15, severity: "Medium" },
                        { type: "Copy/Paste", count: 8, severity: "High" },
                        { type: "Multiple Faces", count: 4, severity: "Critical" },
                        { type: "Network Issues", count: 3, severity: "Low" },
                        { type: "Suspicious Activity", count: 1, severity: "Critical" },
                      ]}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="type" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" fill="hsl(var(--destructive))" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Security Score Distribution</CardTitle>
                  <CardDescription>Student security compliance scores</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={[
                          { name: "Excellent (90-100%)", value: 78, color: "#10b981" },
                          { name: "Good (80-89%)", value: 15, color: "#f59e0b" },
                          { name: "Fair (70-79%)", value: 5, color: "#ef4444" },
                          { name: "Poor (<70%)", value: 2, color: "#dc2626" },
                        ]}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, value }) => `${name}: ${value}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {[
                          { name: "Excellent (90-100%)", value: 78, color: "#10b981" },
                          { name: "Good (80-89%)", value: 15, color: "#f59e0b" },
                          { name: "Fair (70-79%)", value: 5, color: "#ef4444" },
                          { name: "Poor (<70%)", value: 2, color: "#dc2626" },
                        ].map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Recent Security Events</CardTitle>
                <CardDescription>Latest security violations and alerts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    {
                      student: "John Doe",
                      violation: "Tab switch detected",
                      severity: "Medium",
                      time: "2 hours ago",
                      exam: "Physics Test",
                    },
                    {
                      student: "Jane Smith",
                      violation: "Copy-paste attempt",
                      severity: "High",
                      time: "4 hours ago",
                      exam: "Math Quiz 2",
                    },
                    {
                      student: "Mike Johnson",
                      violation: "Multiple faces detected",
                      severity: "Critical",
                      time: "1 day ago",
                      exam: "Chemistry Lab",
                    },
                  ].map((event, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{event.student}</p>
                        <p className="text-sm text-muted-foreground">
                          {event.violation} - {event.exam}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={
                            event.severity === "Critical"
                              ? "destructive"
                              : event.severity === "High"
                                ? "destructive"
                                : "secondary"
                          }
                        >
                          {event.severity}
                        </Badge>
                        <span className="text-sm text-muted-foreground">{event.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Trends Tab */}
          <TabsContent value="trends" className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold">Performance Trends</h2>
              <p className="text-muted-foreground">Long-term analysis and improvement tracking</p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Performance Trends Over Time</CardTitle>
                <CardDescription>Average scores and participation rates by month</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="average"
                      stroke="hsl(var(--primary))"
                      strokeWidth={2}
                      name="Average Score"
                    />
                    <Line
                      type="monotone"
                      dataKey="participation"
                      stroke="hsl(var(--secondary))"
                      strokeWidth={2}
                      name="Participation Rate"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Improvement Insights</CardTitle>
                  <CardDescription>AI-powered analysis of performance trends</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 border border-green-200 rounded-lg bg-green-50">
                    <div className="flex items-start gap-3">
                      <TrendingUp className="h-5 w-5 text-green-600 mt-0.5" />
                      <div>
                        <p className="font-medium text-green-900">Positive Trend Identified</p>
                        <p className="text-sm text-green-700">
                          Average scores have improved by 12% over the last 3 months, indicating effective teaching
                          methods.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 border border-blue-200 rounded-lg bg-blue-50">
                    <div className="flex items-start gap-3">
                      <BarChart3 className="h-5 w-5 text-blue-600 mt-0.5" />
                      <div>
                        <p className="font-medium text-blue-900">Participation Growth</p>
                        <p className="text-sm text-blue-700">
                          Student participation has increased by 11% this semester, showing improved engagement.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 border border-yellow-200 rounded-lg bg-yellow-50">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                      <div>
                        <p className="font-medium text-yellow-900">Area for Focus</p>
                        <p className="text-sm text-yellow-700">
                          Hard difficulty questions show lower success rates. Consider additional practice materials.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Predictive Analysis</CardTitle>
                  <CardDescription>Forecasted performance based on current trends</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Expected Average Score (Next Month)</span>
                        <span className="text-sm font-bold">89%</span>
                      </div>
                      <Progress value={89} />
                      <p className="text-xs text-muted-foreground mt-1">Based on current improvement rate</p>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Projected Participation Rate</span>
                        <span className="text-sm font-bold">97%</span>
                      </div>
                      <Progress value={97} />
                      <p className="text-xs text-muted-foreground mt-1">Continuing upward trend</p>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Security Compliance</span>
                        <span className="text-sm font-bold">92%</span>
                      </div>
                      <Progress value={92} />
                      <p className="text-xs text-muted-foreground mt-1">Improved awareness and training</p>
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
