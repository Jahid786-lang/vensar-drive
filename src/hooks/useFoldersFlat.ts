import { useQuery } from '@tanstack/react-query'
import { fetchFolders } from '@/api/folders'
import { getMockFlatFolders } from '@/api/folders'

export function useFoldersFlat() {
  return useQuery({
    queryKey: ['folders', 'flat'],
    queryFn: async () => {
      try {
        return await fetchFolders()
      } catch {
        return getMockFlatFolders()
      }
    },
    staleTime: 1000 * 60 * 2,
  })
}
