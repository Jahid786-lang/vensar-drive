import { api } from '@/lib/api'

export interface ServiceItem {
  id: string
  serviceId: string
  serviceName: string
  serviceIcon: string | null
  description: string | null
  createdAt?: string
  updatedAt?: string
}

export interface CreateServiceDto {
  serviceId: string
  serviceName: string
  serviceIcon?: string | null
  description?: string | null
}

export async function fetchServices(): Promise<ServiceItem[]> {
  const data = await api.get<ServiceItem[]>('/services')
  return Array.isArray(data) ? data : []
}

export async function fetchServiceById(serviceId: string): Promise<ServiceItem> {
  return api.get<ServiceItem>(`/services/${encodeURIComponent(serviceId)}`)
}

export async function createService(dto: CreateServiceDto): Promise<ServiceItem> {
  return api.post<ServiceItem>('/services', dto)
}

export async function updateService(
  serviceId: string,
  dto: Partial<CreateServiceDto>,
): Promise<ServiceItem> {
  return api.patch<ServiceItem>(`/services/${encodeURIComponent(serviceId)}`, dto)
}

export async function deleteService(serviceId: string): Promise<void> {
  await api.delete(`/services/${encodeURIComponent(serviceId)}`)
}

export async function seedServices(): Promise<{ success: boolean; seeded: number }> {
  return api.post<{ success: boolean; seeded: number }>('/services/seed')
}
