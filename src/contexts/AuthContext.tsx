import { useCallback } from 'react'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import {
  requestOtpThunk,
  verifyOtpThunk,
  logout as logoutAction,
  clearPendingLogin,
  type User,
  type UserRole,
} from '@/store/authSlice'

export type { User, UserRole }

export function useAuth() {
  const dispatch = useAppDispatch()
  const user = useAppSelector((s) => s.auth.user)
  const pendingLogin = useAppSelector((s) => s.auth.pendingLogin)
  const isLoading = useAppSelector((s) => s.auth.isLoading)

  const requestOtp = useCallback(
    async (email: string, password: string) => {
      const result = await dispatch(requestOtpThunk({ email, password }))
      return result.meta.requestStatus === 'fulfilled'
    },
    [dispatch],
  )

  const verifyOtp = useCallback(
    async (mobile: string, otp: string) => {
      const result = await dispatch(verifyOtpThunk({ mobile, otp }))
      return result.meta.requestStatus === 'fulfilled'
    },
    [dispatch],
  )

  const logout = useCallback(() => {
    dispatch(logoutAction())
  }, [dispatch])

  const clearPending = useCallback(() => {
    dispatch(clearPendingLogin())
  }, [dispatch])

  return {
    user,
    pendingLogin,
    isAuthenticated: !!user,
    isLoading,
    requestOtp,
    verifyOtp,
    logout,
    clearPending,
  }
}
