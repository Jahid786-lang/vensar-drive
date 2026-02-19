/**
 * Role constants and helpers. Single source of truth for role values.
 * Used by sidebar config, route guards, and auth.
 */
export const ROLE_SUPER_ADMIN = 'super_admin'
export const ROLE_ADMIN = 'admin'
export const ROLE_USER = 'user'

export type UserRole = typeof ROLE_SUPER_ADMIN | typeof ROLE_ADMIN | typeof ROLE_USER

export const ROLES: UserRole[] = [ROLE_SUPER_ADMIN, ROLE_ADMIN, ROLE_USER]

export function isSuperAdmin(role: string | undefined): role is typeof ROLE_SUPER_ADMIN {
  return role === ROLE_SUPER_ADMIN
}

export function isAdminOrAbove(role: string | undefined): boolean {
  return role === ROLE_SUPER_ADMIN || role === ROLE_ADMIN
}

/** Roles that this actor can assign when creating a user. Super admin: all; Admin: only user (and future non-admin roles). */
export function rolesCreatableBy(actorRole: UserRole | undefined): UserRole[] {
  if (actorRole === ROLE_SUPER_ADMIN) return [ROLE_SUPER_ADMIN, ROLE_ADMIN, ROLE_USER]
  if (actorRole === ROLE_ADMIN) return [ROLE_USER]
  return []
}

export function isValidRole(role: string): role is UserRole {
  return ROLES.includes(role as UserRole)
}
