import type { Metadata } from 'next';
import SessionProvider from '@/components/SessionProvider';
import './globals.css';

export const metadata: Metadata = {
  title: 'Satpam Indonesia JAYA - Platform Digital Satpam Nasional',
  description:
    'Platform digital Satpam Indonesia - Komunitas, Edukasi, Karier, Sertifikasi & AI Assistant untuk seluruh Satpam Indonesia.',
  keywords: ['satpam', 'security', 'gada pratama', 'gada madya', 'gada utama', 'loker satpam', 'sertifikasi satpam'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className="dark">
      <body className="antialiased bg-navy-900 text-white relative min-h-screen">
        <SessionProvider>{children}</SessionProvider>
        <div className="fixed bottom-0 left-0 right-0 py-2 text-center text-xs text-gold/40 bg-navy-900/70 backdrop-blur-sm border-t border-gold/10 z-50">
          &copy; By- CyberRichardMeha2026
        </div>
      </body>
    </html>
  );
}
