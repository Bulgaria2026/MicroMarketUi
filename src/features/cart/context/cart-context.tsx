import type { CartItem } from "@/features/cart/types/cart";
import { createContext, useEffect, useMemo, useReducer, type ReactNode } from "react";

interface CartState {
  items: CartItem[];
}

type CartAction =
  | { type: "ADD_ITEM"; payload: CartItem }
  | { type: "REMOVE_ITEM"; payload: { productId: string } }
  | { type: "UPDATE_QUANTITY"; payload: { productId: string; quantity: number } }
  | { type: "CLEAR" };

export interface CartContextType {
  items: CartItem[];
  itemCount: number;
  addItem: (item: CartItem) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
}

export const CartContext = createContext<CartContextType | undefined>(undefined);

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD_ITEM": {
      const existing = state.items.find(i => i.productId === action.payload.productId);
      if (existing) {
        return {
          items: state.items.map(i =>
            i.productId === action.payload.productId ? { ...i, quantity: i.quantity + action.payload.quantity } : i,
          ),
        };
      }
      return { items: [...state.items, action.payload] };
    }
    case "REMOVE_ITEM":
      return { items: state.items.filter(i => i.productId !== action.payload.productId) };
    case "UPDATE_QUANTITY":
      return {
        items: state.items.map(i =>
          i.productId === action.payload.productId ? { ...i, quantity: action.payload.quantity } : i,
        ),
      };
    case "CLEAR":
      return { items: [] };
    default:
      return state;
  }
}

function loadCart(): CartState {
  try {
    const stored = localStorage.getItem("cart");
    if (stored) return JSON.parse(stored) as CartState;
  } catch {
    // ignore malformed data
  }
  return { items: [] };
}

export function CartProvider({ children }: Readonly<{ children: ReactNode }>) {
  const [state, dispatch] = useReducer(cartReducer, undefined, loadCart);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(state));
  }, [state]);

  const itemCount = state.items.reduce((sum, item) => sum + item.quantity, 0);

  const contextValue = useMemo(
    () => ({
      items: state.items,
      itemCount,
      addItem: (item: CartItem) => dispatch({ type: "ADD_ITEM", payload: item }),
      removeItem: (productId: string) => dispatch({ type: "REMOVE_ITEM", payload: { productId } }),
      updateQuantity: (productId: string, quantity: number) =>
        dispatch({ type: "UPDATE_QUANTITY", payload: { productId, quantity } }),
      clearCart: () => dispatch({ type: "CLEAR" }),
    }),
    [state.items, itemCount],
  );

  return <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>;
}
