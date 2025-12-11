import { NextResponse } from 'next/server';
import { openai, MODELS, type ChatMessage } from '@/app/lib/openrouter-sdk';

/**
 * API Route para chat con OpenRouter usando el SDK oficial de OpenAI
 * POST /api/chat
 * 
 * Body: {
 *   messages: ChatMessage[],
 *   model?: string,
 *   temperature?: number,
 *   max_tokens?: number
 * }
 * 
 * Basado en: https://openrouter.ai/docs/quickstart
 */
export async function POST(req: Request) {
  try {
    // 1. Validar el body del request
    const body = await req.json();
    const { messages, model = MODELS.GPT_4O_MINI, temperature = 0.7, max_tokens = 1000 } = body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: 'El campo "messages" es requerido y debe ser un array no vacío' },
        { status: 400 }
      );
    }

    // 2. Validar estructura de mensajes
    const isValidMessages = messages.every(
      (msg: ChatMessage) =>
        msg.role && msg.content && ['system', 'user', 'assistant'].includes(msg.role)
    );

    if (!isValidMessages) {
      return NextResponse.json(
        { error: 'Formato de mensajes inválido. Cada mensaje debe tener "role" y "content"' },
        { status: 400 }
      );
    }

    // 3. Llamar a OpenRouter usando el SDK de OpenAI
    const completion = await openai.chat.completions.create({
      model,
      messages,
      temperature,
      max_tokens,
    });

    // 4. Devolver la respuesta exitosa
    return NextResponse.json({
      success: true,
      message: completion.choices[0]?.message?.content || '',
      usage: completion.usage,
      model: completion.model,
    });

  } catch (error) {
    console.error('❌ Error en /api/chat:', error);
    
    // Manejar errores específicos de OpenAI/OpenRouter
    const isOpenAIError = error && typeof error === 'object' && 'status' in error;
    
    if (isOpenAIError) {
      const openAIError = error as { status: number; message?: string };
      return NextResponse.json(
        { 
          error: 'Error al comunicarse con OpenRouter',
          details: openAIError.message || 'Error desconocido'
        },
        { status: openAIError.status }
      );
    }
    
    return NextResponse.json(
      { 
        error: 'Error interno del servidor',
        details: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    );
  }
}
