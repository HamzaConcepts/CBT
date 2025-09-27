"use client"

import { useEffect } from "react"
import { supabase } from "@/lib/supabaseClient"

export default function AuthCallback() {
  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Get the current URL hash and search params
        const { data, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error("Auth callback error:", error)
          window.location.href = "/?error=" + encodeURIComponent(error.message)
          return
        }

        if (data.session?.user) {
          // User is authenticated, redirect to dashboard
          window.location.href = "/dashboard"
        } else {
          // No session, redirect to home
          window.location.href = "/"
        }
      } catch (error) {
        console.error("Callback handling error:", error)
        window.location.href = "/?error=callback_error"
      }
    }

    handleAuthCallback()
  }, [])

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p>Confirming your email...</p>
      </div>
    </div>
  )
}