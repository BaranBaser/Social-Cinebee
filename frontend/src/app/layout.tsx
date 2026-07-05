import './globals.css';
import ClientShell from '@/components/ClientShell';

export const metadata = {
  title: 'CinemaAI - Sinematik Keşif',
  description: 'Film, dizi ve anime takip platformu',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr">
      <body className="min-h-screen bg-ink bg-grain">
        <ClientShell>{children}</ClientShell>
      </body>
    </html>
  );
}
