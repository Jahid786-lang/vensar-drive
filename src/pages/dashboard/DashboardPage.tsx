import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { ServicesPage } from '../services/ServicesPage'

export function DashboardPage() {
  return (
    <DashboardLayout title="Dashboard">
      <ServicesPage />
    </DashboardLayout>
  )
}
