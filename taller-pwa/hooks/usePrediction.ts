'use client';

import { useState, useCallback } from 'react';
import type { TechnicalPredictionData, GeneratePredictionResponse } from '@/types/prediction';

interface Message {
  role: string;
  content: string;
}

interface UsePredictionOptions {
  onSuccess?: (prediction: TechnicalPredictionData) => void;
  onError?: (error: string) => void;
}

interface UsePredictionReturn {
  prediction: TechnicalPredictionData | null;
  predictionId: string | null;
  isLoading: boolean;
  error: string | null;
  generatePrediction: (chatId: string, messages?: Message[]) => Promise<void>;
  fetchPrediction: (chatId: string) => Promise<void>;
  clearPrediction: () => void;
}

/**
 * Hook para gestionar predicciones técnicas
 */
export function usePrediction(options: UsePredictionOptions = {}): UsePredictionReturn {
  const [prediction, setPrediction] = useState<TechnicalPredictionData | null>(null);
  const [predictionId, setPredictionId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { onSuccess, onError } = options;

  /**
   * Genera una nueva predicción para un chat
   * @param chatId - ID del chat (puede ser UUID real o "demo-xxx" para modo demo)
   * @param messages - Mensajes de la conversación (requerido para modo demo)
   */
  const generatePrediction = useCallback(async (chatId: string, messages?: Message[]) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/predictions/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ chatId, messages }),
      });

      const data: GeneratePredictionResponse = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Error al generar la predicción');
      }

      if (data.prediction) {
        setPrediction(data.prediction);
        setPredictionId(data.predictionId || null);
        onSuccess?.(data.prediction);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      onError?.(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [onSuccess, onError]);

  /**
   * Obtiene una predicción existente
   */
  const fetchPrediction = useCallback(async (chatId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/predictions/generate?chatId=${chatId}`);
      const data: GeneratePredictionResponse = await response.json();

      if (!response.ok) {
        if (response.status === 404) {
          // No hay predicción, no es un error
          setPrediction(null);
          setPredictionId(null);
          return;
        }
        throw new Error(data.error || 'Error al obtener la predicción');
      }

      if (data.prediction) {
        setPrediction(data.prediction);
        setPredictionId(data.predictionId || null);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      onError?.(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [onError]);

  /**
   * Limpia la predicción actual
   */
  const clearPrediction = useCallback(() => {
    setPrediction(null);
    setPredictionId(null);
    setError(null);
  }, []);

  return {
    prediction,
    predictionId,
    isLoading,
    error,
    generatePrediction,
    fetchPrediction,
    clearPrediction,
  };
}
