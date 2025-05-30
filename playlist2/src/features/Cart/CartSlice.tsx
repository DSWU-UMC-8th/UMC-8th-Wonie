import { create } from "zustand";
import cartItems from "../../constants/cartItems";

export interface CartItem {
  id: string;
  title: string;
  singer: string;
  price: number;
  img: string;
  amount: number;
}

interface CartState {
  cartItems: CartItem[];
  amount: number;
  total: number;
  increase: (id: string) => void;
  decrease: (id: string) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  calculateTotals: () => void;
}

export const CartSlice = create<CartState>((set, get) => ({
  cartItems: cartItems,
  amount: 0,
  total: 0,

  increase: (id) =>
    set((state) => ({
      cartItems: state.cartItems.map((item) =>
        item.id === id ? { ...item, amount: item.amount + 1 } : item
      ),
    })),

  decrease: (id) =>
    set((state) => ({
      cartItems: state.cartItems
        .map((item) =>
          item.id === id ? { ...item, amount: item.amount - 1 } : item
        )
        .filter((item) => item.amount > 0),
    })),

  removeItem: (id) =>
    set((state) => ({
      cartItems: state.cartItems.filter((item) => item.id !== id),
    })),

  clearCart: () => set({ cartItems: [] }),

  calculateTotals: () => {
    const { cartItems } = get();
    const amount = cartItems.reduce((sum, item) => sum + item.amount, 0);
    const total = cartItems.reduce(
      (sum, item) => sum + item.amount * item.price,
      0
    );
    set({ amount, total });
  },
}));
