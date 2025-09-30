"use client"

import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabaseClient"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useToast } from "@/hooks/use-toast"
import { mutate } from "swr"
import { format } from "date-fns"
import { CreateExamDialog } from "@/components/classroom/CreateExamDialog"
import {
  AlertCircle,
  Calendar,
  CheckCircle2,
  Clock,
  Eye,
  FileText,
  Layers,
  Plus,
  Shield,
  Trash2,
  Unlock
} from "lucide-react"

interface DbExam {
  id: string
  classroom_id: string
  created_by: string | null
  title: string
  description: string | null
  type: string
  duration_min: number | null
  question_count: number
  total_marks: number
  status: string
  available_from: string | null
  available_until: string | null
  due_at: string | null
  max_attempts: number | null
  lock_on_start: boolean | null
  created_at: string
}

interface DbExamQuestion {
  id: string
  prompt: string
  question_type: "mcq" | "text"
  options: string[] | null
  points: number
  sort_order: number
  answer?: {
    correct_option_index: number | null
    correct_text_answer: string | null
  } | null
}

type SupabaseExamQuestionRow = {
  id: string
  prompt: string
  question_type: "mcq" | "text"
  options: string[] | Record<string, string> | null
  points: number
  sort_order: number
  exam_question_answers:
    | Array<{ correct_option_index: number | null; correct_text_answer: string | null }>
    | { correct_option_index: number | null; correct_text_answer: string | null }
    | null
}

const normalizeOptions = (
  options: SupabaseExamQuestionRow["options"]
): string[] | null => {
  if (!options) return null
  if (Array.isArray(options)) return options
  return Object.values(options)
}

const normalizeAnswer = (
  answer: SupabaseExamQuestionRow["exam_question_answers"]
): DbExamQuestion["answer"] => {
  if (!answer) return null
  if (Array.isArray(answer)) {
    const [first] = answer
    return first ? { ...first } : null
  }
  return { ...answer }
}

const resolveErrorMessage = (error: unknown, fallback: string): string =>
  error instanceof Error ? error.message : fallback

interface ClassroomExamsTabProps {
  classroomId: string
  userRole: "TEACHER" | "STUDENT" | null
  userId?: string
  exams: DbExam[]
  isLoading: boolean
}

export function ClassroomExamsTab({
  classroomId,
  userRole,
  userId,
  exams,
  isLoading,
}: ClassroomExamsTabProps) {
  const { toast } = useToast()
  const router = useRouter()

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isExamDialogOpen, setIsExamDialogOpen] = useState(false)
  const [selectedExam, setSelectedExam] = useState<DbExam | null>(null)
  const [examQuestions, setExamQuestions] = useState<DbExamQuestion[]>([])
  const [questionCache, setQuestionCache] = useState<Record<string, DbExamQuestion[]>>({})
  const [loadingExamId, setLoadingExamId] = useState<string | null>(null)
  const [takingExam, setTakingExam] = useState(false)

  const [submittingAttempt, setSubmittingAttempt] = useState(false)
  const [studentAnswers, setStudentAnswers] = useState<Record<string, { optionIndex?: number; text?: string }>>({})

  const isTeacher = userRole === "TEACHER"

  const upcomingExams = useMemo(
    () => exams.filter((exam) => getExamState(exam).label !== "Closed"),
    [exams]
  )

  const pastExams = useMemo(
    () => exams.filter((exam) => getExamState(exam).label === "Closed"),
    [exams]
  )

  const handleDeleteExam = async (examId: string) => {
    if (!confirm("Delete this exam? All questions and attempts will be removed.")) return

    try {
      const { error } = await supabase.from("exams").delete().eq("id", examId)
      if (error) throw error

      toast({
        title: "Exam deleted",
        description: "The exam has been removed from this classroom.",
      })

      setQuestionCache((prev) => {
        const clone = { ...prev }
        delete clone[examId]
        return clone
      })

      mutate(`exams-${classroomId}`)
    } catch (error: unknown) {
      console.error("Failed to delete exam", error)
      toast({
        title: "Could not delete exam",
        description: resolveErrorMessage(error, "Please try again."),
        variant: "destructive",
      })
    }
  }

  const loadExamQuestions = async (exam: DbExam, expand = false) => {
    if (!expand) {
      setSelectedExam(exam)
      return
    }

    if (questionCache[exam.id]) {
      setSelectedExam(exam)
      setExamQuestions(questionCache[exam.id])
      setTakingExam(false)
      setIsExamDialogOpen(true)
      return
    }

    try {
      setLoadingExamId(exam.id)
      const { data, error } = await supabase
        .from("exam_questions")
        .select(
          "id,prompt,question_type,points,sort_order,options,exam_question_answers(correct_option_index,correct_text_answer)"
        )
        .eq("exam_id", exam.id)
        .order("sort_order", { ascending: true })

      if (error) throw error

  const normalized: DbExamQuestion[] = (data || []).map((row: SupabaseExamQuestionRow) => ({
        id: row.id,
        prompt: row.prompt,
        question_type: row.question_type,
        points: row.points,
        sort_order: row.sort_order,
        options: normalizeOptions(row.options),
        answer: normalizeAnswer(row.exam_question_answers),
      }))

      setQuestionCache((prev) => ({ ...prev, [exam.id]: normalized }))
      setExamQuestions(normalized)
      setSelectedExam(exam)
      setTakingExam(false)
      setIsExamDialogOpen(true)
    } catch (error: unknown) {
      console.error("Failed to load exam questions", error)
      toast({
        title: "Could not load questions",
        description: resolveErrorMessage(error, "Please try again."),
        variant: "destructive",
      })
    } finally {
      setLoadingExamId(null)
    }
  }

  const handleStartExam = async (exam: DbExam) => {
    if (!userId) {
      router.replace("/auth")
      return
    }

    try {
      setLoadingExamId(exam.id)

      const { data: attempts, error: attemptsError } = await supabase
        .from("attempts")
        .select("id")
        .eq("exam_id", exam.id)
        .eq("user_id", userId)

      if (attemptsError) throw attemptsError
      const maxAttempts = exam.max_attempts ?? 1
      if (attempts && attempts.length >= maxAttempts) {
        toast({
          title: "No attempts remaining",
          description: "You have already used all attempts for this exam.",
          variant: "destructive",
        })
        return
      }

      if (!questionCache[exam.id]) {
        await loadExamQuestions(exam, true)
      } else {
        setExamQuestions(questionCache[exam.id])
        setSelectedExam(exam)
      }

      setStudentAnswers({})
      setTakingExam(true)
      setIsExamDialogOpen(true)
    } catch (error: unknown) {
      console.error("Failed to start exam", error)
      toast({
        title: "Could not start exam",
        description: resolveErrorMessage(error, "Please try again."),
        variant: "destructive",
      })
    } finally {
      setLoadingExamId(null)
    }
  }

  const handleSubmitAttempt = async () => {
    if (!selectedExam || !userId) return

    try {
      setSubmittingAttempt(true)
      const now = new Date().toISOString()

      const autoScore = examQuestions.reduce((score, question) => {
        if (question.question_type !== "mcq") return score
        const answer = studentAnswers[question.id]?.optionIndex
        if (answer === undefined || answer === null) return score
        return answer === question.answer?.correct_option_index
          ? score + question.points
          : score
      }, 0)

      const { data: attemptInsert, error: attemptError } = await supabase
        .from("attempts")
        .insert({
          exam_id: selectedExam.id,
          user_id: userId,
          started_at: now,
          submitted_at: now,
          status: "submitted",
          auto_score: autoScore,
          total_score: autoScore,
          score: autoScore,
        })
        .select("id")
        .single()

      if (attemptError || !attemptInsert) throw attemptError

      const answersPayload = examQuestions.map((question) => {
        const answer = studentAnswers[question.id]
        return {
          attempt_id: attemptInsert.id,
          question_id: question.id,
          answer_option_index:
            question.question_type === "mcq" && answer?.optionIndex !== undefined
              ? answer.optionIndex
              : null,
          answer_text: question.question_type === "text" ? answer?.text || null : null,
          is_correct:
            question.question_type === "mcq" && answer?.optionIndex !== undefined
              ? answer.optionIndex === question.answer?.correct_option_index
              : null,
          score_awarded:
            question.question_type === "mcq" && answer?.optionIndex !== undefined
              ? answer.optionIndex === question.answer?.correct_option_index
                ? question.points
                : 0
              : null,
        }
      })

      const { error: answersError } = await supabase
        .from("exam_attempt_answers")
        .insert(answersPayload)

      if (answersError) throw answersError

      toast({
        title: "Exam submitted",
        description: "Your responses have been recorded.",
      })

      setIsExamDialogOpen(false)
      setTakingExam(false)
      setSelectedExam(null)
      setExamQuestions([])
      mutate(`exams-${classroomId}`)
    } catch (error: unknown) {
      console.error("Failed to submit exam", error)
      toast({
        title: "Could not submit exam",
        description: resolveErrorMessage(error, "Please try again."),
        variant: "destructive",
      })
    } finally {
      setSubmittingAttempt(false)
    }
  }

  const renderExamStatusBadge = (exam: DbExam) => {
    const state = getExamState(exam)
    return (
      <Badge variant={state.variant} className="capitalize">
        {state.label}
      </Badge>
    )
  }

  return (
    <div className="space-y-6">
      {isTeacher && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-xl">Classroom Exams</CardTitle>
              <CardDescription>
                Create secure exams, control availability, and monitor performance.
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                New Exam
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatTile
                icon={Layers}
                label="Total Exams"
                value={exams.length}
              />
              <StatTile
                icon={Unlock}
                label="Open Exams"
                value={exams.filter((exam) => getExamState(exam).label === "Open").length}
              />
              <StatTile
                icon={Calendar}
                label="Scheduled"
                value={exams.filter((exam) => getExamState(exam).label === "Locked").length}
              />
              <StatTile
                icon={CheckCircle2}
                label="Closed"
                value={exams.filter((exam) => getExamState(exam).label === "Closed").length}
              />
            </div>
          </CardContent>
        </Card>
      )}

      <SecurityPlaceholder />

      <section className="space-y-4">
        <header className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Eye className="w-4 h-4" /> Active Exams
            </h3>
            <p className="text-sm text-muted-foreground">
              Exams that are open or scheduled for this classroom.
            </p>
          </div>
        </header>
        <ExamList
          exams={upcomingExams}
          isTeacher={isTeacher}
          loadingExamId={loadingExamId}
          onView={(exam) => loadExamQuestions(exam, true)}
          onDelete={handleDeleteExam}
          onStart={handleStartExam}
          renderStatus={renderExamStatusBadge}
          isLoading={isLoading}
        />
      </section>

      {pastExams.length > 0 && (
        <section className="space-y-4">
          <header>
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <FileText className="w-4 h-4" /> Past Exams
            </h3>
          </header>
          <ExamList
            exams={pastExams}
            isTeacher={isTeacher}
            loadingExamId={loadingExamId}
            onView={(exam) => loadExamQuestions(exam, true)}
            onDelete={handleDeleteExam}
            onStart={handleStartExam}
            renderStatus={renderExamStatusBadge}
            isLoading={isLoading}
            disabledStart
          />
        </section>
      )}

      <CreateExamDialog
        classroomId={classroomId}
        userId={userId}
        isOpen={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onExamCreated={() => mutate(`exams-${classroomId}`)}
      />

      <Dialog open={isExamDialogOpen} onOpenChange={(open) => {
        setIsExamDialogOpen(open)
        if (!open) {
          setSelectedExam(null)
          setExamQuestions([])
          setTakingExam(false)
          setStudentAnswers({})
        }
      }}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>{takingExam ? selectedExam?.title : "Exam Questions"}</DialogTitle>
          </DialogHeader>
          <ScrollArea className="max-h-[70vh] pr-4">
            {selectedExam && (
              <div className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <InfoRow icon={Clock} label="Duration" value={`${selectedExam.duration_min ?? 0} minutes`} />
                  <InfoRow icon={Layers} label="Questions" value={`${selectedExam.question_count}`} />
                  {selectedExam.available_from && (
                    <InfoRow
                      icon={Calendar}
                      label="Opens"
                      value={formatDisplayDate(selectedExam.available_from)}
                    />
                  )}
                  {selectedExam.available_until && (
                    <InfoRow
                      icon={Calendar}
                      label="Closes"
                      value={formatDisplayDate(selectedExam.available_until)}
                    />
                  )}
                </div>

                {selectedExam.description && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Instructions</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm leading-relaxed whitespace-pre-line">
                        {selectedExam.description}
                      </p>
                    </CardContent>
                  </Card>
                )}

                <div className="space-y-4">
                  {examQuestions.map((question, questionIndex) => (
                    <Card key={question.id}>
                      <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2">
                          Question {questionIndex + 1}
                          <Badge variant="outline" className="capitalize">
                            {question.question_type === "mcq" ? "MCQ" : "Text"}
                          </Badge>
                          <Badge variant="secondary">{question.points} pts</Badge>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <p className="text-sm leading-relaxed whitespace-pre-line">{question.prompt}</p>

                        {question.question_type === "mcq" && question.options && (
                          <RadioGroup
                            value={
                              studentAnswers[question.id]?.optionIndex !== undefined
                                ? String(studentAnswers[question.id]?.optionIndex)
                                : undefined
                            }
                            onValueChange={(value) =>
                              setStudentAnswers((prev) => ({
                                ...prev,
                                [question.id]: {
                                  ...prev[question.id],
                                  optionIndex: Number(value),
                                },
                              }))
                            }
                            className="space-y-2"
                          >
                            {question.options.map((option, optionIndex) => (
                              <label
                                key={`${question.id}-option-${optionIndex}`}
                                className="flex items-center gap-2 rounded-lg border px-3 py-2 text-sm hover:bg-muted/60"
                              >
                                <RadioGroupItem
                                  value={String(optionIndex)}
                                  className="h-4 w-4"
                                />
                                <span>{option}</span>
                              </label>
                            ))}
                          </RadioGroup>
                        )}

                        {question.question_type === "text" && (
                          <Textarea
                            placeholder="Enter your answer"
                            value={studentAnswers[question.id]?.text || ""}
                            onChange={(event) =>
                              setStudentAnswers((prev) => ({
                                ...prev,
                                [question.id]: {
                                  ...prev[question.id],
                                  text: event.target.value,
                                },
                              }))
                            }
                            rows={4}
                          />
                        )}

                        {isTeacher && question.answer && (
                          <div className="rounded-md bg-muted/40 p-3 text-xs text-muted-foreground space-y-1">
                            <p className="font-semibold flex items-center gap-1">
                              <Shield className="w-3 h-3" /> Answer Key
                            </p>
                            {question.question_type === "mcq" ? (
                              <p>
                                Correct Option: {question.answer.correct_option_index !== null
                                  ? `Option ${Number(question.answer.correct_option_index) + 1}`
                                  : "Not set"}
                              </p>
                            ) : (
                              <p>
                                Reference: {question.answer.correct_text_answer || "Not provided"}
                              </p>
                            )}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}

                  {examQuestions.length === 0 && (
                    <p className="text-sm text-muted-foreground">
                      No questions found for this exam yet.
                    </p>
                  )}
                </div>
              </div>
            )}
          </ScrollArea>

          {takingExam && (
            <div className="flex items-center justify-end gap-2">
              <Button variant="outline" onClick={() => setIsExamDialogOpen(false)} disabled={submittingAttempt}>
                Cancel
              </Button>
              <Button onClick={handleSubmitAttempt} disabled={submittingAttempt}>
                {submittingAttempt ? "Submitting..." : "Submit Exam"}
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

interface ExamListProps {
  exams: DbExam[]
  isTeacher: boolean
  loadingExamId: string | null
  onView: (exam: DbExam) => void
  onDelete: (examId: string) => void
  onStart: (exam: DbExam) => void
  renderStatus: (exam: DbExam) => React.ReactNode
  disabledStart?: boolean
  isLoading?: boolean
}

function ExamList({
  exams,
  isTeacher,
  loadingExamId,
  onView,
  onDelete,
  onStart,
  renderStatus,
  disabledStart = false,
  isLoading = false,
}: ExamListProps) {
  if (isLoading && !exams.length) {
    return (
      <Card>
        <CardContent className="py-10 text-center text-sm text-muted-foreground">
          Loading exams...
        </CardContent>
      </Card>
    )
  }

  if (!exams.length) {
    return (
      <Card>
        <CardContent className="py-10 text-center text-sm text-muted-foreground">
          No exams to display yet.
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {exams.map((exam) => {
        const state = getExamState(exam)
        return (
          <Card key={exam.id} className="border border-border/60">
            <CardContent className="flex flex-col gap-4 p-4 md:flex-row md:items-center md:justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <h4 className="text-base font-semibold">{exam.title}</h4>
                  {renderStatus(exam)}
                  {exam.lock_on_start && (
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Shield className="w-3 h-3" /> Lockdown
                    </Badge>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {exam.duration_min ?? 0} min
                  </span>
                  <span className="flex items-center gap-1">
                    <Layers className="w-3 h-3" /> {exam.question_count} questions
                  </span>
                  <span className="flex items-center gap-1">
                    <Badge variant="secondary" className="px-2">
                      {exam.total_marks} marks
                    </Badge>
                  </span>
                  {exam.available_from && (
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      Opens {formatDisplayDate(exam.available_from)}
                    </span>
                  )}
                  {exam.available_until && (
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      Closes {formatDisplayDate(exam.available_until)}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onView(exam)}
                  disabled={loadingExamId === exam.id}
                >
                  <Eye className="w-4 h-4 mr-2" /> View
                </Button>

                {!isTeacher && (
                  <Button
                    size="sm"
                    onClick={() => onStart(exam)}
                    disabled={disabledStart || state.label !== "Open" || loadingExamId === exam.id}
                  >
                    {loadingExamId === exam.id ? "Preparing..." : "Start"}
                  </Button>
                )}

                {isTeacher && (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => onDelete(exam.id)}
                    disabled={loadingExamId === exam.id}
                  >
                    <Trash2 className="w-4 h-4 mr-2" /> Delete
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

interface StatTileProps {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: number
}

function StatTile({ icon: Icon, label, value }: StatTileProps) {
  return (
    <Card>
      <CardContent className="flex items-center gap-3 py-4">
        <div className="rounded-lg bg-primary/10 p-3">
          <Icon className="w-5 h-5 text-primary" />
        </div>
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-wide">{label}</p>
          <p className="text-lg font-semibold">{value}</p>
        </div>
      </CardContent>
    </Card>
  )
}

interface InfoRowProps {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: string
}

function InfoRow({ icon: Icon, label, value }: InfoRowProps) {
  return (
    <div className="flex items-center gap-3 rounded-lg border px-3 py-2">
      <Icon className="w-4 h-4 text-muted-foreground" />
      <div className="flex flex-col">
        <span className="text-xs uppercase text-muted-foreground">{label}</span>
        <span className="text-sm font-medium">{value}</span>
      </div>
    </div>
  )
}

function SecurityPlaceholder() {
  return (
    <Card className="border-dashed border-primary/40 bg-primary/5">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-primary" /> Exam Security Enhancements
        </CardTitle>
        <CardDescription>
          Reserve this space for future anti-cheating integrations such as lockdown browser telemetry, AI proctoring, and anomaly detection dashboards.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2 text-sm text-muted-foreground">
        <p>
          You can wire advanced monitoring components here without restructuring the exam tab. Use the hooks in <code>security-monitor.tsx</code> or craft new ones to track browser focus, webcam streams, and collaboration patterns.
        </p>
        <p className="flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          Tip: expose an API endpoint to receive real-time security events and surface summaries in this panel.
        </p>
      </CardContent>
    </Card>
  )
}

function getExamState(exam: DbExam) {
  const now = new Date()
  const start = exam.available_from ? new Date(exam.available_from) : null
  const end = exam.available_until ? new Date(exam.available_until) : null

  if (end && end < now) {
    return { label: "Closed", variant: "outline" as const }
  }

  if (start && start > now) {
    return { label: "Locked", variant: "secondary" as const }
  }

  return { label: "Open", variant: "default" as const }
}

function formatDisplayDate(value: string) {
  try {
    return format(new Date(value), "MMM d, yyyy h:mm a")
  } catch {
    return value
  }
}
