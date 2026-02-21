import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";
import Link from "@mui/material/Link";
import { useAppDispatch } from "@/store/hooks";
import {
  requestOtpThunk,
  verifyOtpThunk,
  loadPendingOtpThunk,
} from "@/store/authSlice";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";
import { AppInput } from "@/components/AppInput";
import { AppButton } from "@/components/AppButton";
import { loginSchema, type LoginFormValues } from "@/schemas/loginSchema";
import { otpSchema, type OtpFormValues } from "@/schemas/otpSchema";
import "./LoginPage.css";

const blobTransition = (i: number) => ({
  duration: 18 + i * 2,
  repeat: Infinity,
  repeatType: "reverse" as const,
});

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export function LoginPage() {
  const dispatch = useAppDispatch();
  const { pendingLogin, clearPending, isLoading } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const from =
    location.state &&
    typeof location.state === "object" &&
    "from" in location.state &&
    location.state.from &&
    typeof location.state.from === "object" &&
    "pathname" in location.state.from
      ? (location.state as { from: { pathname: string } }).from.pathname
      : "/";
  const [demoOtp, setDemoOtp] = useState("");

  const credentialsForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { userId: "", password: "" },
  });
  const otpForm = useForm<OtpFormValues>({
    resolver: zodResolver(otpSchema),
    defaultValues: { otp: "" },
  });

  const showOtpStep = !!pendingLogin;

  useEffect(() => {
    dispatch(loadPendingOtpThunk());
  }, [dispatch]);

  async function onCredentialsSubmit(data: LoginFormValues) {
    credentialsForm.clearErrors("root");
    const result = await dispatch(
      requestOtpThunk({ email: data.userId.trim(), password: data.password }),
    );
    if (
      result.meta.requestStatus === "fulfilled" &&
      result.payload &&
      typeof result.payload === "object" &&
      "otp" in result.payload
    ) {
      setDemoOtp(result.payload.otp);
      showToast(
        "OTP sent successfully. Check your email or use the code below.",
        "success",
      );
    } else {
      const msg =
        typeof result.payload === "string"
          ? result.payload
          : "Invalid credentials. Try again.";
      credentialsForm.setError("root", { message: msg });
      showToast(msg, "error");
    }
  }

  async function onOtpSubmit(data: OtpFormValues) {
    otpForm.clearErrors("root");
    if (!pendingLogin) return;
    const result = await dispatch(
      verifyOtpThunk({ mobile: pendingLogin.mobile, otp: data.otp }),
    );
    if (result.meta.requestStatus === "fulfilled") {
      showToast("Login successful. Redirecting…", "success");
      navigate(from, { replace: true });
    } else {
      const msg =
        (result.payload as string) ?? "Invalid OTP. Please try again.";
      otpForm.setError("root", { message: msg });
      showToast(msg, "error");
    }
  }

  function handleBackToLogin() {
    clearPending();
    setDemoOtp("");
    otpForm.reset({ otp: "" });
    showToast("Enter your credentials again to receive a new OTP.", "info");
  }

  return (
    <Box className="login-page" component="div">
      <Box
        className="login-illustration-wrap"
        component={motion.div}
        initial={{ opacity: 0.5 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <Box
          className="login-logo-pill"
          component={motion.div}
          initial={{ y: -8, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.15, duration: 0.5 }}
        >
          {/* <img src="/logo.png" alt="Vensar Drive" className="login-illustration" /> */}
          <Box sx={{ display: "flex", gap: 1, mr: { xs: 1, sm: 3 } }}>
            <img
              src="/logo.png"
              alt="Vensar Drive"
              // style={{ height: 32, objectFit: 'contain' }}
              className="login-illustration"
            />
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                color: "primary.dark",
                fontSize: {
                  xs: "1rem",
                  sm: "1.2rem",
                  display: "flex",
                  // justifyContent: "center",
                  alignItems: "flex-end"
                },
              }}
            >
              OneDrive
            </Typography>
          </Box>
        </Box>
      </Box>
      <Box className="login-bg" component="div">
        <motion.div
          className="login-blob login-blob-1"
          animate={{
            x: [0, 15, -10, 20, 0],
            y: [0, -20, 15, -5, 0],
            scale: [1, 1.05, 0.98, 1.02, 1],
          }}
          transition={blobTransition(0)}
          aria-hidden
        />
        <motion.div
          className="login-blob login-blob-2"
          animate={{
            x: [0, 12, -15, 18, 0],
            y: [0, 18, -12, 20, 0],
            scale: [1, 1.03, 0.99, 1.04, 1],
          }}
          transition={blobTransition(1)}
          aria-hidden
        />
        <motion.div
          className="login-blob login-blob-3"
          animate={{
            x: [0, -18, 14, -8, 0],
            y: [0, 10, -18, 12, 0],
            scale: [1, 1.04, 0.97, 1.03, 1],
          }}
          transition={blobTransition(2)}
          aria-hidden
        />
        <motion.div
          className="login-blob login-blob-4"
          animate={{
            x: [0, 10, -12, 15, 0],
            y: [0, -15, 10, -8, 0],
            scale: [1, 1.02, 0.99, 1.05, 1],
          }}
          transition={blobTransition(3)}
          aria-hidden
        />
      </Box>

      <Box className="login-waves" component="div" aria-hidden>
        <div className="login-wave" />
        <div className="login-wave login-wave-2" />
      </Box>

      <Box
        component={motion.main}
        className="login-main"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <Box
          className="login-glass"
          component={motion.div}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.2,
            type: "spring",
            stiffness: 100,
            damping: 20,
          }}
          whileHover={{ scale: 1.01 }}
        >
          <Box className="login-glass-inner">
            <AnimatePresence mode="wait">
              {!showOtpStep ? (
                <motion.div
                  key="credentials"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.2 }}
                >
                  <Box component="header" className="login-header">
                    <Typography
                      component="h1"
                      variant="h5"
                      className="login-card-title"
                    >
                      Login
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      className="login-card-subtitle"
                    >
                      Sign in to continue
                    </Typography>
                  </Box>

                  <motion.form
                    className="login-form"
                    onSubmit={credentialsForm.handleSubmit(onCredentialsSubmit)}
                    noValidate
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    {credentialsForm.formState.errors.root && (
                      <Box
                        component={motion.div}
                        variants={itemVariants}
                        role="alert"
                      >
                        <Alert
                          severity="error"
                          onClose={() => credentialsForm.clearErrors("root")}
                          sx={{ borderRadius: 2 }}
                        >
                          {credentialsForm.formState.errors.root.message}
                        </Alert>
                      </Box>
                    )}
                    <Box
                      component={motion.div}
                      variants={itemVariants}
                      className="login-field"
                    >
                      <Controller
                        name="userId"
                        control={credentialsForm.control}
                        render={({ field, fieldState }) => (
                          <AppInput
                            {...field}
                            id="login-userId"
                            label="User Name or Mobile Number"
                            type="text"
                            autoComplete="user-id"
                            placeholder="Enter user name, mobile number or email"
                            disabled={isLoading}
                            autoFocus
                            error={!!fieldState.error}
                            helperText={fieldState.error?.message}
                          />
                        )}
                      />
                    </Box>
                    <Box
                      component={motion.div}
                      variants={itemVariants}
                      className="login-field"
                    >
                      <Controller
                        name="password"
                        control={credentialsForm.control}
                        render={({ field, fieldState }) => (
                          <AppInput
                            {...field}
                            id="login-password"
                            label="Password"
                            type="password"
                            autoComplete="current-password"
                            placeholder="••••••••"
                            disabled={isLoading}
                            showPasswordToggle
                            error={!!fieldState.error}
                            helperText={fieldState.error?.message}
                          />
                        )}
                      />
                    </Box>
                    <Box
                      component={motion.div}
                      variants={itemVariants}
                      sx={{ mt: 0.5 }}
                    >
                      <AppButton
                        type="submit"
                        variant="contained"
                        color="primary"
                        size="large"
                        fullWidth
                        loading={isLoading}
                      >
                        Send OTP
                      </AppButton>
                    </Box>
                    <Box
                      component={motion.div}
                      variants={itemVariants}
                      className="login-actions"
                    >
                      <Link
                        href="#"
                        variant="body2"
                        onClick={(e) => {
                          e.preventDefault();
                          /* TODO: Forgot password flow */
                        }}
                        sx={{
                          color: "primary.light",
                          "&:hover": {
                            color: "primary.main",
                            textDecoration: "none",
                          },
                        }}
                      >
                        Forgot password?
                      </Link>
                    </Box>
                    <Typography
                      component={motion.p}
                      variants={itemVariants}
                      variant="caption"
                      className="login-terms"
                    >
                      By logging in you&apos;re accepting our{" "}
                      <Link
                        href="#"
                        variant="caption"
                        onClick={(e) => {
                          e.preventDefault();
                          /* TODO: Terms route */
                        }}
                        sx={{
                          color: "primary.light",
                          fontWeight: 600,
                          "&:hover": { color: "primary.main" },
                        }}
                      >
                        Terms and conditions
                      </Link>
                    </Typography>
                  </motion.form>
                </motion.div>
              ) : (
                <motion.div
                  key="otp"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <Box component="header" className="login-header">
                    <Typography
                      component="h1"
                      variant="h5"
                      className="login-card-title"
                    >
                      Verify OTP
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      className="login-card-subtitle"
                    >
                      We sent a 6-digit code to{" "}
                      <strong>{pendingLogin?.mobile}</strong>
                    </Typography>
                  </Box>

                  <motion.form
                    className="login-form"
                    onSubmit={otpForm.handleSubmit(onOtpSubmit)}
                    noValidate
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    {otpForm.formState.errors.root && (
                      <Box
                        component={motion.div}
                        variants={itemVariants}
                        role="alert"
                      >
                        <Alert
                          severity="error"
                          onClose={() => otpForm.clearErrors("root")}
                          sx={{ borderRadius: 2 }}
                        >
                          {otpForm.formState.errors.root.message}
                        </Alert>
                      </Box>
                    )}
                    <Box
                      component={motion.div}
                      variants={itemVariants}
                      className="login-field"
                    >
                      <Controller
                        name="otp"
                        control={otpForm.control}
                        render={({ field, fieldState }) => (
                          <AppInput
                            {...field}
                            id="login-otp"
                            label="Enter OTP"
                            type="text"
                            inputProps={{ maxLength: 6, pattern: "[0-9]*" }}
                            autoComplete="one-time-code"
                            placeholder="000000"
                            disabled={isLoading}
                            autoFocus
                            error={!!fieldState.error}
                            helperText={fieldState.error?.message}
                            onChange={(e) => {
                              const v = e.target.value
                                .replace(/\D/g, "")
                                .slice(0, 6);
                              field.onChange(v);
                            }}
                          />
                        )}
                      />
                    </Box>
                    {demoOtp && (
                      <Box
                        component={motion.div}
                        variants={itemVariants}
                        sx={{ mb: 0.5 }}
                      >
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{ fontStyle: "italic" }}
                        >
                          For demo: OTP is <strong>{demoOtp}</strong>
                        </Typography>
                      </Box>
                    )}
                    <Box
                      component={motion.div}
                      variants={itemVariants}
                      sx={{ mt: 0.5 }}
                    >
                      <AppButton
                        type="submit"
                        variant="contained"
                        color="primary"
                        size="large"
                        fullWidth
                        loading={isLoading}
                      >
                        Verify & continue
                      </AppButton>
                    </Box>
                    <Box
                      component={motion.div}
                      variants={itemVariants}
                      className="login-actions"
                    >
                      <Link
                        component="button"
                        type="button"
                        variant="body2"
                        onClick={handleBackToLogin}
                        sx={{
                          color: "primary.light",
                          "&:hover": {
                            color: "primary.main",
                            textDecoration: "none",
                          },
                          border: 0,
                          background: "none",
                          cursor: "pointer",
                          padding: 0,
                        }}
                      >
                        Back to login
                      </Link>
                    </Box>
                  </motion.form>
                </motion.div>
              )}
            </AnimatePresence>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
