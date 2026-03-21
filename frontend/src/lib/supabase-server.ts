import { createClient } from '@supabase/supabase-js'

/**
 * Server-side Supabase client for use in Next.js API routes and server components
 * Uses service role key for elevated privileges (admin operations)
 *
 * IMPORTANT: Never expose service role key to client-side code.
 * This function should only be used in:
 * - API routes (/app/api/*)
 * - Server components with 'use server'
 * - Server-side utilities and background jobs
 */
export function createServerSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !key) {
    throw new Error(
      'Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables'
    )
  }

  return createClient(url, key)
}

/**
 * Get the organization ID from the current request context
 * Should be used in API routes to get org_id from auth token or query
 */
export async function getOrgIdFromRequest(req?: Request): Promise<string | null> {
  // This would typically extract org_id from JWT claims or request headers
  // For now, return null - implement based on your auth strategy
  return null
}
