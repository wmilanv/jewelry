import { create } from 'zustand';
import { persist, createJSONStorage, StateStorage } from 'zustand/middleware';
import type { CatalogData, Category, OrderRecord, Product, StoreSettings } from '@/types';
import { CATALOG_VERSION, DEFAULT_CATALOG } from '@/data/catalog';

interface StoreState extends CatalogData {
  orders: OrderRecord[];
  hydrated: boolean;
  setHydrated: () => void;
  updateSettings: (patch: (s: StoreSettings) => StoreSettings) => void;
  upsertProduct: (p: Product) => void;
  deleteProduct: (id: string) => void;
  upsertCategory: (c: Category) => void;
  deleteCategory: (id: string) => void;
  addOrder: (o: OrderRecord) => void;
  updateOrderStatus: (id: string, status: OrderRecord['status']) => void;
  loadCatalog: (data: CatalogData) => void;
  resetCatalog: () => void;
}

/** localStorage a prueba de errores (cuota llena, modo privado, SSR). */
const safeStorage: StateStorage = {
  getItem: (k) => {
    try { return localStorage.getItem(k); } catch { return null; }
  },
  setItem: (k, v) => {
    try { localStorage.setItem(k, v); } catch (e) { console.warn('No se pudo guardar (almacenamiento lleno). Usa URLs de imagen en vez de subir archivos.', e); }
  },
  removeItem: (k) => {
    try { localStorage.removeItem(k); } catch { /* noop */ }
  },
};

const clone = <T,>(v: T): T => JSON.parse(JSON.stringify(v));

export const useStoreData = create<StoreState>()(
  persist(
    (set) => ({
      ...clone(DEFAULT_CATALOG),
      orders: [],
      hydrated: false,
      setHydrated: () => set({ hydrated: true }),
      updateSettings: (patch) => set((s) => ({ settings: patch(clone(s.settings)) })),
      upsertProduct: (p) =>
        set((s) => {
          const exists = s.products.some((x) => x.id === p.id);
          return { products: exists ? s.products.map((x) => (x.id === p.id ? p : x)) : [p, ...s.products] };
        }),
      deleteProduct: (id) => set((s) => ({ products: s.products.filter((p) => p.id !== id) })),
      upsertCategory: (c) =>
        set((s) => {
          const exists = s.categories.some((x) => x.id === c.id);
          return { categories: exists ? s.categories.map((x) => (x.id === c.id ? c : x)) : [...s.categories, c] };
        }),
      deleteCategory: (id) => set((s) => ({ categories: s.categories.filter((c) => c.id !== id) })),
      addOrder: (o) => set((s) => ({ orders: [o, ...s.orders] })),
      updateOrderStatus: (id, status) =>
        set((s) => ({ orders: s.orders.map((o) => (o.id === id ? { ...o, status } : o)) })),
      loadCatalog: (data) => set({ settings: clone(data.settings), categories: clone(data.categories), products: clone(data.products) }),
      resetCatalog: () => set({ ...clone(DEFAULT_CATALOG) }),
    }),
    {
      name: 'tienda_catalogo',
      version: CATALOG_VERSION,
      storage: createJSONStorage(() => safeStorage),
      skipHydration: true,
      partialize: (s) => ({ settings: s.settings, categories: s.categories, products: s.products, orders: s.orders }),
      // Si cambia CATALOG_VERSION se descartan datos viejos y se usa el catálogo desplegado (conserva pedidos)
      migrate: (persisted: any) => ({ ...clone(DEFAULT_CATALOG), orders: persisted?.orders ?? [] }) as any,
      // Mezcla profunda mínima para que nuevos campos de settings no rompan datos antiguos
      merge: (persisted: any, current) => ({
        ...current,
        ...persisted,
        settings: { ...current.settings, ...(persisted?.settings ?? {}) },
      }),
    },
  ),
);

export const formatMoney = (value: number, settings: StoreSettings) =>
  new Intl.NumberFormat(settings.locale.locale, {
    style: 'currency',
    currency: settings.locale.currency,
    maximumFractionDigits: 0,
  }).format(value);

export const slugify = (s: string) =>
  s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

