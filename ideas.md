# Sistema de Estimación de Costos de Desarrollo de Software

## 1. VISIÓN GENERAL DEL SISTEMA

### 1.1 Propósito
Aplicación web inteligente para estimar automáticamente el tiempo y costo de desarrollo de proyectos de software mediante análisis de especificaciones técnicas y machine learning, proporcionando estimaciones precisas basadas en datos históricos y parámetros del mercado.

### 1.2 Stack Tecnológico
- **Frontend/Backend:** Next.js 14+ (App Router)
- **Base de Datos:** Supabase (PostgreSQL)
- **IA/LLM:** OpenRouter API (acceso a múltiples modelos)
- **Despliegue:** Vercel
- **Autenticación:** Supabase Auth
- **Almacenamiento:** Supabase Storage (para PDFs)

---

## 2. ARQUITECTURA DEL SISTEMA

### 2.1 Capas de la Aplicación

```
┌─────────────────────────────────────┐
│     CAPA DE PRESENTACIÓN            │
│  (Next.js Frontend - React)         │
└─────────────────────────────────────┘
           ↓
┌─────────────────────────────────────┐
│     CAPA DE LÓGICA DE NEGOCIO       │
│  (Next.js API Routes/Server Actions)│
└─────────────────────────────────────┘
           ↓
┌──────────────┬──────────────────────┐
│   OpenRouter │      Supabase        │
│   (LLM API)  │   (Base de Datos)    │
└──────────────┴──────────────────────┘
```

### 2.2 Módulos Principales

1. **Módulo de Chat Inteligente**
2. **Módulo de Análisis de Especificaciones**
3. **Módulo de Gestión de Personal**
4. **Módulo de Estimación de Costos**
5. **Módulo de Aprendizaje Continuo**
6. **Módulo de Reportes**
7. **Módulo de Integración Externa**

---

## 3. COMPONENTES DETALLADOS

### 3.1 MÓDULO DE CHAT INTELIGENTE

#### Función Principal
Interfaz conversacional tipo ChatGPT donde el usuario carga especificaciones en PDF y conversa con la IA para refinar requisitos.

#### Componentes Técnicos

**a) Interfaz de Usuario (UI/UX)**
- **Componente:** `ChatInterface.tsx`
- **Funcionalidad:**
  - Layout similar a ChatGPT/Claude (sidebar + área de chat)
  - Drag & drop para PDFs
  - Historial de conversaciones
  - Markdown rendering para respuestas formateadas
  - Streaming de respuestas en tiempo real
- **Mejoras sugeridas:**
  - Multi-modal: aceptar imágenes de diagramas
  - Sugerencias contextuales mientras escribe
  - Comandos rápidos (/analizar, /estimar, /personal)
  - Temas claro/oscuro

**b) Procesador de Documentos**
- **Componente:** `DocumentProcessor.ts`
- **Funcionalidad:**
  - Extracción de texto de PDFs (pdf-parse o pdf.js)
  - Chunking inteligente para contexto del LLM
  - Detección de secciones (requisitos, arquitectura, funcionalidades)
- **Mejoras sugeridas:**
  - OCR para PDFs escaneados
  - Soporte para Word, Excel
  - Extracción de diagramas UML

**c) Gestor de Conversaciones**
- **Componente:** `ConversationManager.ts`
- **Funcionalidad:**
  - Manejo de contexto conversacional
  - Integración con OpenRouter
  - Streaming de respuestas
  - Manejo de errores y reintentos
- **Mejoras sugeridas:**
  - Cambio dinámico de modelo LLM
  - Comparación de respuestas entre modelos
  - Caché de respuestas comunes

---

### 3.2 MÓDULO DE ANÁLISIS DE ESPECIFICACIONES

#### Función Principal
Analiza automáticamente las especificaciones técnicas y determina perfiles, tecnologías y arquitectura requerida.

#### Componentes Técnicos

**a) Analizador de Requisitos**
- **Componente:** `RequirementsAnalyzer.ts`
- **Funcionalidad:**
  - Prompt engineering para extracción estructurada
  - Identificación de requisitos funcionales/no funcionales
  - Clasificación por complejidad (baja/media/alta)
  - Detección de módulos y funcionalidades
- **Prompt Template:**
```
Analiza las siguientes especificaciones y extrae:
1. Lista de funcionalidades principales
2. Complejidad de cada funcionalidad (1-10)
3. Tecnologías mencionadas o recomendadas
4. Integraciones con servicios externos
5. Requisitos de seguridad y rendimiento
```

**b) Detector de Stack Tecnológico**
- **Componente:** `TechStackDetector.ts`
- **Funcionalidad:**
  - Identifica tecnologías mencionadas en specs
  - Recomienda stack basado en requisitos
  - Valida compatibilidad tecnológica
- **Tecnologías a detectar:**
  - Bases de datos (PostgreSQL, MongoDB, MySQL, etc.)
  - Lenguajes (JavaScript, Python, Java, etc.)
  - Frameworks (React, Vue, Django, etc.)
  - Cloud providers (AWS, Azure, GCP)
  - APIs y servicios (Stripe, Twilio, etc.)

**c) Perfilador de Personal**
- **Componente:** `StaffProfiler.ts`
- **Funcionalidad:**
  - Determina roles necesarios (Frontend, Backend, DevOps, QA, UI/UX)
  - Define niveles requeridos (Junior/Semi-Senior/Senior)
  - Calcula cantidad de personas por rol
  - Genera matriz de habilidades requeridas
- **Mejoras sugeridas:**
  - Recomendaciones de upskilling del personal actual
  - Identificación de gaps de conocimiento

---

### 3.3 MÓDULO DE GESTIÓN DE PERSONAL

#### Función Principal
Registra y gestiona el historial, habilidades y experiencia del equipo de desarrollo.

#### Componentes Técnicos

**a) Base de Datos de Personal**

**Tablas Supabase:**

```sql
-- Tabla: developers
CREATE TABLE developers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT UNIQUE,
  level TEXT CHECK (level IN ('junior', 'semi-senior', 'senior')),
  hourly_rate DECIMAL(10,2),
  availability_percentage INTEGER DEFAULT 100,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tabla: developer_skills
CREATE TABLE developer_skills (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  developer_id UUID REFERENCES developers(id),
  skill_name TEXT NOT NULL,
  proficiency INTEGER CHECK (proficiency BETWEEN 1 AND 10),
  years_experience DECIMAL(3,1)
);

-- Tabla: developer_projects
CREATE TABLE developer_projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  developer_id UUID REFERENCES developers(id),
  project_name TEXT,
  role TEXT,
  hours_worked INTEGER,
  technologies_used TEXT[],
  complexity_level INTEGER CHECK (complexity_level BETWEEN 1 AND 10),
  lines_of_code INTEGER,
  modules_developed INTEGER,
  start_date DATE,
  end_date DATE
);
```

**b) Sistema de Matching**
- **Componente:** `DeveloperMatcher.ts`
- **Funcionalidad:**
  - Algoritmo de matching entre requisitos y personal disponible
  - Scoring de compatibilidad (0-100%)
  - Recomendaciones de asignación
- **Criterios de Matching:**
  - Experiencia en tecnologías requeridas
  - Complejidad manejada previamente
  - Disponibilidad actual
  - Costo vs presupuesto
- **Mejoras sugeridas:**
  - ML para predicción de éxito de asignación
  - Consideración de química de equipo

**c) Historial y Métricas**
- **Componente:** `DeveloperMetrics.ts`
- **Funcionalidad:**
  - Cálculo de velocidad promedio (líneas/hora)
  - Índice de calidad (bugs/módulo)
  - Especialización por tecnología
  - Tendencias de productividad

---

### 3.4 MÓDULO DE ESTIMACIÓN DE COSTOS

#### Función Principal
Calcula estimaciones de tiempo y costo usando modelos paramétricos y datos históricos.

#### Componentes Técnicos

**a) Motor de Estimación Multi-Modelo**
- **Componente:** `EstimationEngine.ts`

**Modelos Implementados:**

1. **Estimación Paramétrica (COCOMO II)**
```typescript
// Fórmula base: Esfuerzo = A × (Tamaño)^B × M
// A = constante (2.94 para COCOMO II)
// B = exponente de escala (1.0 - 1.2)
// M = multiplicadores de esfuerzo
```

2. **Estimación por Puntos de Función**
```typescript
// PF = (ILF × 10) + (EIF × 7) + (EI × 4) + (EO × 5) + (EQ × 4)
// Esfuerzo = PF × Factor_Complejidad × Factor_Tecnología
```

3. **Estimación Basada en IA (Propuesta)**
```typescript
// Utiliza embeddings de especificaciones similares
// Busca proyectos parecidos en historial
// Ajusta con factores contextuales
```

**b) Calculadora de Costos**
- **Componente:** `CostCalculator.ts`
- **Funcionalidad:**
  - Cálculo de HH (Hombre-Hora) por módulo
  - Aplicación de tarifas por nivel de desarrollador
  - Costos indirectos (overhead, infraestructura)
  - Conversión de monedas (MXN/USD)

**Estructura de Costos:**
```typescript
interface CostBreakdown {
  directCosts: {
    seniorHours: number;
    semiSeniorHours: number;
    juniorHours: number;
    totalHours: number;
    laborCost: number;
  };
  indirectCosts: {
    hosting: number;
    aiServices: number;
    licenses: number;
    other: number;
  };
  moduleBreakdown: ModuleCost[];
  totalCost: number;
  currency: 'MXN' | 'USD';
}
```

**c) Gestor de Tarifas de Mercado**
- **Componente:** `MarketRatesManager.ts`
- **Funcionalidad:**
  - CRUD de tarifas por país/región
  - Actualización automática desde APIs externas
  - Histórico de tarifas para análisis de tendencias

**Tabla Supabase:**
```sql
CREATE TABLE market_rates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  country TEXT NOT NULL,
  role TEXT NOT NULL,
  level TEXT NOT NULL,
  hourly_rate_min DECIMAL(10,2),
  hourly_rate_max DECIMAL(10,2),
  currency TEXT DEFAULT 'USD',
  source TEXT,
  last_updated TIMESTAMP DEFAULT NOW()
);
```

**d) Motor de Ajuste Dinámico**
- **Componente:** `DynamicAdjuster.ts`
- **Funcionalidad:**
  - Factores de ajuste (riesgo, urgencia, calidad)
  - Buffer para incertidumbre (típicamente 15-25%)
  - Descuentos por volumen o cliente recurrente
- **Mejoras sugeridas:**
  - ML para predecir probabilidad de retraso
  - Análisis de sentimiento del cliente para priorización

---

### 3.5 MÓDULO DE APRENDIZAJE CONTINUO

#### Función Principal
Sistema de retroalimentación que mejora estimaciones futuras basado en resultados reales.

#### Componentes Técnicos

**a) Sistema de Feedback**
- **Componente:** `FeedbackCollector.tsx`
- **Funcionalidad:**
  - Formulario para registrar HH reales vs estimadas
  - Registro de desviaciones y causas
  - Notas sobre dificultades encontradas

**Tabla Supabase:**
```sql
CREATE TABLE project_feedback (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  estimation_id UUID REFERENCES estimations(id),
  estimated_hours INTEGER,
  actual_hours INTEGER,
  deviation_percentage DECIMAL(5,2),
  deviation_reasons TEXT[],
  lessons_learned TEXT,
  completed_at TIMESTAMP DEFAULT NOW()
);
```

**b) Analizador de Desviaciones**
- **Componente:** `DeviationAnalyzer.ts`
- **Funcionalidad:**
  - Identifica patrones en desviaciones
  - Categoriza razones comunes de retrasos
  - Genera insights accionables
- **Métricas clave:**
  - MAPE (Mean Absolute Percentage Error)
  - Bias (sobre/sub estimación)
  - Precisión por tipo de proyecto

**c) Motor de Ajuste de Modelos**
- **Componente:** `ModelTuner.ts`
- **Funcionalidad:**
  - Ajuste de coeficientes de modelos paramétricos
  - Actualización de vectores de similitud
  - Re-entrenamiento periódico
- **Estrategia:**
  - Cada 10 proyectos completados: ajuste fino
  - Mensual: análisis de precisión global
  - Anual: revisión completa de modelos

**Mejoras sugeridas:**
- **Integración con OpenRouter para fine-tuning:**
  - Crear dataset estructurado de estimaciones vs realidad
  - Usar pocos proyectos como ejemplos (few-shot learning)
  - Prompt dinámico que incluye desviaciones históricas

---

### 3.6 MÓDULO DE REPORTES

#### Función Principal
Genera documentos profesionales con la estimación completa y desglose detallado.

#### Componentes Técnicos

**a) Generador de Reportes**
- **Componente:** `ReportGenerator.tsx`
- **Funcionalidad:**
  - Templates personalizables
  - Exportación a PDF (react-pdf o jsPDF)
  - Gráficos y visualizaciones (recharts)
  - Branding corporativo

**Estructura del Reporte:**

```markdown
# Reporte de Estimación de Proyecto

## 1. Resumen Ejecutivo
- Cliente: [Nombre]
- Fecha: [DD/MM/YYYY]
- Costo Total: [Monto]
- Tiempo de Desarrollo: [X semanas/meses]

## 2. Alcance de Desarrollo
- Objetivos del proyecto
- Funcionalidades principales
- Exclusiones

## 3. Arquitectura del Sistema
- Stack tecnológico
- Diagrama de arquitectura (generado por IA)
- Integraciones externas

## 4. Equipo Requerido
- Roles y niveles
- Horas por rol
- Costo por especialista

## 5. Estimación de Esfuerzo
- Total de HH
- Desglose por fase (análisis, diseño, desarrollo, testing, despliegue)
- Cronograma propuesto

## 6. Desglose de Costos
### 6.1 Costos Directos
- [Tabla con módulos y costos]

### 6.2 Costos Indirectos
- Hosting: $XXX/mes
- Servicios IA: $XXX/mes
- Licencias: $XXX

### 6.3 Costo Total
- Subtotal: $XXX
- IVA (16%): $XXX
- Total: $XXX

## 7. Supuestos y Riesgos
- Supuestos considerados
- Riesgos identificados
- Plan de mitigación

## 8. Términos y Condiciones
- Forma de pago
- Garantías
- Mantenimiento post-lanzamiento
```

**b) Dashboard de Métricas**
- **Componente:** `MetricsDashboard.tsx`
- **Funcionalidad:**
  - Vista general de estimaciones activas
  - KPIs de precisión
  - Comparativas históricas
- **Visualizaciones:**
  - Gráfico de tendencias de precisión
  - Distribución de proyectos por tamaño
  - Utilización de personal
  - ROI de proyectos

**c) Comparador de Estimaciones**
- **Componente:** `EstimationComparator.tsx`
- **Funcionalidad:**
  - Compara múltiples escenarios (optimista, realista, pesimista)
  - What-if analysis (¿qué pasa si contrato más seniors?)
  - Análisis de sensibilidad

---

### 3.7 MÓDULO DE INTEGRACIÓN EXTERNA

#### Función Principal
Conecta con fuentes de datos externas para enriquecer estimaciones.

#### Componentes Técnicos

**a) Integrador de APIs Financieras**
- **Componente:** `FinancialDataIntegrator.ts`
- **APIs sugeridas:**
  - **Exchangerate API:** Tipo de cambio USD/MXN en tiempo real
  - **Banco de México API:** Datos oficiales de paridad
- **Funcionalidad:**
  - Actualización diaria de tipos de cambio
  - Histórico de conversiones
  - Alertas de variaciones significativas

**b) Scraper de Tarifas de Mercado**
- **Componente:** `MarketRateScraper.ts`
- **Fuentes sugeridas:**
  - Glassdoor API / Web scraping
  - LinkedIn Salary Insights
  - Talent.com API
  - StackOverflow Developer Survey (anual)
- **Funcionalidad:**
  - Actualización semanal/mensual
  - Validación de datos contra múltiples fuentes
  - Normalización por región y experiencia
- **Consideraciones legales:**
  - Respetar términos de servicio
  - Usar APIs oficiales cuando estén disponibles
  - Implementar rate limiting

**c) Conector de Bases de Datos de Costos**
- **Componente:** `CostDatabaseConnector.ts`
- **Funcionalidad:**
  - Integración con plataformas como Upwork, Toptal
  - Benchmarking contra industria
  - Importación de datasets públicos (GitHub, Kaggle)

---

## 4. FLUJO DE TRABAJO DEL SISTEMA

### 4.1 Flujo Principal

```
1. Usuario sube PDF con especificaciones
   ↓
2. Sistema extrae y analiza contenido
   ↓
3. IA identifica:
   - Funcionalidades (módulos)
   - Stack tecnológico
   - Complejidad de cada módulo
   ↓
4. Sistema consulta:
   - Personal disponible
   - Tarifas de mercado
   - Proyectos similares históricos
   ↓
5. Motor de estimación calcula:
   - HH por módulo
   - Costo por módulo
   - Cronograma sugerido
   ↓
6. Usuario revisa y ajusta estimación en chat
   ↓
7. Sistema genera reporte profesional
   ↓
8. [Post-proyecto] Usuario ingresa datos reales
   ↓
9. Sistema aprende y ajusta modelos
```

### 4.2 Flujos Secundarios

**A) Gestión de Personal:**
- Administrador agrega/edita desarrolladores
- Sistema actualiza disponibilidad automática
- Notificaciones de skills gaps

**B) Consulta de Métricas:**
- Usuario accede a dashboard
- Filtra por período, cliente, tecnología
- Exporta reportes de análisis

**C) Actualización de Tarifas:**
- Sistema ejecuta jobs programados (cron)
- Obtiene datos de APIs externas
- Notifica cambios significativos (>10%)

---

## 5. ESQUEMA DE BASE DE DATOS COMPLETO

### Tablas Principales

```sql
-- USUARIOS Y EMPRESAS
CREATE TABLE companies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  industry TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  company_id UUID REFERENCES companies(id),
  role TEXT CHECK (role IN ('admin', 'estimator', 'viewer')),
  created_at TIMESTAMP DEFAULT NOW()
);

-- ESTIMACIONES
CREATE TABLE estimations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  project_name TEXT NOT NULL,
  client_name TEXT,
  status TEXT CHECK (status IN ('draft', 'completed', 'approved', 'rejected')),
  pdf_url TEXT,
  specification_text TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE estimation_modules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  estimation_id UUID REFERENCES estimations(id),
  module_name TEXT NOT NULL,
  description TEXT,
  complexity_level INTEGER CHECK (complexity_level BETWEEN 1 AND 10),
  estimated_hours INTEGER,
  cost DECIMAL(12,2),
  technologies TEXT[]
);

CREATE TABLE estimation_staff (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  estimation_id UUID REFERENCES estimations(id),
  developer_id UUID REFERENCES developers(id),
  role TEXT,
  allocated_hours INTEGER,
  hourly_rate DECIMAL(10,2)
);

-- PERSONAL (ya definido anteriormente)
-- developers, developer_skills, developer_projects

-- COSTOS ADICIONALES
CREATE TABLE additional_costs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  estimation_id UUID REFERENCES estimations(id),
  cost_type TEXT NOT NULL,
  description TEXT,
  monthly_cost DECIMAL(10,2),
  duration_months INTEGER
);

-- CONFIGURACIÓN
CREATE TABLE estimation_models_config (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  model_name TEXT UNIQUE NOT NULL,
  parameters JSONB,
  is_active BOOLEAN DEFAULT TRUE,
  accuracy_score DECIMAL(5,2),
  last_tuned TIMESTAMP
);

CREATE TABLE market_rates (
  -- Ya definida anteriormente
);

CREATE TABLE exchange_rates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  from_currency TEXT,
  to_currency TEXT,
  rate DECIMAL(10,6),
  date DATE NOT NULL,
  UNIQUE(from_currency, to_currency, date)
);

-- APRENDIZAJE
CREATE TABLE project_feedback (
  -- Ya definida anteriormente
);

CREATE TABLE estimation_accuracy_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  estimation_id UUID REFERENCES estimations(id),
  model_used TEXT,
  estimated_hours INTEGER,
  actual_hours INTEGER,
  mape DECIMAL(5,2),
  created_at TIMESTAMP DEFAULT NOW()
);

-- CHAT
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  estimation_id UUID REFERENCES estimations(id),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID REFERENCES conversations(id),
  role TEXT CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## 6. INTEGRACIÓN CON OPENROUTER

### 6.1 Configuración

```typescript
// lib/openrouter.ts
import OpenAI from 'openai';

const openrouter = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY,
  defaultHeaders: {
    'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL,
    'X-Title': 'Software Cost Estimator',
  },
});

export default openrouter;
```

### 6.2 Modelos Recomendados

**Para análisis de especificaciones (precisión):**
- `anthropic/claude-3.5-sonnet` - Mejor para extracción estructurada
- `openai/gpt-4-turbo` - Alternativa robusta

**Para chat conversacional (velocidad + costo):**
- `anthropic/claude-3-haiku` - Rápido y económico
- `google/gemini-pro` - Buena relación calidad-precio

**Para generación de reportes:**
- `anthropic/claude-3-opus` - Mejor calidad de escritura
- `openai/gpt-4` - Excelente para contenido formal

### 6.3 Estrategia de Prompts

**Prompt de Análisis de Especificaciones:**
```typescript
const analysisPrompt = `
Eres un arquitecto de software senior experto en estimaciones. 
Analiza las siguientes especificaciones y extrae en formato JSON:

{
  "projectName": "string",
  "modules": [
    {
      "name": "string",
      "description": "string",
      "complexity": 1-10,
      "estimatedHours": number,
      "technologies": ["string"],
      "dependencies": ["string"]
    }
  ],
  "recommendedStack": {
    "frontend": ["string"],
    "backend": ["string"],
    "database": "string",
    "infrastructure": ["string"]
  },
  "requiredRoles": [
    {
      "role": "string",
      "level": "junior|semi-senior|senior",
      "quantity": number,
      "justification": "string"
    }
  ],
  "externalIntegrations": ["string"],
  "estimatedDuration": "X weeks/months"
}

Especificaciones:
${specifications}
`;
```

---

## 7. FUNCIONALIDADES AVANZADAS (MEJORAS)

### 7.1 Análisis Predictivo
- **Predicción de riesgos:** Usar IA para identificar red flags en especificaciones
- **Probabilidad de éxito:** Score basado en complejidad vs capacidad del equipo
- **Recomendaciones de mitigación:** Sugerencias automáticas de mejores prácticas

### 7.2 Colaboración en Tiempo Real
- **Co-edición de estimaciones:** Múltiples usuarios ajustando parámetros simultáneamente
- **Comentarios y anotaciones:** Sistema de revisión tipo Google Docs
- **Notificaciones:** Alertas cuando estimación es aprobada/rechazada

### 7.3 Integración con Project Management
- **Exportar a Jira/Asana:** Crear automáticamente epics y tareas
- **Sincronización de progreso:** Actualizar HH reales desde PM tools
- **Burndown charts:** Visualización de avance vs estimación

### 7.4 Marketplace de Templates
- **Biblioteca de specs:** Plantillas pre-hechas por tipo de proyecto
- **Componentes reutilizables:** "Módulo de autenticación", "Sistema de pagos", etc.
- **Community-driven:** Usuarios comparten y califican estimaciones

### 7.5 Multi-idioma y Multi-moneda
- **i18n:** Soporte para español, inglés, portugués
- **Localización de tarifas:** Ajustes automáticos por región
- **Conversión de moneda:** Estimaciones en MXN, USD, EUR, etc.

### 7.6 Modo Offline
- **PWA:** Trabajo sin conexión con sincronización posterior
- **Exportación/Importación:** Backup de datos en JSON

### 7.7 Asistente de Voz
- **Dictado de especificaciones:** Grabar reuniones con cliente y transcribir
- **Comandos por voz:** "Genera reporte", "Muestra proyectos similares"

---

## 8. SEGURIDAD Y COMPLIANCE

### 8.1 Autenticación y Autorización
- **Supabase Auth:** Social login (Google, GitHub) + email/password
- **Row Level Security (RLS):** Políticas a nivel de base de datos
- **Roles y permisos:**
  - Admin: acceso completo
  - Estimator: crear/editar estimaciones
  - Viewer: solo lectura

### 8.2 Protección de Datos
- **Encriptación:** PDFs y datos sensibles encriptados en reposo (Supabase)
- **HTTPS:** Todas las comunicaciones cifradas
- **Logs de auditoría:** Registro de acciones críticas

### 8.3 Privacidad
- **GDPR/CCPA:** Derecho a exportar/eliminar datos
- **Anonimización:** Opción de ocultar datos de clientes en métricas
- **Retención de datos:** Políticas configurables de eliminación

---

## 9. PLAN DE IMPLEMENTACIÓN

### Fase 1: MVP (4-6 semanas)
- ✅ Setup de Next.js + Supabase + Vercel
- ✅ Autenticación básica
- ✅ Chat con OpenRouter (modelo único)
- ✅ Upload y parsing de PDFs
- ✅ Estimación paramétrica simple (COCOMO)
- ✅ Generación de reporte básico en PDF

### Fase 2: Core Features (6-8 semanas)
- ✅ Gestión completa de personal
- ✅ Múltiples modelos de estimación
- ✅ Dashboard de métricas
- ✅ Sistema de feedback y aprendizaje básico
- ✅ Integración con API de tipo de cambio

### Fase 3: Advanced Features (8-10 semanas)
- ✅ Matching inteligente de personal
- ✅ Análisis de desviaciones y ajuste de modelos
- ✅ Reportes personalizables
- ✅ Integración con APIs de tarifas de mercado
- ✅ Comparador de escenarios

### Fase 4: Polish y Scale (4-6 semanas)
- ✅ Optimización de performance
- ✅ Testing exhaustivo (unit, integration, e2e)
- ✅ Documentación completa
- ✅ Onboarding para nuevos usuarios
- ✅ Monitoreo y analytics

---

## 10. TECNOLOGÍAS Y LIBRERÍAS ESPECÍFICAS

### 10.1 Frontend (Next.js)

**Core:**
- `next@14+` - Framework principal
- `react@18+` - UI library
- `typescript@5+` - Type safety

**UI Components:**
- `@radix-ui/*` - Componentes accesibles headless
- `tailwindcss@3+` - Styling
- `shadcn/ui` - Component library
- `lucide-react` - Iconografía
- `framer-motion` - Animaciones

**Chat Interface:**
- `react-markdown` - Renderizado de markdown
- `remark-gfm` - GitHub Flavored Markdown
- `react-syntax-highlighter` - Code highlighting
- `react-dropzone` - Drag & drop de archivos

**Visualización de Datos:**
- `recharts` - Gráficos y charts
- `@tanstack/react-table` - Tablas avanzadas
- `date-fns` - Manejo de fechas

**Formularios:**
- `react-hook-form` - Gestión de formularios
- `zod` - Validación de schemas

**PDF:**
- `@react-pdf/renderer` - Generación de PDFs
- `pdf-parse` o `pdfjs-dist` - Parsing de PDFs

### 10.2 Backend (Next.js API Routes)

**Supabase:**
- `@supabase/supabase-js` - Cliente de Supabase
- `@supabase/auth-helpers-nextjs` - Auth helpers

**OpenRouter/LLM:**
- `openai` - SDK compatible con OpenRouter
- `ai` (Vercel AI SDK) - Streaming de respuestas

**Procesamiento:**
- `langchain` - (Opcional) Orquestación de LLMs
- `zod` - Validación de respuestas de IA

**APIs Externas:**
- `axios` o `fetch` - HTTP requests
- `cheerio` - Web scraping (si necesario)

### 10.3 Base de Datos

**Supabase PostgreSQL:**
- Extensiones: `uuid-ossp`, `pgvector` (para embeddings)
- Views materializadas para métricas
- Functions para cálculos complejos

### 10.4 Deployment

**Vercel:**
- Edge Functions para latencia baja
- Vercel Cron Jobs para actualizaciones periódicas
- Environment variables para secrets

**Monitoring:**
- Vercel Analytics
- Sentry para error tracking
- PostHog o Mixpanel para analytics

---

## 11. ESTRUCTURA DEL PROYECTO

```
software-cost-estimator/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   └── register/
│   ├── (dashboard)/
│   │   ├── layout.tsx
│   │   ├── page.tsx                    # Dashboard principal
│   │   ├── estimations/
│   │   │   ├── page.tsx               # Lista de estimaciones
│   │   │   ├── new/
│   │   │   │   └── page.tsx           # Nueva estimación (chat)
│   │   │   └── [id]/
│   │   │       ├── page.tsx           # Detalle de estimación
│   │   │       ├── edit/
│   │   │       └── report/
│   │   ├── developers/
│   │   │   ├── page.tsx               # Gestión de personal
│   │   │   └── [id]/
│   │   ├── metrics/
│   │   │   └── page.tsx               # Dashboard de métricas
│   │   ├── settings/
│   │   │   ├── rates/                 # Tarifas de mercado
│   │   │   ├── models/                # Config de modelos
│   │   │   └── company/
│   ├── api/
│   │   ├── chat/
│   │   │   └── route.ts               # Streaming chat con OpenRouter
│   │   ├── estimations/
│   │   │   ├── route.ts               # CRUD estimaciones
│   │   │   ├── analyze/
│   │   │   │   └── route.ts           # Análisis de especificaciones
│   │   │   └── [id]/
│   │   │       ├── route.ts
│   │   │       └── report/
│   │   │           └── route.ts       # Generar PDF
│   │   ├── developers/
│   │   │   ├── route.ts
│   │   │   └── match/
│   │   │       └── route.ts           # Matching de personal
│   │   ├── feedback/
│   │   │   └── route.ts               # Feedback post-proyecto
│   │   ├── external/
│   │   │   ├── exchange-rates/
│   │   │   │   └── route.ts           # Obtener tipo de cambio
│   │   │   └── market-rates/
│   │   │       └── route.ts           # Scraping de tarifas
│   │   └── webhooks/
│   │       └── supabase/
│   │           └── route.ts           # Webhooks de Supabase
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── chat/
│   │   ├── ChatInterface.tsx
│   │   ├── MessageList.tsx
│   │   ├── MessageInput.tsx
│   │   ├── FileUpload.tsx
│   │   └── StreamingMessage.tsx
│   ├── estimations/
│   │   ├── EstimationCard.tsx
│   │   ├── ModuleBreakdown.tsx
│   │   ├── CostSummary.tsx
│   │   └── StaffAllocation.tsx
│   ├── developers/
│   │   ├── DeveloperCard.tsx
│   │   ├── SkillsMatrix.tsx
│   │   └── ProjectHistory.tsx
│   ├── reports/
│   │   ├── PDFReport.tsx
│   │   └── ReportPreview.tsx
│   ├── metrics/
│   │   ├── AccuracyChart.tsx
│   │   ├── DeviationAnalysis.tsx
│   │   └── KPICards.tsx
│   ├── ui/                            # shadcn components
│   │   ├── button.tsx
│   │   ├── dialog.tsx
│   │   ├── table.tsx
│   │   └── ...
│   └── providers/
│       ├── SupabaseProvider.tsx
│       └── ThemeProvider.tsx
├── lib/
│   ├── supabase/
│   │   ├── client.ts                  # Cliente browser
│   │   ├── server.ts                  # Cliente server
│   │   └── middleware.ts
│   ├── openrouter/
│   │   ├── client.ts
│   │   ├── prompts.ts                 # Prompt templates
│   │   └── streaming.ts
│   ├── estimation/
│   │   ├── models/
│   │   │   ├── cocomo.ts
│   │   │   ├── function-points.ts
│   │   │   ├── ai-based.ts
│   │   │   └── index.ts
│   │   ├── calculator.ts
│   │   ├── matcher.ts                 # Developer matching
│   │   └── adjuster.ts                # Dynamic adjustment
│   ├── pdf/
│   │   ├── parser.ts
│   │   ├── generator.ts
│   │   └── templates/
│   ├── external/
│   │   ├── exchange-rates.ts
│   │   └── market-rates.ts
│   ├── utils/
│   │   ├── formatting.ts
│   │   ├── validation.ts
│   │   └── date.ts
│   └── constants.ts
├── types/
│   ├── database.ts                    # Tipos generados de Supabase
│   ├── estimation.ts
│   ├── developer.ts
│   └── chat.ts
├── hooks/
│   ├── useChat.ts
│   ├── useEstimation.ts
│   ├── useDevelopers.ts
│   └── useSupabase.ts
├── supabase/
│   ├── migrations/
│   │   ├── 001_initial_schema.sql
│   │   ├── 002_add_rls_policies.sql
│   │   └── ...
│   ├── functions/                     # Edge functions
│   └── config.toml
├── public/
│   ├── templates/
│   │   └── report-template.html
│   └── assets/
├── .env.local.example
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## 12. VARIABLES DE ENTORNO

```bash
# .env.local

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
SUPABASE_SERVICE_ROLE_KEY=eyJxxx...

# OpenRouter
OPENROUTER_API_KEY=sk-or-v1-xxx...
NEXT_PUBLIC_APP_URL=https://tudominio.com

# Modelos por defecto
OPENROUTER_MODEL_ANALYSIS=anthropic/claude-3.5-sonnet
OPENROUTER_MODEL_CHAT=anthropic/claude-3-haiku
OPENROUTER_MODEL_REPORT=anthropic/claude-3-opus

# APIs Externas
EXCHANGE_RATE_API_KEY=xxx
MARKET_RATES_API_KEY=xxx

# Configuración
NEXT_PUBLIC_DEFAULT_CURRENCY=MXN
NEXT_PUBLIC_MAX_FILE_SIZE=10485760  # 10MB

# Monitoring (opcional)
SENTRY_DSN=https://xxx@sentry.io/xxx
NEXT_PUBLIC_POSTHOG_KEY=phc_xxx
```

---

## 13. EJEMPLO DE IMPLEMENTACIÓN: CHAT CON STREAMING

### 13.1 API Route (`app/api/chat/route.ts`)

```typescript
import { OpenAIStream, StreamingTextResponse } from 'ai';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import openrouter from '@/lib/openrouter/client';
import { getSystemPrompt } from '@/lib/openrouter/prompts';

export const runtime = 'edge';

export async function POST(req: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return new Response('Unauthorized', { status: 401 });
    }

    const { messages, conversationId, pdfText } = await req.json();

    // Guardar mensaje del usuario en BD
    await supabase.from('messages').insert({
      conversation_id: conversationId,
      role: 'user',
      content: messages[messages.length - 1].content,
    });

    // Construir contexto con PDF si existe
    const systemPrompt = getSystemPrompt(pdfText);

    const response = await openrouter.chat.completions.create({
      model: process.env.OPENROUTER_MODEL_CHAT!,
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages,
      ],
      stream: true,
      temperature: 0.7,
    });

    // Convertir a stream
    const stream = OpenAIStream(response, {
      async onCompletion(completion) {
        // Guardar respuesta en BD
        await supabase.from('messages').insert({
          conversation_id: conversationId,
          role: 'assistant',
          content: completion,
        });
      },
    });

    return new StreamingTextResponse(stream);
  } catch (error) {
    console.error('Chat error:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}
```

### 13.2 Hook del Cliente (`hooks/useChat.ts`)

```typescript
import { useChat as useVercelChat } from 'ai/react';
import { useEffect } from 'react';
import { useSupabase } from './useSupabase';

export function useChat(conversationId: string, pdfText?: string) {
  const { supabase } = useSupabase();
  
  const chat = useVercelChat({
    api: '/api/chat',
    body: {
      conversationId,
      pdfText,
    },
    onError: (error) => {
      console.error('Chat error:', error);
    },
  });

  return chat;
}
```

### 13.3 Componente de Chat (`components/chat/ChatInterface.tsx`)

```typescript
'use client';

import { useState } from 'react';
import { useChat } from '@/hooks/useChat';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import FileUpload from './FileUpload';

interface ChatInterfaceProps {
  conversationId: string;
  estimationId?: string;
}

export default function ChatInterface({ 
  conversationId, 
  estimationId 
}: ChatInterfaceProps) {
  const [pdfText, setPdfText] = useState<string>();
  const { messages, input, handleInputChange, handleSubmit, isLoading } = 
    useChat(conversationId, pdfText);

  const handleFileUpload = async (file: File) => {
    // Parsear PDF y extraer texto
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await fetch('/api/pdf/parse', {
      method: 'POST',
      body: formData,
    });
    
    const { text } = await response.json();
    setPdfText(text);
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <div className="border-b p-4">
        <h1 className="text-xl font-semibold">Nueva Estimación</h1>
        <FileUpload onUpload={handleFileUpload} />
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto">
        <MessageList messages={messages} isLoading={isLoading} />
      </div>

      {/* Input */}
      <div className="border-t p-4">
        <MessageInput
          value={input}
          onChange={handleInputChange}
          onSubmit={handleSubmit}
          disabled={isLoading}
        />
      </div>
    </div>
  );
}
```

---

## 14. EJEMPLO: MOTOR DE ESTIMACIÓN

### 14.1 Modelo COCOMO II (`lib/estimation/models/cocomo.ts`)

```typescript
interface CocomoParams {
  kloc: number;  // Miles de líneas de código
  scale_factors: {
    precedentedness: number;  // 1-5
    flexibility: number;       // 1-5
    architecture: number;      // 1-5
    team_cohesion: number;     // 1-5
    process_maturity: number;  // 1-5
  };
  effort_multipliers: {
    product: number;    // 0.5-2.0
    platform: number;   // 0.5-2.0
    personnel: number;  // 0.5-2.0
    project: number;    // 0.5-2.0
  };
}

export function calculateCOCOMO(params: CocomoParams): {
  effort: number;      // Person-months
  duration: number;    // Months
  people: number;      // Average team size
} {
  const A = 2.94;
  
  // Calcular exponente B
  const SF_sum = Object.values(params.scale_factors).reduce((a, b) => a + b, 0);
  const B = 0.91 + 0.01 * SF_sum;
  
  // Calcular multiplicador de esfuerzo
  const EM = Object.values(params.effort_multipliers).reduce((a, b) => a * b, 1);
  
  // Esfuerzo en persona-mes
  const effort = A * Math.pow(params.kloc, B) * EM;
  
  // Duración en meses
  const C = 3.67;
  const D = 0.28 + 0.2 * (B - 0.91);
  const duration = C * Math.pow(effort, D);
  
  // Promedio de personas
  const people = effort / duration;
  
  return { effort, duration, people };
}

export function estimateKLOC(modules: Array<{
  complexity: number;
  functionPoints: number;
}>): number {
  // Conversión de Function Points a KLOC
  // Varía por lenguaje (Java ~53 LOC/FP, Python ~20 LOC/FP)
  const avgLOCperFP = 35; // Promedio
  
  const totalFP = modules.reduce((sum, m) => 
    sum + m.functionPoints * (m.complexity / 5), 0
  );
  
  return (totalFP * avgLOCperFP) / 1000;
}
```

### 14.2 Calculadora de Costos (`lib/estimation/calculator.ts`)

```typescript
import { createClient } from '@/lib/supabase/server';
import { calculateCOCOMO, estimateKLOC } from './models/cocomo';

interface Module {
  id: string;
  name: string;
  complexity: number;
  functionPoints: number;
  technologies: string[];
}

interface CostCalculationResult {
  totalCost: number;
  totalHours: number;
  breakdown: {
    moduleId: string;
    hours: number;
    cost: number;
    staffing: {
      senior: number;
      semiSenior: number;
      junior: number;
    };
  }[];
  indirectCosts: {
    hosting: number;
    aiServices: number;
    licenses: number;
    total: number;
  };
}

export async function calculateEstimation(
  modules: Module[],
  estimationId: string
): Promise<CostCalculationResult> {
  const supabase = createClient();
  
  // 1. Obtener tarifas de mercado
  const { data: rates } = await supabase
    .from('market_rates')
    .select('*')
    .eq('country', 'MX');
  
  const seniorRate = rates?.find(r => r.level === 'senior')?.hourly_rate_max || 80;
  const semiSeniorRate = rates?.find(r => r.level === 'semi-senior')?.hourly_rate_max || 50;
  const juniorRate = rates?.find(r => r.level === 'junior')?.hourly_rate_max || 30;
  
  // 2. Calcular KLOC total
  const kloc = estimateKLOC(modules);
  
  // 3. Aplicar COCOMO
  const cocomo = calculateCOCOMO({
    kloc,
    scale_factors: {
      precedentedness: 3,
      flexibility: 3,
      architecture: 3,
      team_cohesion: 4,
      process_maturity: 3,
    },
    effort_multipliers: {
      product: 1.0,
      platform: 1.0,
      personnel: 0.9,  // Equipo competente
      project: 1.0,
    },
  });
  
  // 4. Distribuir esfuerzo por módulo
  const totalComplexity = modules.reduce((sum, m) => sum + m.complexity, 0);
  const hoursPerMonth = 160;
  const totalHours = cocomo.effort * hoursPerMonth;
  
  const breakdown = modules.map(module => {
    const moduleHours = (module.complexity / totalComplexity) * totalHours;
    
    // Distribución de personal según complejidad
    let seniorHours, semiSeniorHours, juniorHours;
    
    if (module.complexity >= 8) {
      // Alta complejidad: más seniors
      seniorHours = moduleHours * 0.5;
      semiSeniorHours = moduleHours * 0.3;
      juniorHours = moduleHours * 0.2;
    } else if (module.complexity >= 5) {
      // Media complejidad
      seniorHours = moduleHours * 0.3;
      semiSeniorHours = moduleHours * 0.4;
      juniorHours = moduleHours * 0.3;
    } else {
      // Baja complejidad: más juniors
      seniorHours = moduleHours * 0.2;
      semiSeniorHours = moduleHours * 0.3;
      juniorHours = moduleHours * 0.5;
    }
    
    const cost = 
      (seniorHours * seniorRate) +
      (semiSeniorHours * semiSeniorRate) +
      (juniorHours * juniorRate);
    
    return {
      moduleId: module.id,
      hours: moduleHours,
      cost,
      staffing: {
        senior: seniorHours,
        semiSenior: semiSeniorHours,
        junior: juniorHours,
      },
    };
  });
  
  const totalCost = breakdown.reduce((sum, b) => sum + b.cost, 0);
  
  // 5. Costos indirectos
  const monthlyDuration = cocomo.duration;
  const indirectCosts = {
    hosting: 50 * monthlyDuration,      // $50/mes
    aiServices: 100 * monthlyDuration,  // $100/mes OpenRouter
    licenses: 30 * monthlyDuration,     // $30/mes herramientas
    total: 180 * monthlyDuration,
  };
  
  return {
    totalCost: totalCost + indirectCosts.total,
    totalHours,
    breakdown,
    indirectCosts,
  };
}
```

---

## 15. MÉTRICAS Y KPIS DEL SISTEMA

### 15.1 Métricas de Precisión

**MAPE (Mean Absolute Percentage Error):**
```typescript
function calculateMAPE(estimations: Array<{
  estimated: number;
  actual: number;
}>): number {
  const sum = estimations.reduce((acc, e) => {
    return acc + Math.abs((e.actual - e.estimated) / e.actual);
  }, 0);
  
  return (sum / estimations.length) * 100;
}
```

**Bias (Tendencia de sobre/sub estimación):**
```typescript
function calculateBias(estimations: Array<{
  estimated: number;
  actual: number;
}>): number {
  const sum = estimations.reduce((acc, e) => {
    return acc + (e.estimated - e.actual);
  }, 0);
  
  return sum / estimations.length;
}
```

### 15.2 KPIs de Negocio

- **Tasa de conversión:** Estimaciones → Proyectos cerrados
- **Valor promedio de proyecto**
- **Tiempo promedio de estimación**
- **Satisfacción del cliente** (encuestas post-estimación)
- **ROI de proyectos** (costo real vs ingreso)

### 15.3 Métricas de Sistema

- **Latencia de respuesta del chat** (< 2s)
- **Uptime** (99.9%)
- **Costo de OpenRouter por estimación**
- **Tamaño promedio de PDFs procesados**

---

## 16. ROADMAP POST-LANZAMIENTO

### Q1 Post-Launch
- ✅ Recolección de feedback inicial
- ✅ Ajustes de UX basados en uso real
- ✅ Optimización de costos de IA
- ✅ Integración con 2-3 clientes beta

### Q2
- ✅ Mobile app (React Native o PWA mejorada)
- ✅ Integración con Jira/Asana
- ✅ Marketplace de templates
- ✅ API pública para integraciones

### Q3
- ✅ ML propio para estimaciones (TensorFlow.js)
- ✅ Análisis predictivo de riesgos
- ✅ Multi-idioma completo
- ✅ Certificaciones de seguridad (SOC 2)

### Q4
- ✅ Enterprise features (SSO, audit logs)
- ✅ White-label para partners
- ✅ Expansión a nuevos mercados (LATAM, US)

---

## 17. CONSIDERACIONES FINALES

### 17.1 Escalabilidad
- **Base de datos:** Índices optimizados, particionamiento por fecha
- **Caché:** Redis para tarifas de mercado y datos frecuentes
- **CDN:** Cloudflare para assets estáticos
- **Rate limiting:** 100 requests/min por usuario

### 17.2 Costos Estimados (Mensual)

**Infraestructura:**
- Vercel Pro: $20
- Supabase Pro: $25
- OpenRouter (promedio): $100-300
- Cloudflare: $0 (free tier)
- **Total: ~$150-350/mes**

**Por usuario activo:**
- ~$5-10/mes (asumiendo 30-50 estimaciones/mes por usuario)

### 17.3 Modelo de Negocio Sugerido

**Planes:**
1. **Free:** 5 estimaciones/mes, reportes básicos
2. **Pro ($49/mes):** Estimaciones ilimitadas, gestión de personal, métricas
3. **Team ($99/mes):** Multi-usuario, colaboración, API access
4. **Enterprise (Custom):** SSO, SLA, soporte dedicado

---

## 18. CONCLUSIÓN

Este sistema representa una solución completa e innovadora para la estimación de costos de desarrollo de software, combinando:

✅ **IA Conversacional** para facilitar la captura de requisitos
✅ **Modelos paramétricos probados** (COCOMO, Function Points)
✅ **Aprendizaje continuo** que mejora con cada proyecto
✅ **Integración con datos reales** del mercado y de la empresa
✅ **Stack moderno y escalable** (Next.js + Supabase + OpenRouter)

**Ventajas competitivas:**
- Reducción del 70% en tiempo de estimación vs métodos manuales
- Mayor precisión mediante aprendizaje histórico
- Experiencia de usuario superior (chat vs formularios)
- Reportes profesionales automáticos
- ROI medible desde el primer mes

**Próximos pasos:**
1. Validar MVP con 3-5 empresas de desarrollo
2. Iterar basado en feedback real
3. Construir dataset de entrenamiento con proyectos reales
4. Escalar a mercado LATAM

---

**Documento preparado por:** Sistema de IA  
**Fecha:** Noviembre 2025  
**Versión:** 1.0  
**Stack:** Next.js 14 + Supabase + OpenRouter + Vercel