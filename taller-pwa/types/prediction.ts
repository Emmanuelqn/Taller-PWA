/**
 * Tipos para el sistema de predicción técnica
 */

// Niveles de desarrollador
export type DeveloperLevel = 'junior' | 'mid' | 'senior' | 'lead';

// Complejidad de módulos
export type ModuleComplexity = 'low' | 'medium' | 'high' | 'very_high';

// Probabilidad de riesgo
export type RiskProbability = 'low' | 'medium' | 'high';

// Impacto de riesgo
export type RiskImpact = 'low' | 'medium' | 'high' | 'critical';

// Tecnología con justificación
export interface TechnologyItem {
  name: string;
  justification: string;
}

// Stack tecnológico completo
export interface TechnologyStack {
  frontend: TechnologyItem[];
  backend: TechnologyItem[];
  database: TechnologyItem[];
  infrastructure: TechnologyItem[];
  tools: TechnologyItem[];
}

// Perfil requerido
export interface RequiredProfile {
  role: string;
  level: DeveloperLevel;
  quantity: number;
  hourlyRateMXN: number;
  responsibilities: string[];
  percentageAllocation: number;
  skills: string[];
}

// Desglose de módulo
export interface ModuleBreakdown {
  name: string;
  description: string;
  hours: number;
  complexity: ModuleComplexity;
  dependencies: string[];
}

// Estimación
export interface Estimation {
  totalHours: number;
  totalWeeks: number;
  totalMonths: number;
  hoursPerWeek: number;
  methodology: string;
  confidenceLevel: number; // 0-100
  optimisticHours: number;
  pessimisticHours: number;
  estimatedLinesOfCode?: number;
  complexityScore: number; // 1-10
}

// Desglose de costo por perfil
export interface CostBreakdownItem {
  profile: string;
  hours: number;
  rateMXN: number;
  totalMXN: number;
}

// Costo de desarrollo
export interface DevelopmentCost {
  totalMXN: number;
  totalUSD: number;
  breakdown: CostBreakdownItem[];
}

// Item de infraestructura
export interface InfrastructureItem {
  name: string;
  monthlyMXN: number;
}

// Costo de infraestructura
export interface InfrastructureCost {
  monthlyMXN: number;
  monthlyUSD: number;
  items: InfrastructureItem[];
}

// Servicio de terceros
export interface ThirdPartyService {
  name: string;
  monthlyMXN: number;
  description: string;
}

// Contingencia
export interface Contingency {
  percentage: number;
  amountMXN: number;
}

// Costos totales
export interface Costs {
  currency: 'MXN';
  exchangeRate: number;
  development: DevelopmentCost;
  infrastructure: InfrastructureCost;
  thirdPartyServices: ThirdPartyService[];
  contingency: Contingency;
  totalProjectMXN: number;
  totalProjectUSD: number;
}

// Fase del timeline
export interface TimelinePhase {
  name: string;
  weeks: number;
  deliverables: string[];
  milestones: string[];
}

// Timeline del proyecto
export interface Timeline {
  phases: TimelinePhase[];
}

// Riesgo identificado
export interface Risk {
  description: string;
  probability: RiskProbability;
  impact: RiskImpact;
  mitigation: string;
}

// Predicción técnica completa
export interface TechnicalPredictionData {
  projectName: string;
  projectSummary: string;
  scopeDescription: string;
  projectType: 'MOBILE_APP' | 'WEB_APP' | 'ENTERPRISE_SYSTEM' | 'API_BACKEND' | 'ECOMMERCE' | 'SAAS' | 'OTHER';
  technologyStack: TechnologyStack;
  requiredProfiles: RequiredProfile[];
  moduleBreakdown: ModuleBreakdown[];
  estimation: Estimation;
  costs: Costs;
  timeline: Timeline;
  risks: Risk[];
  assumptions: string[];
  recommendations: string[];
}

// Request para generar predicción
export interface GeneratePredictionRequest {
  chatId: string;
  userId: string;
}

// Response de predicción
export interface GeneratePredictionResponse {
  success: boolean;
  prediction?: TechnicalPredictionData;
  predictionId?: string;
  error?: string;
}

// Constantes de tarifas México 2026
export const MEXICO_RATES_2026 = {
  junior: {
    hourlyMXN: 500,
    hourlyUSD: 25,
  },
  mid: {
    hourlyMXN: 1000,
    hourlyUSD: 50,
  },
  senior: {
    hourlyMXN: 1500,
    hourlyUSD: 75,
  },
  lead: {
    hourlyMXN: 2000,
    hourlyUSD: 100,
  },
  exchangeRate: 20, // USD to MXN
} as const;

// Función helper para calcular costo por nivel
export function calculateCostByLevel(
  level: DeveloperLevel, 
  hours: number
): { mxn: number; usd: number } {
  const rate = MEXICO_RATES_2026[level];
  return {
    mxn: hours * rate.hourlyMXN,
    usd: hours * rate.hourlyUSD,
  };
}

// Función helper para formatear moneda
export function formatCurrency(amount: number, currency: 'MXN' | 'USD'): string {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}
