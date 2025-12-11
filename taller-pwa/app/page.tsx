'use client';

import { useState } from 'react';
import Sidebar from './components/Sidebar';
import ChatArea from './components/ChatArea';
import MessageInput from './components/MessageInput';
import { sendChatMessageStream } from './lib/openrouter-client';

interface Message {
  id: number;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [streamingMessage, setStreamingMessage] = useState(''); // Texto que va llegando

  const handleSendMessage = async (content: string) => {
    // 1. Agregar mensaje del usuario
    const userMessage: Message = {
      id: Date.now(),
      role: 'user',
      content,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    setStreamingMessage(''); // Limpiar el mensaje en streaming

    // 2. Preparar historial de mensajes para OpenRouter
    const chatHistory = messages.map((msg) => ({
      role: msg.role,
      content: msg.content,
    }));

    // 3. Variable para acumular el contenido completo
    let fullContent = '';

    // 4. Llamar a OpenRouter con streaming
    await sendChatMessageStream({
      messages: [
        { role: 'system', content: 'Eres un asistente útil, amigable y profesional.' },
        ...chatHistory,
        { role: 'user', content },
      ],
      temperature: 0.7,
      max_tokens: 2000,
      onChunk: (text) => {
        // Acumular el texto
        fullContent += text;
        // Actualizar el estado del mensaje en streaming
        setStreamingMessage(fullContent);
      },
      onComplete: () => {
        // 5. Cuando termine, agregar el mensaje completo al historial
        const assistantMessage: Message = {
          id: Date.now(),
          role: 'assistant',
          content: fullContent,
          timestamp: new Date().toISOString(),
        };
        
        setMessages((prev) => [...prev, assistantMessage]);
        setStreamingMessage(''); // Limpiar el mensaje en streaming
        setIsLoading(false);
      },
      onError: (error) => {
        console.error('Error al enviar mensaje:', error);
        
        // Agregar mensaje de error
        const errorMessage: Message = {
          id: Date.now(),
          role: 'assistant',
          content: `❌ Error: ${error.message}`,
          timestamp: new Date().toISOString(),
        };
        
        setMessages((prev) => [...prev, errorMessage]);
        setStreamingMessage('');
        setIsLoading(false);
      },
    });
  };

  const handleNewChat = () => {
    setMessages([]);
  };

  return (
    <div className="flex h-screen bg-[#212121] text-white overflow-hidden">
      {/* Sidebar estilo ChatGPT */}
      <Sidebar 
        isOpen={isSidebarOpen} 
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        onNewChat={handleNewChat}
      />
      
      {/* Área principal */}
      <div className="flex flex-col flex-1 relative">
        {/* Área de chat con scroll */}
        <div className="flex-1 overflow-hidden">
          <ChatArea 
            messages={messages}
            streamingMessage={streamingMessage}
            isLoading={isLoading}
          />
        </div>
        
        {/* Input fijo en la parte inferior */}
        <MessageInput 
          onSendMessage={handleSendMessage}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}