'use client';

import { useState } from 'react';

interface GeneratePredictionButtonProps {
  chatId: string;
  onGenerate: () => Promise<void>;
  isLoading: boolean;
  hasExistingPrediction?: boolean;
  onViewPrediction?: () => void;
}

export default function GeneratePredictionButton({
  chatId,
  onGenerate,
  isLoading,
  hasExistingPrediction = false,
  onViewPrediction,
}: GeneratePredictionButtonProps) {
  const [showConfirm, setShowConfirm] = useState(false);

  const handleClick = () => {
    if (hasExistingPrediction) {
      setShowConfirm(true);
    } else {
      onGenerate();
    }
  };

  const handleConfirm = () => {
    setShowConfirm(false);
    onGenerate();
  };

  return (
    <div className="relative">
      {/* Main Button */}
      <div className="flex gap-2">
        <button
          onClick={handleClick}
          disabled={isLoading || !chatId}
          className={`
            flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm
            transition-all duration-200
            ${isLoading 
              ? 'bg-gray-600 text-gray-400 cursor-not-allowed' 
              : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl'
            }
          `}
        >
          {isLoading ? (
            <>
              <LoadingSpinner />
              <span>Generando predicción...</span>
            </>
          ) : (
            <>
              <ChartIcon />
              <span>{hasExistingPrediction ? 'Regenerar Predicción' : 'Generar Predicción'}</span>
            </>
          )}
        </button>

        {hasExistingPrediction && onViewPrediction && (
          <button
            onClick={onViewPrediction}
            className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm bg-gray-700 text-white hover:bg-gray-600 transition-colors"
          >
            <EyeIcon />
            <span>Ver Predicción</span>
          </button>
        )}
      </div>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-gray-800 rounded-xl p-6 max-w-md mx-4 border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-2">
              ¿Regenerar predicción?
            </h3>
            <p className="text-gray-400 mb-4">
              Ya existe una predicción para esta conversación. ¿Deseas generar una nueva? 
              La predicción anterior se mantendrá pero se creará una nueva versión.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 rounded-lg text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-700 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirm}
                className="px-4 py-2 rounded-lg text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors"
              >
                Sí, regenerar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Icons
function ChartIcon() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        strokeWidth={2} 
        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" 
      />
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        strokeWidth={2} 
        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" 
      />
      <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        strokeWidth={2} 
        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" 
      />
    </svg>
  );
}

function LoadingSpinner() {
  return (
    <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
      <circle 
        className="opacity-25" 
        cx="12" 
        cy="12" 
        r="10" 
        stroke="currentColor" 
        strokeWidth="4"
      />
      <path 
        className="opacity-75" 
        fill="currentColor" 
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}
