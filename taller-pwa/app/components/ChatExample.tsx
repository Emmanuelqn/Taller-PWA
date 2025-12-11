'use client';

import { useState } from 'react';
import { sendChatMessage, sendChatMessageStream } from '@/app/lib/openrouter-client';

/**
 * Componente de ejemplo para usar OpenRouter
 * Muestra cómo hacer llamadas tanto sin streaming como con streaming
 */
export default function ChatExample() {
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState('');
  const [streamResponse, setStreamResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [streaming, setStreaming] = useState(false);

  // Ejemplo 1: Llamada sin streaming
  const handleSendMessage = async () => {
    if (!message.trim()) return;

    setLoading(true);
    setResponse('');

    try {
      const result = await sendChatMessage({
        messages: [
          { role: 'system', content: 'Eres un asistente útil y amigable.' },
          { role: 'user', content: message },
        ],
        temperature: 0.7,
        max_tokens: 500,
      });

      if (result.success) {
        setResponse(result.message);
      } else {
        setResponse(`Error: ${result.error || 'Error desconocido'}`);
      }
    } catch (error) {
      setResponse(`Error: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    } finally {
      setLoading(false);
    }
  };

  // Ejemplo 2: Llamada con streaming
  const handleSendMessageStream = async () => {
    if (!message.trim()) return;

    setStreaming(true);
    setStreamResponse('');

    await sendChatMessageStream({
      messages: [
        { role: 'system', content: 'Eres un asistente útil y amigable.' },
        { role: 'user', content: message },
      ],
      temperature: 0.7,
      max_tokens: 500,
      onChunk: (text) => {
        setStreamResponse((prev) => prev + text);
      },
      onComplete: () => {
        setStreaming(false);
        console.log('✅ Stream completado');
      },
      onError: (error) => {
        setStreaming(false);
        setStreamResponse(`Error: ${error.message}`);
      },
    });
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <h2 className="text-2xl font-bold">Ejemplo de OpenRouter</h2>

      {/* Input de mensaje */}
      <div className="space-y-2">
        <label htmlFor="message" className="block text-sm font-medium">
          Escribe tu mensaje:
        </label>
        <textarea
          id="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Ej: ¿Qué es Next.js?"
          className="w-full p-3 border rounded-lg resize-none focus:ring-2 focus:ring-blue-500"
          rows={3}
        />
      </div>

      {/* Botones */}
      <div className="flex gap-3">
        <button
          onClick={handleSendMessage}
          disabled={loading || streaming || !message.trim()}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {loading ? 'Enviando...' : 'Enviar (Sin Streaming)'}
        </button>

        <button
          onClick={handleSendMessageStream}
          disabled={loading || streaming || !message.trim()}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {streaming ? 'Recibiendo...' : 'Enviar (Con Streaming)'}
        </button>
      </div>

      {/* Respuesta sin streaming */}
      {response && (
        <div className="space-y-2">
          <h3 className="font-semibold">Respuesta (Sin Streaming):</h3>
          <div className="p-4 bg-gray-50 rounded-lg whitespace-pre-wrap">
            {response}
          </div>
        </div>
      )}

      {/* Respuesta con streaming */}
      {streamResponse && (
        <div className="space-y-2">
          <h3 className="font-semibold">Respuesta (Con Streaming):</h3>
          <div className="p-4 bg-blue-50 rounded-lg whitespace-pre-wrap">
            {streamResponse}
            {streaming && <span className="animate-pulse">▊</span>}
          </div>
        </div>
      )}
    </div>
  );
}
