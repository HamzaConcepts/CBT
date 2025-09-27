"use client"

import { useEffect, useState } from "react"
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
  LogOut,
} from "lucide-react"
import { supabase } from "@/lib/supabaseClient"

type DbClassroom = {
  id: string
  name: string
  subject: string | null
  code: string
  description: string | null
  color: string | null
  teacher_id: string
}

export function ClassroomSystem() {
  const [createdClasses, setCreatedClasses] = useState<DbClassroom[]>([])
  const [joinedClasses, setJoinedClasses] = useState<DbClassroom[]>([])
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
  const [joinError, setJoinError] = useState("")
  const [isJoining, setIsJoining] = useState(false)

  const [currentUserId, setCurrentUserId] = useState<string | null>(null)

  useEffect(() => {
    const load = async () => {
      const { data: userData } = await supabase.auth.getUser()
      const uid = userData.user?.id || null
      setCurrentUserId(uid)
      if (!uid) return
      
      // Get classes created by user (as teacher)
      const { data: teacherClasses } = await supabase
        .from("classrooms")
        .select("id,name,subject,code,description,color,teacher_id")
        .eq("teacher_id", uid)
        .order("created_at", { ascending: false })

      // Get classes joined by user (as student)
      const { data: studentMemberships } = await supabase
        .from("classroom_memberships")
        .select("classrooms(id,name,subject,code,description,color,teacher_id)")
        .eq("user_id", uid)
        .eq("role", "STUDENT")

      const studentClasses = (studentMemberships || [])
        .map((r: any) => r.classrooms)
        .filter(Boolean) // Remove any null classrooms

      setCreatedClasses(teacherClasses || [])
      setJoinedClasses(studentClasses || [])
    }
    load()
  }, [])

  const generateClassCode = () => {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase()
    setNewClass((prev) => ({ ...prev, code }))
  }

  const handleCreateClass = async () => {
    if (!newClass.name || !newClass.subject) return
    const colors = [
      "bg-gradient-to-br from-blue-500 to-purple-600",
      "bg-gradient-to-br from-green-500 to-teal-600",
      "bg-gradient-to-br from-orange-500 to-red-600",
      "bg-gradient-to-br from-pink-500 to-rose-600",
      "bg-gradient-to-br from-indigo-500 to-blue-600",
    ]
    const color = colors[Math.floor(Math.random() * colors.length)]
    const code = newClass.code || Math.random().toString(36).substring(2, 8).toUpperCase()

    if (!currentUserId) return
    const { data, error } = await supabase
      .from("classrooms")
      .insert({ name: newClass.name, subject: newClass.subject, description: newClass.description, code, color, teacher_id: currentUserId })
      .select("id,name,subject,code,description,color,teacher_id")
      .single()
    if (!error && data) {
      // Ensure creator is teacher member
      await supabase
        .from("classroom_memberships")
        .upsert({ classroom_id: data.id, user_id: currentUserId!, role: "TEACHER", status: "active" }, { onConflict: "classroom_id,user_id" })
      setCreatedClasses([data, ...createdClasses])
      setNewClass({ name: "", subject: "", description: "", code: "" })
      setIsCreateDialogOpen(false)
    }
  }

  const handleJoinClass = async () => {
    if (!joinCode.trim()) {
      setJoinError("Please enter a class code")
      return
    }
    if (!currentUserId) {
      setJoinError("You must be logged in to join a class")
      return
    }

    setIsJoining(true)
    setJoinError("")

    try {
      // Check if classroom exists with this code
      const { data: classRow, error: fetchError } = await supabase
        .from("classrooms")
        .select("id,name,subject,code,description,color,teacher_id")
        .eq("code", joinCode.trim().toUpperCase())
        .maybeSingle()

      if (fetchError) {
        setJoinError("Error checking class code. Please try again.")
        setIsJoining(false)
        return
      }

      if (!classRow) {
        setJoinError("Invalid class code. No classroom found with this code.")
        setIsJoining(false)
        return
      }

      // Check if user is already a member
      const { data: existingMembership } = await supabase
        .from("classroom_memberships")
        .select("id")
        .eq("classroom_id", classRow.id)
        .eq("user_id", currentUserId)
        .maybeSingle()

      if (existingMembership) {
        setJoinError("You are already a member of this classroom.")
        setIsJoining(false)
        return
      }

      // Join the classroom
      const { error: joinError } = await supabase
        .from("classroom_memberships")
        .insert({
          classroom_id: classRow.id,
          user_id: currentUserId,
          role: "STUDENT",
          status: "active"
        })

      if (joinError) {
        setJoinError("Failed to join classroom. Please try again.")
        setIsJoining(false)
        return
      }

      // Add the new classroom to the local state
      setJoinedClasses([classRow, ...joinedClasses])
      setJoinCode("")
      setJoinError("")
      setIsJoinDialogOpen(false)
    } catch (error) {
      setJoinError("An unexpected error occurred. Please try again.")
    } finally {
      setIsJoining(false)
    }
  }

  const copyClassCode = (code: string) => {
    navigator.clipboard.writeText(code)
    setCopiedCode(code)
    setTimeout(() => setCopiedCode(null), 2000)
  }

  const handleLeaveClass = async (classroomId: string, className: string) => {
    if (!currentUserId) return
    
    const confirmed = window.confirm(`Are you sure you want to leave "${className}"? You'll need a class code to rejoin.`)
    if (!confirmed) return

    try {
      const { error } = await supabase
        .from("classroom_memberships")
        .delete()
        .eq("classroom_id", classroomId)
        .eq("user_id", currentUserId)

      if (error) {
        alert("Failed to leave classroom. Please try again.")
        return
      }

      // Remove the classroom from the local state
      setJoinedClasses(joinedClasses.filter(c => c.id !== classroomId))
    } catch (error) {
      alert("An unexpected error occurred. Please try again.")
    }
  }

  const allClasses = [...createdClasses, ...joinedClasses]
  
  const filterClasses = (classList: DbClassroom[]) => {
    return classList.filter((cls) => {
      const subject = (cls.subject || "").toLowerCase()
      return (
        cls.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        subject.includes(searchTerm.toLowerCase()) ||
        cls.code.toLowerCase().includes(searchTerm.toLowerCase())
      )
    })
  }
  
  const filteredCreatedClasses = filterClasses(createdClasses)
  const filteredJoinedClasses = filterClasses(joinedClasses)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Your Classrooms</h2>
          <p className="text-muted-foreground">Create new classes or join existing ones with a code</p>
        </div>

        <div className="flex items-center gap-3">
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gradient-primary transition-transform hover:-translate-y-0.5 hover:shadow-lg">
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
                    <Button type="button" variant="outline" className="transition-colors hover:border-primary" onClick={generateClassCode}>
                      <Sparkles className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)} className="flex-1 transition-colors hover:border-primary">
                    Cancel
                  </Button>
                  <Button onClick={handleCreateClass} className="flex-1 gradient-primary transition-transform hover:-translate-y-0.5">
                    Create Class
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={isJoinDialogOpen} onOpenChange={setIsJoinDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="transition-transform hover:-translate-y-0.5 hover:shadow-lg">
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
                <DialogDescription>Enter the class code to join the classroom</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="joinCode">Class Code</Label>
                  <Input
                    id="joinCode"
                    placeholder="Enter class code (e.g., MATH2024)"
                    value={joinCode}
                    onChange={(e) => {
                      setJoinCode(e.target.value.toUpperCase())
                      setJoinError("") // Clear error when user types
                    }}
                    className="text-center text-lg font-mono"
                  />
                  {joinError && (
                    <p className="text-sm text-destructive">{joinError}</p>
                  )}
                </div>

                <div className="flex gap-2 pt-4">
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setIsJoinDialogOpen(false)
                      setJoinError("")
                      setJoinCode("")
                    }} 
                    className="flex-1 transition-colors hover:border-primary"
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleJoinClass} 
                    disabled={isJoining}
                    className="flex-1 gradient-primary transition-transform hover:-translate-y-0.5"
                  >
                    {isJoining ? "Joining..." : "Join Class"}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
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

      {/* My Classes Section */}
      {filteredCreatedClasses.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-foreground">My Classes</h3>
              <p className="text-sm text-muted-foreground">Classes you created and manage as a teacher</p>
            </div>
            <Badge variant="secondary">{filteredCreatedClasses.length}</Badge>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCreatedClasses.map((classroom) => (
              <Card key={classroom.id} className="overflow-hidden hover:shadow-lg transition-all duration-300 group">
                {/* Class Header with Gradient */}
                <div className={`${classroom.color} p-6 text-white relative overflow-hidden`}>
                  <div className="absolute inset-0 bg-black/10"></div>
                  <div className="relative z-10">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h4 className="text-xl font-bold text-balance">{classroom.name}</h4>
                        <p className="text-white/90 text-sm">{classroom.subject}</p>
                        <p className="text-white/80 text-xs mt-1 flex items-center gap-1">
                          <GraduationCap className="w-3 h-3" />
                          Teacher
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyClassCode(classroom.code)}
                        className="text-white hover:bg-white/20 p-2 transition-transform hover:-translate-y-0.5"
                      >
                        {copiedCode === classroom.code ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      </Button>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-white/90">
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <span>—</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <BookOpen className="w-4 h-4" />
                        <span>—</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Award className="w-4 h-4" />
                        <span>—</span>
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
                        className="flex-1 group-hover:border-primary/50 transition-all bg-transparent hover:shadow-md hover:-translate-y-0.5"
                        onClick={() => (window.location.href = `/classroom/${classroom.id}`)}
                      >
                        <BookOpen className="w-4 h-4 mr-2" />
                        Manage
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="group-hover:border-primary/50 transition-all bg-transparent hover:shadow-md hover:-translate-y-0.5"
                      >
                        <Settings className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Classes Joined Section */}
      {filteredJoinedClasses.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-foreground">Classes Joined</h3>
              <p className="text-sm text-muted-foreground">Classes you joined as a student</p>
            </div>
            <Badge variant="secondary">{filteredJoinedClasses.length}</Badge>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredJoinedClasses.map((classroom) => (
              <Card key={classroom.id} className="overflow-hidden hover:shadow-lg transition-all duration-300 group">
                {/* Class Header with Gradient */}
                <div className={`${classroom.color} p-6 text-white relative overflow-hidden`}>
                  <div className="absolute inset-0 bg-black/10"></div>
                  <div className="relative z-10">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h4 className="text-xl font-bold text-balance">{classroom.name}</h4>
                        <p className="text-white/90 text-sm">{classroom.subject}</p>
                        <p className="text-white/80 text-xs mt-1 flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          Student
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyClassCode(classroom.code)}
                        className="text-white hover:bg-white/20 p-2 transition-transform hover:-translate-y-0.5"
                      >
                        {copiedCode === classroom.code ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      </Button>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-white/90">
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <span>—</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <BookOpen className="w-4 h-4" />
                        <span>—</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Award className="w-4 h-4" />
                        <span>—</span>
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
                        className="flex-1 group-hover:border-primary/50 transition-all bg-transparent hover:shadow-md hover:-translate-y-0.5"
                        onClick={() => (window.location.href = `/classroom/${classroom.id}`)}
                      >
                        <BookOpen className="w-4 h-4 mr-2" />
                        Enter
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="group-hover:border-primary/50 transition-all bg-transparent hover:shadow-md hover:-translate-y-0.5"
                        onClick={() => handleLeaveClass(classroom.id, classroom.name)}
                        title="Leave class"
                      >
                        <LogOut className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="group-hover:border-primary/50 transition-all bg-transparent hover:shadow-md hover:-translate-y-0.5"
                      >
                        <Settings className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {filteredCreatedClasses.length === 0 && filteredJoinedClasses.length === 0 && (
        <div className="text-center py-12">
          <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
            <GraduationCap className="w-12 h-12 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">
            {searchTerm ? "No classes found" : "No classes yet"}
          </h3>
          <p className="text-muted-foreground mb-4">
            {searchTerm ? "Try adjusting your search terms" : "Create a class or join one using a code"}
          </p>
          {!searchTerm && (
            <>
              <Button
                className="gradient-primary transition-transform hover:-translate-y-0.5 hover:shadow-lg"
                onClick={() => setIsCreateDialogOpen(true)}
              >
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  Create First Class
                </>
              </Button><div className="pt-4">
                  <Button className="gradient-primary transition-transform hover:-translate-y-0.5 hover:shadow-lg" variant="default" onClick={() => setIsJoinDialogOpen(true)}>
                    <UserPlus className="w-4 h-4 mr-2" />
                    Join a Class
                  </Button>
                </div>
              </>
          )}
        </div>
      )}
    </div>
  )
}
