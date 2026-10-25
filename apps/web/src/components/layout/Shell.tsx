'use client';
import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, ShoppingBag, X, Search, MessageCircle, Instagram, Facebook, Mail, Phone, MapPin, ArrowUpRight, Sparkles, Gem } from 'lucide-react';
import { formatMoney, useStoreData } from '@/store/useStoreData';
import { useCartStore } from '@/store/useCartStore';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { Cursor, SmoothScroll } from '@/components/fx/SmoothScroll';
import { Reveal } from '@/components/fx/Reveal';
import { Media } from '@/components/ui/Media';

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

function SearchModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const router = useRouter();
  const { products, categories, settings } = useStoreData();
  const [query, setQuery] = useState('');

  useEffect(() => {
    if (!isOpen) setQuery('');
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        isOpen ? onClose() : null;
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return products
      .filter((p) => p.active && (p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q)))
      .slice(0, 5);
  }, [products, query]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 md:pt-24 px-4 bg-black/75 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl rounded-[2rem] bg-surface border border-line p-6 shadow-2xl space-y-6">
        <div className="flex items-center justify-between border-b border-line pb-4">
          <div className="flex items-center gap-3 flex-1">
            <Search className="w-5 h-5 text-accent shrink-0" />
            <input
              type="text"
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar solitarios, esmeraldas, oro 18k, referencias..."
              className="w-full bg-transparent text-base md:text-lg text-ink placeholder:text-muted/60 focus:outline-none"
            />
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full border border-line flex items-center justify-center hover:bg-ink hover:text-bg transition ml-3"
            aria-label="Cerrar búsqueda"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {query.trim() === '' ? (
          <div className="space-y-4">
            <div className="text-[10px] uppercase tracking-[0.25em] text-muted font-medium">Búsquedas recomendadas</div>
            <div className="flex flex-wrap gap-2">
              {['Solitario Imperial', 'Esmeraldas de Muzo', 'Toi et Moi', 'Oro Rosa 18K', 'Alianzas Pavé'].map((tag) => (
                <button
                  key={tag}
                  onClick={() => setQuery(tag)}
                  className="rounded-full border border-line hover:border-accent hover:text-accent px-4 py-1.5 text-xs text-muted transition"
                >
                  {tag}
                </button>
              ))}
            </div>
            <div className="border-t border-line/60 pt-4 flex items-center justify-between text-xs text-muted">
              <span>Colecciones activas: {categories.length}</span>
              <Link href="/tienda" onClick={onClose} className="hover:text-accent flex items-center gap-1">
                Ver todo el catálogo <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-10 text-muted space-y-2">
            <p className="text-sm">No encontramos piezas con &ldquo;{query}&rdquo;.</p>
            <Link href="/tienda" onClick={onClose} className="text-accent underline text-xs">
              Explorar todo el archivo en la tienda
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="text-[10px] uppercase tracking-[0.25em] text-muted">Resultados ({filtered.length})</div>
            <div className="divide-y divide-line/60 max-h-80 overflow-y-auto pr-1">
              {filtered.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    onClose();
                    router.push(`/producto/${item.slug}`);
                  }}
                  className="w-full text-left py-3.5 flex items-center gap-4 hover:bg-white/[0.03] px-2 rounded-xl transition group"
                >
                  <Media src={item.images[0]} art={item.art} alt={item.name} className="w-14 h-14 rounded-xl border border-line shrink-0" />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-display uppercase text-base text-ink group-hover:text-accent transition truncate">
                      {item.name}
                    </h4>
                    <p className="text-xs text-muted truncate">{item.sku} · {item.description}</p>
                  </div>
                  <span className="text-sm font-medium text-accent shrink-0">
                    {formatMoney(item.price, settings)}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Header() {
  const settings = useStoreData((s) => s.settings);
  const count = useCartStore((s) => s.items.reduce((a, i) => a + i.quantity, 0));
  const openCart = useCartStore((s) => s.openCart);
  const [menu, setMenu] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
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
        <div className="bg-accent text-on-accent text-center text-[10px] tracking-[0.25em] uppercase py-2.5 px-4 font-medium">
          {settings.announcement.text}
        </div>
      )}
      <header className={`sticky top-0 z-40 transition-all duration-500 ${scrolled ? 'bg-bg/80 backdrop-blur-xl py-3 border-b border-line/40 shadow-lg' : 'py-5'}`}>
        <div className="px-4 md:px-8 flex items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <button className="lg:hidden p-2 -ml-2 text-ink hover:text-accent transition" onClick={() => setMenu(true)} aria-label="Menú">
              <Menu className="w-5 h-5" />
            </button>
            <Brand />
          </div>
          <nav className="hidden lg:flex items-center gap-9 text-[11px] uppercase tracking-[0.22em]">
            {links.map((l) => {
              const active = pathname === l.href;
              return (
                <Link
                  key={l.href + l.label}
                  href={l.href}
                  className={`group relative py-1 transition-colors ${active ? 'text-accent font-semibold' : 'text-ink/75 hover:text-ink'}`}
                >
                  {l.label}
                  <span
                    className={`absolute left-0 -bottom-0.5 h-px w-full origin-left bg-accent transition-transform duration-500 ${
                      active ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                    }`}
                  />
                </Link>
              );
            })}
          </nav>
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setSearchOpen(true)}
              className="flex w-11 h-11 rounded-full border border-ink/25 items-center justify-center hover:bg-ink hover:text-bg transition"
              aria-label="Buscar joyas"
            >
              <Search className="w-4 h-4" />
            </button>
            <button
              onClick={openCart}
              className="relative w-11 h-11 rounded-full border border-ink/25 flex items-center justify-center hover:bg-ink hover:text-bg transition"
              aria-label="Abrir carrito"
            >
              <ShoppingBag className="w-4 h-4" />
              {count > 0 && (
                <span className="absolute -top-1 -right-1 bg-accent text-on-accent text-[10px] font-semibold w-5 h-5 flex items-center justify-center rounded-full">
                  {count}
                </span>
              )}
            </button>
            <Link
              href="/#contacto"
              className="hidden sm:inline-flex items-center gap-2.5 rounded-full bg-ink text-bg pl-1.5 pr-5 h-11 text-[11px] uppercase tracking-[0.15em] hover:bg-accent hover:text-on-accent transition"
            >
              <span className="w-8 h-8 rounded-full bg-bg text-ink flex items-center justify-center">
                <Mail className="w-3.5 h-3.5" />
              </span>
              Contacto
            </Link>
          </div>
        </div>
      </header>

      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />

      {/* Menú móvil de alta costura */}
      {menu && (
        <div className="fixed inset-0 z-50 bg-[#0a0a0d] text-[#f4efe6] flex flex-col p-6 overflow-y-auto animate-fade-in">
          <div className="flex justify-between items-center pb-6 border-b border-white/10">
            <Brand />
            <button
              onClick={() => setMenu(false)}
              aria-label="Cerrar"
              className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="py-8 space-y-6 flex-1">
            <span className="text-[10px] uppercase tracking-[0.3em] text-accent block">Navegación de la Maison</span>
            <nav className="flex flex-col gap-5 font-display text-4xl uppercase">
              {links.map((l) => (
                <Link
                  key={l.href + l.label}
                  href={l.href}
                  onClick={() => setMenu(false)}
                  className="hover:text-accent transition flex items-center justify-between group"
                >
                  <span>{l.label}</span>
                  <ArrowUpRight className="w-6 h-6 opacity-40 group-hover:opacity-100 group-hover:translate-x-1 group-hover:-translate-y-1 transition" />
                </Link>
              ))}
            </nav>
          </div>

          <div className="border-t border-white/10 pt-6 space-y-4">
            <Link
              href="/personalizador"
              onClick={() => setMenu(false)}
              className="w-full rounded-2xl bg-gradient-to-r from-accent/20 to-transparent border border-accent/40 p-4 flex items-center justify-between"
            >
              <div>
                <div className="text-[10px] uppercase tracking-[0.25em] text-accent flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3" /> Atelier Bespoke 3D
                </div>
                <div className="font-display uppercase text-lg mt-0.5">Diseña tu joya a medida</div>
              </div>
              <ArrowUpRight className="w-5 h-5 text-accent" />
            </Link>

            {settings.contact.whatsapp && (
              <a
                href={`https://wa.me/${settings.contact.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent('Hola Atelier Vendôme, deseo información sobre sus colecciones y cita privada.')}`}
                target="_blank"
                rel="noreferrer"
                className="btn-outline w-full text-center flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4 text-accent" /> Hablar con un Gemólogo VIP
              </a>
            )}
          </div>
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
