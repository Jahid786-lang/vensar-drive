/**
 * Sidebar menu config per role. Single source of truth for nav items.
 * Add or remove items per role here; DashboardSidebar only renders this config.
 */
import type { UserRole } from '@/constants/roles'
import BuildOutlined from '@mui/icons-material/BuildOutlined'
import DescriptionOutlined from '@mui/icons-material/DescriptionOutlined'
import ScheduleOutlined from '@mui/icons-material/ScheduleOutlined'
import type { SvgIconComponent } from '@mui/icons-material'

export interface SidebarNavItem {
  id: string
  label: string
  icon: SvgIconComponent
  path?: string
  pathPrefix?: string
  /** Sub-items (e.g. dropdown). If present, path is used for "active" when any child matches. */
  children?: SidebarNavItem[]
  /** Roles that see this item. If omitted, all authenticated roles see it. */
  roles?: UserRole[]
}

/** Shared items shown for all roles (e.g. Recent). */
export const sharedNavItems: SidebarNavItem[] = [
  { id: 'recent', label: 'Recent', icon: ScheduleOutlined, path: '/recent' },
]

function baseMainItems(_role: UserRole): SidebarNavItem[] {
  const items: SidebarNavItem[] = [
    {
      id: 'services',
      label: 'Services',
      icon: BuildOutlined,
      path: '/',
      pathPrefix: '/services',
    },
    {
      id: 'my-documents',
      label: 'My Documents',
      icon: DescriptionOutlined,
      path: '/documents',
    },
  ]

  // if (_role === 'super_admin' || _role === 'admin') {
  //   return [servicesWithDropdown, usersWithDropdown, items[1]]
  // }

  return items
}

export interface SidebarConfig {
  mainItems: SidebarNavItem[]
  sharedItems: SidebarNavItem[]
}

/**
 * Returns sidebar config for the given role. Use in DashboardSidebar.
 */
export function getSidebarConfig(role: UserRole | undefined): SidebarConfig {
  const r = role ?? 'user'
  return {
    mainItems: baseMainItems(r),
    sharedItems: sharedNavItems,
  }
}
