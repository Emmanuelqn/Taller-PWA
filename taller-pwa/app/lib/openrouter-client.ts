/**
 * Cliente para usar OpenRouter desde componentes cliente
 * Este archivo SÍ puede importarse en componentes con 'use client'
 * 
 * IMPORTANTE: Este cliente NO expone la API Key, solo hace llamadas
 * a nuestros propios API Routes que manejan la seguridad
 */

import type { ChatMessage } from './openrouter-sdk';

/**
 * Respuesta del API de chat
 */
export interface ChatResponse {
  success: boolean;
  message: string;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
  model?: string;
  error?: string;
  details?: string;
}

/**
 * Opciones para la llamada al chat
 */
export interface ChatOptions {
  messages: ChatMessage[];
  model?: string;
  temperature?: number;
  max_tokens?: number;
}

/**
 * Envía mensajes al chat (sin streaming)
 * 
 * @example
 * const response = await sendChatMessage({
 *   messages: [
 *     { role: 'user', content: '¿Qué es Next.js?' }
 *   ]
 * });
 * console.log(response.message);
 */
export async function sendChatMessage(options: ChatOptions): Promise<ChatResponse> {
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(options),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Error al enviar mensaje');
    }

    return data;
  } catch (error) {
    console.error('❌ Error en sendChatMessage:', error);
    return {
      success: false,
      message: '',
      error: error instanceof Error ? error.message : 'Error desconocido',
    };
  }
}

/**
 * Envía mensajes al chat con streaming
 * 
 * @example
 * await sendChatMessageStream({
 *   messages: [{ role: 'user', content: 'Hola' }],
 *   onChunk: (text) => console.log(text),
 *   onComplete: () => console.log('Terminado'),
 *   onError: (err) => console.error(err)
 * });
 */
export async function sendChatMessageStream(
  options: ChatOptions & {
    onChunk?: (text: string) => void;
    onComplete?: () => void;
    onError?: (error: Error) => void;
  }
): Promise<void> {
  const { onChunk, onComplete, onError, ...chatOptions } = options;

  try {
    const response = await fetch('/api/chat/stream', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(chatOptions),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Error al enviar mensaje');
    }

    // Leer el stream
    const reader = response.body?.getReader();
    const decoder = new TextDecoder();

    if (!reader) {
      throw new Error('No se pudo obtener el reader del stream');
    }

    while (true) {
      const { done, value } = await reader.read();

      if (done) {
        onComplete?.();
        break;
      }

      // Decodificar el chunk
      const chunk = decoder.decode(value, { stream: true });
      
      // Parsear los eventos SSE
      const lines = chunk.split('\n');
      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6);
          
          if (data === '[DONE]') {
            continue;
          }

          try {
            const parsed = JSON.parse(data);
            const content = parsed.content || parsed.choices?.[0]?.delta?.content;
            
            if (content) {
              onChunk?.(content);
            }
          } catch (e) {
            // Ignorar errores de parsing de chunks individuales
            console.warn('Error al parsear chunk:', e);
          }
        }
      }
    }
  } catch (error) {
    console.error('❌ Error en sendChatMessageStream:', error);
    onError?.(error instanceof Error ? error : new Error('Error desconocido'));
  }
}
