"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Users,
  BookOpen,
  Plus,
  Calendar,
  Award,
  Settings,
  Copy,
  Check,
  Edit,
  Eye,
  Send,
  Download,
  Upload,
  MessageSquare,
  Bell,
  ArrowLeft,
  Target,
  TrendingUp,
  AlertCircle,
} from "lucide-react"

// Mock data for classroom details
const mockClassroom = {
  id: 1,
  name: "Advanced Mathematics",
  subject: "Mathematics",
  teacher: "Dr. Sarah Johnson",
  code: "MATH2024",
  students: 28,
  assignments: 5,
  quizzes: 3,
  color: "bg-gradient-to-br from-blue-500 to-purple-600",
  description: "Advanced calculus and linear algebra concepts",
  schedule: "Mon, Wed, Fri - 10:00 AM",
  room: "Room 204",
}

const mockStudents = [
  {
    id: 1,
    name: "Alice Johnson",
    email: "alice@example.com",
    status: "active",
    joinDate: "2024-01-15",
    lastActive: "2 hours ago",
    avgScore: 85,
  },
  {
    id: 2,
    name: "Bob Smith",
    email: "bob@example.com",
    status: "active",
    joinDate: "2024-01-16",
    lastActive: "1 day ago",
    avgScore: 78,
  },
  {
    id: 3,
    name: "Carol Davis",
    email: "carol@example.com",
    status: "inactive",
    joinDate: "2024-01-14",
    lastActive: "1 week ago",
    avgScore: 92,
  },
  {
    id: 4,
    name: "David Wilson",
    email: "david@example.com",
    status: "active",
    joinDate: "2024-01-17",
    lastActive: "30 min ago",
    avgScore: 73,
  },
]

const mockAssignments = [
  {
    id: 1,
    title: "Calculus Problem Set 1",
    type: "assignment",
    dueDate: "2024-01-25",
    points: 100,
    submitted: 22,
    graded: 18,
    status: "active",
    description: "Complete problems 1-15 from Chapter 3",
  },
  {
    id: 2,
    title: "Linear Algebra Quiz",
    type: "quiz",
    dueDate: "2024-01-20",
    points: 50,
    submitted: 28,
    graded: 28,
    status: "completed",
    description: "Matrix operations and transformations",
  },
  {
    id: 3,
    title: "Midterm Exam",
    type: "exam",
    dueDate: "2024-02-01",
    points: 200,
    submitted: 0,
    graded: 0,
    status: "draft",
    description: "Comprehensive exam covering chapters 1-5",
  },
]

const mockAnnouncements = [
  {
    id: 1,
    title: "Midterm Exam Schedule",
    content: "The midterm exam will be held on February 1st. Please review chapters 1-5.",
    date: "2024-01-18",
    author: "Dr. Sarah Johnson",
  },
  {
    id: 2,
    title: "Office Hours Update",
    content: "Office hours have been moved to Tuesdays and Thursdays, 2-4 PM.",
    date: "2024-01-16",
    author: "Dr. Sarah Johnson",
  },
]

interface ClassroomDetailProps {
  classroomId: string
}

export function ClassroomDetail({ classroomId }: ClassroomDetailProps) {
  const [activeTab, setActiveTab] = useState("overview")
  const [copiedCode, setCopiedCode] = useState(false)
  const [isCreateAssignmentOpen, setIsCreateAssignmentOpen] = useState(false)
  const [isCreateAnnouncementOpen, setIsCreateAnnouncementOpen] = useState(false)
  const [newAssignment, setNewAssignment] = useState({
    title: "",
    type: "assignment",
    dueDate: "",
    points: "",
    description: "",
  })
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: "",
    content: "",
  })

  // In a real app, you would fetch classroom data based on classroomId
  const classroom = mockClassroom

  const copyClassCode = () => {
    navigator.clipboard.writeText(classroom.code)
    setCopiedCode(true)
    setTimeout(() => setCopiedCode(false), 2000)
  }

  const handleCreateAssignment = () => {
    if (newAssignment.title && newAssignment.dueDate) {
      // In a real app, this would make an API call
      console.log("Creating assignment:", newAssignment)
      setNewAssignment({ title: "", type: "assignment", dueDate: "", points: "", description: "" })
      setIsCreateAssignmentOpen(false)
    }
  }

  const handleCreateAnnouncement = () => {
    if (newAnnouncement.title && newAnnouncement.content) {
      // In a real app, this would make an API call
      console.log("Creating announcement:", newAnnouncement)
      setNewAnnouncement({ title: "", content: "" })
      setIsCreateAnnouncementOpen(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      {/* Header */}
      <header className="border-b bg-card/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => window.history.back()} className="hover:bg-primary/10">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>

            <div className={`${classroom.color} p-4 rounded-lg text-white flex-1`}>
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold">{classroom.name}</h1>
                  <p className="text-white/90">
                    {classroom.subject} • {classroom.teacher}
                  </p>
                  <p className="text-white/80 text-sm">
                    {classroom.schedule} • {classroom.room}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right text-white/90">
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <span>{classroom.students}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <BookOpen className="w-4 h-4" />
                        <span>{classroom.assignments}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Award className="w-4 h-4" />
                        <span>{classroom.quizzes}</span>
                      </div>
                    </div>
                  </div>

                  <Button variant="ghost" size="sm" onClick={copyClassCode} className="text-white hover:bg-white/20">
                    {copiedCode ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    <span className="ml-2 font-mono">{classroom.code}</span>
                  </Button>
                </div>
              </div>
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
              value="assignments"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Assignments
            </TabsTrigger>
            <TabsTrigger
              value="students"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Students
            </TabsTrigger>
            <TabsTrigger
              value="grades"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Grades
            </TabsTrigger>
            <TabsTrigger
              value="settings"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Settings
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Announcements */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <Bell className="w-5 h-5" />
                          Announcements
                        </CardTitle>
                        <CardDescription>Latest updates and news</CardDescription>
                      </div>
                      <Dialog open={isCreateAnnouncementOpen} onOpenChange={setIsCreateAnnouncementOpen}>
                        <DialogTrigger asChild>
                          <Button size="sm" className="gradient-primary">
                            <Plus className="w-4 h-4 mr-2" />
                            New
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Create Announcement</DialogTitle>
                            <DialogDescription>Share important updates with your class</DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <Label htmlFor="announcementTitle">Title</Label>
                              <Input
                                id="announcementTitle"
                                placeholder="Announcement title"
                                value={newAnnouncement.title}
                                onChange={(e) => setNewAnnouncement((prev) => ({ ...prev, title: e.target.value }))}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="announcementContent">Content</Label>
                              <Textarea
                                id="announcementContent"
                                placeholder="Write your announcement..."
                                rows={4}
                                value={newAnnouncement.content}
                                onChange={(e) => setNewAnnouncement((prev) => ({ ...prev, content: e.target.value }))}
                              />
                            </div>
                            <div className="flex gap-2 pt-4">
                              <Button
                                variant="outline"
                                onClick={() => setIsCreateAnnouncementOpen(false)}
                                className="flex-1"
                              >
                                Cancel
                              </Button>
                              <Button onClick={handleCreateAnnouncement} className="flex-1 gradient-primary">
                                <Send className="w-4 h-4 mr-2" />
                                Post
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {mockAnnouncements.map((announcement) => (
                        <div key={announcement.id} className="p-4 border rounded-lg">
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-medium">{announcement.title}</h4>
                            <span className="text-xs text-muted-foreground">{announcement.date}</span>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{announcement.content}</p>
                          <p className="text-xs text-muted-foreground">By {announcement.author}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Quick Stats */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Class Statistics</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Total Students</span>
                      <span className="font-medium">{classroom.students}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Active Assignments</span>
                      <span className="font-medium">{mockAssignments.filter((a) => a.status === "active").length}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Avg. Grade</span>
                      <span className="font-medium">82.5%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Completion Rate</span>
                      <span className="font-medium">89%</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 text-sm">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span>Alice submitted assignment</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span>New quiz created</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                        <span>Bob joined the class</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Assignments Tab */}
          <TabsContent value="assignments" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold">Assignments & Assessments</h2>
                <p className="text-muted-foreground">Manage homework, quizzes, and exams</p>
              </div>
              <Dialog open={isCreateAssignmentOpen} onOpenChange={setIsCreateAssignmentOpen}>
                <DialogTrigger asChild>
                  <Button className="gradient-primary">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Assignment
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create New Assignment</DialogTitle>
                    <DialogDescription>Set up a new assignment or assessment</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="assignmentTitle">Title</Label>
                      <Input
                        id="assignmentTitle"
                        placeholder="Assignment title"
                        value={newAssignment.title}
                        onChange={(e) => setNewAssignment((prev) => ({ ...prev, title: e.target.value }))}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="assignmentType">Type</Label>
                        <Select
                          value={newAssignment.type}
                          onValueChange={(value) => setNewAssignment((prev) => ({ ...prev, type: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="assignment">Assignment</SelectItem>
                            <SelectItem value="quiz">Quiz</SelectItem>
                            <SelectItem value="exam">Exam</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="assignmentPoints">Points</Label>
                        <Input
                          id="assignmentPoints"
                          type="number"
                          placeholder="100"
                          value={newAssignment.points}
                          onChange={(e) => setNewAssignment((prev) => ({ ...prev, points: e.target.value }))}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="assignmentDueDate">Due Date</Label>
                      <Input
                        id="assignmentDueDate"
                        type="date"
                        value={newAssignment.dueDate}
                        onChange={(e) => setNewAssignment((prev) => ({ ...prev, dueDate: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="assignmentDescription">Description</Label>
                      <Textarea
                        id="assignmentDescription"
                        placeholder="Assignment instructions..."
                        rows={3}
                        value={newAssignment.description}
                        onChange={(e) => setNewAssignment((prev) => ({ ...prev, description: e.target.value }))}
                      />
                    </div>
                    <div className="flex gap-2 pt-4">
                      <Button variant="outline" onClick={() => setIsCreateAssignmentOpen(false)} className="flex-1">
                        Cancel
                      </Button>
                      <Button onClick={handleCreateAssignment} className="flex-1 gradient-primary">
                        Create Assignment
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockAssignments.map((assignment) => (
                <Card key={assignment.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg">{assignment.title}</CardTitle>
                        <CardDescription className="flex items-center gap-2">
                          <Badge variant="outline">{assignment.type}</Badge>
                          <span>{assignment.points} pts</span>
                        </CardDescription>
                      </div>
                      <Badge
                        variant={
                          assignment.status === "active"
                            ? "default"
                            : assignment.status === "completed"
                              ? "secondary"
                              : "outline"
                        }
                      >
                        {assignment.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <p className="text-sm text-muted-foreground">{assignment.description}</p>

                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span>Due: {new Date(assignment.dueDate).toLocaleDateString()}</span>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Submitted:</span>
                          <span className="ml-1 font-medium">
                            {assignment.submitted}/{classroom.students}
                          </span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Graded:</span>
                          <span className="ml-1 font-medium">
                            {assignment.graded}/{assignment.submitted}
                          </span>
                        </div>
                      </div>

                      <div className="flex gap-2 pt-2">
                        <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                          <Eye className="w-4 h-4 mr-2" />
                          View
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Students Tab */}
          <TabsContent value="students" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold">Class Roster</h2>
                <p className="text-muted-foreground">Manage enrolled students</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline">
                  <Upload className="w-4 h-4 mr-2" />
                  Import
                </Button>
                <Button variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>

            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b bg-muted/50">
                      <tr>
                        <th className="text-left p-4 font-medium">Student</th>
                        <th className="text-left p-4 font-medium">Status</th>
                        <th className="text-left p-4 font-medium">Join Date</th>
                        <th className="text-left p-4 font-medium">Last Active</th>
                        <th className="text-left p-4 font-medium">Avg. Score</th>
                        <th className="text-left p-4 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mockStudents.map((student) => (
                        <tr key={student.id} className="border-b hover:bg-muted/30">
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
                          <td className="p-4 text-sm">{new Date(student.joinDate).toLocaleDateString()}</td>
                          <td className="p-4 text-sm">{student.lastActive}</td>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{student.avgScore}%</span>
                              <div
                                className={`w-2 h-2 rounded-full ${
                                  student.avgScore >= 80
                                    ? "bg-green-500"
                                    : student.avgScore >= 70
                                      ? "bg-yellow-500"
                                      : "bg-red-500"
                                }`}
                              ></div>
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <Button size="sm" variant="outline">
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button size="sm" variant="outline">
                                <MessageSquare className="w-4 h-4" />
                              </Button>
                              <Button size="sm" variant="outline">
                                <Settings className="w-4 h-4" />
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

          {/* Grades Tab */}
          <TabsContent value="grades" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold">Grade Management</h2>
                <p className="text-muted-foreground">View and manage student grades</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Export Grades
                </Button>
                <Button className="gradient-primary">
                  <Plus className="w-4 h-4 mr-2" />
                  Grade Assignment
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Class Average
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">82.5%</div>
                  <p className="text-sm text-muted-foreground">+2.3% from last month</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    Pass Rate
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">89%</div>
                  <p className="text-sm text-muted-foreground">25 of 28 students</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="w-5 h-5" />
                    Top Performer
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-lg font-bold">Carol Davis</div>
                  <p className="text-sm text-muted-foreground">92% average</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Grade Overview</CardTitle>
                <CardDescription>Student performance across all assignments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockStudents.map((student) => (
                    <div key={student.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div>
                          <p className="font-medium">{student.name}</p>
                          <p className="text-sm text-muted-foreground">{student.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="font-medium">{student.avgScore}%</p>
                          <p className="text-sm text-muted-foreground">
                            {student.avgScore >= 80
                              ? "Excellent"
                              : student.avgScore >= 70
                                ? "Good"
                                : "Needs Improvement"}
                          </p>
                        </div>
                        <div
                          className={`w-3 h-3 rounded-full ${
                            student.avgScore >= 80
                              ? "bg-green-500"
                              : student.avgScore >= 70
                                ? "bg-yellow-500"
                                : "bg-red-500"
                          }`}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold">Classroom Settings</h2>
              <p className="text-muted-foreground">Manage classroom preferences and configurations</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                  <CardDescription>Update classroom details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="className">Class Name</Label>
                    <Input id="className" defaultValue={classroom.name} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="classDescription">Description</Label>
                    <Textarea id="classDescription" defaultValue={classroom.description} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="classSchedule">Schedule</Label>
                      <Input id="classSchedule" defaultValue={classroom.schedule} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="classRoom">Room</Label>
                      <Input id="classRoom" defaultValue={classroom.room} />
                    </div>
                  </div>
                  <Button className="w-full gradient-primary">Save Changes</Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Access Control</CardTitle>
                  <CardDescription>Manage who can join your classroom</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">Class Code</p>
                      <p className="text-sm text-muted-foreground">Students use this to join</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="font-mono">
                        {classroom.code}
                      </Badge>
                      <Button size="sm" variant="outline" onClick={copyClassCode}>
                        {copiedCode ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Allow Self-Enrollment</p>
                        <p className="text-sm text-muted-foreground">Students can join with class code</p>
                      </div>
                      <Button variant="outline" size="sm">
                        Enabled
                      </Button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Require Approval</p>
                        <p className="text-sm text-muted-foreground">Review join requests manually</p>
                      </div>
                      <Button variant="outline" size="sm">
                        Disabled
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Notifications</CardTitle>
                  <CardDescription>Configure notification preferences</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Assignment Submissions</p>
                        <p className="text-sm text-muted-foreground">Get notified when students submit work</p>
                      </div>
                      <Button variant="outline" size="sm">
                        Enabled
                      </Button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">New Student Joins</p>
                        <p className="text-sm text-muted-foreground">Alert when someone joins the class</p>
                      </div>
                      <Button variant="outline" size="sm">
                        Enabled
                      </Button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Grade Reminders</p>
                        <p className="text-sm text-muted-foreground">Remind to grade pending assignments</p>
                      </div>
                      <Button variant="outline" size="sm">
                        Disabled
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Danger Zone</CardTitle>
                  <CardDescription>Irreversible actions</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 border border-red-200 rounded-lg bg-red-50">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                      <div className="flex-1">
                        <p className="font-medium text-red-900">Archive Classroom</p>
                        <p className="text-sm text-red-700 mb-3">
                          This will archive the classroom and make it read-only. Students won't be able to submit new
                          work.
                        </p>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-red-300 text-red-700 hover:bg-red-100 bg-transparent"
                        >
                          Archive Classroom
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 border border-red-200 rounded-lg bg-red-50">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                      <div className="flex-1">
                        <p className="font-medium text-red-900">Delete Classroom</p>
                        <p className="text-sm text-red-700 mb-3">
                          Permanently delete this classroom and all associated data. This action cannot be undone.
                        </p>
                        <Button variant="destructive" size="sm">
                          Delete Classroom
                        </Button>
                      </div>
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
