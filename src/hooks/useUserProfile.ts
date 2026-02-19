import { useQuery } from '@tanstack/react-query'

/**
 * Example React Query hook – replace with real API when backend is ready.
 * Use for server state: user profile, settings, etc.
 */
export function useUserProfile(userId: string | undefined) {
  return useQuery({
    queryKey: ['user', 'profile', userId],
    queryFn: async () => {
      // Placeholder: replace with api.get(`/users/${userId}`)
      await new Promise((r) => setTimeout(r, 300))
      return userId
        ? { id: userId, displayName: null as string | null, avatarUrl: null as string | null }
        : null
    },
    enabled: !!userId,
  })
}
