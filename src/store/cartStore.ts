import { create } from 'zustand';
import { CartItem, Pet } from '../types';

interface CartStore {
  items: CartItem[];
  addToCart: (pet: Pet) => void;
  removeFromCart: (petId: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  getTotalPrice: () => number;
  getCartCount: () => number;
  emptyCart: () => void;
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],

  addToCart: (pet: Pet) => {
    const items = get().items;
    const existingItem = items.find(item => item.id === pet.id);

    if (existingItem) {
      set({
        items: items.map(item =>
          item.id === pet.id ? { ...item, quantity: item.quantity + 1 } : item,
        ),
      });
    } else {
      set({
        items: [...items, { ...pet, quantity: 1 }],
      });
    }
  },

  updateQuantity: (id: string, quantity: number) =>
    set(state => ({
      items: state.items.map(item =>
        item.id === id ? { ...item, quantity } : item,
      ),
    })),

  removeFromCart: (petId: string) => {
    set({
      items: get().items.filter(item => item.id !== petId),
    });
  },

  getTotalPrice: () => {
    return get().items.reduce(
      (total, item) => total + item.price * item.quantity,
      0,
    );
  },

  getCartCount: () => {
    return get().items.reduce((count, item) => count + item.quantity, 0);
  },

  emptyCart: () => {
    set({ items: [] });
  },
}));
