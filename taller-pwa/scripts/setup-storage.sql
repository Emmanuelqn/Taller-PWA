-- ============================================================================
-- Script SQL para configurar Supabase Storage
-- Ejecutar en Supabase SQL Editor
-- ============================================================================

-- 1. Crear el bucket para documentos (si no existe)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'documents',
  'documents',
  false, -- No es público, requiere autenticación
  10485760, -- 10MB
  ARRAY['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain']
)
ON CONFLICT (id) DO UPDATE SET
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- 2. Políticas de seguridad RLS para el bucket
-- Primero eliminamos políticas existentes si las hay
DROP POLICY IF EXISTS "Users can upload their own files" ON storage.objects;
DROP POLICY IF EXISTS "Users can view their own files" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own files" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own files" ON storage.objects;

-- 3. Política: Los usuarios pueden subir archivos a su propia carpeta
CREATE POLICY "Users can upload their own files"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'documents' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- 4. Política: Los usuarios pueden ver sus propios archivos
CREATE POLICY "Users can view their own files"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'documents' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- 5. Política: Los usuarios pueden actualizar sus propios archivos
CREATE POLICY "Users can update their own files"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'documents' AND
  (storage.foldername(name))[1] = auth.uid()::text
)
WITH CHECK (
  bucket_id = 'documents' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- 6. Política: Los usuarios pueden eliminar sus propios archivos
CREATE POLICY "Users can delete their own files"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'documents' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- ============================================================================
-- Verificación
-- ============================================================================
-- Ejecutar estas consultas para verificar la configuración:

-- Ver buckets:
-- SELECT * FROM storage.buckets WHERE id = 'documents';

-- Ver políticas del bucket:
-- SELECT * FROM pg_policies WHERE tablename = 'objects' AND schemaname = 'storage';
