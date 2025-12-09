'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, Mic } from 'lucide-react';

interface MessageInputProps {
  onSendMessage?: (message: string) => void;
  placeholder?: string;
}

export default function MessageInput({
  onSendMessage,
  placeholder = 'Escribe un mensaje...',
}: MessageInputProps) {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize del textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
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
    <div className="fixed bottom-0 left-64 right-0 bg-gray-800 border-t border-gray-700">
      <div className="max-w-4xl mx-auto px-4 py-4">
        <div className="flex items-end gap-2 bg-gray-700 rounded-lg px-4 py-3 border border-gray-600 focus-within:border-gray-500 transition-colors">
          <button
            className="p-2 hover:bg-gray-600 rounded-lg transition-colors text-gray-400 hover:text-white"
            aria-label="Adjuntar archivo"
          >
            <Paperclip className="w-5 h-5" />
          </button>
          
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            rows={1}
            className="flex-1 bg-transparent text-white placeholder-gray-400 resize-none outline-none text-sm max-h-32 overflow-y-auto"
            style={{ minHeight: '24px' }}
          />
          
          <div className="flex items-center gap-1">
            <button
              className="p-2 hover:bg-gray-600 rounded-lg transition-colors text-gray-400 hover:text-white"
              aria-label="Grabar audio"
            >
              <Mic className="w-5 h-5" />
            </button>
            
            <button
              onClick={handleSend}
              disabled={!message.trim()}
              className="p-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg transition-colors text-white disabled:text-gray-400"
              aria-label="Enviar mensaje"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-2 text-center">
          Puede cometer errores. Verifica información importante.
        </p>
      </div>
    </div>
  );
}

