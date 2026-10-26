'use client';
import React, { Suspense, useMemo, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Search, SlidersHorizontal } from 'lucide-react';
import { useStoreData } from '@/store/useStoreData';
import { ProductCard } from '@/components/ui/ProductCard';
import { Reveal, SplitTitle } from '@/components/fx/Reveal';

function Shop() {
  const params = useSearchParams();
  const router = useRouter();
  const { categories, products } = useStoreData();
  const cat = params.get('cat') ?? '';
  const [q, setQ] = useState('');
  const [sort, setSort] = useState('recent');
  const [max, setMax] = useState('');

  const list = useMemo(() => {
    let l = products.filter((p) => p.active);
    if (cat) {
      const c = categories.find((x) => x.slug === cat);
      l = l.filter((p) => p.categoryId === c?.id);
    }
    if (q.trim()) {
      const t = q.toLowerCase();
      l = l.filter((p) => p.name.toLowerCase().includes(t) || p.description.toLowerCase().includes(t));
    }
    if (max) l = l.filter((p) => p.price <= Number(max));
    const sorters: Record<string, (a: any, b: any) => number> = {
      recent: (a, b) => b.createdAt - a.createdAt,
      asc: (a, b) => a.price - b.price,
      desc: (a, b) => b.price - a.price,
      name: (a, b) => a.name.localeCompare(b.name),
    };
    return [...l].sort(sorters[sort]);
  }, [products, categories, cat, q, sort, max]);

  const current = categories.find((c) => c.slug === cat);
  const setCat = (slug: string) => router.push(slug ? `/tienda?cat=${slug}` : '/tienda');

  return (
    <div className="max-w-7xl mx-auto px-5 md:px-8 py-14">
      <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-line pb-8">
        <div>
          <p className="eyebrow mb-3">Catálogo de piezas</p>
          <SplitTitle
            text={current ? current.name : 'Colecciones'}
            trigger="now"
            className="font-display uppercase text-5xl md:text-7xl leading-none"
          />
        </div>
        <p className="text-muted text-sm max-w-sm">
          {current?.description || 'Explora nuestras piezas trabajadas a mano o filtra por categoría y presupuesto.'}
        </p>
      </div>

      {/* Barra de categorías horizontal táctil */}
      <div className="flex overflow-x-auto no-scrollbar gap-2 sm:gap-2.5 pb-2 mb-6 sm:mb-8">
        {[{ slug: '', name: 'Todas' }, ...categories].map((c) => (
          <button
            key={c.slug}
            onClick={() => setCat(c.slug)}
            className={`px-5 sm:px-6 py-2.5 rounded-full text-[10px] sm:text-[11px] uppercase tracking-[0.18em] border transition whitespace-nowrap shrink-0 ${
              cat === c.slug
                ? 'bg-ink text-bg border-ink font-semibold'
                : 'border-line text-muted hover:border-ink/60 hover:text-ink'
            }`}
          >
            {c.name}
          </button>
        ))}
      </div>

      {/* Controles de Búsqueda y Filtros Responsivos */}
      <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between rounded-2xl bg-surface border border-line p-3 sm:p-4 mb-8 sm:mb-10">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar piezas…" className="input pl-10" />
        </div>
        <div className="grid grid-cols-2 md:flex gap-2 sm:gap-3 items-center w-full md:w-auto">
          <input type="number" min={0} value={max} onChange={(e) => setMax(e.target.value)} placeholder="Precio máx." className="input w-full md:w-36 text-xs" />
          <select value={sort} onChange={(e) => setSort(e.target.value)} className="input w-full md:w-52 text-xs">
            <option value="recent">Más recientes</option>
            <option value="asc">Precio: menor a mayor</option>
            <option value="desc">Precio: mayor a menor</option>
            <option value="name">Nombre A-Z</option>
          </select>
        </div>
      </div>

      <p className="text-[10px] sm:text-[11px] uppercase tracking-[0.25em] text-muted mb-6 sm:mb-8">
        {list.length} pieza{list.length === 1 ? '' : 's'} disponible{list.length === 1 ? '' : 's'}
      </p>
      {list.length === 0 ? (
        <p className="text-center text-muted py-20">No encontramos productos con esos filtros.</p>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-3 sm:gap-x-4 md:gap-x-6 gap-y-8 sm:gap-y-12">
          {list.map((p, i) => (
            <Reveal key={p.id} delay={(i % 4) * 0.06} y={40}>
              <ProductCard product={p} />
            </Reveal>
          ))}
        </div>
      )}
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={null}>
      <Shop />
    </Suspense>
  );
}
