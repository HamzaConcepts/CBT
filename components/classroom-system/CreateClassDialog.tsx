"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, GraduationCap, Sparkles } from "lucide-react"
import { useGenerateClassCode } from "@/hooks/useClassroomSystem"

interface CreateClassDialogProps {
  onCreateClass: (classData: {
    name: string
    subject: string
    description?: string
    code?: string
  }) => Promise<void>
  isCreating?: boolean
}

export function CreateClassDialog({ onCreateClass, isCreating = false }: CreateClassDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [newClass, setNewClass] = useState({
    name: "",
    subject: "",
    description: "",
    code: "",
  })
  
  const { generateCode } = useGenerateClassCode()

  const handleGenerateCode = () => {
    const code = generateCode()
    setNewClass((prev) => ({ ...prev, code }))
  }

  const handleSubmit = async () => {
    if (!newClass.name || !newClass.subject) return
    
    try {
      await onCreateClass(newClass)
      setNewClass({ name: "", subject: "", description: "", code: "" })
      setIsOpen(false)
    } catch (error) {
      console.error("Failed to create class:", error)
      // Error handling will be implemented in the parent component
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
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
              <Button 
                type="button" 
                variant="outline" 
                className="transition-colors hover:border-primary" 
                onClick={handleGenerateCode}
              >
                <Sparkles className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button 
              variant="outline" 
              onClick={() => setIsOpen(false)} 
              className="flex-1 transition-colors hover:border-primary"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit} 
              disabled={isCreating || !newClass.name || !newClass.subject}
              className="flex-1 gradient-primary transition-transform hover:-translate-y-0.5"
            >
              {isCreating ? "Creating..." : "Create Class"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}