/**
 * User types for users API (GET /users response and CRUD).
 */

import type { UserRole } from '@/constants/roles'

export interface UserListItem {
  _id: string
  id: string
  email: string
  name: string
  role: UserRole
  avatar: string | null
  mobile: string | null
  address: string | null
  designation: string | null
  isActive: boolean
  canCreateAdmin: boolean
  canChangeRole: boolean
  createdBy: string | null
  createdByName: string | null
  updatedBy: string | null
  createdAt: string
  updatedAt: string
}

export interface CreateUserDto {
  name: string
  email: string
  password: string
  mobile?: string
  role: UserRole
  address?: string
  designation?: string
}

export interface UpdateUserDto {
  name?: string
  email?: string
  mobile?: string
  role?: UserRole
  address?: string
  designation?: string
  isActive?: boolean
}
