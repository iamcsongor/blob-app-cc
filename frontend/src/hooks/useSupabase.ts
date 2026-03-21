'use client'

import { createClient } from '@supabase/supabase-js'
import { useState, useEffect, useCallback, useRef } from 'react'

// Initialize the Supabase client (client-side, uses anon key)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface Organisation {
  id: string
  name: string
  logo_url: string | null
  timezone: string
  currency: string
  created_at: string
  updated_at: string
}

export interface Employee {
  id: string
  org_id: string
  name: string
  email: string | null
  department_id: string | null
  role_title: string | null
  manager_id: string | null
  start_date: string | null
  status: 'active' | 'away' | 'on_leave' | 'offboarded'
  avatar_url: string | null
  created_at: string
  updated_at: string
}

export interface Department {
  id: string
  org_id: string
  name: string
  manager_id: string | null
  team_size: number
  description: string | null
  created_at: string
  updated_at: string
}

export interface BlobScore {
  id: string
  employee_id: string
  org_id: string
  score: number
  interpretation: string
  computed_at: string
  created_at: string
}

export interface MetricScore {
  id: string
  employee_id: string
  org_id: string
  category: string
  score: number
  confidence: number
  computed_at: string
  created_at: string
}

export interface Program {
  id: string
  org_id: string
  name: string
  description: string | null
  template_type: string
  status: 'active' | 'paused' | 'completed'
  duration_weeks: number | null
  created_at: string
  updated_at: string
  enrolment_count?: number
}

export interface Trophy {
  id: string
  org_id: string
  name: string
  description: string | null
  icon_url: string | null
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
  criteria_type: 'manual' | 'automatic'
  criteria_config: Record<string, any> | null
  created_at: string
  award_count?: number
}

export interface FeedEvent {
  id: string
  org_id: string
  event_type: string
  title: string
  description: string | null
  entity_type: string | null
  entity_id: string | null
  tags: string[]
  created_at: string
}

export interface ConnectedTool {
  id: string
  org_id: string
  tool_name: string
  status: 'connected' | 'disconnected' | 'error'
  employee_count: number
  last_sync_at: string | null
  created_at: string
  updated_at: string
}

export interface Notification {
  id: string
  user_id: string
  org_id: string
  type: 'critical' | 'warning' | 'positive' | 'informational' | 'ai_insight'
  title: string
  body: string | null
  entity_type: string | null
  entity_id: string | null
  read: boolean
  created_at: string
}

export interface WatchlistItem {
  id: string
  user_id: string
  entity_type: 'employee' | 'department'
  entity_id: string
  created_at: string
}

// ============================================================================
// GENERIC QUERY HOOK
// ============================================================================

interface QueryOptions {
  select?: string
  orderBy?: { column: string; ascending?: boolean }
  filters?: Array<{ column: string; operator: string; value: any }>
  limit?: number
  single?: boolean
}

export function useSupabaseQuery<T>(
  table: string,
  options?: QueryOptions
) {
  const [data, setData] = useState<T | T[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const isMountedRef = useRef(true)

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      let query = supabase.from(table).select(options?.select || '*')

      // Apply filters
      if (options?.filters) {
        for (const filter of options.filters) {
          switch (filter.operator) {
            case 'eq':
              query = query.eq(filter.column, filter.value)
              break
            case 'neq':
              query = query.neq(filter.column, filter.value)
              break
            case 'gt':
              query = query.gt(filter.column, filter.value)
              break
            case 'gte':
              query = query.gte(filter.column, filter.value)
              break
            case 'lt':
              query = query.lt(filter.column, filter.value)
              break
            case 'lte':
              query = query.lte(filter.column, filter.value)
              break
            case 'in':
              query = query.in(filter.column, filter.value)
              break
            case 'is':
              query = query.is(filter.column, filter.value)
              break
            default:
              break
          }
        }
      }

      // Apply ordering
      if (options?.orderBy) {
        query = query.order(options.orderBy.column, {
          ascending: options.orderBy.ascending ?? false,
        })
      }

      // Apply limit
      if (options?.limit) {
        query = query.limit(options.limit)
      }

      // Execute query (with optional .single())
      const { data: result, error: err } = options?.single
        ? await query.single()
        : await query

      if (err) {
        throw err
      }

      if (isMountedRef.current) {
        setData(result as T | T[])
      }
    } catch (err) {
      if (isMountedRef.current) {
        setError(err instanceof Error ? err : new Error('Unknown error'))
      }
    } finally {
      if (isMountedRef.current) {
        setLoading(false)
      }
    }
  }, [table, options])

  const refetch = useCallback(() => {
    fetchData()
  }, [fetchData])

  useEffect(() => {
    fetchData()

    return () => {
      isMountedRef.current = false
    }
  }, [fetchData])

  return { data, loading, error, refetch }
}

// ============================================================================
// HOOKS FOR SPECIFIC TABLES
// ============================================================================

export function useEmployees(orgId?: string) {
  const filters = orgId ? [{ column: 'org_id', operator: 'eq', value: orgId }] : undefined
  const { data, loading, error, refetch } = useSupabaseQuery<Employee>(
    'employees',
    {
      filters,
      orderBy: { column: 'name', ascending: true },
    }
  )

  return {
    employees: (data as Employee[]) || [],
    loading,
    error,
    refetch,
  }
}

export function useEmployee(id: string) {
  const { data, loading, error, refetch } = useSupabaseQuery<Employee>(
    'employees',
    {
      filters: [{ column: 'id', operator: 'eq', value: id }],
      single: true,
    }
  )

  // Optionally fetch latest blob_score and metric_scores
  const [blobScore, setBlobScore] = useState<BlobScore | null>(null)
  const [metricScores, setMetricScores] = useState<MetricScore[]>([])
  const [scoresLoading, setScoresLoading] = useState(false)

  useEffect(() => {
    if (!id) return

    setScoresLoading(true)
    Promise.all([
      supabase
        .from('blob_scores')
        .select('*')
        .eq('employee_id', id)
        .order('computed_at', { ascending: false })
        .limit(1)
        .single()
        .then((res) => res.data),
      supabase
        .from('metric_scores')
        .select('*')
        .eq('employee_id', id)
        .order('computed_at', { ascending: false })
        .then((res) => res.data || []),
    ])
      .then(([score, scores]) => {
        setBlobScore(score)
        setMetricScores(scores)
      })
      .finally(() => setScoresLoading(false))
  }, [id])

  return {
    employee: (data as Employee) || null,
    blobScore,
    metricScores,
    loading: loading || scoresLoading,
    error,
    refetch,
  }
}

export function useDepartments(orgId?: string) {
  const filters = orgId ? [{ column: 'org_id', operator: 'eq', value: orgId }] : undefined
  const { data, loading, error, refetch } = useSupabaseQuery<Department>(
    'departments',
    {
      filters,
      orderBy: { column: 'name', ascending: true },
    }
  )

  return {
    departments: (data as Department[]) || [],
    loading,
    error,
    refetch,
  }
}

export function useOrganisation(orgId: string) {
  const { data, loading, error, refetch } = useSupabaseQuery<Organisation>(
    'organisations',
    {
      filters: [{ column: 'id', operator: 'eq', value: orgId }],
      single: true,
    }
  )

  const updateOrganisation = useCallback(
    async (updates: Partial<Organisation>) => {
      try {
        const { error: err } = await supabase
          .from('organisations')
          .update(updates)
          .eq('id', orgId)

        if (err) throw err
        refetch()
        return { success: true }
      } catch (err) {
        return {
          success: false,
          error: err instanceof Error ? err : new Error('Unknown error'),
        }
      }
    },
    [orgId, refetch]
  )

  return {
    organisation: (data as Organisation) || null,
    loading,
    error,
    refetch,
    updateOrganisation,
  }
}

export function useConnectedTools(orgId?: string) {
  const filters = orgId ? [{ column: 'org_id', operator: 'eq', value: orgId }] : undefined
  const { data, loading, error, refetch } = useSupabaseQuery<ConnectedTool>(
    'connected_tools',
    {
      filters,
      orderBy: { column: 'tool_name', ascending: true },
    }
  )

  const toggleTool = useCallback(
    async (toolId: string, newStatus: 'connected' | 'disconnected') => {
      try {
        const { error: err } = await supabase
          .from('connected_tools')
          .update({ status: newStatus })
          .eq('id', toolId)

        if (err) throw err
        refetch()
        return { success: true }
      } catch (err) {
        return {
          success: false,
          error: err instanceof Error ? err : new Error('Unknown error'),
        }
      }
    },
    [refetch]
  )

  return {
    tools: (data as ConnectedTool[]) || [],
    loading,
    error,
    refetch,
    toggleTool,
  }
}

export function usePrograms(orgId?: string) {
  const filters = orgId
    ? [{ column: 'org_id', operator: 'eq', value: orgId }]
    : undefined
  const { data, loading, error, refetch } = useSupabaseQuery<Program>(
    'programs',
    {
      filters,
      orderBy: { column: 'created_at', ascending: false },
    }
  )

  // Fetch enrolment counts for each program
  const [programsWithCounts, setProgramsWithCounts] = useState<Program[]>([])
  const [countsLoading, setCountsLoading] = useState(false)

  useEffect(() => {
    if (!data || (data as Program[]).length === 0) {
      setProgramsWithCounts([])
      return
    }

    setCountsLoading(true)
    const programIds = (data as Program[]).map((p) => p.id)

    supabase
      .from('program_enrolments')
      .select('program_id, id')
      .in('program_id', programIds)
      .then((res) => {
        const counts = (res.data || []).reduce(
          (acc, item) => {
            acc[item.program_id] = (acc[item.program_id] || 0) + 1
            return acc
          },
          {} as Record<string, number>
        )

        const withCounts = (data as Program[]).map((p) => ({
          ...p,
          enrolment_count: counts[p.id] || 0,
        }))
        setProgramsWithCounts(withCounts)
      })
      .finally(() => setCountsLoading(false))
  }, [data])

  return {
    programs: programsWithCounts,
    loading: loading || countsLoading,
    error,
    refetch,
  }
}

export function useTrophies(orgId?: string) {
  const filters = orgId ? [{ column: 'org_id', operator: 'eq', value: orgId }] : undefined
  const { data, loading, error, refetch } = useSupabaseQuery<Trophy>(
    'trophies',
    {
      filters,
      orderBy: { column: 'created_at', ascending: false },
    }
  )

  // Fetch award counts for each trophy
  const [trophiesWithCounts, setTrophiesWithCounts] = useState<Trophy[]>([])
  const [countsLoading, setCountsLoading] = useState(false)

  useEffect(() => {
    if (!data || (data as Trophy[]).length === 0) {
      setTrophiesWithCounts([])
      return
    }

    setCountsLoading(true)
    const trophyIds = (data as Trophy[]).map((t) => t.id)

    supabase
      .from('trophy_awards')
      .select('trophy_id, id')
      .in('trophy_id', trophyIds)
      .then((res) => {
        const counts = (res.data || []).reduce(
          (acc, item) => {
            acc[item.trophy_id] = (acc[item.trophy_id] || 0) + 1
            return acc
          },
          {} as Record<string, number>
        )

        const withCounts = (data as Trophy[]).map((t) => ({
          ...t,
          award_count: counts[t.id] || 0,
        }))
        setTrophiesWithCounts(withCounts)
      })
      .finally(() => setCountsLoading(false))
  }, [data])

  return {
    trophies: trophiesWithCounts,
    loading: loading || countsLoading,
    error,
    refetch,
  }
}

export function useFeedEvents(
  orgId?: string,
  filters?: { eventType?: string; limit?: number }
) {
  const queryFilters = orgId
    ? [{ column: 'org_id', operator: 'eq', value: orgId }]
    : undefined

  if (filters?.eventType) {
    queryFilters?.push({
      column: 'event_type',
      operator: 'eq',
      value: filters.eventType,
    })
  }

  const { data, loading, error, refetch } = useSupabaseQuery<FeedEvent>(
    'feed_events',
    {
      filters: queryFilters,
      orderBy: { column: 'created_at', ascending: false },
      limit: filters?.limit || 50,
    }
  )

  return {
    events: (data as FeedEvent[]) || [],
    loading,
    error,
    refetch,
  }
}

export function useNotifications(userId?: string) {
  const filters = userId ? [{ column: 'user_id', operator: 'eq', value: userId }] : undefined
  const { data, loading, error, refetch } = useSupabaseQuery<Notification>(
    'notifications',
    {
      filters,
      orderBy: { column: 'created_at', ascending: false },
      limit: 50,
    }
  )

  const notifications = (data as Notification[]) || []
  const unreadCount = notifications.filter((n) => !n.read).length

  const markAsRead = useCallback(
    async (notificationId: string) => {
      try {
        const { error: err } = await supabase
          .from('notifications')
          .update({ read: true })
          .eq('id', notificationId)

        if (err) throw err
        refetch()
        return { success: true }
      } catch (err) {
        return {
          success: false,
          error: err instanceof Error ? err : new Error('Unknown error'),
        }
      }
    },
    [refetch]
  )

  const markAllAsRead = useCallback(async () => {
    if (!userId) return { success: false, error: new Error('No user ID') }

    try {
      const { error: err } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('user_id', userId)
        .eq('read', false)

      if (err) throw err
      refetch()
      return { success: true }
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err : new Error('Unknown error'),
      }
    }
  }, [userId, refetch])

  return {
    notifications,
    unreadCount,
    loading,
    error,
    refetch,
    markAsRead,
    markAllAsRead,
  }
}

export function useWatchlist(userId?: string) {
  const filters = userId ? [{ column: 'user_id', operator: 'eq', value: userId }] : undefined
  const { data, loading, error, refetch } = useSupabaseQuery<WatchlistItem>(
    'watchlist_items',
    {
      filters,
      orderBy: { column: 'created_at', ascending: false },
    }
  )

  const addItem = useCallback(
    async (entityType: 'employee' | 'department', entityId: string) => {
      if (!userId) return { success: false, error: new Error('No user ID') }

      try {
        const { error: err } = await supabase.from('watchlist_items').insert({
          user_id: userId,
          entity_type: entityType,
          entity_id: entityId,
        })

        if (err) throw err
        refetch()
        return { success: true }
      } catch (err) {
        return {
          success: false,
          error: err instanceof Error ? err : new Error('Unknown error'),
        }
      }
    },
    [userId, refetch]
  )

  const removeItem = useCallback(
    async (itemId: string) => {
      try {
        const { error: err } = await supabase
          .from('watchlist_items')
          .delete()
          .eq('id', itemId)

        if (err) throw err
        refetch()
        return { success: true }
      } catch (err) {
        return {
          success: false,
          error: err instanceof Error ? err : new Error('Unknown error'),
        }
      }
    },
    [refetch]
  )

  return {
    items: (data as WatchlistItem[]) || [],
    loading,
    error,
    refetch,
    addItem,
    removeItem,
  }
}
