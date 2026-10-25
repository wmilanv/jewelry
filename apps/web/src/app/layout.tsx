import './globals.css';
import React from 'react';
import { CartDrawer } from '@/components/cart/CartDrawer';

export const metadata = {
  title: 'ATELIER VENDÔME • Haute Joaillerie & 3D Bespoke',
  description: 'Maison de haute joaillerie contemporaine. Créations sur-mesure et pièces uniques.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="bg-[#08080a] text-neutral-100 min-h-screen">
        {children}
        <CartDrawer />
      </body>
    </html>
  );
}