import { useQuery } from '@tanstack/react-query'
import { fetchFolderTree } from '@/api/folders'
import { getMockFlatFolders } from '@/api/folders'
import { buildFolderTree } from '@/types/folder'

/** Backend se folder tree laata hai. Fail hone par mock use hota hai. */
export function useFolders() {
  return useQuery({
    queryKey: ['folders', 'tree'],
    queryFn: async () => {
      try {
        return await fetchFolderTree()
      } catch {
        return buildFolderTree(getMockFlatFolders())
      }
    },
    staleTime: 1000 * 60 * 2,
  })
}
