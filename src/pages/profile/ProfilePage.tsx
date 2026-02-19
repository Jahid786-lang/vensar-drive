import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { useAuth } from '@/contexts/AuthContext'
import { UserProfileCard } from '@/components/user/UserProfileCard'

export function ProfilePage() {
  const { user } = useAuth()
console.log("user>>>", user)
  if (!user) {
    return (
      <DashboardLayout>
        <Box sx={{ p: 3 }}>
          <Typography color="text.secondary">Not logged in.</Typography>
        </Box>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <Box sx={{ maxWidth: 480, mx: 'auto', p: { xs: 2, sm: 3 } }}>
        <Typography variant="h5" sx={{ fontWeight: 600, mb: 2, color: 'primary.dark' }}>
          My Profile
        </Typography>
        <UserProfileCard user={user} />
      </Box>
    </DashboardLayout>
  )
}
