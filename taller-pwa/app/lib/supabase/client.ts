/**
 * Cliente Supabase para el Browser (Client Components)
 * Next.js 15 / React 19 - Mejores prácticas 2026
 */
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
