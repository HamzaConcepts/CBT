"use client"

import { createContext, useContext, useEffect, useMemo, useState, ReactNode } from "react"
import type { User } from "@supabase/supabase-js"
import { supabase } from "@/lib/supabaseClient"

type UserContextValue = {
  user: User | null
  isLoading: boolean
}

const UserContext = createContext<UserContextValue | undefined>(undefined)

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let active = true

    const loadUser = async () => {
      try {
        const { data, error } = await supabase.auth.getUser()
        if (!active) return
        if (error) {
          console.error("Failed to fetch user", error)
          setUser(null)
        } else {
          setUser(data.user ?? null)
        }
      } finally {
        if (active) setIsLoading(false)
      }
    }

    loadUser()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      setIsLoading(false)
    })

    return () => {
      active = false
      subscription.unsubscribe()
    }
  }, [])

  const value = useMemo(() => ({ user, isLoading }), [user, isLoading])

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}

export function useUserContext() {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error("useUserContext must be used within a UserProvider")
  }
  return context
}
