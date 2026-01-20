# 🚀 Configuración de Autenticación y Storage con Supabase

## Pasos para completar la configuración

### 1. Configurar variables de entorno

Edita el archivo `.env` y agrega tu **ANON KEY** de Supabase:

```bash
# Obtener de: https://supabase.com/dashboard/project/conwiyfckoopwhyzuvuc/settings/api
NEXT_PUBLIC_SUPABASE_ANON_KEY="tu-anon-key-aqui"
```

### 2. Configurar Storage en Supabase

1. Ve a [Supabase Dashboard](https://supabase.com/dashboard/project/conwiyfckoopwhyzuvuc)
2. Navega a **SQL Editor**
3. Copia y ejecuta el contenido de `scripts/setup-storage.sql`

O puedes crear el bucket manualmente:
1. Ve a **Storage** en el dashboard
2. Click en **New Bucket**
3. Nombre: `documents`
4. Desmarca "Public bucket"
5. Click en **Create bucket**

### 3. Configurar Auth en Supabase

1. Ve a **Authentication** > **Providers**
2. Asegúrate de que **Email** esté habilitado
3. (Opcional) Habilita otros providers (Google, GitHub, etc.)

### 4. Configurar Redirect URLs (importante para producción)

1. Ve a **Authentication** > **URL Configuration**
2. Agrega las URLs permitidas:
   - `http://localhost:3000/**` (desarrollo)
   - `https://tu-dominio.com/**` (producción)

## Estructura de archivos creados

```
app/
├── lib/
│   ├── supabase/
│   │   ├── client.ts      # Cliente para browser
│   │   ├── server.ts      # Cliente para servidor
│   │   └── middleware.ts  # Utilidad para middleware
│   ├── prisma.ts          # Cliente Prisma singleton
│   └── document-extractor.ts # Extracción de texto PDF/DOCX/TXT
├── contexts/
│   └── AuthContext.tsx    # Contexto de autenticación
├── actions/
│   └── auth.ts            # Server actions (logout)
├── auth/
│   ├── callback/route.ts  # Callback de OAuth
│   └── confirm/route.ts   # Confirmación de email
├── api/
│   └── files/
│       └── upload/route.ts # API de subida de archivos
├── login/
│   └── page.tsx           # Página de login actualizada
└── layout.tsx             # Layout con AuthProvider

middleware.ts              # Middleware de protección de rutas
scripts/
└── setup-storage.sql      # Script para configurar Storage
```

## Uso del contexto de autenticación

```tsx
'use client'
import { useAuth } from '@/app/contexts/AuthContext'

export default function MyComponent() {
  const { user, isLoading, signOut } = useAuth()

  if (isLoading) return <div>Cargando...</div>
  if (!user) return <div>No autenticado</div>

  return (
    <div>
      <p>Bienvenido, {user.email}</p>
      <button onClick={signOut}>Cerrar sesión</button>
    </div>
  )
}
```

## Subida de archivos

```tsx
const uploadFile = async (file: File, chatId: string) => {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('chatId', chatId)

  const response = await fetch('/api/files/upload', {
    method: 'POST',
    body: formData,
  })

  return response.json()
}
```

## Ejecutar el proyecto

```bash
# Desarrollo
npm run dev

# Build
npm run build

# Producción
npm run start
```
