/**
 * Utilidades para extracción de texto de documentos
 * Soporta PDF, DOCX y TXT
 */

// pdf-parse requires dynamic import for proper ES module handling
import mammoth from 'mammoth'

export type SupportedMimeType = 
  | 'application/pdf'
  | 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  | 'text/plain'

export interface ExtractionResult {
  text: string
  pageCount?: number
  wordCount: number
  error?: string
}

/**
 * Extrae texto de un archivo PDF
 */
export async function extractFromPDF(buffer: Buffer): Promise<ExtractionResult> {
  try {
    // Dynamic import for pdf-parse with type assertion to handle module resolution
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const pdfParseModule = await import('pdf-parse') as any
    const pdfParse = pdfParseModule.default ?? pdfParseModule
    const data = await pdfParse(buffer)
    const text = (data.text as string).trim()
    
    return {
      text,
      pageCount: data.numpages as number,
      wordCount: countWords(text),
    }
  } catch (error) {
    return {
      text: '',
      wordCount: 0,
      error: `Error al procesar PDF: ${error instanceof Error ? error.message : 'Error desconocido'}`,
    }
  }
}

/**
 * Extrae texto de un archivo DOCX
 */
export async function extractFromDOCX(buffer: Buffer): Promise<ExtractionResult> {
  try {
    const result = await mammoth.extractRawText({ buffer })
    const text = result.value.trim()
    
    return {
      text,
      wordCount: countWords(text),
    }
  } catch (error) {
    return {
      text: '',
      wordCount: 0,
      error: `Error al procesar DOCX: ${error instanceof Error ? error.message : 'Error desconocido'}`,
    }
  }
}

/**
 * Extrae texto de un archivo TXT
 */
export function extractFromTXT(buffer: Buffer): ExtractionResult {
  try {
    const text = buffer.toString('utf-8').trim()
    
    return {
      text,
      wordCount: countWords(text),
    }
  } catch (error) {
    return {
      text: '',
      wordCount: 0,
      error: `Error al procesar TXT: ${error instanceof Error ? error.message : 'Error desconocido'}`,
    }
  }
}

/**
 * Extrae texto basado en el tipo MIME
 */
export async function extractText(
  buffer: Buffer, 
  mimeType: string
): Promise<ExtractionResult> {
  switch (mimeType) {
    case 'application/pdf':
      return extractFromPDF(buffer)
    
    case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
      return extractFromDOCX(buffer)
    
    case 'text/plain':
      return extractFromTXT(buffer)
    
    default:
      return {
        text: '',
        wordCount: 0,
        error: `Tipo de archivo no soportado: ${mimeType}`,
      }
  }
}

/**
 * Cuenta palabras en un texto
 */
function countWords(text: string): number {
  return text
    .split(/\s+/)
    .filter(word => word.length > 0)
    .length
}

/**
 * Verifica si el tipo MIME es soportado
 */
export function isSupportedMimeType(mimeType: string): mimeType is SupportedMimeType {
  const supportedTypes: SupportedMimeType[] = [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain',
  ]
  
  return supportedTypes.includes(mimeType as SupportedMimeType)
}

/**
 * Obtiene la extensión basada en el tipo MIME
 */
export function getExtensionFromMimeType(mimeType: string): string {
  const extensions: Record<string, string> = {
    'application/pdf': 'pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
    'text/plain': 'txt',
  }
  
  return extensions[mimeType] || 'unknown'
}
