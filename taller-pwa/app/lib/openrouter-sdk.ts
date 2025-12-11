/**
 * Cliente OpenRouter usando el SDK oficial de OpenAI
 * Este archivo SOLO debe usarse en el servidor (API Routes)
 * 
 * Basado en la documentación oficial de OpenRouter:
 * https://openrouter.ai/docs/quickstart
 */

import OpenAI from 'openai';

// Validación de la API Key en tiempo de ejecución
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

if (!OPENROUTER_API_KEY) {
  throw new Error(
    '❌ OPENROUTER_API_KEY no está configurada. Verifica tu archivo .env.local'
  );
}

/**
 * Cliente OpenAI configurado para usar OpenRouter
 * Según la documentación oficial de OpenRouter
 */
export const openai = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: OPENROUTER_API_KEY,
  defaultHeaders: {
    'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    'X-Title': process.env.NEXT_PUBLIC_SITE_NAME || 'Taller PWA',
  },
});

/**
 * Modelos recomendados de OpenRouter
 * Actualizado según la documentación oficial
 */
export const MODELS = {
  // OpenAI
  GPT_4O: 'openai/gpt-4o',
  GPT_4O_MINI: 'openai/gpt-4o-mini',
  GPT_4_TURBO: 'openai/gpt-4-turbo',
  
  // Anthropic
  CLAUDE_SONNET: 'anthropic/claude-3.5-sonnet',
  CLAUDE_OPUS: 'anthropic/claude-3-opus',
  CLAUDE_HAIKU: 'anthropic/claude-3-haiku',
  
  // Google
  GEMINI_PRO: 'google/gemini-pro-1.5',
  GEMINI_FLASH: 'google/gemini-flash-1.5',
  
  // Meta
  LLAMA_3_70B: 'meta-llama/llama-3-70b-instruct',
  LLAMA_3_8B: 'meta-llama/llama-3-8b-instruct',
  
  // Modelos gratuitos (con rate limits)
  FREE_GPT_3_5: 'openai/gpt-3.5-turbo',
  FREE_LLAMA_3_8B: 'meta-llama/llama-3-8b-instruct:free',
} as const;

/**
 * Tipo para los mensajes del chat
 */
export type ChatMessage = {
  role: 'system' | 'user' | 'assistant';
  content: string;
};

/**
 * Opciones para la llamada a OpenRouter
 */
export interface ChatCompletionOptions {
  model?: string;
  temperature?: number;
  max_tokens?: number;
  top_p?: number;
  frequency_penalty?: number;
  presence_penalty?: number;
}
