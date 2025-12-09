'use client';

import { Mail } from 'lucide-react';

export default function Login() {
  const handleGoogleLogin = () => {
    // Lógica para iniciar sesión con Google
    console.log('Iniciar sesión con Google');
  };

  const handleEmailLogin = () => {
    // Lógica para iniciar sesión con correo
    console.log('Iniciar sesión con correo');
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black p-4">
      {/* Glassmorphism Card */}
      <div className="w-full max-w-md">
        <div className="backdrop-blur-xl bg-white/5 rounded-3xl p-8 shadow-2xl border border-white/10">
          {/* Logo/Title */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-2">
              Bienvenido
            </h1>
            <p className="text-gray-400 text-sm">
              Inicia sesión para continuar
            </p>
          </div>

          {/* Buttons Container */}
          <div className="space-y-4">
            {/* Google Button */}
            <button
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-xl border border-white/20 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/20"
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <span className="font-medium text-white">
                Continuar con Google
              </span>
            </button>

            {/* Divider */}
            <div className="relative flex items-center justify-center my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10"></div>
              </div>
              <div className="relative px-4 bg-transparent">
                <span className="text-gray-500 text-sm">o</span>
              </div>
            </div>

            {/* Email Button */}
            <button
              onClick={handleEmailLogin}
              className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-blue-500/20 to-purple-500/20 hover:from-blue-500/30 hover:to-purple-500/30 backdrop-blur-sm rounded-xl border border-blue-400/30 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/20"
            >
              <Mail className="w-6 h-6 text-blue-400" />
              <span className="font-medium text-white">
                Continuar con Correo
              </span>
            </button>
          </div>

          {/* Footer Text */}
          <div className="mt-8 text-center">
            <p className="text-gray-500 text-xs">
              Al continuar, aceptas nuestros{' '}
              <a href="#" className="text-blue-400 hover:text-blue-300 transition-colors">
                Términos de Servicio
              </a>{' '}
              y{' '}
              <a href="#" className="text-blue-400 hover:text-blue-300 transition-colors">
                Política de Privacidad
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}