'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function Login() {
  const router = useRouter();

  const handleLogin = () => {
    // Simular login exitoso y redirigir al chat
    router.push('/');
  };

  const handleSignup = () => {
    // Simular registro
    console.log('Sign up');
  };

  return (
    <div className="min-h-screen w-full bg-[#0d0d0d] flex">
      {/* Lado izquierdo - Formulario de login */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="mb-8">
            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center mb-8">
              <svg className="w-5 h-5 text-black" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
              </svg>
            </div>
          </div>

          {/* Título */}
          <div className="mb-8">
            <h1 className="text-[32px] font-semibold text-white mb-2">
              Get started
            </h1>
          </div>

          {/* Botones de login */}
          <div className="space-y-3">
            {/* Botón de Log in */}
            <button
              onClick={handleLogin}
              className="w-full py-3 px-4 bg-[#10a37f] hover:bg-[#0d8c6d] text-white font-medium rounded-md transition-colors"
            >
              Log in
            </button>

            {/* Botón de Sign up */}
            <button
              onClick={handleSignup}
              className="w-full py-3 px-4 bg-transparent hover:bg-white/5 text-white font-medium rounded-md border border-white/20 hover:border-white/30 transition-colors"
            >
              Sign up for free
            </button>
          </div>

          {/* Footer */}
          <div className="mt-8 flex items-center justify-center gap-4 text-sm text-white/50">
            <a href="#" className="hover:text-white/70 hover:underline transition-colors">
              Terms of use
            </a>
            <span>|</span>
            <a href="#" className="hover:text-white/70 hover:underline transition-colors">
              Privacy policy
            </a>
          </div>
        </div>
      </div>

      {/* Lado derecho - Imagen/Ilustración */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#171717] items-center justify-center p-12">
        <div className="max-w-md text-center">
          
          <h2 className="text-2xl font-semibold text-white mb-4">
            Welcome to ChatGPT
          </h2>
          <p className="text-white/60">
            Your AI-powered assistant for conversations, creativity, and productivity
          </p>
        </div>
      </div>
    </div>
  );
}