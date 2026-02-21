import { useQuery } from '@tanstack/react-query'
import { fetchStates } from '@/api/statesApi'

export const STATES_QUERY_KEY = ['states']

export function useStates() {
  return useQuery({
    queryKey: STATES_QUERY_KEY,
    queryFn: fetchStates,
    staleTime: 1000 * 60 * 60,
  })
}
