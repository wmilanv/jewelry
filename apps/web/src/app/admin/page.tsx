'use client';
import React, { useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import {
  LayoutDashboard, Package, Tags, Settings, ShoppingCart, Database, Sparkles, Plus, Trash2, Pencil, X, Download, Upload, RotateCcw, LogOut, ExternalLink,
} from 'lucide-react';
import { formatMoney, slugify, useStoreData } from '@/store/useStoreData';
import { TEMPLATES } from '@/data/catalog';
import { Media } from '@/components/ui/Media';
import type { ArtKind, CatalogData, Category, OrderRecord, Product, ProductOption, StoreSettings } from '@/types';

const PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'admin123';
const ART_KINDS: { v: ArtKind; l: string }[] = [
  { v: 'ring', l: 'Anillo' }, { v: 'necklace', l: 'Collar' }, { v: 'earrings', l: 'Aretes' },
  { v: 'bracelet', l: 'Pulsera' }, { v: 'watch', l: 'Reloj' }, { v: 'box', l: 'Genérico' },
];

type Tab = 'resumen' | 'productos' | 'categorias' | 'pedidos' | 'tienda' | 'personalizador' | 'datos';
const TABS: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: 'resumen', label: 'Resumen', icon: LayoutDashboard },
  { id: 'productos', label: 'Productos', icon: Package },
  { id: 'categorias', label: 'Categorías', icon: Tags },
  { id: 'pedidos', label: 'Pedidos', icon: ShoppingCart },
  { id: 'tienda', label: 'Ajustes de tienda', icon: Settings },
  { id: 'personalizador', label: 'Personalizador 3D', icon: Sparkles },
  { id: 'datos', label: 'Datos y plantillas', icon: Database },
];

const uid = () => Math.random().toString(36).slice(2, 9);

/* ------------------------------------------------------------------ */
export default function AdminPage() {
  const [auth, setAuth] = useState(false);
  const [pw, setPw] = useState('');
  const [tab, setTab] = useState<Tab>('resumen');
  const settings = useStoreData((s) => s.settings);

  React.useEffect(() => {
    if (sessionStorage.getItem('admin_ok') === '1') setAuth(true);
  }, []);

  if (!auth) {
    return (
      <div className="min-h-screen flex items-center justify-center px-5">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (pw === PASSWORD) { sessionStorage.setItem('admin_ok', '1'); setAuth(true); } else alert('Contraseña incorrecta');
          }}
          className="w-full max-w-sm border border-line bg-surface p-8 space-y-5"
        >
          <div>
            <span className="eyebrow">Panel de administración</span>
            <h1 className="font-display text-3xl mt-1">{settings.brand.name}</h1>
          </div>
          <div>
            <label className="label">Contraseña</label>
            <input type="password" autoFocus className="input" value={pw} onChange={(e) => setPw(e.target.value)} />
          </div>
          <button className="btn-primary w-full">Entrar</button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen md:flex">
      <aside className="md:w-64 md:min-h-screen bg-surface border-r border-line p-5 md:sticky md:top-0 md:h-screen flex md:flex-col gap-1 overflow-x-auto">
        <div className="hidden md:block mb-6">
          <span className="eyebrow">Admin</span>
          <p className="font-display text-2xl leading-tight">{settings.brand.name}</p>
        </div>
        {TABS.map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`flex items-center gap-3 px-3.5 py-2.5 text-sm text-left whitespace-nowrap transition ${tab === t.id ? 'bg-accent text-on-accent' : 'text-muted hover:text-ink hover:bg-bg'}`}>
            <t.icon className="w-4 h-4" /> {t.label}
          </button>
        ))}
        <div className="md:mt-auto md:pt-6 flex md:flex-col gap-1">
          <Link href="/" target="_blank" className="flex items-center gap-3 px-3.5 py-2.5 text-sm text-muted hover:text-accent whitespace-nowrap"><ExternalLink className="w-4 h-4" /> Ver tienda</Link>
          <button onClick={() => { sessionStorage.removeItem('admin_ok'); setAuth(false); }} className="flex items-center gap-3 px-3.5 py-2.5 text-sm text-muted hover:text-accent whitespace-nowrap"><LogOut className="w-4 h-4" /> Salir</button>
        </div>
      </aside>
      <main className="flex-1 p-5 md:p-10 max-w-6xl">
        {tab === 'resumen' && <Overview goto={setTab} />}
        {tab === 'productos' && <Products />}
        {tab === 'categorias' && <Categories />}
        {tab === 'pedidos' && <Orders />}
        {tab === 'tienda' && <StoreSettingsForm />}
        {tab === 'personalizador' && <CustomizerForm />}
        {tab === 'datos' && <DataTab />}
      </main>
    </div>
  );
}

/* ------------------------------------------------------------------ */
function Title({ children, sub, action }: { children: React.ReactNode; sub?: string; action?: React.ReactNode }) {
  return (
    <div className="flex items-end justify-between gap-4 mb-8 flex-wrap">
      <div>
        <h1 className="font-display text-4xl">{children}</h1>
        {sub && <p className="text-sm text-muted mt-1">{sub}</p>}
      </div>
      {action}
    </div>
  );
}

function Overview({ goto }: { goto: (t: Tab) => void }) {
  const { products, categories, orders, settings } = useStoreData();
  const revenue = orders.filter((o) => o.status !== 'cancelado').reduce((a, o) => a + o.total, 0);
  const low = products.filter((p) => p.stock >= 0 && p.stock <= 3);
  const cards = [
    { l: 'Productos', v: products.length, t: 'productos' as Tab },
    { l: 'Categorías', v: categories.length, t: 'categorias' as Tab },
    { l: 'Pedidos', v: orders.length, t: 'pedidos' as Tab },
    { l: 'Ventas registradas', v: formatMoney(revenue, settings), t: 'pedidos' as Tab },
  ];
  return (
    <>
      <Title sub="Administra tu tienda desde aquí">Resumen</Title>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((c) => (
          <button key={c.l} onClick={() => goto(c.t)} className="border border-line bg-surface p-5 text-left hover:border-accent transition">
            <p className="text-[11px] uppercase tracking-widest text-muted">{c.l}</p>
            <p className="font-display text-3xl mt-2">{c.v}</p>
          </button>
        ))}
      </div>
      <div className="mt-8 grid md:grid-cols-2 gap-6">
        <div className="border border-line bg-surface p-5">
          <h3 className="eyebrow mb-3">Stock bajo</h3>
          {low.length === 0 ? <p className="text-sm text-muted">Todo en orden.</p> : low.map((p) => (
            <p key={p.id} className="text-sm flex justify-between py-1.5 border-b border-line last:border-0"><span>{p.name}</span><b className={p.stock === 0 ? 'text-red-400' : 'text-accent'}>{p.stock}</b></p>
          ))}
        </div>
        <div className="border border-line bg-surface p-5 text-sm text-muted space-y-2">
          <h3 className="eyebrow mb-3">Cómo publicar tus cambios</h3>
          <p>Los cambios se guardan en este navegador para que puedas probarlos. Para publicarlos a todos tus clientes:</p>
          <ol className="list-decimal ml-5 space-y-1">
            <li>Ve a <b className="text-ink">Datos y plantillas → Exportar</b>.</li>
            <li>Pega el JSON en <code className="text-accent">apps/web/src/data/catalog.ts</code>.</li>
            <li>Sube <code className="text-accent">CATALOG_VERSION</code> y despliega.</li>
          </ol>
        </div>
      </div>
    </>
  );
}

/* ------------------------------ Productos ------------------------------ */
const optionsToText = (opts: ProductOption[]) =>
  opts.map((o) => `${o.name}: ${o.values.map((v) => v.label + (v.priceDelta ? ` +${v.priceDelta}` : '')).join(', ')}`).join('\n');
const textToOptions = (t: string): ProductOption[] =>
  t.split('\n').map((l) => l.trim()).filter(Boolean).map((l) => {
    const idx = l.indexOf(':');
    const name = idx < 0 ? l : l.slice(0, idx);
    const rest = idx < 0 ? '' : l.slice(idx + 1);
    return {
      name: name.trim(),
      values: rest.split(',').map((x) => x.trim()).filter(Boolean).map((x) => {
        const m = x.match(/^(.*\S)\s+([+-]\d+)$/);
        return m ? { label: m[1], priceDelta: Number(m[2]) } : { label: x, priceDelta: 0 };
      }),
    };
  }).filter((o) => o.name && o.values.length);
const specsToText = (s: Product['specs']) => s.map((x) => `${x.label}: ${x.value}`).join('\n');
const textToSpecs = (t: string) =>
  t.split('\n').map((l) => l.trim()).filter(Boolean).map((l) => {
    const i = l.indexOf(':');
    return i < 0 ? { label: l, value: '' } : { label: l.slice(0, i).trim(), value: l.slice(i + 1).trim() };
  });

/** Redimensiona la imagen subida para no llenar el almacenamiento del navegador. */
async function fileToDataUrl(file: File, max = 900): Promise<string> {
  const bmp = await createImageBitmap(file);
  const scale = Math.min(1, max / Math.max(bmp.width, bmp.height));
  const c = document.createElement('canvas');
  c.width = Math.round(bmp.width * scale); c.height = Math.round(bmp.height * scale);
  c.getContext('2d')!.drawImage(bmp, 0, 0, c.width, c.height);
  return c.toDataURL('image/jpeg', 0.82);
}

function ImagePicker({ images, onChange }: { images: string[]; onChange: (v: string[]) => void }) {
  const [url, setUrl] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);
  return (
    <div>
      <span className="label">Imágenes (la primera es la principal)</span>
      <div className="flex flex-wrap gap-2 mb-2">
        {images.map((src, i) => (
          <div key={i} className="relative w-20 h-20 border border-line">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} alt="" className="w-full h-full object-cover" />
            <button type="button" onClick={() => onChange(images.filter((_, x) => x !== i))} className="absolute -top-2 -right-2 bg-bg border border-line rounded-full p-0.5"><X className="w-3 h-3" /></button>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input className="input" placeholder="Pega la URL de una imagen…" value={url} onChange={(e) => setUrl(e.target.value)} />
        <button type="button" className="btn-outline !px-4" onClick={() => { if (url.trim()) { onChange([...images, url.trim()]); setUrl(''); } }}>Añadir</button>
        <button type="button" className="btn-outline !px-4" onClick={() => fileRef.current?.click()}><Upload className="w-4 h-4" /></button>
        <input ref={fileRef} type="file" accept="image/*" multiple hidden onChange={async (e) => {
          const files = Array.from(e.target.files ?? []);
          const urls = await Promise.all(files.map((f) => fileToDataUrl(f)));
          onChange([...images, ...urls]);
          e.target.value = '';
        }} />
      </div>
      <p className="text-[11px] text-muted mt-1">Las fotos subidas se guardan en el navegador. Para publicar, es mejor usar URLs (Cloudinary, Supabase Storage, etc.).</p>
    </div>
  );
}

function Products() {
  const { products, categories, settings, upsertProduct, deleteProduct } = useStoreData();
  const [editing, setEditing] = useState<Product | null>(null);
  const [q, setQ] = useState('');
  const list = products.filter((p) => p.name.toLowerCase().includes(q.toLowerCase()));

  const blank = (): Product => ({
    id: uid(), slug: '', name: '', description: '', price: 0, compareAtPrice: 0, categoryId: categories[0]?.id ?? '',
    images: [], art: { kind: categories[0]?.art.kind ?? 'box', color: settings.theme.accent }, options: [], specs: [],
    stock: -1, sku: '', featured: false, active: true, badge: '', createdAt: Date.now(),
  });

  return (
    <>
      <Title sub={`${products.length} productos`} action={<button className="btn-primary" onClick={() => setEditing(blank())}><Plus className="w-4 h-4" /> Nuevo producto</button>}>Productos</Title>
      <input className="input max-w-xs mb-4" placeholder="Buscar…" value={q} onChange={(e) => setQ(e.target.value)} />
      <div className="border border-line bg-surface divide-y divide-line">
        {list.map((p) => (
          <div key={p.id} className="flex items-center gap-4 p-3">
            <Media src={p.images[0]} art={p.art} alt="" className="w-14 h-14 shrink-0 border border-line" />
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{p.name} {!p.active && <span className="text-[10px] text-muted border border-line px-1.5 ml-1">OCULTO</span>}</p>
              <p className="text-xs text-muted">{categories.find((c) => c.id === p.categoryId)?.name ?? 'Sin categoría'} · Stock: {p.stock < 0 ? '∞' : p.stock}</p>
            </div>
            <span className="text-sm hidden sm:block">{formatMoney(p.price, settings)}</span>
            <button className="p-2 hover:text-accent" onClick={() => setEditing(p)} aria-label="Editar"><Pencil className="w-4 h-4" /></button>
            <button className="p-2 hover:text-red-400" onClick={() => confirm(`¿Eliminar "${p.name}"?`) && deleteProduct(p.id)} aria-label="Eliminar"><Trash2 className="w-4 h-4" /></button>
          </div>
        ))}
        {list.length === 0 && <p className="p-8 text-center text-muted text-sm">Sin productos.</p>}
      </div>
      {editing && <ProductForm product={editing} onClose={() => setEditing(null)} onSave={(p) => { upsertProduct(p); setEditing(null); }} />}
    </>
  );
}

function ProductForm({ product, onClose, onSave }: { product: Product; onClose: () => void; onSave: (p: Product) => void }) {
  const categories = useStoreData((s) => s.categories);
  const products = useStoreData((s) => s.products);
  const [p, setP] = useState(product);
  const [optText, setOptText] = useState(optionsToText(product.options));
  const [specText, setSpecText] = useState(specsToText(product.specs));
  const isNew = !products.some((x) => x.id === product.id);
  const up = <K extends keyof Product>(k: K, v: Product[K]) => setP((s) => ({ ...s, [k]: v }));

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    let slug = slugify(p.slug || p.name) || p.id;
    if (products.some((x) => x.slug === slug && x.id !== p.id)) slug += `-${uid().slice(0, 3)}`;
    onSave({ ...p, slug, options: textToOptions(optText), specs: textToSpecs(specText), sku: p.sku || slug.toUpperCase() });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 overflow-y-auto" onClick={onClose}>
      <form onSubmit={save} onClick={(e) => e.stopPropagation()} className="bg-bg border border-line max-w-3xl mx-auto my-8 p-6 md:p-8 space-y-5">
        <div className="flex justify-between items-center">
          <h2 className="font-display text-3xl">{isNew ? 'Nuevo producto' : 'Editar producto'}</h2>
          <button type="button" onClick={onClose}><X className="w-5 h-5" /></button>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2"><label className="label">Nombre</label><input required className="input" value={p.name} onChange={(e) => up('name', e.target.value)} /></div>
          <div><label className="label">Categoría</label>
            <select className="input" value={p.categoryId} onChange={(e) => up('categoryId', e.target.value)}>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select></div>
          <div><label className="label">SKU</label><input className="input" value={p.sku} onChange={(e) => up('sku', e.target.value)} /></div>
          <div><label className="label">Precio</label><input required type="number" min={0} className="input" value={p.price} onChange={(e) => up('price', Number(e.target.value))} /></div>
          <div><label className="label">Precio anterior (tachado, opcional)</label><input type="number" min={0} className="input" value={p.compareAtPrice} onChange={(e) => up('compareAtPrice', Number(e.target.value))} /></div>
          <div><label className="label">Stock (-1 = ilimitado)</label><input type="number" min={-1} className="input" value={p.stock} onChange={(e) => up('stock', Number(e.target.value))} /></div>
          <div><label className="label">Etiqueta (Nuevo, Oferta…)</label><input className="input" value={p.badge} onChange={(e) => up('badge', e.target.value)} /></div>
        </div>
        <div><label className="label">Descripción</label><textarea rows={4} className="input" value={p.description} onChange={(e) => up('description', e.target.value)} /></div>
        <ImagePicker images={p.images} onChange={(v) => up('images', v)} />
        <div className="grid sm:grid-cols-2 gap-4">
          <div><label className="label">Ilustración (si no hay foto)</label>
            <select className="input" value={p.art.kind} onChange={(e) => up('art', { ...p.art, kind: e.target.value as ArtKind })}>
              {ART_KINDS.map((k) => <option key={k.v} value={k.v}>{k.l}</option>)}
            </select></div>
          <div><label className="label">Color de la ilustración</label><input type="color" className="input h-[42px] p-1" value={p.art.color} onChange={(e) => up('art', { ...p.art, color: e.target.value })} /></div>
        </div>
        <div>
          <label className="label">Opciones (una por línea) — formato: Nombre: valor1, valor2 +5000</label>
          <textarea rows={3} className="input font-mono text-xs" value={optText} onChange={(e) => setOptText(e.target.value)} placeholder={'Talla: S, M, L\nMaterial: Oro 18k, Oro rosado +150000'} />
        </div>
        <div>
          <label className="label">Especificaciones (una por línea) — formato: Etiqueta: valor</label>
          <textarea rows={3} className="input font-mono text-xs" value={specText} onChange={(e) => setSpecText(e.target.value)} placeholder={'Peso: 3.2 g\nMaterial: Oro 18k'} />
        </div>
        <div className="flex gap-6 text-sm">
          <label className="flex items-center gap-2"><input type="checkbox" checked={p.featured} onChange={(e) => up('featured', e.target.checked)} /> Destacado en inicio</label>
          <label className="flex items-center gap-2"><input type="checkbox" checked={p.active} onChange={(e) => up('active', e.target.checked)} /> Visible en la tienda</label>
        </div>
        <div className="flex justify-end gap-3 pt-2 border-t border-line">
          <button type="button" className="btn-outline" onClick={onClose}>Cancelar</button>
          <button className="btn-primary">Guardar producto</button>
        </div>
      </form>
    </div>
  );
}

/* ------------------------------ Categorías ------------------------------ */
function Categories() {
  const { categories, products, upsertCategory, deleteCategory } = useStoreData();
  const [c, setC] = useState<Category | null>(null);
  return (
    <>
      <Title action={<button className="btn-primary" onClick={() => setC({ id: uid(), slug: '', name: '', description: '', image: '', art: { kind: 'box', color: '#c5a880' } })}><Plus className="w-4 h-4" /> Nueva categoría</button>}>Categorías</Title>
      <div className="border border-line bg-surface divide-y divide-line">
        {categories.map((x) => (
          <div key={x.id} className="flex items-center gap-4 p-3">
            <Media src={x.image} art={x.art} alt="" className="w-14 h-14 border border-line shrink-0" />
            <div className="flex-1"><p className="font-medium">{x.name}</p><p className="text-xs text-muted">{products.filter((p) => p.categoryId === x.id).length} productos · /tienda?cat={x.slug}</p></div>
            <button className="p-2 hover:text-accent" onClick={() => setC(x)}><Pencil className="w-4 h-4" /></button>
            <button className="p-2 hover:text-red-400" onClick={() => confirm(`¿Eliminar "${x.name}"?`) && deleteCategory(x.id)}><Trash2 className="w-4 h-4" /></button>
          </div>
        ))}
      </div>
      {c && (
        <div className="fixed inset-0 z-50 bg-black/70 overflow-y-auto" onClick={() => setC(null)}>
          <form onClick={(e) => e.stopPropagation()} onSubmit={(e) => { e.preventDefault(); upsertCategory({ ...c, slug: slugify(c.slug || c.name) }); setC(null); }} className="bg-bg border border-line max-w-lg mx-auto my-12 p-6 space-y-4">
            <h2 className="font-display text-3xl">Categoría</h2>
            <div><label className="label">Nombre</label><input required className="input" value={c.name} onChange={(e) => setC({ ...c, name: e.target.value })} /></div>
            <div><label className="label">Descripción</label><input className="input" value={c.description} onChange={(e) => setC({ ...c, description: e.target.value })} /></div>
            <div><label className="label">Imagen (URL, opcional)</label><input className="input" value={c.image} onChange={(e) => setC({ ...c, image: e.target.value })} /></div>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="label">Ilustración</label>
                <select className="input" value={c.art.kind} onChange={(e) => setC({ ...c, art: { ...c.art, kind: e.target.value as ArtKind } })}>{ART_KINDS.map((k) => <option key={k.v} value={k.v}>{k.l}</option>)}</select></div>
              <div><label className="label">Color</label><input type="color" className="input h-[42px] p-1" value={c.art.color} onChange={(e) => setC({ ...c, art: { ...c.art, color: e.target.value } })} /></div>
            </div>
            <div className="flex justify-end gap-3"><button type="button" className="btn-outline" onClick={() => setC(null)}>Cancelar</button><button className="btn-primary">Guardar</button></div>
          </form>
        </div>
      )}
    </>
  );
}

/* ------------------------------ Pedidos ------------------------------ */
function Orders() {
  const { orders, settings, updateOrderStatus } = useStoreData();
  const STATUS: OrderRecord['status'][] = ['pendiente', 'pagado', 'enviado', 'entregado', 'cancelado'];
  return (
    <>
      <Title sub="Pedidos registrados desde este navegador. Para un historial centralizado conecta el backend (apps/api).">Pedidos</Title>
      {orders.length === 0 ? <p className="border border-line p-10 text-center text-muted text-sm">Aún no hay pedidos.</p> : (
        <div className="space-y-4">
          {orders.map((o) => (
            <div key={o.id} className="border border-line bg-surface p-5 space-y-3">
              <div className="flex flex-wrap justify-between gap-3">
                <div><p className="font-medium">{o.reference}</p><p className="text-xs text-muted">{new Date(o.createdAt).toLocaleString(settings.locale.locale)} · {o.method}</p></div>
                <select className="input w-40" value={o.status} onChange={(e) => updateOrderStatus(o.id, e.target.value as OrderRecord['status'])}>{STATUS.map((s) => <option key={s}>{s}</option>)}</select>
              </div>
              <p className="text-sm">{o.customer.name} · {o.customer.email} · {o.customer.phone}<br /><span className="text-muted">{o.customer.address}, {o.customer.city}</span></p>
              <ul className="text-sm text-muted">{o.items.map((i) => <li key={i.id}>{i.quantity} × {i.title} {i.variantLabel && `(${i.variantLabel})`}</li>)}</ul>
              <p className="text-right font-display text-xl text-accent">{formatMoney(o.total, settings)}</p>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

/* ------------------------------ Ajustes ------------------------------ */
function setPath(obj: any, path: string, value: any) {
  const keys = path.split('.');
  const last = keys.pop()!;
  let cur = obj;
  for (const k of keys) cur = cur[k];
  cur[last] = value;
}

function F({ label, path, type = 'text', area, hint }: { label: string; path: string; type?: string; area?: boolean; hint?: string }) {
  const settings = useStoreData((s) => s.settings);
  const update = useStoreData((s) => s.updateSettings);
  const value = path.split('.').reduce((o: any, k) => o?.[k], settings) ?? '';
  const onChange = (v: string) => update((s) => { setPath(s, path, type === 'number' ? Number(v) : v); return s; });
  return (
    <div>
      <label className="label">{label}</label>
      {area ? <textarea rows={3} className="input" value={value} onChange={(e) => onChange(e.target.value)} />
        : <input type={type} className={`input ${type === 'color' ? 'h-[42px] p-1' : ''}`} value={value} onChange={(e) => onChange(e.target.value)} />}
      {hint && <p className="text-[11px] text-muted mt-1">{hint}</p>}
    </div>
  );
}
function Check({ label, path }: { label: string; path: string }) {
  const settings = useStoreData((s) => s.settings);
  const update = useStoreData((s) => s.updateSettings);
  const value = path.split('.').reduce((o: any, k) => o?.[k], settings) as boolean;
  return <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={!!value} onChange={(e) => update((s) => { setPath(s, path, e.target.checked); return s; })} /> {label}</label>;
}
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return <section className="border border-line bg-surface p-6 mb-6"><h2 className="eyebrow mb-5">{title}</h2><div className="grid sm:grid-cols-2 gap-4">{children}</div></section>;
}

function PairLines({ label, hint, value, onChange }: { label: string; hint: string; value: string; onChange: (v: string) => void }) {
  const [t, setT] = useState(value);
  return <div className="sm:col-span-2"><label className="label">{label}</label><textarea rows={4} className="input font-mono text-xs" value={t} onChange={(e) => { setT(e.target.value); onChange(e.target.value); }} /><p className="text-[11px] text-muted mt-1">{hint}</p></div>;
}

function StoreSettingsForm() {
  const settings = useStoreData((s) => s.settings);
  const update = useStoreData((s) => s.updateSettings);
  const parsePairs = (t: string) => t.split('\n').map((l) => l.split('|').map((x) => x.trim())).filter((p) => p[0]);
  return (
    <>
      <Title sub="Los cambios se aplican al instante en la tienda.">Ajustes de tienda</Title>
      <Section title="Marca">
        <F label="Nombre de la tienda" path="brand.name" />
        <F label="Eslogan" path="brand.tagline" />
        <F label="URL del logo (opcional)" path="brand.logoUrl" />
        <F label="Descripción (pie de página)" path="brand.description" area />
      </Section>
      <Section title="Tema y moneda">
        <div><label className="label">Modo</label>
          <select className="input" value={settings.theme.mode} onChange={(e) => update((s) => { s.theme.mode = e.target.value as any; return s; })}><option value="dark">Oscuro</option><option value="light">Claro</option></select></div>
        <div><label className="label">Tipografía de títulos</label>
          <select className="input" value={settings.theme.fontStyle} onChange={(e) => update((s) => { s.theme.fontStyle = e.target.value as any; return s; })}><option value="serif">Elegante (serif)</option><option value="sans">Moderna (sans)</option></select></div>
        <F label="Color principal" path="theme.accent" type="color" />
        <div className="grid grid-cols-2 gap-3">
          <F label="Moneda (COP, USD, EUR…)" path="locale.currency" />
          <F label="Idioma/formato (es-CO, es-MX…)" path="locale.locale" />
        </div>
      </Section>
      <Section title="Banner superior y portada">
        <Check label="Mostrar banner de anuncio" path="announcement.enabled" />
        <F label="Texto del anuncio" path="announcement.text" />
        <F label="Texto pequeño superior" path="hero.eyebrow" />
        <F label="Título principal" path="hero.title" />
        <F label="Subtítulo" path="hero.subtitle" area />
        <F label="Imagen de portada (URL, opcional)" path="hero.imageUrl" hint="Si la dejas vacía y el personalizador está activo, se muestra el anillo 3D." />
        <F label="Botón principal: texto" path="hero.ctaLabel" />
        <F label="Botón principal: enlace" path="hero.ctaHref" />
        <F label="Botón secundario: texto" path="hero.secondaryLabel" />
        <F label="Botón secundario: enlace" path="hero.secondaryHref" />
        <Check label="Mostrar anillo 3D en la portada" path="hero.show3D" />
      </Section>
      <Section title="Menú y secciones">
        <PairLines label="Enlaces del menú" hint="Uno por línea: Texto | /ruta" value={settings.nav.map((n) => `${n.label} | ${n.href}`).join('\n')}
          onChange={(t) => update((s) => { s.nav = parsePairs(t).map((p) => ({ label: p[0], href: p[1] || '/' })); return s; })} />
        <F label="Título de categorías" path="sections.categoriesTitle" />
        <F label="Título de destacados" path="sections.featuredTitle" />
        <F label="Subtítulo de destacados" path="sections.featuredSubtitle" />
        <PairLines label="Beneficios (4 recomendados)" hint="Uno por línea: Título | Descripción" value={settings.sections.benefits.map((b) => `${b.title} | ${b.text}`).join('\n')}
          onChange={(t) => update((s) => { s.sections.benefits = parsePairs(t).map((p) => ({ title: p[0], text: p[1] || '' })); return s; })} />
        <F label="Título de boletín" path="sections.newsletterTitle" />
        <F label="Texto de boletín" path="sections.newsletterText" />
      </Section>
      <Section title="Contacto y redes">
        <F label="Correo" path="contact.email" />
        <F label="Teléfono" path="contact.phone" />
        <F label="WhatsApp (con indicativo, solo números)" path="contact.whatsapp" hint="Ej: 573001234567. Activa el botón flotante y los pedidos por WhatsApp." />
        <F label="Dirección" path="contact.address" />
        <F label="Instagram (URL)" path="contact.instagram" />
        <F label="Facebook (URL)" path="contact.facebook" />
      </Section>
      <Section title="Envíos y pagos">
        <F label="Costo de envío" path="shipping.flatRate" type="number" />
        <F label="Envío gratis desde (0 = nunca)" path="shipping.freeFrom" type="number" />
        <F label="Nota de entrega" path="shipping.note" />
        <F label="Prefijo de pedidos" path="payments.orderPrefix" />
        <Check label="Pagos con Wompi (requiere NEXT_PUBLIC_API_URL y solo COP)" path="payments.wompi" />
        <Check label="Pedidos por WhatsApp" path="payments.whatsappOrders" />
      </Section>
    </>
  );
}

function CustomizerForm() {
  const settings = useStoreData((s) => s.settings);
  const update = useStoreData((s) => s.updateSettings);
  const c = settings.customizer;
  return (
    <>
      <Title sub="Visor 3D de anillos. Desactívalo si tu tienda vende otro tipo de producto.">Personalizador 3D</Title>
      <Section title="General">
        <Check label="Activar personalizador" path="customizer.enabled" />
        <Check label="Permitir grabado" path="customizer.engraving" />
        <F label="Texto en el menú" path="customizer.navLabel" />
        <F label="Título" path="customizer.title" />
        <F label="Subtítulo" path="customizer.subtitle" />
        <F label="Precio base" path="customizer.basePrice" type="number" />
        <F label="Quilates mínimos" path="customizer.minCarats" type="number" />
        <F label="Quilates máximos" path="customizer.maxCarats" type="number" />
      </Section>

      <section className="border border-line bg-surface p-6 mb-6 space-y-3">
        <div className="flex justify-between"><h2 className="eyebrow">Metales</h2>
          <button className="text-xs text-accent" onClick={() => update((s) => { s.customizer.metals.push({ id: uid(), name: 'Nuevo metal', color: '#cccccc', priceDelta: 0 }); return s; })}>+ Añadir</button></div>
        {c.metals.map((m, i) => (
          <div key={m.id} className="grid grid-cols-[1fr_60px_140px_40px] gap-2 items-center">
            <input className="input" value={m.name} onChange={(e) => update((s) => { s.customizer.metals[i].name = e.target.value; return s; })} />
            <input type="color" className="input h-[42px] p-1" value={m.color} onChange={(e) => update((s) => { s.customizer.metals[i].color = e.target.value; return s; })} />
            <input type="number" className="input" value={m.priceDelta} title="Ajuste de precio" onChange={(e) => update((s) => { s.customizer.metals[i].priceDelta = Number(e.target.value); return s; })} />
            <button onClick={() => update((s) => { s.customizer.metals.splice(i, 1); return s; })} className="hover:text-red-400"><Trash2 className="w-4 h-4" /></button>
          </div>
        ))}
      </section>

      <section className="border border-line bg-surface p-6 space-y-3">
        <div className="flex justify-between"><h2 className="eyebrow">Piedras (precio por quilate)</h2>
          <button className="text-xs text-accent" onClick={() => update((s) => { s.customizer.gems.push({ id: uid(), name: 'Nueva piedra', color: '#ffffff', pricePerCt: 1000000 }); return s; })}>+ Añadir</button></div>
        {c.gems.map((g, i) => (
          <div key={g.id} className="grid grid-cols-[1fr_60px_140px_40px] gap-2 items-center">
            <input className="input" value={g.name} onChange={(e) => update((s) => { s.customizer.gems[i].name = e.target.value; return s; })} />
            <input type="color" className="input h-[42px] p-1" value={g.color} onChange={(e) => update((s) => { s.customizer.gems[i].color = e.target.value; return s; })} />
            <input type="number" className="input" value={g.pricePerCt} onChange={(e) => update((s) => { s.customizer.gems[i].pricePerCt = Number(e.target.value); return s; })} />
            <button onClick={() => update((s) => { s.customizer.gems.splice(i, 1); return s; })} className="hover:text-red-400"><Trash2 className="w-4 h-4" /></button>
          </div>
        ))}
      </section>
    </>
  );
}

/* ------------------------------ Datos ------------------------------ */
function DataTab() {
  const { settings, categories, products, loadCatalog, resetCatalog } = useStoreData();
  const fileRef = useRef<HTMLInputElement>(null);
  const json = useMemo(() => JSON.stringify({ settings, categories, products } satisfies CatalogData, null, 2), [settings, categories, products]);

  const download = () => {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([json], { type: 'application/json' }));
    a.download = 'catalogo.json';
    a.click();
  };
  const importFile = async (f: File) => {
    try {
      const d = JSON.parse(await f.text());
      if (!d.settings || !Array.isArray(d.products) || !Array.isArray(d.categories)) throw new Error();
      if (confirm('Esto reemplazará tu catálogo actual. ¿Continuar?')) loadCatalog(d);
    } catch { alert('Archivo inválido'); }
  };

  return (
    <>
      <Title sub="Respalda, migra o reinicia tu tienda.">Datos y plantillas</Title>
      <div className="space-y-6">
        <div className="border border-line bg-surface p-6 space-y-4">
          <h2 className="eyebrow">Exportar / importar</h2>
          <div className="flex flex-wrap gap-3">
            <button className="btn-primary" onClick={download}><Download className="w-4 h-4" /> Descargar catálogo (.json)</button>
            <button className="btn-outline" onClick={() => navigator.clipboard.writeText(json).then(() => alert('Copiado'))}>Copiar JSON</button>
            <button className="btn-outline" onClick={() => fileRef.current?.click()}><Upload className="w-4 h-4" /> Importar .json</button>
            <input ref={fileRef} hidden type="file" accept="application/json" onChange={(e) => e.target.files?.[0] && importFile(e.target.files[0])} />
          </div>
          <p className="text-xs text-muted">Para publicar: pega el contenido en <code className="text-accent">apps/web/src/data/catalog.ts</code> (objeto DEFAULT_CATALOG), sube CATALOG_VERSION y despliega.</p>
        </div>

        <div className="border border-line bg-surface p-6 space-y-4">
          <h2 className="eyebrow">Plantillas de negocio</h2>
          <p className="text-sm text-muted">Carga un catálogo de ejemplo según tu tipo de negocio y luego edítalo a tu gusto. Reemplaza los datos actuales.</p>
          <div className="flex flex-wrap gap-3">
            {Object.entries(TEMPLATES).map(([k, t]) => (
              <button key={k} className="btn-outline" onClick={() => confirm(`¿Cargar plantilla "${t.label}"? Se reemplazará tu catálogo.`) && loadCatalog(t.data)}>{t.label}</button>
            ))}
          </div>
        </div>

        <div className="border border-red-400/30 bg-surface p-6 space-y-3">
          <h2 className="eyebrow !text-red-400">Zona de riesgo</h2>
          <button className="btn-outline" onClick={() => confirm('¿Restablecer al catálogo original desplegado?') && resetCatalog()}><RotateCcw className="w-4 h-4" /> Restablecer catálogo original</button>
        </div>
      </div>
    </>
  );
}
