import { motion } from 'framer-motion'
import { useTheme } from '@mui/material/styles'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
}

const item = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0 },
}

export function Logo() {
  const theme = useTheme()
  const primary = theme.palette.primary as unknown as Record<string, string>
  const main = theme.palette.primary.main
  const dark = theme.palette.primary.dark
  const alpha25 = primary.alpha25 ?? 'rgba(0,150,136,0.25)'
  const contrastText = theme.palette.primary.contrastText ?? '#ffffff'

  return (
    <Box
      component={motion.div}
      variants={container}
      initial="hidden"
      animate="visible"
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 1.2,
        mb: 0.5,
      }}
    >
      <Box
        component={motion.div}
        variants={item}
        transition={{ type: 'spring', stiffness: 200, damping: 22 }}
        sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        <motion.svg
          width="42"
          height="42"
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          animate={{ rotate: [0, 4, -4, 0] }}
          transition={{ duration: 5, repeat: Infinity, repeatDelay: 2.5 }}
          style={{ filter: `drop-shadow(0 0 10px ${main}59)` }}
        >
          <motion.path
            d="M20 6L8 14v12h24V14L20 6z"
            fill="url(#logo-g)"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.15 }}
          />
          <motion.path
            d="M20 10l8 6v10H12V16l8-6z"
            fill={alpha25}
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.35 }}
          />
          <motion.circle
            cx="20"
            cy="18"
            r="3"
            fill={contrastText}
            style={{ opacity: 0.9 }}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 320, delay: 0.5 }}
          />
          <defs>
            <linearGradient id="logo-g" x1="8" y1="6" x2="32" y2="26" gradientUnits="userSpaceOnUse">
              <stop stopColor={main} />
              <stop offset="1" stopColor={dark} />
            </linearGradient>
          </defs>
        </motion.svg>
      </Box>
      <Typography
        component={motion.span}
        variants={item}
        transition={{ type: 'spring', stiffness: 200, damping: 22 }}
        variant="h4"
        sx={{
          fontWeight: 600,
          letterSpacing: '-0.02em',
          background: (t) => `linear-gradient(135deg, ${t.palette.primary.dark} 0%, ${t.palette.primary.main} 100%)`,
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          color: 'transparent',
        }}
      >
        Vensar Drive
      </Typography>
    </Box>
  )
}
