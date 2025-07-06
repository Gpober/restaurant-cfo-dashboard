import Link from 'next/link';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'I AM CFO Dashboard',
  description: 'Live financial insights for property operators',
  icons: {
    icon: '/favicon.png',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* ✅ Load the manually compiled Tailwind CSS */}
        <link rel="stylesheet" href="/styles.css" />
        <link rel="icon" type="image/png" href="/favicon.png" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <style dangerouslySetInnerHTML={{
          __html: `
            .scrollbar-hide {
              -ms-overflow-style: none;
              scrollbar-width: none;
            }
            .scrollbar-hide::-webkit-scrollbar {
              display: none;
            }
            
            /* Smooth scrolling for horizontal navigation */
            .scrollbar-hide {
              scroll-behavior: smooth;
            }
            
            /* Active link styles - you can add these with JavaScript or use Next.js useRouter */
            .nav-link-active {
              background-color: #3b82f6 !important;
              color: white !important;
            }
            .nav-link-active:hover {
              background-color: #2563eb !important;
              color: white !important;
            }
          `
        }} />
      </head>
      <body className={`${inter.className} bg-gray-50`}>
        {/* Mobile-First Navigation */}
        <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto">
            {/* Mobile Navigation - Horizontal Scroll */}
            <div className="flex items-center px-3 py-3 sm:px-6 sm:py-4 overflow-x-auto scrollbar-hide">
              <div className="flex space-x-1 sm:space-x-4 min-w-max">
                <Link 
                  href="/" 
                  className="flex items-center px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors whitespace-nowrap"
                >
                  <span className="text-lg mr-2">📊</span>
                  <span className="hidden sm:inline">Dashboard</span>
                  <span className="sm:hidden">Home</span>
                </Link>
                
                <Link 
                  href="/inventory" 
                  className="flex items-center px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors whitespace-nowrap"
                >
                  <span className="text-lg mr-2">📦</span>
                  <span className="hidden sm:inline">Inventory</span>
                  <span className="sm:hidden">Stock</span>
                </Link>
                
                <Link 
                  href="/financials" 
                  className="flex items-center px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors whitespace-nowrap"
                >
                  <span className="text-lg mr-2">💰</span>
                  <span className="hidden sm:inline">Financials</span>
                  <span className="sm:hidden">Finance</span>
                </Link>
                
                <Link 
                  href="/payroll" 
                  className="flex items-center px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors whitespace-nowrap"
                >
                  <span className="text-lg mr-2">👥</span>
                  <span className="hidden sm:inline">Payroll</span>
                  <span className="sm:hidden">Staff</span>
                </Link>
                
                <Link 
                  href="/statements" 
                  className="flex items-center px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors whitespace-nowrap"
                >
                  <span className="text-lg mr-2">📋</span>
                  <span className="hidden sm:inline">Statements</span>
                  <span className="sm:hidden">Reports</span>
                </Link>
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="px-3 py-4 sm:px-6 sm:py-6 max-w-7xl mx-auto">
          {children}
        </main>
      </body>
    </html>
  );
}
