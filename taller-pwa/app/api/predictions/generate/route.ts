import { NextRequest, NextResponse } from 'next/server';
import { openai, MODELS } from '@/app/lib/openrouter-sdk';
import { 
  PREDICTION_GENERATION_PROMPT,
  generateConversationContext,
  generateDocumentsContext
} from '@/app/lib/prompts/requirements-analyst';
import type { TechnicalPredictionData } from '@/types/prediction';
import prisma from '@/app/lib/prisma';

// Función para validar si un string es un UUID válido
function isValidUUID(str: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(str);
}

/**
 * API Route para generar predicciones técnicas
 * POST /api/predictions/generate
 * 
 * Body: {
 *   chatId: string - ID del chat con la conversación
 *   messages?: Array<{role: string, content: string}> - Mensajes para modo demo
 * }
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { chatId, messages: demoMessages } = body;

    if (!chatId) {
      return NextResponse.json(
        { error: 'El campo "chatId" es requerido' },
        { status: 400 }
      );
    }

    // Verificar si es modo demo (chatId no es UUID válido)
    const isDemoMode = !isValidUUID(chatId);

    let conversationContext: string;
    let documentsContext: string;
    let userId: string | null = null;

    if (isDemoMode) {
      // Modo demo: usar mensajes enviados en el body
      if (!demoMessages || !Array.isArray(demoMessages) || demoMessages.length === 0) {
        return NextResponse.json(
          { error: 'Para modo demo, se requiere el campo "messages" con la conversación' },
          { status: 400 }
        );
      }

      conversationContext = generateConversationContext(
        demoMessages.map((m: { role: string; content: string }) => ({ 
          role: m.role, 
          content: m.content 
        }))
      );
      documentsContext = generateDocumentsContext([]);
    } else {
      // Modo normal: obtener chat de la base de datos
      const chat = await prisma.chat.findUnique({
        where: { id: chatId },
        include: {
          messages: {
            orderBy: { createdAt: 'asc' },
            select: {
              role: true,
              content: true,
            }
          },
          uploadedFiles: {
            select: {
              originalName: true,
              extractedText: true,
            }
          },
          user: {
            select: { id: true }
          }
        }
      });

      if (!chat) {
        return NextResponse.json(
          { error: 'Chat no encontrado' },
          { status: 404 }
        );
      }

      userId = chat.user.id;
      conversationContext = generateConversationContext(
        chat.messages.map(m => ({ role: m.role, content: m.content }))
      );
      documentsContext = generateDocumentsContext(
        chat.uploadedFiles.map(f => ({ 
          name: f.originalName, 
          extractedText: f.extractedText 
        }))
      );
    }

    // 3. Construir el prompt final
    const finalPrompt = PREDICTION_GENERATION_PROMPT
      .replace('{CONVERSATION_CONTEXT}', conversationContext)
      .replace('{DOCUMENTS_CONTEXT}', documentsContext);

    // 4. Llamar a OpenRouter para generar la predicción
    const completion = await openai.chat.completions.create({
      model: MODELS.GPT_4O, // Usar modelo más capaz para predicciones
      messages: [
        {
          role: 'system',
          content: 'Eres un experto en estimación de proyectos de software. Responde ÚNICAMENTE con JSON válido, sin markdown ni explicaciones.'
        },
        {
          role: 'user',
          content: finalPrompt
        }
      ],
      temperature: 0.3, // Baja temperatura para respuestas más consistentes
      max_tokens: 4000,
      response_format: { type: 'json_object' }, // Forzar respuesta JSON
    });

    const responseContent = completion.choices[0]?.message?.content;

    if (!responseContent) {
      throw new Error('No se recibió respuesta del modelo');
    }

    // 5. Parsear y validar la predicción
    let predictionData: TechnicalPredictionData;
    try {
      predictionData = JSON.parse(responseContent);
    } catch {
      console.error('❌ Error parseando JSON:', responseContent);
      throw new Error('La respuesta del modelo no es un JSON válido');
    }

    // 6. Validar campos mínimos requeridos
    if (!predictionData.projectName || !predictionData.costs || !predictionData.estimation) {
      throw new Error('La predicción generada no tiene todos los campos requeridos');
    }

    // 7. Guardar la predicción en la base de datos (solo si no es modo demo)
    let savedPredictionId: string | null = null;

    if (!isDemoMode && userId) {
      const savedPrediction = await prisma.technicalPrediction.create({
        data: {
          chatId: chatId,
          userId: userId,
          
          // Información básica
          projectName: predictionData.projectName,
          projectSummary: predictionData.projectSummary,
          scopeDescription: predictionData.scopeDescription,
          projectType: predictionData.projectType || 'OTHER',
          
          // Stack tecnológico (como JSON)
          technologyStack: predictionData.technologyStack as object,
          
          // Perfiles (como JSON)
          requiredProfiles: predictionData.requiredProfiles as object[],
          
          // Desglose de módulos (como JSON)
          moduleBreakdown: predictionData.moduleBreakdown as object[],
          
          // Estimaciones
          totalHours: predictionData.estimation.totalHours,
          totalWeeks: predictionData.estimation.totalWeeks,
          totalMonths: predictionData.estimation.totalMonths,
          confidenceLevel: predictionData.estimation.confidenceLevel,
          estimationModel: predictionData.estimation.methodology || 'PERT',
          complexityScore: predictionData.estimation.complexityScore,
          
          // Costos
          totalCostMXN: predictionData.costs.totalProjectMXN,
          totalCostUSD: predictionData.costs.totalProjectUSD,
          developmentCostMXN: predictionData.costs.development.totalMXN,
          infrastructureCostMXN: predictionData.costs.infrastructure.monthlyMXN * predictionData.estimation.totalMonths,
          contingencyPercentage: predictionData.costs.contingency.percentage,
          costBreakdown: predictionData.costs as object,
          
          // Timeline (como JSON)
          timeline: predictionData.timeline as object,
          
          // Riesgos y recomendaciones
          risks: predictionData.risks as object[],
          assumptions: predictionData.assumptions,
          recommendations: predictionData.recommendations,
        }
      });

      savedPredictionId = savedPrediction.id;

      // 8. Actualizar estado del chat
      await prisma.chat.update({
        where: { id: chatId },
        data: { 
          status: 'PREDICTION_GENERATED',
          predictionGeneratedAt: new Date()
        }
      });
    }

    return NextResponse.json({
      success: true,
      predictionId: savedPredictionId,
      prediction: predictionData,
      isDemo: isDemoMode
    });

  } catch (error) {
    console.error('❌ Error generando predicción:', error);
    
    return NextResponse.json(
      { 
        error: 'Error al generar la predicción',
        details: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/predictions/generate?chatId=xxx
 * Obtiene la predicción existente de un chat
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const chatId = searchParams.get('chatId');

    if (!chatId) {
      return NextResponse.json(
        { error: 'El parámetro "chatId" es requerido' },
        { status: 400 }
      );
    }

    const prediction = await prisma.technicalPrediction.findFirst({
      where: { chatId },
      orderBy: { createdAt: 'desc' }
    });

    if (!prediction) {
      return NextResponse.json(
        { error: 'No se encontró predicción para este chat' },
        { status: 404 }
      );
    }

    // Reconstruir el objeto completo de predicción
    const predictionData: TechnicalPredictionData = {
      projectName: prediction.projectName,
      projectSummary: prediction.projectSummary || '',
      scopeDescription: prediction.scopeDescription || '',
      projectType: prediction.projectType as TechnicalPredictionData['projectType'],
      technologyStack: prediction.technologyStack as unknown as TechnicalPredictionData['technologyStack'],
      requiredProfiles: prediction.requiredProfiles as unknown as TechnicalPredictionData['requiredProfiles'],
      moduleBreakdown: prediction.moduleBreakdown as unknown as TechnicalPredictionData['moduleBreakdown'],
      estimation: {
        totalHours: prediction.totalHours,
        totalWeeks: prediction.totalWeeks,
        totalMonths: prediction.totalMonths,
        hoursPerWeek: 40,
        methodology: prediction.estimationModel || 'PERT',
        confidenceLevel: prediction.confidenceLevel || 75,
        optimisticHours: Math.round(prediction.totalHours * 0.8),
        pessimisticHours: Math.round(prediction.totalHours * 1.3),
        complexityScore: prediction.complexityScore || 5
      },
      costs: prediction.costBreakdown as unknown as TechnicalPredictionData['costs'],
      timeline: prediction.timeline as unknown as TechnicalPredictionData['timeline'],
      risks: prediction.risks as unknown as TechnicalPredictionData['risks'],
      assumptions: prediction.assumptions,
      recommendations: prediction.recommendations
    };

    return NextResponse.json({
      success: true,
      predictionId: prediction.id,
      prediction: predictionData,
      createdAt: prediction.createdAt
    });

  } catch (error) {
    console.error('❌ Error obteniendo predicción:', error);
    
    return NextResponse.json(
      { 
        error: 'Error al obtener la predicción',
        details: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    );
  }
}
