import { useEffect } from 'react'
import useSWR from 'swr'
import { supabase } from '@/lib/supabaseClient'

export function useCurrentUser() {
  const { data: user, isLoading, mutate } = useSWR(
    'current-user',
    async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser()
        if (error) throw error
        return user
      } catch (error) {
        console.error('Error fetching user:', error)
        return null
      }
    },
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 60000, // Cache for 1 minute
    }
  )

  useEffect(() => {
    // Listen for auth changes and update SWR cache
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        mutate(session?.user ?? null, false)
      }
    )

    return () => subscription.unsubscribe()
  }, [mutate])

  return { user: user ?? null, isLoading }
}