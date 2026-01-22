import type { Metadata } from 'next';
import '@app/styles/globals.css';

export const metadata: Metadata = {
  title: 'Task Three',
  description: 'Todo Application',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
