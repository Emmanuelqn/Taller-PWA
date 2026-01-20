/**
 * API Route para subir archivos
 * POST /api/files/upload
 * 
 * Soporta: PDF, DOCX, TXT
 * Almacena en Supabase Storage
 * Extrae texto y guarda metadata en DB
 */
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/app/lib/supabase/server'
import prisma from '@/app/lib/prisma'
import { 
  extractText, 
  isSupportedMimeType, 
  getExtensionFromMimeType 
} from '@/app/lib/document-extractor'
import { v4 as uuidv4 } from 'uuid'

// Configuración
const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
const BUCKET_NAME = 'documents'

export async function POST(request: NextRequest) {
  try {
    // 1. Obtener cliente Supabase y verificar autenticación
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      )
    }

    // 2. Obtener el formulario con el archivo
    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const chatId = formData.get('chatId') as string | null

    if (!file) {
      return NextResponse.json(
        { error: 'No se proporcionó ningún archivo' },
        { status: 400 }
      )
    }

    if (!chatId) {
      return NextResponse.json(
        { error: 'Se requiere el ID del chat' },
        { status: 400 }
      )
    }

    // 3. Validar tipo de archivo
    if (!isSupportedMimeType(file.type)) {
      return NextResponse.json(
        { error: 'Tipo de archivo no soportado. Solo se permiten PDF, DOCX y TXT.' },
        { status: 400 }
      )
    }

    // 4. Validar tamaño
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: `El archivo excede el tamaño máximo de ${MAX_FILE_SIZE / 1024 / 1024}MB` },
        { status: 400 }
      )
    }

    // 5. Verificar que el chat existe y pertenece al usuario
    const chat = await prisma.chat.findFirst({
      where: {
        id: chatId,
        userId: user.id,
      },
    })

    if (!chat) {
      return NextResponse.json(
        { error: 'Chat no encontrado o no autorizado' },
        { status: 404 }
      )
    }

    // 6. Generar nombre único para el archivo
    const fileId = uuidv4()
    const extension = getExtensionFromMimeType(file.type)
    const fileName = `${fileId}.${extension}`
    const storagePath = `${user.id}/${chatId}/${fileName}`

    // 7. Convertir archivo a Buffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // 8. Subir a Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(storagePath, buffer, {
        contentType: file.type,
        cacheControl: '3600',
        upsert: false,
      })

    if (uploadError) {
      console.error('Error al subir archivo:', uploadError)
      return NextResponse.json(
        { error: 'Error al subir el archivo' },
        { status: 500 }
      )
    }

    // 9. Obtener URL pública (si el bucket es público)
    const { data: urlData } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(storagePath)

    // 10. Extraer texto del documento
    const extractionResult = await extractText(buffer, file.type)

    // 11. Guardar metadata en la base de datos
    const uploadedFile = await prisma.uploadedFile.create({
      data: {
        fileName,
        originalName: file.name,
        mimeType: file.type,
        fileSize: file.size,
        fileExtension: extension,
        storagePath,
        storageUrl: urlData.publicUrl,
        extractedText: extractionResult.text || null,
        textExtractionStatus: extractionResult.error ? 'FAILED' : 'COMPLETED',
        extractionError: extractionResult.error || null,
        pageCount: extractionResult.pageCount || null,
        wordCount: extractionResult.wordCount,
        processedAt: new Date(),
        userId: user.id,
        chatId,
      },
    })

    // 12. Responder con los datos del archivo
    return NextResponse.json({
      success: true,
      file: {
        id: uploadedFile.id,
        fileName: uploadedFile.originalName,
        mimeType: uploadedFile.mimeType,
        fileSize: uploadedFile.fileSize,
        wordCount: uploadedFile.wordCount,
        pageCount: uploadedFile.pageCount,
        textExtracted: !extractionResult.error,
        extractedTextPreview: extractionResult.text?.slice(0, 500) || null,
      },
    })

  } catch (error) {
    console.error('Error en upload:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

/**
 * GET /api/files/upload?chatId=xxx
 * Lista archivos de un chat
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const chatId = searchParams.get('chatId')

    if (!chatId) {
      return NextResponse.json(
        { error: 'Se requiere el ID del chat' },
        { status: 400 }
      )
    }

    const files = await prisma.uploadedFile.findMany({
      where: {
        chatId,
        userId: user.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        id: true,
        fileName: true,
        originalName: true,
        mimeType: true,
        fileSize: true,
        wordCount: true,
        pageCount: true,
        textExtractionStatus: true,
        createdAt: true,
      },
    })

    return NextResponse.json({ files })

  } catch (error) {
    console.error('Error al listar archivos:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
