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
import { UserPlus } from "lucide-react"

interface JoinClassDialogProps {
  onJoinClass: (joinCode: string) => Promise<void>
  isJoining?: boolean
}

export function JoinClassDialog({ onJoinClass, isJoining = false }: JoinClassDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [joinCode, setJoinCode] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = async () => {
    if (!joinCode.trim()) {
      setError("Please enter a class code")
      return
    }

    setError("")
    
    try {
      await onJoinClass(joinCode.trim().toUpperCase())
      setJoinCode("")
      setError("")
      setIsOpen(false)
    } catch (err: any) {
      setError(err.message || "Failed to join class")
    }
  }

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open)
    if (!open) {
      setError("")
      setJoinCode("")
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
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
                setError("") // Clear error when user types
              }}
              className="text-center text-lg font-mono"
            />
            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}
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
              disabled={isJoining}
              className="flex-1 gradient-primary transition-transform hover:-translate-y-0.5"
            >
              {isJoining ? "Joining..." : "Join Class"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}