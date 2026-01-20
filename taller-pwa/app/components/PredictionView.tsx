'use client';

import { useState } from 'react';
import type { TechnicalPredictionData } from '@/types/prediction';
import { formatCurrency } from '@/types/prediction';

interface PredictionViewProps {
  prediction: TechnicalPredictionData;
  onClose?: () => void;
}

type TabId = 'overview' | 'stack' | 'team' | 'modules' | 'costs' | 'timeline' | 'risks';

export default function PredictionView({ prediction, onClose }: PredictionViewProps) {
  const [activeTab, setActiveTab] = useState<TabId>('overview');

  const tabs: { id: TabId; label: string; icon: string }[] = [
    { id: 'overview', label: 'Resumen', icon: '📋' },
    { id: 'stack', label: 'Stack', icon: '🛠️' },
    { id: 'team', label: 'Equipo', icon: '👥' },
    { id: 'modules', label: 'Módulos', icon: '📦' },
    { id: 'costs', label: 'Costos', icon: '💰' },
    { id: 'timeline', label: 'Timeline', icon: '📅' },
    { id: 'risks', label: 'Riesgos', icon: '⚠️' },
  ];

  return (
    <div className="bg-gray-900 rounded-xl border border-gray-700 overflow-hidden max-h-[90vh] flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">
              {prediction.projectName}
            </h2>
            <p className="text-blue-100 text-sm max-w-2xl">
              {prediction.projectSummary}
            </p>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <QuickStat
            label="Tiempo Estimado"
            value={`${prediction.estimation.totalWeeks} semanas`}
            subValue={`${prediction.estimation.totalMonths} meses`}
          />
          <QuickStat
            label="Horas Totales"
            value={`${prediction.estimation.totalHours.toLocaleString()} hrs`}
            subValue={`Confianza: ${prediction.estimation.confidenceLevel}%`}
          />
          <QuickStat
            label="Costo Total (MXN)"
            value={formatCurrency(prediction.costs.totalProjectMXN, 'MXN')}
            subValue={`~${formatCurrency(prediction.costs.totalProjectUSD, 'USD')}`}
          />
          <QuickStat
            label="Complejidad"
            value={`${prediction.estimation.complexityScore}/10`}
            subValue={getComplexityLabel(prediction.estimation.complexityScore)}
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-700 bg-gray-800/50">
        <div className="flex overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? 'text-blue-400 border-b-2 border-blue-400 bg-gray-800'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/50'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {activeTab === 'overview' && <OverviewTab prediction={prediction} />}
        {activeTab === 'stack' && <StackTab prediction={prediction} />}
        {activeTab === 'team' && <TeamTab prediction={prediction} />}
        {activeTab === 'modules' && <ModulesTab prediction={prediction} />}
        {activeTab === 'costs' && <CostsTab prediction={prediction} />}
        {activeTab === 'timeline' && <TimelineTab prediction={prediction} />}
        {activeTab === 'risks' && <RisksTab prediction={prediction} />}
      </div>
    </div>
  );
}

// Quick Stat Component
function QuickStat({ label, value, subValue }: { label: string; value: string; subValue: string }) {
  return (
    <div className="bg-white/10 rounded-lg p-3">
      <p className="text-blue-100 text-xs mb-1">{label}</p>
      <p className="text-white font-bold text-lg">{value}</p>
      <p className="text-blue-200 text-xs">{subValue}</p>
    </div>
  );
}

// Helper function
function getComplexityLabel(score: number): string {
  if (score <= 2) return 'Muy Simple';
  if (score <= 4) return 'Simple';
  if (score <= 6) return 'Moderado';
  if (score <= 8) return 'Complejo';
  return 'Muy Complejo';
}

// Overview Tab
function OverviewTab({ prediction }: { prediction: TechnicalPredictionData }) {
  return (
    <div className="space-y-6">
      {/* Scope */}
      <Section title="📝 Alcance del Proyecto">
        <p className="text-gray-300">{prediction.scopeDescription}</p>
      </Section>

      {/* Type & Methodology */}
      <div className="grid md:grid-cols-2 gap-6">
        <Section title="🏷️ Tipo de Proyecto">
          <Badge variant="blue">{formatProjectType(prediction.projectType)}</Badge>
        </Section>
        <Section title="📊 Metodología de Estimación">
          <Badge variant="purple">{prediction.estimation.methodology}</Badge>
        </Section>
      </div>

      {/* Assumptions */}
      <Section title="📌 Supuestos">
        <ul className="space-y-2">
          {prediction.assumptions.map((assumption, i) => (
            <li key={i} className="flex items-start gap-2 text-gray-300">
              <span className="text-yellow-400 mt-0.5">•</span>
              {assumption}
            </li>
          ))}
        </ul>
      </Section>

      {/* Recommendations */}
      <Section title="💡 Recomendaciones">
        <ul className="space-y-2">
          {prediction.recommendations.map((rec, i) => (
            <li key={i} className="flex items-start gap-2 text-gray-300">
              <span className="text-green-400 mt-0.5">✓</span>
              {rec}
            </li>
          ))}
        </ul>
      </Section>
    </div>
  );
}

// Stack Tab
function StackTab({ prediction }: { prediction: TechnicalPredictionData }) {
  const { technologyStack } = prediction;

  const categories = [
    { key: 'frontend', label: 'Frontend', icon: '🎨', items: technologyStack.frontend },
    { key: 'backend', label: 'Backend', icon: '⚙️', items: technologyStack.backend },
    { key: 'database', label: 'Base de Datos', icon: '🗄️', items: technologyStack.database },
    { key: 'infrastructure', label: 'Infraestructura', icon: '☁️', items: technologyStack.infrastructure },
    { key: 'tools', label: 'Herramientas', icon: '🔧', items: technologyStack.tools },
  ];

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {categories.map((category) => (
        <Section key={category.key} title={`${category.icon} ${category.label}`}>
          <div className="space-y-3">
            {category.items.map((item, i) => (
              <div key={i} className="bg-gray-800 rounded-lg p-3">
                <p className="text-white font-medium">{item.name}</p>
                <p className="text-gray-400 text-sm mt-1">{item.justification}</p>
              </div>
            ))}
          </div>
        </Section>
      ))}
    </div>
  );
}

// Team Tab
function TeamTab({ prediction }: { prediction: TechnicalPredictionData }) {
  const { requiredProfiles } = prediction;

  const totalPeople = requiredProfiles.reduce((sum, p) => sum + p.quantity, 0);

  return (
    <div className="space-y-6">
      <div className="bg-gray-800 rounded-lg p-4">
        <p className="text-gray-400 text-sm">Equipo Total Requerido</p>
        <p className="text-3xl font-bold text-white">{totalPeople} personas</p>
      </div>

      <div className="space-y-4">
        {requiredProfiles.map((profile, i) => (
          <div key={i} className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h4 className="text-white font-medium text-lg">{profile.role}</h4>
                <div className="flex gap-2 mt-1">
                  <Badge variant={getLevelVariant(profile.level)}>{profile.level.toUpperCase()}</Badge>
                  <Badge variant="gray">x{profile.quantity}</Badge>
                  <Badge variant="blue">{profile.percentageAllocation}% dedicación</Badge>
                </div>
              </div>
              <div className="text-right">
                <p className="text-green-400 font-bold">
                  {formatCurrency(profile.hourlyRateMXN, 'MXN')}/hr
                </p>
              </div>
            </div>

            <div className="mt-3">
              <p className="text-gray-400 text-xs mb-1">Responsabilidades:</p>
              <div className="flex flex-wrap gap-1">
                {profile.responsibilities.map((resp, j) => (
                  <span key={j} className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded">
                    {resp}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-3">
              <p className="text-gray-400 text-xs mb-1">Skills:</p>
              <div className="flex flex-wrap gap-1">
                {profile.skills.map((skill, j) => (
                  <span key={j} className="text-xs bg-blue-900/50 text-blue-300 px-2 py-1 rounded">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Modules Tab
function ModulesTab({ prediction }: { prediction: TechnicalPredictionData }) {
  const { moduleBreakdown } = prediction;
  const totalHours = moduleBreakdown.reduce((sum, m) => sum + m.hours, 0);

  return (
    <div className="space-y-6">
      <div className="bg-gray-800 rounded-lg p-4">
        <p className="text-gray-400 text-sm">Total de Horas por Módulos</p>
        <p className="text-3xl font-bold text-white">{totalHours.toLocaleString()} horas</p>
      </div>

      <div className="space-y-4">
        {moduleBreakdown.map((module, i) => (
          <div key={i} className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <div className="flex justify-between items-start mb-2">
              <h4 className="text-white font-medium">{module.name}</h4>
              <Badge variant={getComplexityVariant(module.complexity)}>
                {module.complexity}
              </Badge>
            </div>
            <p className="text-gray-400 text-sm mb-3">{module.description}</p>
            
            <div className="flex justify-between items-center">
              <div className="text-blue-400 font-bold">{module.hours} horas</div>
              <div className="w-32 bg-gray-700 rounded-full h-2">
                <div
                  className="bg-blue-500 rounded-full h-2"
                  style={{ width: `${(module.hours / totalHours) * 100}%` }}
                />
              </div>
            </div>

            {module.dependencies.length > 0 && (
              <div className="mt-3 pt-3 border-t border-gray-700">
                <p className="text-gray-400 text-xs">Depende de:</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {module.dependencies.map((dep, j) => (
                    <span key={j} className="text-xs bg-yellow-900/30 text-yellow-400 px-2 py-1 rounded">
                      {dep}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// Costs Tab
function CostsTab({ prediction }: { prediction: TechnicalPredictionData }) {
  const { costs } = prediction;

  return (
    <div className="space-y-6">
      {/* Total */}
      <div className="bg-gradient-to-r from-green-900/50 to-emerald-900/50 rounded-lg p-6 border border-green-700">
        <p className="text-green-300 text-sm mb-1">Costo Total del Proyecto</p>
        <p className="text-4xl font-bold text-white">
          {formatCurrency(costs.totalProjectMXN, 'MXN')}
        </p>
        <p className="text-green-300 mt-1">
          ≈ {formatCurrency(costs.totalProjectUSD, 'USD')}
        </p>
      </div>

      {/* Breakdown */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Development */}
        <Section title="👨‍💻 Desarrollo">
          <div className="bg-gray-800 rounded-lg p-4 mb-4">
            <p className="text-2xl font-bold text-white">
              {formatCurrency(costs.development.totalMXN, 'MXN')}
            </p>
          </div>
          <div className="space-y-2">
            {costs.development.breakdown.map((item, i) => (
              <div key={i} className="flex justify-between text-sm">
                <span className="text-gray-400">
                  {item.profile} ({item.hours} hrs × {formatCurrency(item.rateMXN, 'MXN')})
                </span>
                <span className="text-white font-medium">
                  {formatCurrency(item.totalMXN, 'MXN')}
                </span>
              </div>
            ))}
          </div>
        </Section>

        {/* Infrastructure */}
        <Section title="☁️ Infraestructura (Mensual)">
          <div className="bg-gray-800 rounded-lg p-4 mb-4">
            <p className="text-2xl font-bold text-white">
              {formatCurrency(costs.infrastructure.monthlyMXN, 'MXN')}/mes
            </p>
          </div>
          <div className="space-y-2">
            {costs.infrastructure.items.map((item, i) => (
              <div key={i} className="flex justify-between text-sm">
                <span className="text-gray-400">{item.name}</span>
                <span className="text-white font-medium">
                  {formatCurrency(item.monthlyMXN, 'MXN')}
                </span>
              </div>
            ))}
          </div>
        </Section>
      </div>

      {/* Third Party Services */}
      {costs.thirdPartyServices.length > 0 && (
        <Section title="🔌 Servicios de Terceros (Mensual)">
          <div className="space-y-2">
            {costs.thirdPartyServices.map((service, i) => (
              <div key={i} className="bg-gray-800 rounded-lg p-3 flex justify-between items-center">
                <div>
                  <p className="text-white font-medium">{service.name}</p>
                  <p className="text-gray-400 text-sm">{service.description}</p>
                </div>
                <p className="text-white font-bold">
                  {formatCurrency(service.monthlyMXN, 'MXN')}/mes
                </p>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Contingency */}
      <Section title="🛡️ Contingencia">
        <div className="bg-yellow-900/30 border border-yellow-700 rounded-lg p-4">
          <div className="flex justify-between items-center">
            <span className="text-yellow-300">
              Reserva de contingencia ({costs.contingency.percentage}%)
            </span>
            <span className="text-white font-bold text-xl">
              {formatCurrency(costs.contingency.amountMXN, 'MXN')}
            </span>
          </div>
        </div>
      </Section>
    </div>
  );
}

// Timeline Tab
function TimelineTab({ prediction }: { prediction: TechnicalPredictionData }) {
  const { timeline } = prediction;
  let accumulatedWeeks = 0;

  return (
    <div className="space-y-6">
      <div className="relative">
        {timeline.phases.map((phase, i) => {
          const startWeek = accumulatedWeeks + 1;
          accumulatedWeeks += phase.weeks;

          return (
            <div key={i} className="relative pl-8 pb-8 last:pb-0">
              {/* Timeline line */}
              {i < timeline.phases.length - 1 && (
                <div className="absolute left-3 top-3 w-0.5 h-full bg-gray-700" />
              )}
              
              {/* Timeline dot */}
              <div className="absolute left-0 top-0 w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-bold">
                {i + 1}
              </div>

              {/* Content */}
              <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                <div className="flex justify-between items-start mb-3">
                  <h4 className="text-white font-medium">{phase.name}</h4>
                  <div className="text-right">
                    <Badge variant="blue">{phase.weeks} semanas</Badge>
                    <p className="text-gray-400 text-xs mt-1">
                      Semanas {startWeek} - {accumulatedWeeks}
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <p className="text-gray-400 text-xs mb-1">Entregables:</p>
                    <ul className="space-y-1">
                      {phase.deliverables.map((del, j) => (
                        <li key={j} className="text-gray-300 text-sm flex items-start gap-2">
                          <span className="text-green-400">•</span>
                          {del}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {phase.milestones.length > 0 && (
                    <div>
                      <p className="text-gray-400 text-xs mb-1">Hitos:</p>
                      <div className="flex flex-wrap gap-2">
                        {phase.milestones.map((milestone, j) => (
                          <span key={j} className="text-xs bg-purple-900/50 text-purple-300 px-2 py-1 rounded">
                            🏁 {milestone}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Risks Tab
function RisksTab({ prediction }: { prediction: TechnicalPredictionData }) {
  const { risks } = prediction;

  const getRiskColor = (probability: string, impact: string) => {
    if (impact === 'critical' || (impact === 'high' && probability === 'high')) {
      return 'border-red-500 bg-red-900/20';
    }
    if (impact === 'high' || probability === 'high') {
      return 'border-orange-500 bg-orange-900/20';
    }
    if (impact === 'medium' || probability === 'medium') {
      return 'border-yellow-500 bg-yellow-900/20';
    }
    return 'border-green-500 bg-green-900/20';
  };

  return (
    <div className="space-y-4">
      {risks.map((risk, i) => (
        <div
          key={i}
          className={`rounded-lg p-4 border ${getRiskColor(risk.probability, risk.impact)}`}
        >
          <div className="flex justify-between items-start mb-3">
            <p className="text-white font-medium flex-1">{risk.description}</p>
            <div className="flex gap-2 ml-4">
              <Badge variant={getProbabilityVariant(risk.probability)}>
                P: {risk.probability}
              </Badge>
              <Badge variant={getImpactVariant(risk.impact)}>
                I: {risk.impact}
              </Badge>
            </div>
          </div>
          
          <div className="bg-gray-800/50 rounded p-3">
            <p className="text-gray-400 text-xs mb-1">🛡️ Mitigación:</p>
            <p className="text-gray-300 text-sm">{risk.mitigation}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

// Utility Components
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-lg font-semibold text-white mb-3">{title}</h3>
      {children}
    </div>
  );
}

type BadgeVariant = 'blue' | 'green' | 'yellow' | 'red' | 'purple' | 'gray' | 'orange';

function Badge({ children, variant = 'blue' }: { children: React.ReactNode; variant?: BadgeVariant }) {
  const variants: Record<BadgeVariant, string> = {
    blue: 'bg-blue-900/50 text-blue-300',
    green: 'bg-green-900/50 text-green-300',
    yellow: 'bg-yellow-900/50 text-yellow-300',
    red: 'bg-red-900/50 text-red-300',
    purple: 'bg-purple-900/50 text-purple-300',
    gray: 'bg-gray-700 text-gray-300',
    orange: 'bg-orange-900/50 text-orange-300',
  };

  return (
    <span className={`text-xs px-2 py-1 rounded ${variants[variant]}`}>
      {children}
    </span>
  );
}

// Helper functions
function formatProjectType(type: string): string {
  const types: Record<string, string> = {
    MOBILE_APP: 'Aplicación Móvil',
    WEB_APP: 'Aplicación Web',
    ENTERPRISE_SYSTEM: 'Sistema Empresarial',
    API_BACKEND: 'API / Backend',
    ECOMMERCE: 'E-Commerce',
    SAAS: 'SaaS',
    OTHER: 'Otro',
  };
  return types[type] || type;
}

function getLevelVariant(level: string): BadgeVariant {
  const variants: Record<string, BadgeVariant> = {
    junior: 'green',
    mid: 'blue',
    senior: 'purple',
    lead: 'orange',
  };
  return variants[level] || 'gray';
}

function getComplexityVariant(complexity: string): BadgeVariant {
  const variants: Record<string, BadgeVariant> = {
    low: 'green',
    medium: 'yellow',
    high: 'orange',
    very_high: 'red',
  };
  return variants[complexity] || 'gray';
}

function getProbabilityVariant(probability: string): BadgeVariant {
  const variants: Record<string, BadgeVariant> = {
    low: 'green',
    medium: 'yellow',
    high: 'red',
  };
  return variants[probability] || 'gray';
}

function getImpactVariant(impact: string): BadgeVariant {
  const variants: Record<string, BadgeVariant> = {
    low: 'green',
    medium: 'yellow',
    high: 'orange',
    critical: 'red',
  };
  return variants[impact] || 'gray';
}
