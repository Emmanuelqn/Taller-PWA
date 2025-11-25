import Link from "next/link";

export default function Navbar() {
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
              className="px-3 py-2 rounded-md text-sm font-medium hover:bg-black/[.1] dark:hover:bg-white/[.1] transition-colors"
            >
              Home
            </Link>
            <Link 
              href="/login" 
              className="px-3 py-2 rounded-md text-sm font-medium hover:bg-black/[.1] dark:hover:bg-white/[.1] transition-colors"
            >
              Login Page
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
