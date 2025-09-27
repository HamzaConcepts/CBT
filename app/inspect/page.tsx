"use client"

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function DatabaseInspectPage() {
  const [data, setData] = useState<any>({})
  
  useEffect(() => {
    const inspect = async () => {
      try {
        // Check current user
        const { data: user } = await supabase.auth.getUser()
        
        // Check all profiles
        const { data: profiles, error: profilesError } = await supabase
          .from('profiles')
          .select('*')
        
        // Check classroom memberships with profiles
        const { data: memberships, error: membershipsError } = await supabase
          .from('classroom_memberships')
          .select(`
            *,
            profiles(*)
          `)
        
        // Check auth users table (might not work due to RLS)
        const { data: authUsers, error: authError } = await supabase
          .from('auth.users')
          .select('*')
          .limit(5)
        
        setData({
          currentUser: user,
          profiles: { data: profiles, error: profilesError },
          memberships: { data: memberships, error: membershipsError },
          authUsers: { data: authUsers, error: authError }
        })
      } catch (error: any) {
        console.error('Inspection error:', error)
        setData({ error: error?.message || 'Unknown error' })
      }
    }
    
    inspect()
  }, [])
  
  return (
    <div className="container mx-auto py-8 space-y-6">
      <h1 className="text-3xl font-bold">Database Inspection</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Current User</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="text-xs overflow-auto bg-gray-100 p-4 rounded">
            {JSON.stringify(data.currentUser, null, 2)}
          </pre>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Profiles Table</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="text-xs overflow-auto bg-gray-100 p-4 rounded">
            {JSON.stringify(data.profiles, null, 2)}
          </pre>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Classroom Memberships with Profiles</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="text-xs overflow-auto bg-gray-100 p-4 rounded">
            {JSON.stringify(data.memberships, null, 2)}
          </pre>
        </CardContent>
      </Card>
      
      {data.error && (
        <Card>
          <CardHeader>
            <CardTitle>Error</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="text-xs overflow-auto bg-red-100 p-4 rounded">
              {data.error}
            </pre>
          </CardContent>
        </Card>
      )}
    </div>
  )
}