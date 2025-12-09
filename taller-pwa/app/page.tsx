'use client';

import { useState } from 'react';
import ChatArea from './components/ChatArea';
import MessageInput from './components/MessageInput';

interface Message {
  id: number;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);

  const handleSendMessage = (content: string) => {
    const newMessage: Message = {
      id: Date.now(),
      role: 'user',
      content,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, newMessage]);

    // Simular respuesta del asistente después de un breve delay
    setTimeout(() => {
      const assistantMessage: Message = {
        id: Date.now() + 1,
        role: 'assistant',
        content: 'Gracias por tu mensaje. Esta es una respuesta simulada del asistente.',
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    }, 1000);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900">
      {/* Área de chat con scroll */}
      <div className="flex-1 overflow-hidden">
        <ChatArea messages={messages} />
      </div>
      
      {/* Input fijo en la parte inferior */}
      <MessageInput onSendMessage={handleSendMessage} />
    </div>
  );
}
