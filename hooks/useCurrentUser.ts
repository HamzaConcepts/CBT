import { useUserContext } from '@/components/providers/user-provider'

export function useCurrentUser() {
  const { user, isLoading } = useUserContext()
  return { user, isLoading }
}