import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  fetchProjectsByService,
  fetchProject,
  createProject,
  updateProject,
  deleteProject,
  seedIrrigationProject,
  type CreateProjectDto,
} from '@/api/projectsApi'

export const PROJECTS_QUERY_KEY = ['projects']

export function useProjects(serviceId: string | undefined) {
  return useQuery({
    queryKey: [...PROJECTS_QUERY_KEY, serviceId ?? ''],
    queryFn: () => fetchProjectsByService(serviceId!),
    enabled: !!serviceId,
    staleTime: 1000 * 60 * 2,
  })
}

export function useProject(serviceId: string | undefined, projectId: string | undefined) {
  return useQuery({
    queryKey: [...PROJECTS_QUERY_KEY, serviceId ?? '', projectId ?? ''],
    queryFn: () => fetchProject(serviceId!, projectId!),
    enabled: !!serviceId && !!projectId,
    staleTime: 1000 * 60 * 2,
  })
}

export function useCreateProject(serviceId: string | undefined) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (dto: CreateProjectDto) => createProject(serviceId!, dto),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: PROJECTS_QUERY_KEY })
    },
  })
}

export function useUpdateProject(serviceId: string | undefined, projectId: string | undefined) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (dto: Partial<CreateProjectDto>) =>
      updateProject(serviceId!, projectId!, dto),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: PROJECTS_QUERY_KEY })
    },
  })
}

export function useDeleteProject(serviceId: string | undefined) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (projectId: string) => deleteProject(serviceId!, projectId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: PROJECTS_QUERY_KEY })
    },
  })
}

export function useSeedIrrigationProject() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: seedIrrigationProject,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: PROJECTS_QUERY_KEY })
    },
  })
}
