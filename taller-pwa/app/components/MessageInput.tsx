'use client';

import { useState, useRef, useEffect } from 'react';
import { ArrowUp, Paperclip, Image as ImageIcon } from 'lucide-react';

interface MessageInputProps {
  onSendMessage?: (message: string) => void;
  placeholder?: string;
  isLoading?: boolean;
}

export default function MessageInput({
  onSendMessage,
  placeholder = 'Envía un mensaje',
  isLoading = false,
}: MessageInputProps) {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize del textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const newHeight = Math.min(textareaRef.current.scrollHeight, 200);
      textareaRef.current.style.height = `${newHeight}px`;
    }
  }, [message]);

  const handleSend = () => {
    if (message.trim() && onSendMessage) {
      onSendMessage(message.trim());
      setMessage('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="w-full border-t border-white/10 bg-[#212121]">
      <div className="max-w-3xl mx-auto px-4 py-4">
        {/* Contenedor del input */}
        <div className="relative flex items-end gap-2 bg-[#2f2f2f] rounded-3xl px-4 py-3 shadow-lg">
          {/* Botón de adjuntar */}
          <button
            disabled={isLoading}
            className={`shrink-0 p-2 rounded-lg transition-colors ${
              isLoading 
                ? 'text-white/30 cursor-not-allowed' 
                : 'text-white/70 hover:text-white hover:bg-white/10'
            }`}
            aria-label="Adjuntar archivo"
          >
            <Paperclip className="w-5 h-5" />
          </button>

          {/* Botón de imagen */}
          <button
            disabled={isLoading}
            className={`shrink-0 p-2 rounded-lg transition-colors ${
              isLoading 
                ? 'text-white/30 cursor-not-allowed' 
                : 'text-white/70 hover:text-white hover:bg-white/10'
            }`}
            aria-label="Adjuntar imagen"
          >
            <ImageIcon className="w-5 h-5" />
          </button>
          
          {/* Textarea */}
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={isLoading ? 'Esperando respuesta...' : placeholder}
            rows={1}
            disabled={isLoading}
            className={`flex-1 bg-transparent text-white placeholder-white/40 resize-none outline-none text-[15px] max-h-[200px] overflow-y-auto py-2 ${
              isLoading ? 'cursor-not-allowed opacity-50' : ''
            }`}
            style={{ minHeight: '24px' }}
          />
          
          {/* Botón de enviar */}
          <button
            onClick={handleSend}
            disabled={!message.trim() || isLoading}
            className={`shrink-0 p-2 rounded-full transition-all ${
              message.trim() && !isLoading
                ? 'bg-white text-black hover:bg-white/90'
                : 'bg-white/10 text-white/40 cursor-not-allowed'
            }`}
            aria-label={isLoading ? 'Enviando...' : 'Enviar mensaje'}
          >
            <ArrowUp className={`w-5 h-5 ${isLoading ? 'animate-pulse' : ''}`} />
          </button>
        </div>

        {/* Texto de advertencia */}
        <p className="text-xs text-white/40 mt-3 text-center px-4">
          ChatGPT puede cometer errores. Comprueba la información importante.
        </p>
      </div>
    </div>
  );
}

