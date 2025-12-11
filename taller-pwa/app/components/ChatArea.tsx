'use client';

import { useEffect, useRef } from 'react';
import { Bot, User } from 'lucide-react';

interface Message {
  id: number;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

interface ChatAreaProps {
  messages?: Message[];
  isSidebarOpen?: boolean;
  streamingMessage?: string; // Mensaje que se está escribiendo en tiempo real
  isLoading?: boolean;
}

export default function ChatArea({ 
  messages = [], 
  isSidebarOpen = true,
  streamingMessage = '',
  isLoading = false
}: ChatAreaProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Auto-scroll al final cuando hay nuevos mensajes o streaming
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, streamingMessage]);

  // Pantalla de inicio cuando no hay mensajes
  if (messages.length === 0) {
    return (
      <div className="h-full flex items-center justify-center px-4">
        <div className="max-w-3xl w-full text-center space-y-8">
          {/* Logo/Icono principal */}
          <div className="flex justify-center">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <Bot className="w-8 h-8 text-white" />
            </div>
          </div>

          {/* Título */}
          <div>
            <h1 className="text-4xl font-semibold mb-3">¿En qué puedo ayudarte hoy?</h1>
          </div>

          {/* Sugerencias de ejemplo */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-2xl mx-auto">
            {[
              {
                title: 'Crear un plan',
                description: 'Para mejorar mi productividad diaria',
              },
              {
                title: 'Explicar un concepto',
                description: 'De programación de forma simple',
              },
              {
                title: 'Ayuda con código',
                description: 'Revisar y optimizar mi código',
              },
              {
                title: 'Generar ideas',
                description: 'Para un proyecto creativo',
              },
            ].map((suggestion, index) => (
              <button
                key={index}
                className="p-4 rounded-xl border border-white/10 hover:bg-white/5 transition-all text-left group"
              >
                <p className="font-medium text-white/90 mb-1 group-hover:text-white">
                  {suggestion.title}
                </p>
                <p className="text-sm text-white/50 group-hover:text-white/70">
                  {suggestion.description}
                </p>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Vista de chat con mensajes
  return (
    <div
      ref={scrollRef}
      className="h-full overflow-y-auto"
    >
      <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-4 ${
              message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
            }`}
          >
            {/* Avatar */}
            <div className="flex-shrink-0">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  message.role === 'user'
                    ? 'bg-gradient-to-br from-purple-500 to-pink-500'
                    : 'bg-gradient-to-br from-emerald-500 to-teal-500'
                }`}
              >
                {message.role === 'user' ? (
                  <User className="w-5 h-5 text-white" />
                ) : (
                  <Bot className="w-5 h-5 text-white" />
                )}
              </div>
            </div>

            {/* Contenido del mensaje */}
            <div className="flex-1 space-y-2 max-w-[85%]">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-white/90">
                  {message.role === 'user' ? 'Tú' : 'Asistente'}
                </span>
                <span className="text-xs text-white/40">
                  {new Date(message.timestamp).toLocaleTimeString('es-ES', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
              
              <div
                className={`rounded-2xl px-4 py-3 ${
                  message.role === 'user'
                    ? 'bg-white/10'
                    : 'bg-white/5'
                }`}
              >
                <p className="text-[15px] leading-relaxed text-white/90 whitespace-pre-wrap break-words">
                  {message.content}
                </p>
              </div>
            </div>
          </div>
        ))}

        {/* Mensaje en streaming (mientras se está escribiendo) */}
        {isLoading && streamingMessage && (
          <div className="flex gap-4 flex-row">
            {/* Avatar del asistente */}
            <div className="flex-shrink-0">
              <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gradient-to-br from-emerald-500 to-teal-500">
                <Bot className="w-5 h-5 text-white" />
              </div>
            </div>

            {/* Contenido del mensaje en streaming */}
            <div className="flex-1 space-y-2 max-w-[85%]">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-white/90">
                  Asistente
                </span>
                <span className="text-xs text-white/40">
                  Escribiendo...
                </span>
              </div>
              
              <div className="rounded-2xl px-4 py-3 bg-white/5">
                <p className="text-[15px] leading-relaxed text-white/90 whitespace-pre-wrap break-words">
                  {streamingMessage}
                  <span className="inline-block w-1 h-4 ml-1 bg-emerald-500 animate-pulse" />
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Indicador de carga cuando aún no hay texto */}
        {isLoading && !streamingMessage && (
          <div className="flex gap-4 flex-row">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gradient-to-br from-emerald-500 to-teal-500">
                <Bot className="w-5 h-5 text-white" />
              </div>
            </div>

            <div className="flex-1 space-y-2 max-w-[85%]">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-white/90">
                  Asistente
                </span>
              </div>
              
              <div className="rounded-2xl px-4 py-3 bg-white/5">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

