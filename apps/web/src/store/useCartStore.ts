import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { CartItem } from '@/types';

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addItem: (item: CartItem, open?: boolean) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, qty: number) => void;
  clearCart: () => void;
  getSubtotal: () => number;
  getCount: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      addItem: (newItem, open = true) =>
        set((state) => {
          const exists = state.items.some((i) => i.id === newItem.id);
          const items = exists
            ? state.items.map((i) => (i.id === newItem.id ? { ...i, quantity: i.quantity + newItem.quantity } : i))
            : [...state.items, newItem];
          return { items, isOpen: open };
        }),
      removeItem: (id) => set((state) => ({ items: state.items.filter((i) => i.id !== id) })),
      updateQuantity: (id, qty) =>
        set((state) => ({
          items: state.items.map((i) => (i.id === id ? { ...i, quantity: Math.max(1, Math.min(99, qty)) } : i)),
        })),
      clearCart: () => set({ items: [] }),
      getSubtotal: () => get().items.reduce((acc, i) => acc + i.price * i.quantity, 0),
      getCount: () => get().items.reduce((acc, i) => acc + i.quantity, 0),
    }),
    {
      name: 'tienda_carrito',
      version: 2,
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
      partialize: (s) => ({ items: s.items }),
    },
  ),
);
