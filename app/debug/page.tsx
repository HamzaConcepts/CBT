"use client"

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { AlertCircle, CheckCircle, XCircle } from 'lucide-react'

export default function DebugPage() {
  const [results, setResults] = useState<any>({})
  const [loading, setLoading] = useState(false)

  const runTests = async () => {
    setLoading(true)
    const testResults: any = {}

    try {
      // Test 1: Check authentication
      const { data: session, error: sessionError } = await supabase.auth.getSession()
      testResults.auth = {
        success: !!session?.session?.user,
        user: session?.session?.user,
        error: sessionError?.message
      }

      if (session?.session?.user) {
        const userId = session.session.user.id

        // Test 2: Check if profile exists
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', userId)
          .single()

        testResults.profile = {
          success: !!profile,
          data: profile,
          error: profileError?.message
        }

        // Test 3: Try to create profile if it doesn't exist
        if (!profile) {
          const { data: newProfile, error: createError } = await supabase
            .from('profiles')
            .insert([{
              user_id: userId,
              name: session.session.user.user_metadata?.full_name || session.session.user.email?.split('@')[0],
              email: session.session.user.email,
              role: 'STUDENT'
            }])
            .select()
            .single()

          testResults.profileCreation = {
            success: !!newProfile,
            data: newProfile,
            error: createError?.message
          }
        }

        // Test 4: Check classrooms access
        const { data: classrooms, error: classroomsError } = await supabase
          .from('classrooms')
          .select('*')

        testResults.classrooms = {
          success: !classroomsError,
          count: classrooms?.length || 0,
          data: classrooms,
          error: classroomsError?.message
        }

        // Test 5: Check classroom_memberships access
        const { data: memberships, error: membershipsError } = await supabase
          .from('classroom_memberships')
          .select('*')
          .eq('user_id', userId)

        testResults.memberships = {
          success: !membershipsError,
          count: memberships?.length || 0,
          data: memberships,
          error: membershipsError?.message
        }

        // Test 6: Try creating a test classroom
        const { data: testClassroom, error: createClassroomError } = await supabase
          .from('classrooms')
          .insert([{
            name: 'Debug Test Class',
            subject: 'Testing',
            code: 'DEBUG' + Date.now().toString().slice(-4),
            teacher_id: userId,
            description: 'This is a test classroom for debugging'
          }])
          .select()
          .single()

        testResults.createClassroom = {
          success: !!testClassroom,
          data: testClassroom,
          error: createClassroomError?.message
        }

        // Clean up test classroom
        if (testClassroom) {
          await supabase
            .from('classrooms')
            .delete()
            .eq('id', testClassroom.id)
        }
      }

    } catch (error: any) {
      testResults.globalError = error.message
    }

    setResults(testResults)
    setLoading(false)
  }

  useEffect(() => {
    runTests()
  }, [])

  const StatusIcon = ({ success }: { success: boolean }) => {
    return success ? (
      <CheckCircle className="w-5 h-5 text-green-500" />
    ) : (
      <XCircle className="w-5 h-5 text-red-500" />
    )
  }

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Database Debug</h1>
        <Button onClick={runTests} disabled={loading}>
          {loading ? 'Testing...' : 'Run Tests Again'}
        </Button>
      </div>

      {Object.keys(results).length > 0 && (
        <div className="grid gap-4">
          {/* Authentication Test */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <StatusIcon success={results.auth?.success} />
                Authentication Test
              </CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="text-sm bg-gray-100 p-4 rounded overflow-auto">
                {JSON.stringify(results.auth, null, 2)}
              </pre>
            </CardContent>
          </Card>

          {/* Profile Test */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <StatusIcon success={results.profile?.success} />
                Profile Test
              </CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="text-sm bg-gray-100 p-4 rounded overflow-auto">
                {JSON.stringify(results.profile, null, 2)}
              </pre>
            </CardContent>
          </Card>

          {/* Profile Creation Test */}
          {results.profileCreation && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <StatusIcon success={results.profileCreation?.success} />
                  Profile Creation Test
                </CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="text-sm bg-gray-100 p-4 rounded overflow-auto">
                  {JSON.stringify(results.profileCreation, null, 2)}
                </pre>
              </CardContent>
            </Card>
          )}

          {/* Classrooms Test */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <StatusIcon success={results.classrooms?.success} />
                Classrooms Test
              </CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="text-sm bg-gray-100 p-4 rounded overflow-auto">
                {JSON.stringify(results.classrooms, null, 2)}
              </pre>
            </CardContent>
          </Card>

          {/* Create Classroom Test */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <StatusIcon success={results.createClassroom?.success} />
                Create Classroom Test
              </CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="text-sm bg-gray-100 p-4 rounded overflow-auto">
                {JSON.stringify(results.createClassroom, null, 2)}
              </pre>
            </CardContent>
          </Card>

          {/* Global Error */}
          {results.globalError && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-red-500" />
                  Global Error
                </CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="text-sm bg-red-100 p-4 rounded overflow-auto">
                  {results.globalError}
                </pre>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  )
}