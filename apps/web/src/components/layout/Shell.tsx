'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, ShoppingBag, X, Search, MessageCircle, Instagram, Facebook, Mail, Phone, MapPin, ArrowUpRight } from 'lucide-react';
import { useStoreData } from '@/store/useStoreData';
import { useCartStore } from '@/store/useCartStore';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { Cursor, SmoothScroll } from '@/components/fx/SmoothScroll';
import { Reveal } from '@/components/fx/Reveal';

function Brand({ footer = false }: { footer?: boolean }) {
  const brand = useStoreData((s) => s.settings.brand);
  return (
    <Link href="/" className={`inline-flex items-center rounded-full bg-ink text-bg transition hover:bg-accent hover:text-on-accent ${footer ? 'px-7 py-3' : 'px-6 py-2.5'}`}>
      {brand.logoUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={brand.logoUrl} alt={brand.name} className="h-6 w-auto" />
      ) : (
        <span className="font-display text-xl uppercase tracking-[0.18em] leading-none">{brand.name}</span>
      )}
    </Link>
  );
}

function Header() {
  const settings = useStoreData((s) => s.settings);
  const count = useCartStore((s) => s.items.reduce((a, i) => a + i.quantity, 0));
  const openCart = useCartStore((s) => s.openCart);
  const [menu, setMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  useEffect(() => setMenu(false), [pathname]);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 40);
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);

  const links = [...settings.nav];
  if (settings.customizer.enabled) links.push({ label: settings.customizer.navLabel, href: '/personalizador' });

  return (
    <>
      {settings.announcement.enabled && settings.announcement.text && (
        <div className="bg-accent text-on-accent text-center text-[10px] tracking-[0.25em] uppercase py-2.5 px-4">
          {settings.announcement.text}
        </div>
      )}
      <header className={`sticky top-0 z-40 transition-all duration-500 ${scrolled ? 'bg-bg/70 backdrop-blur-xl py-3' : 'py-5'}`}>
        <div className="px-4 md:px-8 flex items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <button className="md:hidden p-2 -ml-2" onClick={() => setMenu(true)} aria-label="Menú"><Menu className="w-5 h-5" /></button>
            <Brand />
          </div>
          <nav className="hidden lg:flex items-center gap-9 text-[11px] uppercase tracking-[0.22em]">
            {links.map((l) => (
              <Link key={l.href + l.label} href={l.href} className="group relative py-1 text-ink/70 hover:text-ink transition-colors">
                {l.label}
                <span className="absolute left-0 -bottom-0.5 h-px w-full origin-left scale-x-0 bg-accent transition-transform duration-500 group-hover:scale-x-100" />
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-2.5">
            <Link href="/tienda" className="hidden sm:flex w-11 h-11 rounded-full border border-ink/25 items-center justify-center hover:bg-ink hover:text-bg transition" aria-label="Buscar">
              <Search className="w-4 h-4" />
            </Link>
            <button onClick={openCart} className="relative w-11 h-11 rounded-full border border-ink/25 flex items-center justify-center hover:bg-ink hover:text-bg transition" aria-label="Abrir carrito">
              <ShoppingBag className="w-4 h-4" />
              {count > 0 && (
                <span className="absolute -top-1 -right-1 bg-accent text-on-accent text-[10px] font-semibold w-5 h-5 flex items-center justify-center rounded-full">{count}</span>
              )}
            </button>
            <Link href="/#contacto" className="hidden sm:inline-flex items-center gap-2.5 rounded-full bg-ink text-bg pl-1.5 pr-5 h-11 text-[11px] uppercase tracking-[0.15em] hover:bg-accent hover:text-on-accent transition">
              <span className="w-8 h-8 rounded-full bg-bg text-ink flex items-center justify-center"><Mail className="w-3.5 h-3.5" /></span>
              Contacto
            </Link>
          </div>
        </div>
      </header>

      {menu && (
        <div className="fixed inset-0 z-50 bg-bg flex flex-col p-6">
          <div className="flex justify-between items-center mb-12">
            <Brand />
            <button onClick={() => setMenu(false)} aria-label="Cerrar"><X className="w-6 h-6" /></button>
          </div>
          <nav className="flex flex-col gap-5 font-display text-5xl uppercase">
            {links.map((l) => (<Link key={l.href + l.label} href={l.href}>{l.label}</Link>))}
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
    <footer id="contacto" className="mt-32 mx-3 md:mx-5 mb-3 md:mb-5 rounded-[2rem] bg-surface border border-line overflow-hidden">
      <div className="px-6 md:px-14 pt-16 pb-10 grid gap-12 md:grid-cols-12">
        <div className="md:col-span-5 space-y-6">
          <p className="font-display text-3xl md:text-4xl leading-tight max-w-md">{brand.tagline || brand.name}</p>
          <p className="text-sm text-muted leading-relaxed max-w-sm">{brand.description}</p>
          <div className="flex gap-2.5">
            {contact.instagram && (<a href={contact.instagram} target="_blank" rel="noreferrer" aria-label="Instagram" className="w-11 h-11 rounded-full border border-ink/25 flex items-center justify-center hover:bg-ink hover:text-bg transition"><Instagram className="w-4 h-4" /></a>)}
            {contact.facebook && (<a href={contact.facebook} target="_blank" rel="noreferrer" aria-label="Facebook" className="w-11 h-11 rounded-full border border-ink/25 flex items-center justify-center hover:bg-ink hover:text-bg transition"><Facebook className="w-4 h-4" /></a>)}
          </div>
        </div>
        <div className="md:col-span-3 md:col-start-7">
          <h4 className="eyebrow mb-5">Tienda</h4>
          <ul className="space-y-3 text-sm">
            <li><Link href="/tienda" className="text-muted hover:text-ink inline-flex items-center gap-1 group">Todo <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition" /></Link></li>
            {categories.map((c) => (
              <li key={c.id}><Link href={`/tienda?cat=${c.slug}`} className="text-muted hover:text-ink inline-flex items-center gap-1 group">{c.name} <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition" /></Link></li>
            ))}
          </ul>
        </div>
        <div className="md:col-span-3">
          <h4 className="eyebrow mb-5">Contacto</h4>
          <ul className="space-y-3.5 text-sm text-muted">
            {contact.email && <li className="flex gap-2.5"><Mail className="w-4 h-4 shrink-0 mt-0.5" />{contact.email}</li>}
            {contact.phone && <li className="flex gap-2.5"><Phone className="w-4 h-4 shrink-0 mt-0.5" />{contact.phone}</li>}
            {contact.address && <li className="flex gap-2.5"><MapPin className="w-4 h-4 shrink-0 mt-0.5" />{contact.address}</li>}
          </ul>
        </div>
      </div>
      <Reveal y={80} className="px-4 select-none">
        <p className="font-display uppercase text-center leading-[0.8] text-[clamp(3.5rem,15vw,15rem)] text-ink/90 whitespace-nowrap overflow-hidden pb-[0.08em]">
          {brand.name}
        </p>
      </Reveal>
      <div className="border-t border-line py-5 px-6 md:px-14 flex flex-wrap justify-between gap-2 text-[11px] text-muted tracking-wider">
        <span>© {new Date().getFullYear()} {brand.name}. Todos los derechos reservados.</span>
        <span>{contact.address}</span>
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
      <SmoothScroll />
      <Cursor />
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
          className="fixed bottom-5 right-5 z-30 bg-[#25D366] text-white w-12 h-12 flex items-center justify-center rounded-full shadow-xl hover:scale-110 transition"
        >
          <MessageCircle className="w-5 h-5" />
        </a>
      )}
    </>
  );
}
