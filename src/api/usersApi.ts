/**
 * Users API: list, create, update, delete, toggle active.
 */

import { apiClient } from './client'
import type { UserListItem, CreateUserDto, UpdateUserDto } from './types/user.types'

const USERS_PREFIX = '/users' as const

export type { UserListItem, CreateUserDto, UpdateUserDto }

/** GET /users – list all users (admin/super_admin only). */
export async function getUsers(): Promise<UserListItem[]> {
  const { data } = await apiClient.get<UserListItem[]>(USERS_PREFIX)
  return data
}

/** POST /users – create a new user. */
export async function createUser(payload: CreateUserDto): Promise<UserListItem> {
  const { data } = await apiClient.post<UserListItem>(USERS_PREFIX, payload)
  return data
}

/** PATCH /users/:id – update user. */
export async function updateUser(id: string, payload: UpdateUserDto): Promise<UserListItem> {
  const { data } = await apiClient.patch<UserListItem>(`${USERS_PREFIX}/${id}`, payload)
  return data
}

/** DELETE /users/:id – delete user. */
export async function deleteUser(id: string): Promise<void> {
  await apiClient.delete(`${USERS_PREFIX}/${id}`)
}

/** PATCH /users/:id – toggle isActive. */
export async function toggleUserActive(id: string, isActive: boolean): Promise<UserListItem> {
  const { data } = await apiClient.patch<UserListItem>(`${USERS_PREFIX}/${id}`, { isActive })
  return data
}
