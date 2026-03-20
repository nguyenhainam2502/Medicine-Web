import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import UserMenu from '@/components/UserMenu';
import FloatingCart from '@/components/FloatingCart';
import FloatingAIAssistant from '@/components/FloatingAIAssistant';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Medicine App - HealthCare Pro',
  description: 'Nền tảng tra cứu và gợi ý thuốc thông minh',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" className="scroll-smooth">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      </head>
      <body className={`${inter.className} bg-[#f6f7f8] text-slate-900 flex flex-col min-h-screen overflow-x-hidden`}>
        {/* Header (Stitch style) */}
        <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md px-6 md:px-10 py-3">
          <div className="mx-auto max-w-7xl flex items-center justify-between">
            <a href="/" className="flex items-center gap-2 text-[#2b8cee]">
              <span className="material-symbols-outlined text-3xl font-bold">medical_services</span>
              <h2 className="text-slate-900 text-xl font-bold leading-tight tracking-tight">MedAI Pro</h2>
            </a>
            <nav className="hidden md:flex flex-1 justify-center gap-8">
              <a className="text-slate-600 hover:text-[#2b8cee] text-sm font-medium transition-colors" href="/symptom-check">Trợ Lý AI</a>
              <a className="text-slate-600 hover:text-[#2b8cee] text-sm font-medium transition-colors" href="/#categories">Danh Mục</a>
              <a className="text-slate-600 hover:text-[#2b8cee] text-sm font-medium transition-colors" href="/news">Tin Tức Y Tế</a>
            </nav>
            <div className="flex items-center gap-3">
              <UserMenu />
            </div>
          </div>
        </header>

        <main className="flex-1 w-full">
          {children}
        </main>
        <FloatingAIAssistant />
        <FloatingCart />
      </body>
    </html>
  );
}
