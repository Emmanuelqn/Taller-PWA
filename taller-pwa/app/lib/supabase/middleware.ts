/**
 * Utilidad para actualizar sesión en Middleware
 * Next.js 15 / React 19 - Mejores prácticas 2026
 */
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // IMPORTANTE: Evitar lógica entre createServerClient y supabase.auth.getUser()
  // Un error simple podría causar logout aleatorio de usuarios

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Rutas públicas que no requieren autenticación
  const publicRoutes = ['/login', '/auth', '/auth/callback', '/auth/confirm']
  const isPublicRoute = publicRoutes.some(route => 
    request.nextUrl.pathname.startsWith(route)
  )

  // Si no hay usuario y no es ruta pública, redirigir al login
  if (!user && !isPublicRoute) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // Si hay usuario y está en login, redirigir al chat
  if (user && request.nextUrl.pathname === '/login') {
    const url = request.nextUrl.clone()
    url.pathname = '/'
    return NextResponse.redirect(url)
  }

  // IMPORTANTE: Retornar supabaseResponse tal cual
  // Si creas una nueva respuesta con NextResponse.next(), asegúrate de:
  // 1. Pasar el request: const myNewResponse = NextResponse.next({ request })
  // 2. Copiar las cookies: myNewResponse.cookies.setAll(supabaseResponse.cookies.getAll())

  return supabaseResponse
}
