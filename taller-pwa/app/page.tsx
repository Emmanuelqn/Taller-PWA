'use client';

import { useState, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import ChatArea from './components/ChatArea';
import MessageInput from './components/MessageInput';
import GeneratePredictionButton from './components/GeneratePredictionButton';
import PredictionModal from './components/PredictionModal';
import { sendChatMessageStream } from './lib/openrouter-client';
import { 
  REQUIREMENTS_ANALYST_PROMPT, 
  shouldGeneratePrediction 
} from './lib/prompts/requirements-analyst';
import { usePrediction } from '@/hooks/usePrediction';

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
  const [streamingMessage, setStreamingMessage] = useState('');
  const [showPredictionModal, setShowPredictionModal] = useState(false);
  
  // Hook para predicciones (chatId temporal para demo)
  const [currentChatId] = useState(() => `demo-${Date.now()}`);
  const { 
    prediction, 
    isLoading: isPredictionLoading, 
    generatePrediction,
    clearPrediction 
  } = usePrediction({
    onSuccess: () => {
      setShowPredictionModal(true);
    },
    onError: (error) => {
      console.error('Error generando predicción:', error);
      // Agregar mensaje de error al chat
      const errorMessage: Message = {
        id: Date.now(),
        role: 'assistant',
        content: `❌ Error al generar la predicción: ${error}`,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    },
  });

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
    setStreamingMessage('');

    // 2. Preparar historial de mensajes para OpenRouter
    const chatHistory = messages.map((msg) => ({
      role: msg.role,
      content: msg.content,
    }));

    // 3. Variable para acumular el contenido completo
    let fullContent = '';

    // 4. Llamar a OpenRouter con streaming usando el prompt de analista
    await sendChatMessageStream({
      messages: [
        { role: 'system', content: REQUIREMENTS_ANALYST_PROMPT },
        ...chatHistory,
        { role: 'user', content },
      ],
      temperature: 0.7,
      max_tokens: 2000,
      onChunk: (text) => {
        fullContent += text;
        setStreamingMessage(fullContent);
      },
      onComplete: () => {
        const assistantMessage: Message = {
          id: Date.now(),
          role: 'assistant',
          content: fullContent,
          timestamp: new Date().toISOString(),
        };
        
        setMessages((prev) => [...prev, assistantMessage]);
        setStreamingMessage('');
        setIsLoading(false);

        // Verificar si debemos generar predicción automáticamente
        const allMessages = [...messages, userMessage, { role: 'assistant', content: fullContent }];
        if (shouldGeneratePrediction(allMessages.map(m => ({ role: m.role, content: m.content })))) {
          // Notificar al usuario que se generará la predicción
          setTimeout(() => {
            const notifyMessage: Message = {
              id: Date.now(),
              role: 'assistant',
              content: '🚀 **¡Perfecto!** Tengo toda la información necesaria. Generando tu predicción técnica...',
              timestamp: new Date().toISOString(),
            };
            setMessages((prev) => [...prev, notifyMessage]);
            // En producción, aquí llamaríamos a generatePrediction(currentChatId)
          }, 500);
        }
      },
      onError: (error) => {
        console.error('Error al enviar mensaje:', error);
        
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

  const handleNewChat = useCallback(() => {
    setMessages([]);
    clearPrediction();
  }, [clearPrediction]);

  const handleGeneratePrediction = useCallback(async () => {
    // Convertir mensajes al formato requerido por la API
    const chatMessages = messages.map(msg => ({
      role: msg.role,
      content: msg.content,
    }));
    
    // Enviar mensajes junto con el chatId para modo demo
    await generatePrediction(currentChatId, chatMessages);
  }, [generatePrediction, currentChatId, messages]);

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
        {/* Header con botón de predicción */}
        {messages.length > 0 && (
          <div className="flex-shrink-0 px-4 py-3 border-b border-white/10 flex justify-between items-center">
            <h2 className="text-sm font-medium text-white/70">
              Análisis de Requerimientos
            </h2>
            <GeneratePredictionButton
              chatId={currentChatId}
              onGenerate={handleGeneratePrediction}
              isLoading={isPredictionLoading}
              hasExistingPrediction={!!prediction}
              onViewPrediction={() => setShowPredictionModal(true)}
            />
          </div>
        )}

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

      {/* Modal de predicción */}
      <PredictionModal
        prediction={prediction}
        isOpen={showPredictionModal}
        onClose={() => setShowPredictionModal(false)}
      />
    </div>
  );
}