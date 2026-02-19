import { createSlice } from '@reduxjs/toolkit'
import BoltOutlined from '@mui/icons-material/BoltOutlined'
import type { ServiceItemRecord, ServiceItem } from '@/data/servicesData'
import { initialServicesList, iconRegistry } from '@/data/servicesData'

function slugify(text: string): string {
  return text
    .trim()
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function uniqueId(baseId: string, existingIds: Set<string>): string {
  let id = baseId
  let n = 0
  while (existingIds.has(id)) {
    n += 1
    id = `${baseId}-${n}`
  }
  return id
}

interface ServicesState {
  list: ServiceItemRecord[]
}

const initialState: ServicesState = {
  list: initialServicesList,
}

export const servicesSlice = createSlice({
  name: 'services',
  initialState,
  reducers: {
    addService(
      state,
      action: { payload: { label: string; iconId: string } },
    ) {
      const { label, iconId } = action.payload
      const baseId = slugify(label) || 'service'
      const existingIds = new Set(state.list.map((s) => s.id))
      const id = uniqueId(baseId, existingIds)
      state.list.push({ id, label: label.trim(), iconId })
    },
  },
})

export const { addService } = servicesSlice.actions

export function selectServicesList(state: { services: ServicesState }): ServiceItem[] {
  const list = state.services.list
  return list.map((r) => ({
    id: r.id,
    label: r.label,
    icon: iconRegistry[r.iconId] ?? BoltOutlined,
  }))
}
