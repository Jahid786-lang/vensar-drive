import { api } from '@/lib/api'

export interface MajorComponent {
  srNo: number
  component: string
  qty: number
}

export interface CustomField {
  label: string
  value: string
}

export interface ProjectItem {
  id: string
  projectId: string
  serviceId: string
  name: string
  shortName: string | null
  stateCode: string
  title: string | null
  workScope: string | null
  majorComponents: MajorComponent[]
  customFields: CustomField[]
  createdAt?: string
  updatedAt?: string
}

export interface CreateProjectDto {
  projectId: string
  name: string
  shortName?: string | null
  stateCode: string
  title?: string | null
  workScope?: string | null
  majorComponents?: MajorComponent[]
  customFields?: CustomField[]
}

export async function fetchProjectsByService(
  serviceId: string,
): Promise<ProjectItem[]> {
  const data = await api.get<ProjectItem[]>(
    `/projects?serviceId=${encodeURIComponent(serviceId)}`,
  )
  return Array.isArray(data) ? data : []
}

export async function fetchProject(
  serviceId: string,
  projectId: string,
): Promise<ProjectItem> {
  return api.get<ProjectItem>(
    `/projects/${encodeURIComponent(serviceId)}/${encodeURIComponent(projectId)}`,
  )
}

export async function createProject(
  serviceId: string,
  dto: CreateProjectDto,
): Promise<ProjectItem> {
  return api.post<ProjectItem>(
    `/projects/${encodeURIComponent(serviceId)}`,
    dto,
  )
}

export async function updateProject(
  serviceId: string,
  projectId: string,
  dto: Partial<CreateProjectDto>,
): Promise<ProjectItem> {
  return api.patch<ProjectItem>(
    `/projects/${encodeURIComponent(serviceId)}/${encodeURIComponent(projectId)}`,
    dto,
  )
}

export async function deleteProject(
  serviceId: string,
  projectId: string,
): Promise<void> {
  return api.delete(
    `/projects/${encodeURIComponent(serviceId)}/${encodeURIComponent(projectId)}`,
  )
}

export async function seedIrrigationProject(): Promise<{ success: boolean; seeded: number }> {
  return api.post<{ success: boolean; seeded: number }>('/projects/seed/irrigation')
}
