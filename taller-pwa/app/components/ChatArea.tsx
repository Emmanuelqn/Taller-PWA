'use client';

import { useEffect, useRef } from 'react';

interface Message {
  id: number;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

interface ChatAreaProps {
  messages?: Message[];
}

export default function ChatArea({ messages = [] }: ChatAreaProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Mensajes simulados para demostración
  const defaultMessages: Message[] = [
    {
      id: 1,
      role: 'assistant',
      content: '¡Hola! ¿En qué puedo ayudarte hoy?',
      timestamp: new Date().toISOString(),
    },
  ];

  const displayMessages = messages.length > 0 ? messages : defaultMessages;

  useEffect(() => {
    // Auto-scroll al final cuando hay nuevos mensajes
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [displayMessages]);

  return (
    <div
      ref={scrollRef}
      className="h-full overflow-y-auto px-4 py-6 pb-32 space-y-4 max-w-4xl mx-auto"
    >
      {displayMessages.map((message) => (
        <div
          key={message.id}
          className={`flex ${
            message.role === 'user' ? 'justify-end' : 'justify-start'
          }`}
        >
          <div
            className={`max-w-[80%] rounded-lg px-4 py-3 ${
              message.role === 'user'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-700 text-gray-100'
            }`}
          >
            <p className="text-sm whitespace-pre-wrap break-words">
              {message.content}
            </p>
            <p
              className={`text-xs mt-1 ${
                message.role === 'user' ? 'text-blue-200' : 'text-gray-400'
              }`}
            >
              {new Date(message.timestamp).toLocaleTimeString('es-ES', {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

