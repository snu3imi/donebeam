<<<<<<< HEAD
"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { FallingStars } from "@/components/falling-stars"
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  LogIn,
  Loader2,
  AlertCircle,
  Shield,
  Zap,
  LayoutDashboard,
  RefreshCw,
  Cloud,
  ShieldOff,
  Crown,
  X,
  Send,
  CheckCircle2,
} from "lucide-react"

const features = [
  {
    icon: Shield,
    title: "Bank-Grade Security",
    description: "AES-256 encryption protects your assets",
  },
  {
    icon: Zap,
    title: "Lightning Validation",
    description: "Validate 1000+ cookies in seconds",
  },
  {
    icon: LayoutDashboard,
    title: "Elite Dashboard",
    description: "Real-time analytics & monitoring",
  },
  {
    icon: RefreshCw,
    title: "Auto-Refresh",
    description: "Keep cookies alive automatically",
  },
  {
    icon: Cloud,
    title: "Cloud Sync",
    description: "Access from any device, anywhere",
  },
  {
    icon: ShieldOff,
    title: "Anti-Detection",
    description: "Stealth mode for maximum safety",
  },
]

export function LoginForm() {
  const { signIn } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)

  // Request access modal
  const [showRequestModal, setShowRequestModal] = useState(false)
  const [requestEmail, setRequestEmail] = useState("")
  const [requestLoading, setRequestLoading] = useState(false)
  const [requestSent, setRequestSent] = useState(false)
  const [requestError, setRequestError] = useState("")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      await signIn(email, password)
    } catch {
      setError("Invalid email or password. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  async function handleRequestAccess(e: React.FormEvent) {
    e.preventDefault()
    setRequestError("")
    setRequestLoading(true)

    try {
      const res = await fetch("/api/request-access", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: requestEmail }),
      })

      if (!res.ok) throw new Error("Failed")

      setRequestSent(true)
    } catch {
      setRequestError("Failed to send request. Please try again.")
    } finally {
      setRequestLoading(false)
    }
  }

  return (
    <div className="relative flex min-h-screen bg-background overflow-hidden">
      <FallingStars />

      {/* Watermark background */}
      <div className="pointer-events-none fixed inset-0 z-[1] flex select-none items-center justify-center overflow-hidden">
        <span className="font-serif text-[20vw] font-bold italic tracking-tight text-primary/[0.03]">
          elit tools
        </span>
      </div>

      {/* Main content area */}
      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-4 py-12">
        {/* Logo & branding */}
        <div className="mb-8 flex flex-col items-center gap-3">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/20 ring-2 ring-primary/30 animate-[pulse_3s_ease-in-out_infinite]">
            <Crown className="h-10 w-10 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">
            Elit Tools
          </h1>
          <p className="text-sm text-muted-foreground">
            Premium Account Management
          </p>
        </div>

        {/* Login card */}
        <div className="w-full max-w-md rounded-xl border border-border/60 bg-card/80 p-8 backdrop-blur-sm">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-foreground">
              Welcome back
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Enter your credentials to continue
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {error && (
              <div className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-primary">
                <AlertCircle className="h-4 w-4 shrink-0" />
                {error}
              </div>
            )}

            {/* Email field */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="email"
                className="text-sm font-medium text-foreground"
              >
                Email address
              </label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  className="h-11 w-full rounded-lg border border-border bg-input pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>

            {/* Password field */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="password"
                className="text-sm font-medium text-foreground"
              >
                Password
              </label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  className="h-11 w-full rounded-lg border border-border bg-input pl-10 pr-11 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember me */}
            <label className="flex cursor-pointer select-none items-center gap-2">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 rounded border-border bg-input accent-primary"
              />
              <span className="text-sm text-muted-foreground">
                Remember my email
              </span>
            </label>

            {/* Animated Submit button */}
            <button
              type="submit"
              disabled={loading}
              className="group relative flex h-11 w-full items-center justify-center gap-2 overflow-hidden rounded-lg bg-primary font-medium text-primary-foreground transition-all hover:bg-primary/90 hover:shadow-[0_0_20px_rgba(220,38,38,0.4)] hover:scale-[1.02] active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50"
            >
              {/* Shimmer effect */}
              <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <LogIn className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  <span>Sign In</span>
                </>
              )}
            </button>

            {/* Divider */}
            <div className="border-t border-border" />

            {/* Footer */}
            <p className="text-center text-sm text-muted-foreground">
              {"Don't have an account? "}
              <button
                type="button"
                onClick={() => {
                  setShowRequestModal(true)
                  setRequestSent(false)
                  setRequestEmail("")
                  setRequestError("")
                }}
                className="font-medium text-primary transition-colors hover:text-primary/80"
              >
                Request access
              </button>
            </p>
          </form>
        </div>
      </div>

      {/* Right sidebar - features panel */}
      <aside className="relative z-10 hidden w-[380px] shrink-0 flex-col justify-center border-l border-border/40 bg-card/40 px-10 py-12 backdrop-blur-sm lg:flex">
        <div className="mb-8">
          <h2 className="text-xl font-bold text-primary">Why Elit Tools?</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            The premium solution for Roblox account management
          </p>
        </div>

        <div className="flex flex-col gap-5">
          {features.map((feature) => (
            <div key={feature.title} className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/15">
                <feature.icon className="h-5 w-5 text-primary" />
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-sm font-semibold text-foreground">
                  {feature.title}
                </span>
                <span className="text-xs leading-relaxed text-muted-foreground">
                  {feature.description}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="my-8 border-t border-border/40" />

        {/* Trust badge */}
        <div className="flex items-center gap-3">
          <div className="flex -space-x-2">
            {["A", "B", "C", "D"].map((letter) => (
              <div
                key={letter}
                className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-card bg-primary text-xs font-bold text-primary-foreground"
              >
                {letter}
              </div>
            ))}
          </div>
          <span className="text-sm font-medium text-muted-foreground">
            2M+ users trust Elit Tools
          </span>
        </div>
      </aside>

      {/* Request Access Modal */}
      {showRequestModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <FallingStars />
          <div className="relative z-10 w-full max-w-sm rounded-xl border border-border/60 bg-card p-6 shadow-2xl">
            <button
              onClick={() => setShowRequestModal(false)}
              className="absolute right-4 top-4 rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="mb-5 flex flex-col items-center gap-2">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/20">
                <Crown className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">
                Request Access
              </h3>
              <p className="text-center text-sm text-muted-foreground">
                Enter your email and wait for admin approval
              </p>
            </div>

            {requestSent ? (
              <div className="flex flex-col items-center gap-3 py-4">
                <CheckCircle2 className="h-10 w-10 text-emerald-500" />
                <p className="text-center text-sm text-foreground">
                  Request sent successfully!
                </p>
                <p className="text-center text-xs text-muted-foreground">
                  You will be notified when your access is approved.
                </p>
                <button
                  onClick={() => setShowRequestModal(false)}
                  className="mt-2 rounded-lg bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground transition-colors hover:bg-secondary/80"
                >
                  Close
                </button>
              </div>
            ) : (
              <form
                onSubmit={handleRequestAccess}
                className="flex flex-col gap-4"
              >
                {requestError && (
                  <div className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-primary">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    {requestError}
                  </div>
                )}

                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="request-email"
                    className="text-sm font-medium text-foreground"
                  >
                    Your email address
                  </label>
                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                      id="request-email"
                      type="email"
                      placeholder="you@example.com"
                      value={requestEmail}
                      onChange={(e) => setRequestEmail(e.target.value)}
                      required
                      autoComplete="email"
                      className="h-11 w-full rounded-lg border border-border bg-input pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={requestLoading}
                  className="group relative flex h-11 w-full items-center justify-center gap-2 overflow-hidden rounded-lg bg-primary font-medium text-primary-foreground transition-all hover:bg-primary/90 hover:shadow-[0_0_20px_rgba(220,38,38,0.4)] hover:scale-[1.02] active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50"
                >
                  <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />
                  {requestLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      <span>Submit Request</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
=======
"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { FallingStars } from "@/components/falling-stars"
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  LogIn,
  Loader2,
  AlertCircle,
  Shield,
  Zap,
  LayoutDashboard,
  RefreshCw,
  Cloud,
  ShieldOff,
  Crown,
  X,
  Send,
  CheckCircle2,
} from "lucide-react"

const features = [
  {
    icon: Shield,
    title: "Bank-Grade Security",
    description: "AES-256 encryption protects your assets",
  },
  {
    icon: Zap,
    title: "Lightning Validation",
    description: "Validate 1000+ cookies in seconds",
  },
  {
    icon: LayoutDashboard,
    title: "Elite Dashboard",
    description: "Real-time analytics & monitoring",
  },
  {
    icon: RefreshCw,
    title: "Auto-Refresh",
    description: "Keep cookies alive automatically",
  },
  {
    icon: Cloud,
    title: "Cloud Sync",
    description: "Access from any device, anywhere",
  },
  {
    icon: ShieldOff,
    title: "Anti-Detection",
    description: "Stealth mode for maximum safety",
  },
]

export function LoginForm() {
  const { signIn } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)

  // Request access modal
  const [showRequestModal, setShowRequestModal] = useState(false)
  const [requestEmail, setRequestEmail] = useState("")
  const [requestLoading, setRequestLoading] = useState(false)
  const [requestSent, setRequestSent] = useState(false)
  const [requestError, setRequestError] = useState("")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      await signIn(email, password)
    } catch {
      setError("Invalid email or password. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  async function handleRequestAccess(e: React.FormEvent) {
    e.preventDefault()
    setRequestError("")
    setRequestLoading(true)

    try {
      const res = await fetch("/api/request-access", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: requestEmail }),
      })

      if (!res.ok) throw new Error("Failed")

      setRequestSent(true)
    } catch {
      setRequestError("Failed to send request. Please try again.")
    } finally {
      setRequestLoading(false)
    }
  }

  return (
    <div className="relative flex min-h-screen bg-background overflow-hidden">
      <FallingStars />

      {/* Watermark background */}
      <div className="pointer-events-none fixed inset-0 z-[1] flex select-none items-center justify-center overflow-hidden">
        <span className="font-serif text-[20vw] font-bold italic tracking-tight text-primary/[0.03]">
          elit tools
        </span>
      </div>

      {/* Main content area */}
      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-4 py-12">
        {/* Logo & branding */}
        <div className="mb-8 flex flex-col items-center gap-3">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/20 ring-2 ring-primary/30 animate-[pulse_3s_ease-in-out_infinite]">
            <Crown className="h-10 w-10 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">
            Elit Tools
          </h1>
          <p className="text-sm text-muted-foreground">
            Premium Account Management
          </p>
        </div>

        {/* Login card */}
        <div className="w-full max-w-md rounded-xl border border-border/60 bg-card/80 p-8 backdrop-blur-sm">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-foreground">
              Welcome back
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Enter your credentials to continue
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {error && (
              <div className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-primary">
                <AlertCircle className="h-4 w-4 shrink-0" />
                {error}
              </div>
            )}

            {/* Email field */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="email"
                className="text-sm font-medium text-foreground"
              >
                Email address
              </label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  className="h-11 w-full rounded-lg border border-border bg-input pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>

            {/* Password field */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="password"
                className="text-sm font-medium text-foreground"
              >
                Password
              </label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  className="h-11 w-full rounded-lg border border-border bg-input pl-10 pr-11 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember me */}
            <label className="flex cursor-pointer select-none items-center gap-2">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 rounded border-border bg-input accent-primary"
              />
              <span className="text-sm text-muted-foreground">
                Remember my email
              </span>
            </label>

            {/* Animated Submit button */}
            <button
              type="submit"
              disabled={loading}
              className="group relative flex h-11 w-full items-center justify-center gap-2 overflow-hidden rounded-lg bg-primary font-medium text-primary-foreground transition-all hover:bg-primary/90 hover:shadow-[0_0_20px_rgba(220,38,38,0.4)] hover:scale-[1.02] active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50"
            >
              {/* Shimmer effect */}
              <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <LogIn className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  <span>Sign In</span>
                </>
              )}
            </button>

            {/* Divider */}
            <div className="border-t border-border" />

            {/* Footer */}
            <p className="text-center text-sm text-muted-foreground">
              {"Don't have an account? "}
              <button
                type="button"
                onClick={() => {
                  setShowRequestModal(true)
                  setRequestSent(false)
                  setRequestEmail("")
                  setRequestError("")
                }}
                className="font-medium text-primary transition-colors hover:text-primary/80"
              >
                Request access
              </button>
            </p>
          </form>
        </div>
      </div>

      {/* Right sidebar - features panel */}
      <aside className="relative z-10 hidden w-[380px] shrink-0 flex-col justify-center border-l border-border/40 bg-card/40 px-10 py-12 backdrop-blur-sm lg:flex">
        <div className="mb-8">
          <h2 className="text-xl font-bold text-primary">Why Elit Tools?</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            The premium solution for Roblox account management
          </p>
        </div>

        <div className="flex flex-col gap-5">
          {features.map((feature) => (
            <div key={feature.title} className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/15">
                <feature.icon className="h-5 w-5 text-primary" />
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-sm font-semibold text-foreground">
                  {feature.title}
                </span>
                <span className="text-xs leading-relaxed text-muted-foreground">
                  {feature.description}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="my-8 border-t border-border/40" />

        {/* Trust badge */}
        <div className="flex items-center gap-3">
          <div className="flex -space-x-2">
            {["A", "B", "C", "D"].map((letter) => (
              <div
                key={letter}
                className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-card bg-primary text-xs font-bold text-primary-foreground"
              >
                {letter}
              </div>
            ))}
          </div>
          <span className="text-sm font-medium text-muted-foreground">
            2M+ users trust Elit Tools
          </span>
        </div>
      </aside>

      {/* Request Access Modal */}
      {showRequestModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <FallingStars />
          <div className="relative z-10 w-full max-w-sm rounded-xl border border-border/60 bg-card p-6 shadow-2xl">
            <button
              onClick={() => setShowRequestModal(false)}
              className="absolute right-4 top-4 rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="mb-5 flex flex-col items-center gap-2">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/20">
                <Crown className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">
                Request Access
              </h3>
              <p className="text-center text-sm text-muted-foreground">
                Enter your email and wait for admin approval
              </p>
            </div>

            {requestSent ? (
              <div className="flex flex-col items-center gap-3 py-4">
                <CheckCircle2 className="h-10 w-10 text-emerald-500" />
                <p className="text-center text-sm text-foreground">
                  Request sent successfully!
                </p>
                <p className="text-center text-xs text-muted-foreground">
                  You will be notified when your access is approved.
                </p>
                <button
                  onClick={() => setShowRequestModal(false)}
                  className="mt-2 rounded-lg bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground transition-colors hover:bg-secondary/80"
                >
                  Close
                </button>
              </div>
            ) : (
              <form
                onSubmit={handleRequestAccess}
                className="flex flex-col gap-4"
              >
                {requestError && (
                  <div className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-primary">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    {requestError}
                  </div>
                )}

                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="request-email"
                    className="text-sm font-medium text-foreground"
                  >
                    Your email address
                  </label>
                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                      id="request-email"
                      type="email"
                      placeholder="you@example.com"
                      value={requestEmail}
                      onChange={(e) => setRequestEmail(e.target.value)}
                      required
                      autoComplete="email"
                      className="h-11 w-full rounded-lg border border-border bg-input pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={requestLoading}
                  className="group relative flex h-11 w-full items-center justify-center gap-2 overflow-hidden rounded-lg bg-primary font-medium text-primary-foreground transition-all hover:bg-primary/90 hover:shadow-[0_0_20px_rgba(220,38,38,0.4)] hover:scale-[1.02] active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50"
                >
                  <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />
                  {requestLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      <span>Submit Request</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
>>>>>>> d9c409a34aecc0e321ad11ef035d23b954fa5079
