/**
 * Middleware de Next.js para protección de rutas
 * Maneja la autenticación con Supabase Auth
 */
import { type NextRequest } from 'next/server'
import { updateSession } from '@/app/lib/supabase/middleware'

export async function middleware(request: NextRequest) {
  return await updateSession(request)
}

export const config = {
  matcher: [
    /*
     * Excluir rutas que no necesitan autenticación:
     * - _next/static (archivos estáticos)
     * - _next/image (optimización de imágenes)
     * - favicon.ico (favicon)
     * - Archivos de imagen públicos
     * - API routes de autenticación
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
