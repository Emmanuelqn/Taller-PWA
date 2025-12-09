"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="bg-foreground text-background shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold hover:opacity-80 transition-opacity">
              Taller PWA
            </Link>
          </div>
          
          <div className="flex space-x-4">
            <Link 
              href="/" 
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                pathname === "/"
                  ? "bg-black/20 dark:bg-white/20 font-semibold"
                  : "hover:bg-black/10 dark:hover:bg-white/10"
              }`}
            >
              Home
            </Link>
            <Link 
              href="/login" 
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                pathname === "/login"
                  ? "bg-black/20 dark:bg-white/20 font-semibold"
                  : "hover:bg-black/10 dark:hover:bg-white/10"
              }`}
            >
              Login Page
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
