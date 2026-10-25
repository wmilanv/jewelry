import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { CartItemDTO } from '../types/index';

interface CartStore {
  items: CartItemDTO[];
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addItem: (item: CartItemDTO) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, qty: number) => void;
  clearCart: () => void;
  getTotalCOP: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      addItem: (newItem) => {
        set((state) => {
          const existingIndex = state.items.findIndex((i) => i.id === newItem.id);
          if (existingIndex > -1) {
            const updated = [...state.items];
            updated[existingIndex].quantity += newItem.quantity;
            return { items: updated, isOpen: true };
          }
          return { items: [...state.items, newItem], isOpen: true };
        });
      },
      removeItem: (id) =>
        set((state) => ({ items: state.items.filter((i) => i.id !== id) })),
      updateQuantity: (id, qty) =>
        set((state) => ({
          items: state.items.map((i) =>
            i.id === id ? { ...i, quantity: Math.max(1, qty) } : i
          ),
        })),
      clearCart: () => set({ items: [] }),
      getTotalCOP: () =>
        get().items.reduce((acc, item) => acc + item.priceCOP * item.quantity, 0),
    }),
    {
      name: 'atelier_vendome_cart',
      storage: createJSONStorage(() => localStorage),
    }
  )
);