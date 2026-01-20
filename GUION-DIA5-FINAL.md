# 🎯 GUION COMPLETO - DÍA 5 (SESIÓN FINAL)
## Taller de Desarrollo de Software con Herramientas de IA
### Duración: 60 minutos | Fecha: 20 de Enero de 2026

---

## 📋 RESUMEN EJECUTIVO

**Objetivo de la sesión:** Combinar el contenido del Día 5 y Día 6 para finalizar el proyecto PWA completo, con base de datos, autenticación, subida de archivos, predicción técnica con IA, y despliegue en producción.

**Estado actual del proyecto:**
- ✅ Frontend completo (ChatGPT-like UI)
- ✅ Integración con OpenRouter funcional (streaming)
- ✅ Componentes: Sidebar, ChatArea, MessageInput, Login
- ❌ No hay Prisma/Supabase configurado
- ❌ No hay autenticación real
- ❌ No hay subida de archivos
- ❌ No hay persistencia de conversaciones
- ❌ No hay predicción técnica implementada

**Herramienta principal:** GitHub Copilot en VS Code 2026

---

## 🚀 GITHUB COPILOT EN VS CODE 2026 - CARACTERÍSTICAS CLAVE

### Nuevas Funcionalidades (Enero 2026)

1. **Agent Mode (Modo Agente)** 
   - GitHub Copilot ahora actúa como un agente de codificación completo
   - Puede ejecutar tareas multi-paso de forma autónoma
   - Interpreta contexto del proyecto, propone mejoras arquitectónicas
   - Detecta bugs y puede implementar features completas

2. **MCP Context7**
   - Server MCP que proporciona documentación actualizada 
   - Obtiene documentación y ejemplos directamente de repositorios fuente
   - Para usarlo: incluir "use context7" en prompts del Agent Mode
   - Mitiga problemas de datos de entrenamiento desactualizados

3. **Agent Skills (Experimental - VS Code 1.108)**
   - Permite "enseñar" nuevas capacidades a Copilot
   - Se definen en carpetas con instrucciones, scripts y recursos

4. **Multi-file Editing**
   - Edición precisa en múltiples archivos simultáneamente
   - Ideal para refactoring, migraciones y corrección de bugs

5. **Modelos Disponibles**
   - GPT 5.1, Claude 4.5, Gemini 3 Flash
   - Routing automático según complejidad de la tarea
   - Soporte para OpenRouter para control de tokens

6. **Custom Instructions**
   - Personalización de respuestas según herramientas preferidas
   - Integración con estándares organizacionales

7. **Copilot Studio Extension (14 Enero 2026)**
   - Desarrollo y gestión de agentes desde VS Code
   - IntelliSense y soporte de lenguaje para componentes de agentes

### Cómo Activar Agent Mode en VS Code

```
1. Abrir Copilot Chat (Ctrl + Shift + I)
2. Seleccionar modo "Agent" en el dropdown
3. Para usar Context7: agregar "use context7" al inicio del prompt
```

---

## ⏱️ TIMELINE DE LA SESIÓN (60 minutos)

| Tiempo | Actividad | Duración |
|--------|-----------|----------|
| 0:00 | Introducción y recap | 5 min |
| 0:05 | Demo GitHub Copilot 2026 | 5 min |
| 0:10 | Prompt inicial - Análisis y conexión | 10 min |
| 0:20 | Base de datos con Prisma/Supabase | 12 min |
| 0:32 | Autenticación y subida de archivos | 10 min |
| 0:42 | Predicción técnica con IA | 8 min |
| 0:50 | Preparación y deploy a Vercel | 8 min |
| 0:58 | Commit final y cierre | 2 min |

---

## 📜 GUION DE LA SESIÓN

---

### 🎬 BLOQUE 1: INTRODUCCIÓN Y RECAP (0:00 - 5:00)

---

#### [LO QUE DIGO]

> "¡Buenas tardes a todos! Bienvenidos a la sesión final de nuestro taller de desarrollo de software con herramientas de IA.
>
> Hoy vamos a cerrar con broche de oro combinando todo lo que hemos visto en las sesiones anteriores. Si recuerdan:
>
> - En el **Día 1** hicimos toda la planeación con Claude AI, definimos los requerimientos y creamos el proyecto con Next.js
> - En el **Día 2** vimos todas las herramientas de Cursor: autocompletado, Agent Mode, Ask Mode, reglas personalizadas y MCPs
> - En el **Día 3** desarrollamos toda la interfaz estilo ChatGPT con el agente
> - En el **Día 4** integramos OpenRouter y ya tenemos el chat funcionando con streaming
> - **Ayer** comparamos las alternativas a Cursor: GitHub Copilot y Antigravity
>
> Hoy usaremos **GitHub Copilot en VS Code** para demostrar que las alternativas gratuitas o más económicas pueden lograr exactamente lo mismo. Vamos a:
>
> 1. Conectar la base de datos con Prisma y Supabase
> 2. Implementar autenticación real
> 3. Agregar la subida de archivos
> 4. Crear la funcionalidad de predicción técnica con costos reales de México
> 5. Desplegar todo a producción en Vercel
>
> ¿Alguna pregunta antes de empezar? Perfecto, ¡comencemos!"

---

### 🎬 BLOQUE 2: DEMO GITHUB COPILOT 2026 (5:00 - 10:00)

---

#### [LO QUE DIGO]

> "Antes de entrar al código, les quiero mostrar las nuevas características de GitHub Copilot en 2026 porque son impresionantes.
>
> **Primero, el Agent Mode.** Ya no es solo autocompletado inteligente - ahora Copilot puede actuar como un agente completo que:
> - Entiende todo el contexto de tu proyecto
> - Ejecuta tareas de múltiples pasos de forma autónoma
> - Edita múltiples archivos simultáneamente
> - Puede correr comandos en la terminal
>
> **Segundo, MCP Context7.** Esto es muy importante y es algo que en Cursor teníamos que configurar manualmente. Context7 es un servidor MCP que le da a Copilot acceso a documentación actualizada. Cuando incluyes 'use context7' en tu prompt, Copilot obtiene la documentación más reciente de las bibliotecas que estás usando.
>
> **¿Por qué es importante?** Porque todos los modelos de IA fueron entrenados en cierta fecha y su conocimiento puede estar desactualizado. Con Context7, Copilot consulta la documentación real y actual.
>
> Les muestro cómo se ve..."

#### [LO QUE HAGO]

1. Abrir VS Code con el proyecto `taller-pwa`
2. Abrir el panel de Copilot Chat (Ctrl + Shift + I)
3. Mostrar el selector de modo (Agent / Ask / Edit)
4. Mostrar cómo agregar Context7

#### [LO QUE DIGO]

> "Como ven, aquí tenemos el chat de Copilot. Arriba pueden ver que ahora tenemos diferentes modos. El modo **Agent** es el más potente - es similar al Agent Mode de Cursor. El modo **Ask** es para preguntas simples, y **Edit** es para ediciones rápidas en el código seleccionado.
>
> Ahora sí, vamos a empezar con el desarrollo real."

---

### 🎬 BLOQUE 3: PROMPT INICIAL - ANÁLISIS COMPLETO (10:00 - 20:00)

---

#### [LO QUE DIGO]

> "Voy a empezar con un prompt muy completo que le da a la IA todo el contexto necesario. Esto es una **mejor práctica clave**: mientras más contexto des, mejores resultados obtienes.
>
> Fíjense cómo estructuro el prompt: primero le pido que analice, luego le doy instrucciones específicas, y al final le especifico que use las mejores prácticas de 2026."

#### [PROMPT QUE ESCRIBO EN COPILOT AGENT MODE]

```
use context7

Quiero que analices todo el código del proyecto actual, entiendas cómo funciona y hagas lo siguiente aplicando las mejores prácticas actuales (2026) para Next.js 15, TypeScript y React 19.

El proyecto es una PWA de análisis de requerimientos de software donde:
1. El usuario sube documentos con requisitos del cliente (PDF, DOCX, TXT)
2. La IA hace preguntas de clarificación
3. Una vez entendido el alcance, genera una predicción técnica con: stack tecnológico, perfiles requeridos, tiempo estimado y costo de desarrollo

TAREAS A REALIZAR:

1. **Conectar todas las pantallas sin código redundante**
   - El login debe redirigir correctamente al chat
   - El sidebar debe manejar el historial real de conversaciones
   - Proteger rutas que requieran autenticación

2. **Configurar Prisma con Supabase**
   - Crear schema.prisma con modelos para: User, Chat, Message, UploadedFile, TechnicalPrediction
   - Los chats deben tener relación con usuarios y mensajes
   - Los archivos deben estar asociados a chats

3. **Implementar autenticación con Supabase Auth**
   - Login/registro con email
   - Sesiones persistentes
   - Middleware para proteger rutas

4. **Agregar funcionalidad de subida de archivos**
   - Soporte para PDF, DOCX, TXT
   - Almacenar en Supabase Storage
   - Extraer texto de los documentos

5. **La base de datos ya está configurada en .env (Supabase PostgreSQL)**

Empieza por mostrarme el archivo schema.prisma que necesitamos.
```

#### [LO QUE DIGO MIENTRAS COPILOT TRABAJA]

> "Observen cómo el agente está analizando todo el proyecto. Lo primero que hace es entender la estructura de carpetas, revisar los archivos existentes, y luego empezar a generar el código necesario.
>
> Noten que usé 'use context7' al inicio - esto hace que Copilot consulte la documentación actual de Next.js 15, Prisma, y Supabase para darnos código actualizado.
>
> **Un tip importante:** siempre revisen lo que la IA genera antes de aceptarlo. El Agent Mode es poderoso pero no infalible. Lean el resumen que da después de cada cambio."

---

### 🎬 BLOQUE 4: BASE DE DATOS CON PRISMA (20:00 - 32:00)

---

#### [LO QUE DIGO]

> "Perfecto, ahora vamos a ver el schema de Prisma que generó. Les voy a explicar la estructura..."

#### [SCHEMA ESPERADO - EXPLICACIÓN]

```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id            String    @id @default(cuid())
  email         String    @unique
  name          String?
  avatarUrl     String?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  
  chats         Chat[]
  files         UploadedFile[]
  predictions   TechnicalPrediction[]
}

model Chat {
  id            String    @id @default(cuid())
  title         String    @default("Nueva conversación")
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  
  userId        String
  user          User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  messages      Message[]
  files         UploadedFile[]
  prediction    TechnicalPrediction?
}

model Message {
  id            String    @id @default(cuid())
  role          String    // 'user' | 'assistant' | 'system'
  content       String    @db.Text
  createdAt     DateTime  @default(now())
  
  chatId        String
  chat          Chat      @relation(fields: [chatId], references: [id], onDelete: Cascade)
}

model UploadedFile {
  id            String    @id @default(cuid())
  filename      String
  originalName  String
  mimeType      String
  size          Int
  url           String
  extractedText String?   @db.Text
  createdAt     DateTime  @default(now())
  
  chatId        String
  chat          Chat      @relation(fields: [chatId], references: [id], onDelete: Cascade)
  
  userId        String
  user          User      @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model TechnicalPrediction {
  id              String    @id @default(cuid())
  
  // Stack tecnológico recomendado
  technologies    Json      // Array de tecnologías
  
  // Perfiles requeridos
  teamProfiles    Json      // Array de perfiles con roles y conocimientos
  
  // Tiempo estimado
  estimatedWeeks  Int
  estimatedHours  Int
  
  // Costos (basados en tarifas mexicanas)
  hourlyRate      Decimal   @db.Decimal(10, 2)  // Tarifa por hora en MXN
  totalCostMXN    Decimal   @db.Decimal(12, 2)  // Costo total en MXN
  totalCostUSD    Decimal   @db.Decimal(12, 2)  // Costo total en USD
  
  // Desglose del cálculo
  costBreakdown   Json      // Desglose detallado
  
  createdAt       DateTime  @default(now())
  
  chatId          String    @unique
  chat            Chat      @relation(fields: [chatId], references: [id], onDelete: Cascade)
  
  userId          String
  user            User      @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```

#### [LO QUE DIGO]

> "Este schema tiene todo lo que necesitamos:
>
> - **User**: usuarios de nuestra aplicación
> - **Chat**: cada conversación individual
> - **Message**: los mensajes dentro de cada chat
> - **UploadedFile**: los documentos que sube el usuario
> - **TechnicalPrediction**: la estimación técnica que genera la IA
>
> Ahora necesitamos generar las migraciones. Le voy a pedir a Copilot que nos ayude..."

#### [PROMPT PARA MIGRACIONES]

```
Ahora necesito que:

1. Instales Prisma si no está instalado: npm install prisma @prisma/client
2. Generes la migración inicial: npx prisma migrate dev --name init
3. Generes el cliente de Prisma: npx prisma generate

Dame los comandos exactos que debo ejecutar en la terminal y ayúdame a verificar que todo esté sincronizado correctamente.
```

#### [LO QUE DIGO MIENTRAS SE EJECUTAN COMANDOS]

> "Miren, el agente puede ejecutar comandos directamente en la terminal. Esto es algo que Cursor también tiene. Siempre revisen los comandos antes de permitir que se ejecuten - especialmente comandos que modifican la base de datos.
>
> Aquí estamos ejecutando:
> - `npm install prisma @prisma/client` para instalar las dependencias
> - `npx prisma migrate dev --name init` para crear la migración inicial
> - `npx prisma generate` para generar el cliente TypeScript"

---

### 🎬 BLOQUE 5: AUTENTICACIÓN Y SUBIDA DE ARCHIVOS (32:00 - 42:00)

---

#### [LO QUE DIGO]

> "Ahora viene una parte crucial: la autenticación. Vamos a usar **Supabase Auth** porque:
> 
> 1. Ya tenemos Supabase configurado para la base de datos
> 2. Incluye autenticación, base de datos Y storage en un solo servicio
> 3. Tiene un plan gratuito muy generoso
> 4. Funciona perfectamente con Next.js 15
>
> **¿Qué es Supabase?** Es una alternativa open-source a Firebase. Nos da PostgreSQL, autenticación, almacenamiento de archivos, y funciones edge, todo gratis hasta cierto límite de uso."

#### [PROMPT PARA AUTENTICACIÓN]

```
use context7

Implementa la autenticación completa con Supabase Auth para el proyecto. Necesito:

1. **Instalar las dependencias necesarias:**
   - @supabase/supabase-js
   - @supabase/ssr (para Next.js App Router)

2. **Configurar el cliente de Supabase:**
   - Cliente para el browser
   - Cliente para el servidor
   - Middleware para manejar sesiones

3. **Actualizar la página de login:**
   - Formulario real de email/password
   - Opción de registro
   - Manejo de errores
   - Redirección después del login

4. **Proteger las rutas:**
   - Middleware que verifique la sesión
   - Redirigir a /login si no está autenticado

5. **Variables de entorno necesarias:**
   - NEXT_PUBLIC_SUPABASE_URL
   - NEXT_PUBLIC_SUPABASE_ANON_KEY

Además, implementa la funcionalidad de subida de archivos:

1. **Configurar Supabase Storage:**
   - Bucket para documentos de usuarios
   - Políticas de acceso (solo el dueño puede ver sus archivos)

2. **API Route para subir archivos:**
   - POST /api/files/upload
   - Validar tipos de archivo (PDF, DOCX, TXT)
   - Subir a Supabase Storage
   - Guardar metadata en la base de datos

3. **Extraer texto de los documentos:**
   - Para PDF: usar pdf-parse
   - Para DOCX: usar mammoth
   - Para TXT: leer directamente

Usa las mejores prácticas de seguridad de 2026.
```

#### [LO QUE DIGO SOBRE DOCUMENTACIÓN EN PROMPTS]

> "Aquí quiero hacer una pausa importante. **¿Por qué usamos 'use context7'?**
>
> En Cursor tenemos la capacidad de agregar documentación directamente con @docs. Pero en GitHub Copilot, Context7 hace algo similar: le da acceso a la documentación actualizada de las bibliotecas.
>
> **Cuando NO tienes Context7 o integración automática de docs**, la mejor práctica es incluir fragmentos de documentación directamente en tus prompts. Por ejemplo..."

#### [EJEMPLO DE PROMPT CON DOCUMENTACIÓN]

```
Según la documentación oficial de Supabase para Next.js App Router (2026):

"""
Para el App Router de Next.js 13+, usa @supabase/ssr:

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: cookieStore }
  )
}
"""

Basándote en esta documentación, implementa el cliente de Supabase correctamente para nuestro proyecto...
```

#### [LO QUE DIGO]

> "¿Ven cómo incluí un fragmento de la documentación? Esto le da contexto preciso a la IA y reduce significativamente los errores. Esta técnica es especialmente útil cuando:
> 
> 1. La biblioteca es muy nueva o tuvo cambios recientes
> 2. Hay múltiples formas de hacer algo y quieres una específica
> 3. Estás usando una versión específica que puede diferir del training data"

---

### 🎬 BLOQUE 6: PREDICCIÓN TÉCNICA CON IA (42:00 - 50:00)

---

#### [LO QUE DIGO]

> "Ahora viene la funcionalidad principal de nuestra PWA: la predicción técnica. Cuando el usuario suba sus documentos y chatee con la IA, el sistema debe poder generar una estimación completa con:
>
> - Stack tecnológico recomendado
> - Perfiles del equipo necesarios  
> - Tiempo estimado
> - **Costo total basado en tarifas reales de México**
>
> Para los costos, investigué las tarifas actuales de desarrollo de software en México. Basándome en datos del mercado mexicano para 2025-2026:"

#### [INFORMACIÓN DE COSTOS REALES - MÉXICO 2025-2026]

> "**Tarifas de desarrollo de software en México (2025-2026):**
>
> | Nivel | $/hora (USD) | $/hora (MXN) | Salario mensual (MXN) |
> |-------|--------------|--------------|----------------------|
> | Junior | $25-40 | $500-800 | $15,000 - $25,000 |
> | Mid-level | $40-65 | $800-1,300 | $25,000 - $40,000 |
> | Senior | $65-100 | $1,300-2,000 | $40,000 - $60,000 |
> | Lead/Architect | $80-120 | $1,600-2,400 | $60,000 - $90,000 |
>
> **Promedio para proyectos gubernamentales/institucionales:**
> - El INEEL y otras instituciones gubernamentales en México suelen contratar desarrollo de sistemas a través de licitaciones
> - Las tarifas promedio rondan los **$800-1,500 MXN/hora** para desarrollo de sistemas
> - Para un proyecto completo, se considera un promedio de **$1,000 MXN/hora** (aproximadamente $50 USD/hora)
>
> **Fuentes consultadas:**
> - Estudios salariales de México 2025 (Glassdoor, Indeed, Computrabajo)
> - Licitaciones públicas del INEEL y CFE para desarrollo de software
> - Encuestas de la industria de TI mexicana"

#### [PROMPT PARA PREDICCIÓN TÉCNICA]

```
use context7

Crea el sistema completo de predicción técnica para nuestro proyecto. Necesito:

1. **Un system prompt especializado para el análisis de requerimientos:**
   El prompt debe hacer que la IA:
   - Analice los documentos subidos y los mensajes del usuario
   - Haga preguntas de clarificación hasta entender el alcance completo
   - Cuando tenga suficiente información, genere automáticamente la predicción

2. **API Route: POST /api/predictions/generate**
   Que reciba el chatId y genere la predicción técnica con:
   - technologies: array de tecnologías recomendadas con justificación
   - teamProfiles: array de perfiles (rol, conocimientos, seniority, cantidad)
   - estimatedWeeks: tiempo estimado en semanas
   - estimatedHours: horas totales de desarrollo
   - Cálculo de costos usando estas tarifas mexicanas (2026):
     * Desarrollador Junior: $500 MXN/hora
     * Desarrollador Mid: $1,000 MXN/hora
     * Desarrollador Senior: $1,500 MXN/hora
     * Tech Lead: $2,000 MXN/hora
   - Tipo de cambio: 1 USD = 20 MXN

3. **Componente de visualización de la predicción:**
   - Tarjetas visuales para cada sección
   - Gráficos si es posible (tiempo, costos)
   - Exportar a PDF

4. **Lógica para detectar cuándo generar la predicción:**
   - Después de X mensajes de clarificación
   - O cuando el usuario lo solicite explícitamente

El cálculo debe ser realista y basarse en las tarifas mencionadas que son estándares del mercado mexicano institucional/gubernamental.
```

#### [LO QUE DIGO]

> "Fíjense cómo le di las tarifas exactas a la IA. Esto es importante porque:
>
> 1. Los datos de entrenamiento pueden tener tarifas desactualizadas
> 2. Queremos que los cálculos reflejen el mercado mexicano real
> 3. Podemos justificar estos números ante clientes o instituciones
>
> La IA ahora va a generar una predicción que tenga sentido con la realidad del mercado mexicano."

---

### 🎬 BLOQUE 7: RESOLUCIÓN DE BUGS CON IA (Ejemplo Práctico)

---

#### [LO QUE DIGO]

> "Antes de pasar a producción, quiero mostrarles una técnica crucial para debuggear con IA. Cuando algo no funciona, esta es mi estrategia:
>
> 1. **Agregar console.log() o logs estructurados** en puntos clave
> 2. **Reproducir el error** y copiar la información del log
> 3. **Darle ese contexto a la IA** con un prompt específico"

#### [EJEMPLO DE FLUJO DE DEBUGGING]

```javascript
// Agregar logs en el código
console.log('🔍 [DEBUG] User data:', { userId, email });
console.log('🔍 [DEBUG] Request body:', JSON.stringify(body, null, 2));
console.log('🔍 [DEBUG] API Response:', { status, data });
```

#### [PROMPT PARA RESOLVER BUGS]

```
Estoy obteniendo este error al intentar guardar un mensaje en la base de datos:

"""
Error: PrismaClientKnownRequestError
Code: P2003
Message: Foreign key constraint failed on the field: `Message_chatId_fkey`

Logs del debug:
🔍 [DEBUG] User data: { userId: 'abc123', email: 'user@test.com' }
🔍 [DEBUG] Chat creation: { chatId: 'xyz789', userId: 'abc123' }
🔍 [DEBUG] Message save attempt: { chatId: 'xyz789', content: 'Hola' }
"""

El flujo es: usuario hace login -> crea nuevo chat -> envía mensaje.
El chat se crea correctamente pero el mensaje falla.

¿Qué está fallando y cómo lo soluciono?
```

#### [LO QUE DIGO]

> "¿Ven cómo le di todo el contexto? El error específico, los logs que me muestran el flujo, y una descripción de lo que estaba intentando hacer. Con esta información, la IA puede identificar que probablemente hay un problema de timing - el chat no se ha persistido completamente cuando intentamos guardar el mensaje.
>
> Esta técnica me ha ahorrado horas de debugging. La clave es darle a la IA exactamente lo que está pasando, no solo el mensaje de error."

---

### 🎬 BLOQUE 8: PREPARACIÓN Y DEPLOY A VERCEL (50:00 - 58:00)

---

#### [LO QUE DIGO]

> "¡Excelente! Ya tenemos casi todo listo. Ahora vamos a preparar el proyecto para producción y desplegarlo en Vercel.
>
> **¿Qué es Vercel?** Es la plataforma creada por los mismos desarrolladores de Next.js. Es ideal para nuestro proyecto porque:
> 
> 1. Integración perfecta con Next.js
> 2. Deploy automático desde GitHub
> 3. Edge Functions para mejor rendimiento
> 4. Plan gratuito generoso para proyectos personales
> 5. Manejo automático de SSL y dominios"

#### [PROMPT PARA PRODUCCIÓN]

```
use context7

Quiero que dejes el sitio listo para producción en Vercel. Dame un paso a paso detallado incluyendo:

1. **Verificación del proyecto:**
   - Ejecutar npm run build y corregir cualquier error
   - Verificar que todas las variables de entorno estén configuradas
   - Revisar que no haya console.log innecesarios

2. **Configuración de next.config.ts:**
   - Optimizar imágenes
   - Configurar headers de seguridad
   - Habilitar PWA si no está habilitado

3. **Variables de entorno para Vercel:**
   Listarme todas las variables que necesito configurar:
   - DATABASE_URL
   - OPENROUTER_API_KEY
   - NEXT_PUBLIC_SUPABASE_URL
   - NEXT_PUBLIC_SUPABASE_ANON_KEY
   - Cualquier otra que se necesite

4. **Comandos de deploy:**
   - Cómo conectar el repo de GitHub
   - Configuración recomendada en Vercel
   - Cómo hacer el primer deploy

5. **Post-deploy:**
   - Verificar que las migraciones de Prisma se ejecutaron
   - Configurar el dominio de Supabase para production
   - Probar todas las funcionalidades

Dame los comandos exactos y las configuraciones paso a paso.
```

#### [LO QUE DIGO MIENTRAS TRABAJA]

> "Vercel hace que el deploy sea increíblemente simple. Básicamente:
>
> 1. Creamos una cuenta en vercel.com (gratis)
> 2. Conectamos nuestro repositorio de GitHub
> 3. Configuramos las variables de entorno
> 4. ¡Deploy!
>
> Cada vez que hagamos push a main, Vercel automáticamente hace un nuevo deploy. También nos da previews para cada pull request.
>
> **Importante sobre las variables de entorno:** nunca pongan las API keys directamente en el código. Siempre usen variables de entorno, y en Vercel las configuran en el dashboard del proyecto."

#### [PASOS EN VERCEL]

```markdown
## Deploy a Vercel - Paso a Paso

1. **Ir a vercel.com y crear cuenta** (pueden usar GitHub para login)

2. **Nuevo proyecto:**
   - Click en "Add New" -> "Project"
   - Importar desde GitHub
   - Seleccionar el repositorio del taller

3. **Configurar variables de entorno:**
   - DATABASE_URL=postgresql://postgres...
   - OPENROUTER_API_KEY=sk-or-v1-...
   - NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
   - NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...

4. **Configurar Build Settings:**
   - Framework: Next.js (detectado automáticamente)
   - Build Command: npx prisma generate && next build
   - Output Directory: .next

5. **Deploy!**
   - Click en "Deploy"
   - Esperar 2-3 minutos
   - ¡Listo! Ya tienen su URL pública
```

---

### 🎬 BLOQUE 9: COMMIT FINAL Y CIERRE (58:00 - 60:00)

---

#### [LO QUE DIGO]

> "Perfecto, ya tenemos todo funcionando. Ahora vamos a hacer el commit final con un mensaje convencional que describa todo lo que hicimos hoy."

#### [PROMPT PARA COMMIT]

```
Genera un mensaje de commit convencional (Conventional Commits) que resuma todos los cambios realizados hoy para finalizar el proyecto. El mensaje debe:

1. Usar el formato: type(scope): description
2. Incluir un cuerpo con el detalle de los cambios
3. Mencionar los features principales implementados:
   - Base de datos con Prisma
   - Autenticación con Supabase
   - Subida de archivos
   - Predicción técnica
   - Preparación para producción
```

#### [EJEMPLO DE COMMIT GENERADO]

```
feat(core): complete project implementation with auth, db, and predictions

feat: implement full authentication system with Supabase Auth
feat: add Prisma schema with User, Chat, Message, File, Prediction models
feat: create file upload functionality for PDF, DOCX, TXT
feat: implement technical prediction engine with Mexican market rates
chore: configure project for Vercel production deployment
docs: add environment variable templates

BREAKING CHANGE: requires Supabase and database configuration

This commit completes the AI-powered requirements analysis PWA with:
- Real-time chat with OpenRouter integration
- Document upload and text extraction
- Technical predictions including:
  - Technology stack recommendations
  - Team profile requirements
  - Time and cost estimations (based on Mexican rates 2026)
- Full authentication flow
- Production-ready configuration for Vercel
```

#### [LO QUE DIGO PARA CERRAR]

> "¡Y eso es todo! En una hora hemos logrado:
>
> ✅ Conectar la base de datos completa con Prisma y Supabase
> ✅ Implementar autenticación real
> ✅ Agregar subida y procesamiento de archivos
> ✅ Crear el sistema de predicción técnica con costos reales de México
> ✅ Preparar y desplegar a producción
>
> **Las herramientas de IA realmente cambian la velocidad de desarrollo.** Lo que antes tomaba días o semanas, ahora se puede hacer en horas.
>
> **Recuerden los puntos clave:**
>
> 1. **Siempre incluyan contexto en sus prompts** - documentación, ejemplos, restricciones
> 2. **Usen '2026' o 'mejores prácticas actuales'** para obtener código moderno
> 3. **Revisen siempre lo que genera la IA** - no acepten ciegamente
> 4. **Debuggeen con contexto** - denle logs y errores específicos a la IA
> 5. **Cualquier herramienta funciona** - Copilot, Cursor, Antigravity... lo importante es saber usarla
>
> ¿Alguna pregunta final?
>
> ¡Gracias a todos por participar en este taller! El repositorio está en GitHub para que puedan revisarlo. ¡Mucho éxito aplicando estas herramientas en sus proyectos!"

---

## 📚 APÉNDICE: PROMPTS ADICIONALES DE REFERENCIA

### Para cuando algo no funciona

```
Estoy intentando [describir la acción] pero obtengo este error:

[pegar error completo]

Mi configuración es:
- Next.js 15.5.6
- React 19.1.0
- Node.js [versión]
- [otras dependencias relevantes]

Este es el código relevante:
[pegar código]

¿Qué está mal y cómo lo corrijo? Usa las mejores prácticas de 2026.
```

### Para optimizar rendimiento

```
use context7

Revisa este componente/función y optimízalo para mejor rendimiento en Next.js 15:

[pegar código]

Considera:
- Server Components vs Client Components
- Memoización donde sea necesario
- Lazy loading si aplica
- Reducción de re-renders
```

### Para agregar nueva funcionalidad

```
use context7

Necesito agregar [describir funcionalidad] a mi proyecto Next.js 15.

El contexto actual es:
- [describir arquitectura actual]
- [tecnologías usadas]

Requisitos:
- [requisito 1]
- [requisito 2]

Genera el código siguiendo las mejores prácticas de 2026 y explícame las decisiones de diseño.
```

---

## 🔧 CHECKLIST TÉCNICO DEL PROYECTO

### Variables de Entorno Requeridas (.env)

```env
# Base de datos (Supabase Postgres)
DATABASE_URL="postgresql://postgres.[proyecto]:[password]@aws-0-[region].pooler.supabase.com:5432/postgres?sslmode=require"

# OpenRouter
OPENROUTER_API_KEY="sk-or-v1-..."

# Supabase
NEXT_PUBLIC_SUPABASE_URL="https://[proyecto].supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJ..."

# Para producción en Vercel (adicionales)
NEXTAUTH_SECRET="[generar con: openssl rand -base64 32]"
NEXTAUTH_URL="https://tu-dominio.vercel.app"
```

### Dependencias a Instalar

```bash
# Base de datos
npm install prisma @prisma/client

# Supabase
npm install @supabase/supabase-js @supabase/ssr

# Procesamiento de archivos
npm install pdf-parse mammoth

# PWA (opcional)
npm install next-pwa
```

### Estructura de Carpetas Final

```
taller-pwa/
├── app/
│   ├── api/
│   │   ├── chat/
│   │   │   ├── route.ts
│   │   │   └── stream/route.ts
│   │   ├── files/
│   │   │   └── upload/route.ts
│   │   └── predictions/
│   │       └── generate/route.ts
│   ├── components/
│   │   ├── ChatArea.tsx
│   │   ├── MessageInput.tsx
│   │   ├── Sidebar.tsx
│   │   ├── FileUpload.tsx
│   │   └── PredictionCard.tsx
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts
│   │   │   └── server.ts
│   │   ├── prisma.ts
│   │   └── openrouter-client.ts
│   ├── login/
│   │   └── page.tsx
│   └── page.tsx
├── prisma/
│   └── schema.prisma
├── middleware.ts
└── .env
```

---

## 🎓 RECURSOS ADICIONALES

1. **Documentación oficial:**
   - Next.js 15: https://nextjs.org/docs
   - Prisma: https://www.prisma.io/docs
   - Supabase: https://supabase.com/docs
   - OpenRouter: https://openrouter.ai/docs

2. **GitHub del proyecto:**
   - [Tu repositorio aquí]

3. **Tarifas de desarrollo en México:**
   - Glassdoor México
   - Indeed México
   - Computrabajo
   - Licitaciones públicas del INEEL/CFE

---

*Guion preparado para el Día 5 del Taller de Desarrollo de Software con Herramientas de IA*
*Fecha de creación: 19 de Enero de 2026*
*Duración estimada: 60 minutos*
