import type { Metadata } from 'next';
import { JetBrains_Mono } from 'next/font/google';

import ErrorBoundary from '@/components/error-boundary';
import { Footer } from '@/components/footer';
import Header from '@/components/header';
import ProgressBar from '@/components/progress-bar';
import QueryProvider from '@/components/query-provider';
import { ThemeProvider } from '@/components/theme-provider';

import './globals.css';

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-jetbrains-mono',
});

export const metadata: Metadata = {
  title: 'Jamscan - Explore the JAM network',
  description: 'The unlimited rust implementation of the JAM protocol.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`min-h-screen bg-background font-sans antialiased ${jetbrainsMono.variable}`}>
        <QueryProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <ProgressBar />
            <div className="relative flex min-h-screen flex-col">
              <Header />
              <ErrorBoundary>
                <div className="flex-1 pb-20">{children}</div>
              </ErrorBoundary>
              <Footer />
            </div>
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
