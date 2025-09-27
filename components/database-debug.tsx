"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"

export default function DatabaseDebug() {
  const [debug, setDebug] = useState<any>({})
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    async function runDebugChecks() {
      try {
        // Check auth
        const { data: authData, error: authError } = await supabase.auth.getSession()
        setUser(authData.session?.user)

        const debugInfo: any = {
          auth: {
            user: authData.session?.user?.id || "No user",
            error: authError?.message || "No auth error"
          }
        }

        if (authData.session?.user) {
          // Check profiles table
          const { data: profiles, error: profilesError } = await supabase
            .from('profiles')
            .select('*')
            .limit(1)

          debugInfo.profiles = {
            count: profiles?.length || 0,
            error: profilesError?.message || "No error"
          }

          // Check classrooms table
          const { data: classrooms, error: classroomsError } = await supabase
            .from('classrooms')
            .select('*')
            .limit(1)

          debugInfo.classrooms = {
            count: classrooms?.length || 0,
            error: classroomsError?.message || "No error"
          }

          // Check classroom_memberships table
          const { data: memberships, error: membershipsError } = await supabase
            .from('classroom_memberships')
            .select('*')
            .limit(1)

          debugInfo.memberships = {
            count: memberships?.length || 0,
            error: membershipsError?.message || "No error"
          }
        }

        setDebug(debugInfo)
      } catch (error) {
        setDebug({ error: (error as Error).message })
      }
    }

    runDebugChecks()
  }, [])

  return (
    <div className="p-4 bg-gray-100 rounded-lg">
      <h2 className="text-lg font-bold mb-4">Database Debug Info</h2>
      <pre className="text-sm overflow-auto">
        {JSON.stringify(debug, null, 2)}
      </pre>
      
      {user && (
        <div className="mt-4">
          <h3 className="font-bold">User Info:</h3>
          <p>ID: {user.id}</p>
          <p>Email: {user.email}</p>
        </div>
      )}
    </div>
  )
}