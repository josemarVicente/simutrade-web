import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import QueryProvider from '@/providers/QueryProvider';
import { ToastProvider } from '@/components/ui/Toast';
import ThemeProvider from '@/providers/ThemeProvider';
import './globals.css';

const geist = Geist({ subsets: ['latin'] });
const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
});

export const metadata: Metadata = {
  title: 'SimuTrade — Paper Trading Simulator',
  description: 'Practice stock trading with $10,000 in virtual cash',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geist.className} ${geistMono.variable} bg-zinc-950 text-zinc-100 antialiased`}>
        <QueryProvider>
          <ThemeProvider>
            <ToastProvider>{children}</ToastProvider>
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
