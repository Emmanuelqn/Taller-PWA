'use client';

import { useEffect, useRef } from 'react';
import PredictionView from './PredictionView';
import type { TechnicalPredictionData } from '@/types/prediction';

interface PredictionModalProps {
  prediction: TechnicalPredictionData | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function PredictionModal({ prediction, isOpen, onClose }: PredictionModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  // Cerrar con Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // Cerrar al hacer clic fuera
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  if (!isOpen || !prediction) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
      onClick={handleBackdropClick}
    >
      <div 
        ref={modalRef}
        className="w-full max-w-6xl max-h-[95vh] animate-in fade-in zoom-in-95 duration-200"
      >
        <PredictionView prediction={prediction} onClose={onClose} />
      </div>
    </div>
  );
}
