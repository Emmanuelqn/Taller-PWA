import { openai, MODELS, type ChatMessage } from '@/app/lib/openrouter-sdk';

/**
 * API Route para chat con streaming usando Server-Sent Events (SSE)
 * POST /api/chat/stream
 * 
 * Body: {
 *   messages: ChatMessage[],
 *   model?: string,
 *   temperature?: number,
 *   max_tokens?: number
 * }
 * 
 * Devuelve un stream en formato SSE:
 * data: {"content": "texto"}\n\n
 * data: [DONE]\n\n
 */
export async function POST(req: Request) {
  try {
    // 1. Validar el body del request
    const body = await req.json();
    const { messages, model = MODELS.GPT_4O_MINI, temperature = 0.7, max_tokens = 1000 } = body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return new Response(
        JSON.stringify({ error: 'El campo "messages" es requerido y debe ser un array no vacío' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // 2. Validar estructura de mensajes
    const isValidMessages = messages.every(
      (msg: ChatMessage) =>
        msg.role && msg.content && ['system', 'user', 'assistant'].includes(msg.role)
    );

    if (!isValidMessages) {
      return new Response(
        JSON.stringify({ error: 'Formato de mensajes inválido. Cada mensaje debe tener "role" y "content"' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // 3. Crear un stream de respuesta
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          // 4. Llamar a OpenRouter con streaming habilitado
          const completion = await openai.chat.completions.create({
            model,
            messages,
            temperature,
            max_tokens,
            stream: true, // ✅ Habilitar streaming
          });

          // 5. Procesar cada chunk del stream
          for await (const chunk of completion) {
            const content = chunk.choices[0]?.delta?.content;
            
            if (content) {
              // Enviar el chunk en formato SSE
              const data = JSON.stringify({ content });
              controller.enqueue(encoder.encode(`data: ${data}\n\n`));
            }
          }

          // 6. Enviar señal de finalización
          controller.enqueue(encoder.encode('data: [DONE]\n\n'));
          controller.close();

        } catch (error) {
          console.error('❌ Error en streaming:', error);
          
          // Enviar error como evento SSE
          const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
          const errorData = JSON.stringify({ error: errorMessage });
          controller.enqueue(encoder.encode(`data: ${errorData}\n\n`));
          controller.close();
        }
      },
    });

    // 7. Devolver la respuesta con headers de SSE
    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });

  } catch (error) {
    console.error('❌ Error en /api/chat/stream:', error);
    
    return new Response(
      JSON.stringify({ 
        error: 'Error interno del servidor',
        details: error instanceof Error ? error.message : 'Error desconocido'
      }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}
