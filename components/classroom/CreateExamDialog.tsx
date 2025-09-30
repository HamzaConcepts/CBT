"use client"

import { useMemo, useState } from "react"
import { nanoid } from "nanoid"
import { supabase } from "@/lib/supabaseClient"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { FileText, Plus, Trash2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

const DEFAULT_EXAM = {
  title: "",
  description: "",
  durationMin: 60,
  availableFrom: "",
  availableUntil: "",
  maxAttempts: 1,
  lockOnStart: true,
}

interface CreateQuestion {
  id: string
  type: "mcq" | "text"
  prompt: string
  points: number
  options: string[]
  correctOption: number | null
  correctTextAnswer: string
}

interface CreateExamDialogProps {
  classroomId: string
  userId?: string
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onExamCreated?: () => void
}

export function CreateExamDialog({
  classroomId,
  userId,
  isOpen,
  onOpenChange,
  onExamCreated,
}: CreateExamDialogProps) {
  const { toast } = useToast()

  const [newExam, setNewExam] = useState(() => ({ ...DEFAULT_EXAM }))
  const [newQuestions, setNewQuestions] = useState<CreateQuestion[]>([])
  const [isSavingExam, setIsSavingExam] = useState(false)

  const totalMarks = useMemo(
    () => newQuestions.reduce((sum, question) => sum + (Number.isFinite(question.points) ? question.points : 0), 0),
    [newQuestions]
  )

  const handleAddQuestion = (type: "mcq" | "text") => {
    setNewQuestions((prev) => [
      ...prev,
      {
        id: nanoid(),
        type,
        prompt: "",
        points: type === "text" ? 10 : 5,
        options: type === "mcq" ? ["", "", "", ""] : [],
        correctOption: type === "mcq" ? 0 : null,
        correctTextAnswer: "",
      },
    ])
  }

  const handleUpdateQuestion = (id: string, updates: Partial<CreateQuestion>) => {
    setNewQuestions((prev) => prev.map((question) => (question.id === id ? { ...question, ...updates } : question)))
  }

  const handleUpdateOption = (questionId: string, index: number, value: string) => {
    setNewQuestions((prev) =>
      prev.map((question) => {
        if (question.id !== questionId) return question
        const options = [...question.options]
        options[index] = value
        return { ...question, options }
      })
    )
  }

  const handleAddOption = (questionId: string) => {
    setNewQuestions((prev) =>
      prev.map((question) =>
        question.id === questionId ? { ...question, options: [...question.options, ""] } : question
      )
    )
  }

  const handleRemoveOption = (questionId: string, index: number) => {
    setNewQuestions((prev) =>
      prev.map((question) => {
        if (question.id !== questionId) return question
        const options = question.options.filter((_, optionIndex) => optionIndex !== index)
        const correctOption =
          question.correctOption !== null && question.correctOption === index
            ? null
            : question.correctOption !== null && question.correctOption > index
              ? question.correctOption - 1
              : question.correctOption
        return { ...question, options, correctOption }
      })
    )
  }

  const handleRemoveQuestion = (id: string) => {
    setNewQuestions((prev) => prev.filter((question) => question.id !== id))
  }

  const resetCreateForm = () => {
    setNewExam({ ...DEFAULT_EXAM })
    setNewQuestions([])
  }

  const handleCreateExam = async () => {
    if (!newExam.title.trim()) {
      toast({
        title: "Enter an exam title",
        description: "Give the exam a title before saving.",
        variant: "destructive",
      })
      return
    }

    if (newQuestions.length === 0) {
      toast({
        title: "Add at least one question",
        description: "Include at least one question before publishing the exam.",
        variant: "destructive",
      })
      return
    }

    for (const question of newQuestions) {
      if (!question.prompt.trim()) {
        toast({
          title: "Question prompt missing",
          description: "Every question needs a prompt before saving.",
          variant: "destructive",
        })
        return
      }
      if (question.type === "mcq") {
        const filledOptions = question.options.filter((option) => option.trim())
        if (filledOptions.length < 2) {
          toast({
            title: "More options needed",
            description: "Multiple choice questions need at least two answer options.",
            variant: "destructive",
          })
          return
        }
        if (question.correctOption === null || !question.options[question.correctOption]?.trim()) {
          toast({
            title: "Select a correct option",
            description: "Choose which option is correct for each MCQ.",
            variant: "destructive",
          })
          return
        }
      }
    }

    try {
      setIsSavingExam(true)

      const totalMarksCalculated = newQuestions.reduce((sum, question) => sum + question.points, 0)
      const availableFrom = newExam.availableFrom ? new Date(newExam.availableFrom).toISOString() : null
      const availableUntil = newExam.availableUntil ? new Date(newExam.availableUntil).toISOString() : null
      const now = new Date()
      const status = determineExamStatus(availableFrom, availableUntil, now)

      const { data: examInsert, error: examError } = await supabase
        .from("exams")
        .insert({
          classroom_id: classroomId,
          created_by: userId ?? null,
          title: newExam.title.trim(),
          description: newExam.description.trim() || null,
          type: "QUIZ",
          duration_min: newExam.durationMin,
          question_count: newQuestions.length,
          total_marks: totalMarksCalculated,
          status,
          available_from: availableFrom,
          available_until: availableUntil,
          max_attempts: newExam.maxAttempts,
          lock_on_start: newExam.lockOnStart,
        })
        .select("id")
        .single()

      if (examError || !examInsert) throw examError

      const { data: insertedQuestions, error: questionError } = await supabase
        .from("exam_questions")
        .insert(
          newQuestions.map((question, index) => ({
            exam_id: examInsert.id,
            prompt: question.prompt.trim(),
            question_type: question.type,
            options: question.type === "mcq" ? question.options.map((option) => option.trim()) : null,
            points: question.points,
            sort_order: index + 1,
          }))
        )
        .select("id")

      if (questionError) throw questionError

      if (insertedQuestions && insertedQuestions.length) {
        const answerPayload = insertedQuestions.map((row: { id: string }, index) => {
          const question = newQuestions[index]
          return {
            question_id: row.id,
            correct_option_index: question.type === "mcq" ? question.correctOption : null,
            correct_text_answer: question.type === "text" ? question.correctTextAnswer.trim() || null : null,
          }
        })

        const { error: answersError } = await supabase.from("exam_question_answers").insert(answerPayload)

        if (answersError) throw answersError
      }

      toast({
        title: "Exam created",
        description: `${newExam.title} is ready for the class.`,
      })

      onOpenChange(false)
      resetCreateForm()
      onExamCreated?.()
    } catch (error: unknown) {
      console.error("Failed to create exam", error)
      toast({
        title: "Could not create exam",
        description: resolveErrorMessage(error, "Please try again."),
        variant: "destructive",
      })
    } finally {
      setIsSavingExam(false)
    }
  }

  const handleDialogChange = (open: boolean) => {
    onOpenChange(open)
    if (!open) {
      resetCreateForm()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleDialogChange}>
      <DialogContent className="max-w-none w-full sm:max-w-[90vw] lg:max-w-[1150px] xl:max-w-[1280px]">
        <DialogHeader>
          <DialogTitle>Create Exam</DialogTitle>
        </DialogHeader>
        <div className="space-y-6 overflow-y-auto max-h-[70vh] pr-2">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="exam-title">Title</Label>
              <Input
                id="exam-title"
                value={newExam.title}
                onChange={(event) => setNewExam((prev) => ({ ...prev, title: event.target.value }))}
                placeholder="e.g. Algebra Mastery Check"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="exam-duration">Duration (minutes)</Label>
              <Input
                id="exam-duration"
                type="number"
                min={5}
                value={newExam.durationMin}
                onChange={(event) =>
                  setNewExam((prev) => ({ ...prev, durationMin: Number(event.target.value) }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="available-from">Available From</Label>
              <Input
                id="available-from"
                type="datetime-local"
                value={newExam.availableFrom}
                onChange={(event) =>
                  setNewExam((prev) => ({ ...prev, availableFrom: event.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="available-until">Available Until</Label>
              <Input
                id="available-until"
                type="datetime-local"
                value={newExam.availableUntil}
                onChange={(event) =>
                  setNewExam((prev) => ({ ...prev, availableUntil: event.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="max-attempts">Max Attempts</Label>
              <Input
                id="max-attempts"
                type="number"
                min={1}
                value={newExam.maxAttempts}
                onChange={(event) =>
                  setNewExam((prev) => ({ ...prev, maxAttempts: Number(event.target.value) || 1 }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                Lockdown on start
                <Switch
                  checked={newExam.lockOnStart}
                  onCheckedChange={(checked) =>
                    setNewExam((prev) => ({ ...prev, lockOnStart: checked }))
                  }
                />
              </Label>
              <p className="text-xs text-muted-foreground">
                When enabled, the exam will engage secure mode when the student begins.
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="exam-description">Instructions</Label>
            <Textarea
              id="exam-description"
              value={newExam.description}
              onChange={(event) =>
                setNewExam((prev) => ({ ...prev, description: event.target.value }))
              }
              placeholder="Provide exam guidelines, allowed materials, or proctoring instructions."
              rows={4}
            />
          </div>

          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold">Questions ({newQuestions.length})</h4>
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={() => handleAddQuestion("text")}
                className="text-sm">
                <FileText className="w-4 h-4 mr-2" />
                Add Text Question
              </Button>
              <Button type="button" onClick={() => handleAddQuestion("mcq")} className="text-sm">
                <Plus className="w-4 h-4 mr-2" />
                Add MCQ
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            {newQuestions.map((question, questionIndex) => (
              <Card key={question.id}>
                <CardHeader className="flex flex-row items-start justify-between gap-4">
                  <div className="space-y-1">
                    <CardTitle className="text-base flex items-center gap-2">
                      Question {questionIndex + 1}
                      <Badge variant="secondary" className="capitalize">
                        {question.type === "mcq" ? "Multiple choice" : "Text response"}
                      </Badge>
                    </CardTitle>
                    <CardDescription>
                      <span className="font-medium">{question.points}</span> points
                    </CardDescription>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveQuestion(question.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Prompt</Label>
                    <Textarea
                      value={question.prompt}
                      onChange={(event) => handleUpdateQuestion(question.id, { prompt: event.target.value })}
                      placeholder="Ask the question the way you would present it to students."
                      rows={3}
                    />
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Points</Label>
                      <Input
                        type="number"
                        min={1}
                        value={question.points}
                        onChange={(event) =>
                          handleUpdateQuestion(question.id, { points: Number(event.target.value) || 0 })
                        }
                      />
                    </div>
                    {question.type === "mcq" && (
                      <div className="space-y-2">
                        <Label>Correct Option</Label>
                        <select
                          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                          value={question.correctOption ?? undefined}
                          onChange={(event) =>
                            handleUpdateQuestion(question.id, {
                              correctOption: Number(event.target.value),
                            })
                          }
                        >
                          {question.options.map((_, optionIndex) => (
                            <option key={`${question.id}-opt-${optionIndex}`} value={optionIndex}>
                              Option {optionIndex + 1}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>

                  {question.type === "mcq" ? (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label>Options</Label>
                        <Button variant="ghost" size="sm" onClick={() => handleAddOption(question.id)}>
                          <Plus className="w-4 h-4 mr-2" /> Add option
                        </Button>
                      </div>
                      <div className="space-y-2">
                        {question.options.map((option, optionIndex) => (
                          <div key={`${question.id}-option-${optionIndex}`} className="flex items-center gap-2">
                            <Input
                              value={option}
                              onChange={(event) => handleUpdateOption(question.id, optionIndex, event.target.value)}
                              placeholder={`Option ${optionIndex + 1}`}
                            />
                            {question.options.length > 2 && (
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => handleRemoveOption(question.id, optionIndex)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Label>Reference Answer (optional)</Label>
                      <Textarea
                        value={question.correctTextAnswer}
                        onChange={(event) =>
                          handleUpdateQuestion(question.id, { correctTextAnswer: event.target.value })
                        }
                        placeholder="Store an exemplar answer or marking guide."
                        rows={3}
                      />
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}

            {newQuestions.length === 0 && (
              <Card>
                <CardContent className="py-6 text-center text-sm text-muted-foreground">
                  Add questions to start building the exam.
                </CardContent>
              </Card>
            )}
          </div>

          <div className="flex items-center justify-between border rounded-lg bg-muted/30 p-4">
            <div>
              <p className="font-semibold">Total Marks</p>
              <p className="text-sm text-muted-foreground">
                Calculated from the sum of all question points.
              </p>
            </div>
            <Badge variant="secondary" className="text-lg px-4 py-2">
              {totalMarks}
            </Badge>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2">
          <Button
            variant="outline"
            onClick={() => handleDialogChange(false)}
            disabled={isSavingExam}
          >
            Cancel
          </Button>
          <Button onClick={handleCreateExam} disabled={isSavingExam}>
            {isSavingExam ? "Saving..." : "Save Exam"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

const resolveErrorMessage = (error: unknown, fallback: string): string =>
  error instanceof Error ? error.message : fallback

function determineExamStatus(
  availableFrom: string | null,
  availableUntil: string | null,
  now: Date
) {
  const start = availableFrom ? new Date(availableFrom) : null
  const end = availableUntil ? new Date(availableUntil) : null

  if (start && start > now) return "scheduled"
  if (end && end < now) return "closed"
  return "open"
}
