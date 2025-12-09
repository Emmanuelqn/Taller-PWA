'use client';

import { MessageSquare, Plus } from 'lucide-react';

export default function Sidebar() {
  // Historial simulado
  const chatHistory = [
    { id: 1, title: 'Conversación sobre React', date: '2024-01-15' },
    { id: 2, title: 'Preguntas sobre Next.js', date: '2024-01-14' },
    { id: 3, title: 'Dudas de TypeScript', date: '2024-01-13' },
    { id: 4, title: 'Optimización de rendimiento', date: '2024-01-12' },
    { id: 5, title: 'Configuración de Tailwind', date: '2024-01-11' },
  ];

  return (
    <aside className="w-64 bg-gray-800 text-white fixed left-0 top-0 h-screen overflow-y-auto border-r border-gray-700">
      <div className="p-4">
        <button className="w-full flex items-center gap-2 px-4 py-3 mb-4 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors">
          <Plus className="w-5 h-5" />
          <span className="font-medium">Nuevo Chat</span>
        </button>
        
        <div className="space-y-1">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-2 mb-2">
            Historial
          </h3>
          {chatHistory.map((chat) => (
            <button
              key={chat.id}
              className="w-full flex items-start gap-3 px-3 py-2.5 hover:bg-gray-700 rounded-lg transition-colors text-left group"
            >
              <MessageSquare className="w-4 h-4 mt-0.5 text-gray-400 group-hover:text-white flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-200 truncate">{chat.title}</p>
                <p className="text-xs text-gray-500 mt-0.5">{chat.date}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}
