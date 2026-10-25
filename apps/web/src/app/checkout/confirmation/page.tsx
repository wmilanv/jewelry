'use client';
import React, { Suspense, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { CheckCircle2 } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';

function Content() {
  const params = useSearchParams();
  const ref = params.get('ref') || params.get('reference') || params.get('id');
  const via = params.get('via');
  const clearCart = useCartStore((s) => s.clearCart);

  // Al volver de Wompi (con id de transacción) se vacía el carrito
  useEffect(() => {
    if (params.get('id')) clearCart();
  }, [params, clearCart]);

  return (
    <div className="max-w-xl mx-auto py-28 px-5 text-center space-y-5">
      <CheckCircle2 className="w-14 h-14 mx-auto text-accent" />
      <h1 className="font-display text-5xl">¡Gracias por tu compra!</h1>
      <p className="text-muted">
        {via === 'whatsapp'
          ? 'Tu pedido fue enviado por WhatsApp. Te confirmaremos el pago y el envío por ese medio.'
          : 'Estamos procesando tu pago. Recibirás la confirmación por correo electrónico.'}
      </p>
      {ref && <p className="text-xs tracking-widest text-muted">Referencia: <b className="text-ink">{ref}</b></p>}
      <Link href="/tienda" className="btn-primary">Seguir comprando</Link>
    </div>
  );
}

export default function ConfirmationPage() {
  return (
    <Suspense fallback={null}>
      <Content />
    </Suspense>
  );
}

