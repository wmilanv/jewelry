'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, ShoppingBag, X, Search, MessageCircle, Instagram, Facebook, Mail, Phone, MapPin } from 'lucide-react';
import { useStoreData } from '@/store/useStoreData';
import { useCartStore } from '@/store/useCartStore';
import { CartDrawer } from '@/components/cart/CartDrawer';

function Brand({ size = 'md' }: { size?: 'md' | 'sm' }) {
  const brand = useStoreData((s) => s.settings.brand);
  return (
    <Link href="/" className="flex flex-col leading-none group">
      {brand.logoUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={brand.logoUrl} alt={brand.name} className={size === 'md' ? 'h-9 w-auto' : 'h-7 w-auto'} />
      ) : (
        <span className={`font-display uppercase tracking-[0.2em] font-semibold group-hover:text-accent transition-colors ${size === 'md' ? 'text-2xl' : 'text-xl'}`}>
          {brand.name}
        </span>
      )}
      {brand.tagline && size === 'md' && (
        <span className="text-[9px] uppercase tracking-[0.35em] text-muted mt-1.5">{brand.tagline}</span>
      )}
    </Link>
  );
}

function Header() {
  const settings = useStoreData((s) => s.settings);
  const count = useCartStore((s) => s.items.reduce((a, i) => a + i.quantity, 0));
  const openCart = useCartStore((s) => s.openCart);
  const [menu, setMenu] = useState(false);
  const pathname = usePathname();
  useEffect(() => setMenu(false), [pathname]);

  const links = [...settings.nav];
  if (settings.customizer.enabled) links.push({ label: settings.customizer.navLabel, href: '/personalizador' });

  return (
    <>
      {settings.announcement.enabled && settings.announcement.text && (
        <div className="bg-accent text-on-accent text-center text-[11px] tracking-[0.15em] uppercase py-2 px-4">
          {settings.announcement.text}
        </div>
      )}
      <header className="sticky top-0 z-40 bg-bg/85 backdrop-blur-md border-b border-line">
        <div className="max-w-7xl mx-auto px-5 md:px-8 h-20 flex items-center justify-between gap-6">
          <button className="md:hidden p-2 -ml-2" onClick={() => setMenu(true)} aria-label="Menú">
            <Menu className="w-5 h-5" />
          </button>
          <Brand />
          <nav className="hidden md:flex items-center gap-8 text-[11px] uppercase tracking-[0.2em]">
            {links.map((l) => (
              <Link key={l.href + l.label} href={l.href} className="text-muted hover:text-accent transition-colors">
                {l.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-1">
            <Link href="/tienda" className="p-2.5 hover:text-accent transition-colors" aria-label="Buscar">
              <Search className="w-[18px] h-[18px]" />
            </Link>
            <button onClick={openCart} className="relative p-2.5 hover:text-accent transition-colors" aria-label="Abrir carrito">
              <ShoppingBag className="w-[18px] h-[18px]" />
              {count > 0 && (
                <span className="absolute top-0.5 right-0 bg-accent text-on-accent text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                  {count}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {menu && (
        <div className="fixed inset-0 z-50 bg-bg flex flex-col p-6">
          <div className="flex justify-between items-center mb-10">
            <Brand size="sm" />
            <button onClick={() => setMenu(false)} aria-label="Cerrar">
              <X className="w-6 h-6" />
            </button>
          </div>
          <nav className="flex flex-col gap-6 font-display text-3xl">
            {links.map((l) => (
              <Link key={l.href + l.label} href={l.href}>
                {l.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </>
  );
}

function Footer() {
  const settings = useStoreData((s) => s.settings);
  const categories = useStoreData((s) => s.categories);
  const { contact, brand } = settings;
  return (
    <footer id="contacto" className="border-t border-line mt-24 bg-surface/40">
      <div className="max-w-7xl mx-auto px-5 md:px-8 py-16 grid gap-12 md:grid-cols-4">
        <div className="md:col-span-2 space-y-4 max-w-md">
          <Brand />
          <p className="text-sm text-muted leading-relaxed">{brand.description}</p>
          <div className="flex gap-3 pt-2">
            {contact.instagram && (
              <a href={contact.instagram} target="_blank" rel="noreferrer" aria-label="Instagram" className="p-2 border border-line hover:border-accent hover:text-accent transition">
                <Instagram className="w-4 h-4" />
              </a>
            )}
            {contact.facebook && (
              <a href={contact.facebook} target="_blank" rel="noreferrer" aria-label="Facebook" className="p-2 border border-line hover:border-accent hover:text-accent transition">
                <Facebook className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>
        <div>
          <h4 className="eyebrow mb-4">Tienda</h4>
          <ul className="space-y-2.5 text-sm text-muted">
            <li><Link href="/tienda" className="hover:text-accent">Todos los productos</Link></li>
            {categories.map((c) => (
              <li key={c.id}><Link href={`/tienda?cat=${c.slug}`} className="hover:text-accent">{c.name}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="eyebrow mb-4">Contacto</h4>
          <ul className="space-y-3 text-sm text-muted">
            {contact.email && <li className="flex gap-2.5"><Mail className="w-4 h-4 shrink-0 mt-0.5" />{contact.email}</li>}
            {contact.phone && <li className="flex gap-2.5"><Phone className="w-4 h-4 shrink-0 mt-0.5" />{contact.phone}</li>}
            {contact.address && <li className="flex gap-2.5"><MapPin className="w-4 h-4 shrink-0 mt-0.5" />{contact.address}</li>}
          </ul>
        </div>
      </div>
      <div className="border-t border-line py-5 px-5 text-center text-[11px] text-muted tracking-wider">
        © {new Date().getFullYear()} {brand.name}. Todos los derechos reservados.
      </div>
    </footer>
  );
}

export function Shell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const brandName = useStoreData((s) => s.settings.brand.name);
  const whatsapp = useStoreData((s) => s.settings.contact.whatsapp);
  const bare = pathname.startsWith('/admin') || pathname.startsWith('/personalizador');

  useEffect(() => {
    if (!pathname.startsWith('/producto')) document.title = brandName;
  }, [brandName, pathname]);

  return (
    <>
      {!bare && <Header />}
      <main>{children}</main>
      {!bare && <Footer />}
      {!pathname.startsWith('/admin') && <CartDrawer />}
      {!bare && whatsapp && (
        <a
          href={`https://wa.me/${whatsapp.replace(/\D/g, '')}`}
          target="_blank"
          rel="noreferrer"
          aria-label="WhatsApp"
          className="fixed bottom-5 right-5 z-30 bg-[#25D366] text-white p-3.5 rounded-full shadow-xl hover:scale-105 transition"
        >
          <MessageCircle className="w-6 h-6" />
        </a>
      )}
    </>
  );
}

