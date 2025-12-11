'use client';

import { MessageSquare, Plus, PanelLeftClose, PanelLeft, Trash2, Edit3 } from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  onNewChat: () => void;
}

export default function Sidebar({ isOpen, onToggle, onNewChat }: SidebarProps) {
  // Historial simulado
  const chatHistory = [
    { id: 1, title: 'Conversación sobre React', date: 'Hoy' },
    { id: 2, title: 'Preguntas sobre Next.js', date: 'Ayer' },
    { id: 3, title: 'Dudas de TypeScript', date: 'Hace 3 días' },
    { id: 4, title: 'Optimización de rendimiento', date: 'Hace 5 días' },
    { id: 5, title: 'Configuración de Tailwind', date: 'Hace 1 semana' },
    { id: 6, title: 'Hooks personalizados', date: 'Hace 1 semana' },
    { id: 7, title: 'Estado global con Context', date: 'Hace 2 semanas' },
    { id: 8, title: 'Server Components', date: 'Hace 2 semanas' },
  ];

  return (
    <>
      {/* Toggle button cuando está cerrado */}
      {!isOpen && (
        <button
          onClick={onToggle}
          className="fixed top-4 left-4 z-50 p-2 rounded-lg bg-[#2f2f2f] hover:bg-[#3f3f3f] transition-colors"
          aria-label="Abrir sidebar"
        >
          <PanelLeft className="w-5 h-5" />
        </button>
      )}

      {/* Sidebar */}
      <aside
        className={`${
          isOpen ? 'w-64 relative' : 'w-0 absolute'
        } bg-[#171717] h-screen overflow-hidden transition-all duration-300 ease-in-out flex-shrink-0 border-r border-white/10 z-40`}
      >
        <div className={`${isOpen ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300 h-full flex flex-col`}>
          {/* Header con toggle y nuevo chat */}
          <div className="p-2 flex items-center gap-2">
            <button
              onClick={onToggle}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors"
              aria-label="Cerrar sidebar"
            >
              <PanelLeftClose className="w-5 h-5" />
            </button>
            
            <button
              onClick={onNewChat}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-white/20 hover:bg-white/10 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span className="text-sm font-medium">Nuevo chat</span>
            </button>
          </div>

          {/* Lista de chats */}
          <div className="flex-1 overflow-y-auto px-2 py-2">
            <div className="space-y-1">
              {chatHistory.map((chat) => (
                <button
                  key={chat.id}
                  className="w-full group flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/10 transition-colors text-left relative"
                >
                  <MessageSquare className="w-4 h-4 flex-shrink-0 text-white/60" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white/90 truncate">{chat.title}</p>
                    <p className="text-xs text-white/40 mt-0.5">{chat.date}</p>
                  </div>
                  
                  {/* Botones de acción al hacer hover */}
                  <div className="hidden group-hover:flex items-center gap-1">
                    <button
                      className="p-1.5 rounded hover:bg-white/20 transition-colors"
                      aria-label="Editar"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      className="p-1.5 rounded hover:bg-white/20 transition-colors text-red-400"
                      aria-label="Eliminar"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Footer con usuario */}
          <div className="p-3 border-t border-white/10">
            <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/10 transition-colors">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-sm font-semibold">
                U
              </div>
              <div className="flex-1 text-left">
                <p className="text-sm font-medium">Usuario</p>
                <p className="text-xs text-white/50">Cuenta gratuita</p>
              </div>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
