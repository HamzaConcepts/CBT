"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Users,
  Plus,
  BookOpen,
  Copy,
  Check,
  Search,
  Award,
  Settings,
  UserPlus,
  GraduationCap,
  Sparkles,
} from "lucide-react"

// Mock data for classes
const mockClasses = [
  {
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
  },
  {
    id: 2,
    name: "Physics Laboratory",
    subject: "Physics",
    teacher: "Prof. Michael Chen",
    code: "PHYS2024",
    students: 22,
    assignments: 8,
    quizzes: 2,
    color: "bg-gradient-to-br from-green-500 to-teal-600",
    description: "Hands-on physics experiments and theory",
  },
  {
    id: 3,
    name: "Computer Science Fundamentals",
    subject: "Computer Science",
    teacher: "Dr. Emily Rodriguez",
    code: "CS2024",
    students: 35,
    assignments: 12,
    quizzes: 6,
    color: "bg-gradient-to-br from-orange-500 to-red-600",
    description: "Programming basics and algorithmic thinking",
  },
]

interface ClassroomSystemProps {
  userRole: "teacher" | "student"
}

export function ClassroomSystem({ userRole }: ClassroomSystemProps) {
  const [classes, setClasses] = useState(mockClasses)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isJoinDialogOpen, setIsJoinDialogOpen] = useState(false)
  const [copiedCode, setCopiedCode] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [newClass, setNewClass] = useState({
    name: "",
    subject: "",
    description: "",
    code: "",
  })
  const [joinCode, setJoinCode] = useState("")

  const generateClassCode = () => {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase()
    setNewClass((prev) => ({ ...prev, code }))
  }

  const handleCreateClass = () => {
    if (newClass.name && newClass.subject) {
      const colors = [
        "bg-gradient-to-br from-blue-500 to-purple-600",
        "bg-gradient-to-br from-green-500 to-teal-600",
        "bg-gradient-to-br from-orange-500 to-red-600",
        "bg-gradient-to-br from-pink-500 to-rose-600",
        "bg-gradient-to-br from-indigo-500 to-blue-600",
      ]

      const newClassData = {
        id: classes.length + 1,
        name: newClass.name,
        subject: newClass.subject,
        teacher: "You", // Current user
        code: newClass.code || Math.random().toString(36).substring(2, 8).toUpperCase(),
        students: 0,
        assignments: 0,
        quizzes: 0,
        color: colors[Math.floor(Math.random() * colors.length)],
        description: newClass.description,
      }

      setClasses([...classes, newClassData])
      setNewClass({ name: "", subject: "", description: "", code: "" })
      setIsCreateDialogOpen(false)
    }
  }

  const handleJoinClass = () => {
    if (joinCode.trim()) {
      // In a real app, this would make an API call to join the class
      console.log("Joining class with code:", joinCode)
      setJoinCode("")
      setIsJoinDialogOpen(false)
      // Show success message or redirect
    }
  }

  const copyClassCode = (code: string) => {
    navigator.clipboard.writeText(code)
    setCopiedCode(code)
    setTimeout(() => setCopiedCode(null), 2000)
  }

  const filteredClasses = classes.filter(
    (cls) =>
      cls.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cls.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cls.teacher.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">
            {userRole === "teacher" ? "My Classrooms" : "Joined Classes"}
          </h2>
          <p className="text-muted-foreground">
            {userRole === "teacher"
              ? "Create and manage your virtual classrooms"
              : "Access your enrolled classes and assignments"}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {userRole === "teacher" ? (
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gradient-primary">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Class
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <GraduationCap className="w-5 h-5 text-primary" />
                    Create New Classroom
                  </DialogTitle>
                  <DialogDescription>Set up a new virtual classroom for your students</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="className">Class Name</Label>
                    <Input
                      id="className"
                      placeholder="e.g., Advanced Mathematics"
                      value={newClass.name}
                      onChange={(e) => setNewClass((prev) => ({ ...prev, name: e.target.value }))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Select
                      value={newClass.subject}
                      onValueChange={(value) => setNewClass((prev) => ({ ...prev, subject: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select subject" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Mathematics">Mathematics</SelectItem>
                        <SelectItem value="Physics">Physics</SelectItem>
                        <SelectItem value="Chemistry">Chemistry</SelectItem>
                        <SelectItem value="Biology">Biology</SelectItem>
                        <SelectItem value="Computer Science">Computer Science</SelectItem>
                        <SelectItem value="English">English</SelectItem>
                        <SelectItem value="History">History</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description (Optional)</Label>
                    <Input
                      id="description"
                      placeholder="Brief description of the class"
                      value={newClass.description}
                      onChange={(e) => setNewClass((prev) => ({ ...prev, description: e.target.value }))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="classCode">Class Code</Label>
                    <div className="flex gap-2">
                      <Input
                        id="classCode"
                        placeholder="Auto-generated"
                        value={newClass.code}
                        onChange={(e) => setNewClass((prev) => ({ ...prev, code: e.target.value.toUpperCase() }))}
                      />
                      <Button type="button" variant="outline" onClick={generateClassCode}>
                        <Sparkles className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)} className="flex-1">
                      Cancel
                    </Button>
                    <Button onClick={handleCreateClass} className="flex-1 gradient-primary">
                      Create Class
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          ) : (
            <Dialog open={isJoinDialogOpen} onOpenChange={setIsJoinDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gradient-primary">
                  <UserPlus className="w-4 h-4 mr-2" />
                  Join Class
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <UserPlus className="w-5 h-5 text-primary" />
                    Join a Classroom
                  </DialogTitle>
                  <DialogDescription>Enter the class code provided by your teacher</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="joinCode">Class Code</Label>
                    <Input
                      id="joinCode"
                      placeholder="Enter class code (e.g., MATH2024)"
                      value={joinCode}
                      onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                      className="text-center text-lg font-mono"
                    />
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button variant="outline" onClick={() => setIsJoinDialogOpen(false)} className="flex-1">
                      Cancel
                    </Button>
                    <Button onClick={handleJoinClass} className="flex-1 gradient-primary">
                      Join Class
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search classes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Classes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredClasses.map((classroom) => (
          <Card key={classroom.id} className="overflow-hidden hover:shadow-lg transition-all duration-300 group">
            {/* Class Header with Gradient */}
            <div className={`${classroom.color} p-6 text-white relative overflow-hidden`}>
              <div className="absolute inset-0 bg-black/10"></div>
              <div className="relative z-10">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-balance">{classroom.name}</h3>
                    <p className="text-white/90 text-sm">{classroom.subject}</p>
                    <p className="text-white/80 text-xs mt-1">{classroom.teacher}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyClassCode(classroom.code)}
                    className="text-white hover:bg-white/20 p-2"
                  >
                    {copiedCode === classroom.code ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </Button>
                </div>

                <div className="flex items-center gap-4 text-sm text-white/90">
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

              {/* Floating decoration */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
            </div>

            <CardContent className="p-6">
              <div className="space-y-4">
                {classroom.description && <p className="text-sm text-muted-foreground">{classroom.description}</p>}

                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Class Code:</span>
                  <Badge variant="outline" className="font-mono">
                    {classroom.code}
                  </Badge>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    className="flex-1 group-hover:border-primary/50 transition-colors bg-transparent"
                    onClick={() => (window.location.href = `/classroom/${classroom.id}`)}
                  >
                    <BookOpen className="w-4 h-4 mr-2" />
                    Enter
                  </Button>
                  {userRole === "teacher" && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="group-hover:border-primary/50 transition-colors bg-transparent"
                    >
                      <Settings className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredClasses.length === 0 && (
        <div className="text-center py-12">
          <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
            <GraduationCap className="w-12 h-12 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">
            {searchTerm
              ? "No classes found"
              : userRole === "teacher"
                ? "No classes created yet"
                : "No classes joined yet"}
          </h3>
          <p className="text-muted-foreground mb-4">
            {searchTerm
              ? "Try adjusting your search terms"
              : userRole === "teacher"
                ? "Create your first classroom to get started"
                : "Join a class using the class code from your teacher"}
          </p>
          {!searchTerm && (
            <Button
              className="gradient-primary"
              onClick={() => (userRole === "teacher" ? setIsCreateDialogOpen(true) : setIsJoinDialogOpen(true))}
            >
              {userRole === "teacher" ? (
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  Create First Class
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4 mr-2" />
                  Join a Class
                </>
              )}
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
