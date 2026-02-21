import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  fetchServices,
  fetchServiceById,
  createService,
  updateService,
  deleteService,
  seedServices,
  type CreateServiceDto,
} from '@/api/servicesApi'

export const SERVICES_QUERY_KEY = ['services']

export function useServices() {
  return useQuery({
    queryKey: SERVICES_QUERY_KEY,
    queryFn: fetchServices,
    staleTime: 1000 * 60 * 2,
  })
}

export function useService(serviceId: string | undefined) {
  return useQuery({
    queryKey: [...SERVICES_QUERY_KEY, serviceId ?? ''],
    queryFn: () => fetchServiceById(serviceId!),
    enabled: !!serviceId,
    staleTime: 1000 * 60 * 2,
  })
}

export function useCreateService() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (dto: CreateServiceDto) => createService(dto),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: SERVICES_QUERY_KEY })
    },
  })
}

export function useUpdateService() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({
      serviceId,
      dto,
    }: {
      serviceId: string
      dto: Partial<CreateServiceDto>
    }) => updateService(serviceId, dto),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: SERVICES_QUERY_KEY })
    },
  })
}

export function useDeleteService() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (serviceId: string) => deleteService(serviceId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: SERVICES_QUERY_KEY })
    },
  })
}

export function useSeedServices() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: seedServices,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: SERVICES_QUERY_KEY })
    },
  })
}
