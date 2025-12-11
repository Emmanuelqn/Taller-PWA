/**
 * Configuración segura de OpenRouter
 * Este archivo SOLO debe usarse en el servidor (API Routes)
 * NUNCA importes esto en componentes cliente
 */

// Validación de la API Key en tiempo de ejecución
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

if (!OPENROUTER_API_KEY) {
  throw new Error(
    '❌ OPENROUTER_API_KEY no está configurada. Verifica tu archivo .env.local'
  );
}

/**
 * Configuración base para OpenRouter
 */
export const openRouterConfig = {
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: OPENROUTER_API_KEY,
  defaultHeaders: {
    'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    'X-Title': process.env.NEXT_PUBLIC_SITE_NAME || 'Taller PWA',
  },
};

/**
 * Modelos disponibles en OpenRouter
 * Puedes agregar más según tus necesidades
 */
export const MODELS = {
  GPT_4O: 'openai/gpt-4o',
  GPT_4O_MINI: 'openai/gpt-4o-mini',
  CLAUDE_SONNET: 'anthropic/claude-sonnet-4.5',
  GEMINI_PRO: 'google/gemini-2.5-flash-lite',
} as const;

/**
 * Tipo para los mensajes del chat
 */
export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

/**
 * Opciones para la llamada a OpenRouter
 */
export interface OpenRouterOptions {
  model?: string;
  temperature?: number;
  max_tokens?: number;
  stream?: boolean;
}
