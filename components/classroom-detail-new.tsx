"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Bell,
  AlertCircle,
  TrendingUp,
  Target,
  Award
} from "lucide-react"

// Import our new modular components
import { ClassroomOverview } from "@/components/classroom/ClassroomOverview"
import { AnnouncementsPanel } from "@/components/classroom/AnnouncementsPanel"
import { AssignmentsList } from "@/components/classroom/AssignmentsList"
import { RosterTable } from "@/components/classroom/RosterTable"
import { MaterialsSection } from "@/components/classroom/MaterialsSection"
import { ClassroomExamsTab } from "@/components/classroom/ExamsTab"

// Import our custom hooks
import { useCurrentUser } from "@/hooks/useCurrentUser"
import {
  useClassroom,
  useTeacher,
  useUserRole,
  useAnnouncements,
  useAssignments,
  useMaterials,
  useRoster,
  useSubmissions,
  useExams
} from "@/hooks/useClassroomData"

interface ClassroomDetailProps {
  classroomId: string
}

export function ClassroomDetail({ classroomId }: ClassroomDetailProps) {
  const [activeTab, setActiveTab] = useState("overview")
  const router = useRouter()
  
  // Authentication
  const { user, isLoading: userLoading } = useCurrentUser()
  
  // Data fetching with SWR
  const { data: classroom, isLoading: classroomLoading } = useClassroom(classroomId)
  const { data: teacher, isLoading: teacherLoading } = useTeacher(classroom?.teacher_id)
  const { data: userRole, isLoading: roleLoading } = useUserRole(classroomId, user?.id)
  const { data: announcements = [], isLoading: announcementsLoading } = useAnnouncements(classroomId)
  const { data: assignments = [], isLoading: assignmentsLoading } = useAssignments(classroomId)
  const { data: materials = [], isLoading: materialsLoading } = useMaterials(classroomId)
  const { data: roster = [], isLoading: rosterLoading } = useRoster(classroomId, userRole)
  const { data: submissions = [], isLoading: submissionsLoading } = useSubmissions(
    classroomId, 
    user?.id, 
    assignments
  )
  const { data: exams = [], isLoading: examsLoading } = useExams(classroomId)

  // Loading states
  const isLoading = userLoading || classroomLoading || roleLoading
  
  // Redirect if not authenticated
  if (!userLoading && !user) {
    router.replace("/")
    return null
  }

  // Derived data for props
  const rosterCount = roster.length
  const assignmentsCount = assignments.length
  const activeAssignmentsCount = assignments.filter(a => a.status === "active").length
  const quizzesCount = assignments.filter(a => a.type === "quiz").length

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        <div className="container mx-auto px-4 py-6">
          <div className="animate-pulse space-y-6">
            <div className="h-32 bg-gray-200 rounded-lg"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-48 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      {/* Render overview component */}
      <ClassroomOverview
        classroom={classroom || null}
        teacher={teacher || null}
        rosterCount={rosterCount}
        assignmentsCount={assignmentsCount}
        activeAssignmentsCount={activeAssignmentsCount}
        quizzesCount={quizzesCount}
      />

      <div className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className={`grid w-full ${userRole === 'STUDENT' ? 'grid-cols-5' : 'grid-cols-6'} bg-card/50 backdrop-blur-sm`}>
            <TabsTrigger                //Overview tab button
              value="overview"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger               //Assignments tab button
              value="assignments"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              {userRole === 'STUDENT' ? 'My Work' : 'Assignments'}
            </TabsTrigger>
            <TabsTrigger
              value="exams"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Exams
            </TabsTrigger>
            {userRole === 'TEACHER' && (      //Students tab button (Teachers only)
              <TabsTrigger
                value="students"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                Students
              </TabsTrigger>
            )}
            <TabsTrigger               //Grades tab button
              value="grades"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              {userRole === 'STUDENT' ? 'My Grades' : 'Grades'}
            </TabsTrigger>
            <TabsTrigger                    //Settings tab button
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
                <AnnouncementsPanel
                  announcements={announcements}
                  userRole={userRole}
                  classroomId={classroomId}
                  isLoading={announcementsLoading}
                />

                {/* Materials Section for Students */}
                {userRole === 'STUDENT' && (
                  <div className="mt-6">
                    <MaterialsSection
                      materials={materials}
                      userRole={userRole}
                      classroomId={classroomId}
                      isLoading={materialsLoading}
                    />
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          {/* Assignments Tab */}
          <TabsContent value="assignments" className="space-y-6">
            <AssignmentsList
              assignments={assignments}
              submissions={submissions}
              userRole={userRole}
              classroomId={classroomId}
              rosterCount={rosterCount}
              isLoading={assignmentsLoading}
            />
          </TabsContent>

          <TabsContent value="exams" className="space-y-6">
            <ClassroomExamsTab
              classroomId={classroomId}
              userRole={userRole as "TEACHER" | "STUDENT" | null}
              userId={user?.id}
              exams={exams}
              isLoading={examsLoading}
            />
          </TabsContent>

          {/* Students Tab (Teachers only) */}
          {userRole === 'TEACHER' && (
            <TabsContent value="students" className="space-y-6">
              <RosterTable 
                roster={roster}
                isLoading={rosterLoading}
              />
            </TabsContent>
          )}

          {/* Grades Tab */}
          <TabsContent value="grades" className="space-y-6">
            {userRole === 'STUDENT' ? (
              // Student grades view
              <div className="space-y-6">
                {/* Student Performance Overview */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="w-5 h-5" />
                        Overall Average
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">
                        {submissions.filter(s => s.score !== null).length > 0
                          ? Math.round(
                              submissions.filter(s => s.score !== null)
                                .reduce((acc, sub) => {
                                  const assignment = assignments.find(a => a.id === sub.assignment_id)
                                  return acc + (sub.score! / (assignment?.points || 1)) * 100
                                }, 0) / submissions.filter(s => s.score !== null).length
                            )
                          : 0}%
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Based on {submissions.filter(s => s.score !== null).length} graded assignments
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Target className="w-5 h-5" />
                        Completion Rate
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">
                        {assignments.length > 0 
                          ? Math.round((submissions.length / assignments.length) * 100)
                          : 0}%
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {submissions.length} of {assignments.length} assignments
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Award className="w-5 h-5" />
                        Highest Score
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">
                        {submissions.filter(s => s.score !== null).length > 0
                          ? Math.max(...submissions.filter(s => s.score !== null).map(sub => {
                              const assignment = assignments.find(a => a.id === sub.assignment_id)
                              return Math.round((sub.score! / (assignment?.points || 1)) * 100)
                            }))
                          : 0}%
                      </div>
                      <p className="text-sm text-muted-foreground">Best performance</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Individual Assignment Grades */}
                <Card>
                  <CardHeader>
                    <CardTitle>Assignment Grades</CardTitle>
                    <CardDescription>Your performance on each assignment</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {assignments.map((assignment) => {
                        const submission = submissions.find(s => s.assignment_id === assignment.id)
                        const percentage = submission && submission.score !== null && assignment.points 
                          ? Math.round((submission.score / assignment.points) * 100)
                          : null
                        
                        return (
                          <div key={assignment.id} className="flex items-center justify-between p-4 border rounded-lg">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-medium">{assignment.title}</h4>
                                <Badge variant="outline">{assignment.type}</Badge>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                Due: {assignment.due_at ? new Date(assignment.due_at).toLocaleDateString() : "TBD"}
                              </p>
                            </div>
                            <div className="text-right">
                              {submission && submission.score !== null ? (
                                <>
                                  <div className="text-lg font-bold">
                                    {percentage}%
                                  </div>
                                  <div className="text-sm text-muted-foreground">
                                    {submission.score}/{assignment.points || 100}
                                  </div>
                                </>
                              ) : (
                                <Badge variant={submission ? "default" : "outline"}>
                                  {submission ? "Submitted" : "Not Submitted"}
                                </Badge>
                              )}
                            </div>
                          </div>
                        )
                      })}
                      
                      {assignments.length === 0 && (
                        <div className="text-center py-8 text-muted-foreground">
                          <Award className="w-12 h-12 mx-auto mb-3 opacity-50" />
                          <p>No assignments available yet</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              // Teacher grades view
              <>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="w-5 h-5" />
                        Class Average
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">100.5%</div>
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
                      <p className="text-sm text-muted-foreground">{Math.round(roster.length * 0.89)} of {roster.length} students</p>
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
                      <div className="text-lg font-bold">
                        {roster[0]?.profiles?.name || "N/A"}
                      </div>
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
                      {roster.map((student) => (
                        <div key={student.user_id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center gap-4">
                            <div>
                              <div className="font-medium">
                                {student.profiles.name || `Student ${student.user_id.slice(0, 8)}`}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {student.profiles.email}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <div className="font-medium">85.2%</div>
                              <div className="text-sm text-muted-foreground">Average</div>
                            </div>
                            <Badge variant="secondary">A-</Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold">
                {userRole === 'STUDENT' ? 'Notification Settings' : 'Classroom Settings'}
              </h2>
              <p className="text-muted-foreground">
                {userRole === 'STUDENT' 
                  ? 'Manage how you receive notifications from this classroom'
                  : 'Manage classroom preferences and configurations'
                }
              </p>
            </div>

            {userRole === 'STUDENT' ? (
              // Student settings - focus on notifications
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Bell className="w-5 h-5" />
                      Assignment Notifications
                    </CardTitle>
                    <CardDescription>Get notified about assignments and due dates</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">New Assignments</p>
                          <p className="text-sm text-muted-foreground">Alert when teacher posts new assignments</p>
                        </div>
                        <Button variant="outline" size="sm" className="bg-green-50 text-green-700 border-green-200">
                          Enabled
                        </Button>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Due Date Reminders</p>
                          <p className="text-sm text-muted-foreground">Remind me before assignment deadlines</p>
                        </div>
                        <Button variant="outline" size="sm" className="bg-green-50 text-green-700 border-green-200">
                          Enabled
                        </Button>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Grade Updates</p>
                          <p className="text-sm text-muted-foreground">Notify when assignments are graded</p>
                        </div>
                        <Button variant="outline" size="sm" className="bg-green-50 text-green-700 border-green-200">
                          Enabled
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              // Teacher settings - existing classroom management content
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Basic Information</CardTitle>
                    <CardDescription>Update classroom details</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="className">Class Name</Label>
                      <Input id="className" defaultValue={classroom?.name || ""} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="classDescription">Description</Label>
                      <Input id="classDescription" defaultValue={classroom?.description || ""} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="classSchedule">Schedule</Label>
                        <Input id="classSchedule" defaultValue={classroom?.schedule || ""} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="classRoom">Room</Label>
                        <Input id="classRoom" defaultValue={classroom?.room || ""} />
                      </div>
                    </div>
                    <Button className="w-full gradient-primary">Save Changes</Button>
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
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}