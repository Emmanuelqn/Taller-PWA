'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/app/lib/supabase/client';
import { Eye, EyeOff, Loader2, Mail, Lock, AlertCircle, CheckCircle } from 'lucide-react';

type AuthMode = 'login' | 'signup' | 'forgot-password';

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();

  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const validateForm = (): boolean => {
    setError(null);

    if (!email.trim()) {
      setError('El correo electrónico es requerido');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Ingresa un correo electrónico válido');
      return false;
    }

    if (mode !== 'forgot-password') {
      if (!password) {
        setError('La contraseña es requerida');
        return false;
      }

      if (password.length < 6) {
        setError('La contraseña debe tener al menos 6 caracteres');
        return false;
      }
    }

    if (mode === 'signup' && password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return false;
    }

    return true;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      if (error.message.includes('Invalid login credentials')) {
        setError('Credenciales inválidas. Verifica tu email y contraseña.');
      } else if (error.message.includes('Email not confirmed')) {
        setError('Debes confirmar tu email antes de iniciar sesión. Revisa tu bandeja de entrada (y spam) para el enlace de confirmación.');
        setSuccess('💡 Tip: Si no encuentras el email, puedes registrarte de nuevo para recibir otro enlace.');
      } else {
        setError(error.message);
      }
      setIsLoading(false);
      return;
    }

    router.push('/');
    router.refresh();
  };

  const handleSignup = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    setError(null);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      if (error.message.includes('User already registered')) {
        setError('Este email ya está registrado. Intenta iniciar sesión.');
      } else {
        setError(error.message);
      }
      setIsLoading(false);
      return;
    }

    setSuccess('¡Registro exitoso! Revisa tu correo para confirmar tu cuenta.');
    setIsLoading(false);
  };

  const handleForgotPassword = async () => {
    if (!email.trim()) {
      setError('Ingresa tu correo electrónico');
      return;
    }

    setIsLoading(true);
    setError(null);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/reset-password`,
    });

    if (error) {
      setError(error.message);
      setIsLoading(false);
      return;
    }

    setSuccess('Se ha enviado un enlace de recuperación a tu correo.');
    setIsLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    switch (mode) {
      case 'login':
        await handleLogin();
        break;
      case 'signup':
        await handleSignup();
        break;
      case 'forgot-password':
        await handleForgotPassword();
        break;
    }
  };

  const getTitle = () => {
    switch (mode) {
      case 'login':
        return 'Iniciar Sesión';
      case 'signup':
        return 'Crear Cuenta';
      case 'forgot-password':
        return 'Recuperar Contraseña';
    }
  };

  const getSubmitText = () => {
    switch (mode) {
      case 'login':
        return 'Iniciar Sesión';
      case 'signup':
        return 'Crear Cuenta';
      case 'forgot-password':
        return 'Enviar Enlace';
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#0d0d0d] flex">
      {/* Lado izquierdo - Formulario */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="mb-8">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center mb-6">
              <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" strokeWidth="2" stroke="currentColor" fill="none"/>
              </svg>
            </div>
          </div>

          {/* Título */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">
              {getTitle()}
            </h1>
            <p className="text-white/60">
              {mode === 'login' && 'Bienvenido de vuelta. Ingresa tus credenciales.'}
              {mode === 'signup' && 'Crea una cuenta para comenzar a analizar requerimientos.'}
              {mode === 'forgot-password' && 'Ingresa tu email para recuperar tu contraseña.'}
            </p>
          </div>

          {/* Mensajes de error/éxito */}
          {error && (
            <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/30 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-emerald-400">{success}</p>
            </div>
          )}

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Correo Electrónico
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@email.com"
                  className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Password */}
            {mode !== 'forgot-password' && (
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Contraseña
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-12 pr-12 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            )}

            {/* Confirm Password (solo signup) */}
            {mode === 'signup' && (
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Confirmar Contraseña
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all"
                    disabled={isLoading}
                  />
                </div>
              </div>
            )}

            {/* Forgot Password link (solo login) */}
            {mode === 'login' && (
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setMode('forgot-password');
                    setError(null);
                    setSuccess(null);
                  }}
                  className="text-sm text-emerald-400 hover:text-emerald-300 transition-colors"
                >
                  ¿Olvidaste tu contraseña?
                </button>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 disabled:from-emerald-500/50 disabled:to-teal-500/50 text-white font-medium rounded-lg transition-all flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Procesando...
                </>
              ) : (
                getSubmitText()
              )}
            </button>
          </form>

          {/* Toggle entre login y signup */}
          <div className="mt-8 text-center">
            {mode === 'login' && (
              <p className="text-white/60">
                ¿No tienes cuenta?{' '}
                <button
                  onClick={() => {
                    setMode('signup');
                    setError(null);
                    setSuccess(null);
                  }}
                  className="text-emerald-400 hover:text-emerald-300 font-medium transition-colors"
                >
                  Crear cuenta
                </button>
              </p>
            )}
            {mode === 'signup' && (
              <p className="text-white/60">
                ¿Ya tienes cuenta?{' '}
                <button
                  onClick={() => {
                    setMode('login');
                    setError(null);
                    setSuccess(null);
                  }}
                  className="text-emerald-400 hover:text-emerald-300 font-medium transition-colors"
                >
                  Iniciar sesión
                </button>
              </p>
            )}
            {mode === 'forgot-password' && (
              <p className="text-white/60">
                <button
                  onClick={() => {
                    setMode('login');
                    setError(null);
                    setSuccess(null);
                  }}
                  className="text-emerald-400 hover:text-emerald-300 font-medium transition-colors"
                >
                  ← Volver al inicio de sesión
                </button>
              </p>
            )}
          </div>

          {/* Footer */}
          <div className="mt-8 flex items-center justify-center gap-4 text-sm text-white/40">
            <a href="#" className="hover:text-white/60 transition-colors">
              Términos de uso
            </a>
            <span>|</span>
            <a href="#" className="hover:text-white/60 transition-colors">
              Privacidad
            </a>
          </div>
        </div>
      </div>

      {/* Lado derecho - Ilustración */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#171717] to-[#0d0d0d] items-center justify-center p-12 relative overflow-hidden">
        {/* Círculos decorativos */}
        <div className="absolute top-20 right-20 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl" />
        
        <div className="max-w-lg text-center relative z-10">
          <div className="mb-8 flex justify-center">
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-emerald-400/20 to-teal-500/20 flex items-center justify-center">
              <svg className="w-12 h-12 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>
          
          <h2 className="text-3xl font-bold text-white mb-4">
            Analiza Requerimientos con IA
          </h2>
          <p className="text-white/60 text-lg leading-relaxed mb-8">
            Sube tus documentos de requerimientos y obtén predicciones técnicas precisas: 
            stack tecnológico, perfiles necesarios, tiempos y costos estimados.
          </p>
          
          <div className="flex flex-col gap-4 text-left max-w-sm mx-auto">
            {[
              'Soporte para PDF, DOCX y TXT',
              'Análisis inteligente con IA',
              'Estimaciones de costos precisas',
              'Recomendaciones de stack tecnológico',
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center">
                  <svg className="w-4 h-4 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-white/80">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}