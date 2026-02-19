import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import type { User } from '@/store/authSlice'

interface UserProfileCardProps {
  user: User
  /** Compact mode: less padding, smaller text */
  compact?: boolean
}

/**
 * Displays current user details (name, email, role).
 * Use with useAuth().user – pass user only when logged in.
 */
export function UserProfileCard({ user, compact }: UserProfileCardProps) {
  return (
    <Paper
      variant="outlined"
      sx={{
        p: compact ? 2 : 3,
        borderRadius: 2,
        border: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Typography
        variant={compact ? 'subtitle1' : 'h6'}
        sx={{ fontWeight: 600, color: 'primary.dark', mb: 1 }}
      >
        {user.name}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
        {user.email}
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography variant="caption" color="text.secondary">
          Role:
        </Typography>
        <Chip
          label={user.role}
          size="small"
          sx={{
            textTransform: 'capitalize',
            fontWeight: 600,
            fontSize: '0.75rem',
          }}
        />
      </Box>
    </Paper>
  )
}
