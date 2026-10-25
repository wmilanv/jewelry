'use client';
import React, { Suspense, useMemo, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Search, SlidersHorizontal } from 'lucide-react';
import { useStoreData } from '@/store/useStoreData';
import { ProductCard } from '@/components/ui/ProductCard';

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
      <div className="text-center mb-10 space-y-2">
        <h1 className="font-display text-5xl">{current ? current.name : 'Tienda'}</h1>
        <p className="text-muted text-sm">{current?.description || 'Todos nuestros productos'}</p>
      </div>

      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {[{ slug: '', name: 'Todo' }, ...categories].map((c) => (
          <button
            key={c.slug}
            onClick={() => setCat(c.slug)}
            className={`px-5 py-2 text-[11px] uppercase tracking-[0.2em] border transition ${cat === c.slug ? 'bg-accent text-on-accent border-accent' : 'border-line text-muted hover:border-accent hover:text-accent'}`}
          >
            {c.name}
          </button>
        ))}
      </div>

      <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between border-y border-line py-4 mb-10">
        <div className="relative md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar productos…" className="input pl-10" />
        </div>
        <div className="flex gap-3 items-center">
          <SlidersHorizontal className="w-4 h-4 text-muted hidden md:block" />
          <input type="number" min={0} value={max} onChange={(e) => setMax(e.target.value)} placeholder="Precio máx." className="input w-36" />
          <select value={sort} onChange={(e) => setSort(e.target.value)} className="input w-48">
            <option value="recent">Más recientes</option>
            <option value="asc">Precio: menor a mayor</option>
            <option value="desc">Precio: mayor a menor</option>
            <option value="name">Nombre A-Z</option>
          </select>
        </div>
      </div>

      <p className="text-xs text-muted mb-6">{list.length} producto{list.length === 1 ? '' : 's'}</p>
      {list.length === 0 ? (
        <p className="text-center text-muted py-20">No encontramos productos con esos filtros.</p>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 md:gap-x-6 gap-y-10">
          {list.map((p) => <ProductCard key={p.id} product={p} />)}
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

