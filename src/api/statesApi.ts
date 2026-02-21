import { api } from '@/lib/api'

export interface StateItem {
  code: string
  name: string
}

export async function fetchStates(): Promise<StateItem[]> {
  const data = await api.get<StateItem[]>('/states')
  return Array.isArray(data) ? data : []
}
