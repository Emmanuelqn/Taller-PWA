/**
 * Declaración de tipos para variables de entorno
 * Esto proporciona autocompletado y validación de tipos en TypeScript
 */

declare namespace NodeJS {
  interface ProcessEnv {
    // OpenRouter
    OPENROUTER_API_KEY: string;
    
    // Configuración opcional de OpenRouter
    NEXT_PUBLIC_SITE_URL?: string;
    NEXT_PUBLIC_SITE_NAME?: string;
    
    // Supabase (si lo usas)
    NEXT_PUBLIC_SUPABASE_URL?: string;
    NEXT_PUBLIC_SUPABASE_ANON_KEY?: string;
    
    // Next.js
    NODE_ENV: 'development' | 'production' | 'test';
  }
}
