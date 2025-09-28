"use client"

import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search } from "lucide-react"

type DbClassroom = {
  id: string
  name: string
  subject: string | null
  code: string
  description: string | null
  color: string | null
  teacher_id: string
}

interface ClassroomSectionProps {
  title: string
  description: string
  classrooms: DbClassroom[]
  children?: React.ReactNode
  isLoading?: boolean
}

export function ClassroomSection({ 
  title, 
  description, 
  classrooms, 
  children,
  isLoading = false 
}: ClassroomSectionProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="h-5 bg-gray-200 rounded w-24 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-48 animate-pulse"></div>
          </div>
          <div className="h-6 bg-gray-200 rounded w-8 animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-64 bg-gray-200 rounded-lg animate-pulse"></div>
          ))}
        </div>
      </div>
    )
  }

  if (classrooms.length === 0) {
    return null
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        <Badge variant="secondary">{classrooms.length}</Badge>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {children}
      </div>
    </div>
  )
}

interface SearchBarProps {
  searchTerm: string
  onSearch: (term: string) => void
  placeholder?: string
}

export function SearchBar({ searchTerm, onSearch, placeholder = "Search classes..." }: SearchBarProps) {
  return (
    <div className="relative max-w-md">
      <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder={placeholder}
        value={searchTerm}
        onChange={(e) => onSearch(e.target.value)}
        className="pl-10"
      />
    </div>
  )
}