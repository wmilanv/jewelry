import './globals.css';
import React from 'react';
import { StoreProvider } from '@/components/StoreProvider';
import { Shell } from '@/components/layout/Shell';

export const metadata = {
  title: 'Atelier Vendôme · Haute Joaillerie & Bespoke 3D',
  description:
    'Maison de alta joyería en oro 18k, esmeraldas colombianas de Muzo y diamantes certificados GIA. Atelier de diseño 3D interactivo y piezas a medida en Bogotá y el mundo.',
  keywords: [
    'alta joyería',
    'oro 18k',
    'esmeraldas de muzo',
    'diamantes GIA',
    'anillos de compromiso',
    'haute joaillerie',
    'atelier bespoke 3d',
    'joyas personalizadas',
    'bogota',
    'atelier vendome',
  ],
  openGraph: {
    title: 'Atelier Vendôme · Haute Joaillerie & Bespoke 3D',
    description:
      'Maison de alta joyería en oro 18k, esmeraldas colombianas de Muzo y diamantes certificados GIA.',
    type: 'website',
    locale: 'es_CO',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Italiana&family=Inter:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-bg text-ink min-h-screen">
        <StoreProvider>
          <Shell>{children}</Shell>
        </StoreProvider>
      </body>
    </html>
  );
}
