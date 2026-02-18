<<<<<<< HEAD
"use client"

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react"

const ADMIN_EMAIL = "2026"
const ADMIN_PASSWORD = "2026"
const AUTH_STORAGE_KEY = "elit-tools-auth"

interface AuthContextType {
  user: { email: string } | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<{ email: string } | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem(AUTH_STORAGE_KEY)
      if (stored) {
        setUser(JSON.parse(stored))
      }
    } catch {
      // ignore
    }
    setLoading(false)
  }, [])

  async function signIn(email: string, password: string) {
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      const userData = { email }
      setUser(userData)
      sessionStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(userData))
    } else {
      throw new Error("Invalid credentials")
    }
  }

  function signOut() {
    setUser(null)
    sessionStorage.removeItem(AUTH_STORAGE_KEY)
  }

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
=======
"use client"

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react"

const ADMIN_EMAIL = "2026"
const ADMIN_PASSWORD = "2026"
const AUTH_STORAGE_KEY = "elit-tools-auth"

interface AuthContextType {
  user: { email: string } | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<{ email: string } | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem(AUTH_STORAGE_KEY)
      if (stored) {
        setUser(JSON.parse(stored))
      }
    } catch {
      // ignore
    }
    setLoading(false)
  }, [])

  async function signIn(email: string, password: string) {
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      const userData = { email }
      setUser(userData)
      sessionStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(userData))
    } else {
      throw new Error("Invalid credentials")
    }
  }

  function signOut() {
    setUser(null)
    sessionStorage.removeItem(AUTH_STORAGE_KEY)
  }

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
>>>>>>> d9c409a34aecc0e321ad11ef035d23b954fa5079
