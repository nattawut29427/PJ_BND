"use client";
import { createContext, useContext, useReducer } from "react";

type CartItem = {
  id: number;
  name: string;
  quantity: number;
  price: number;
};

type CartState = CartItem[];

type CartAction =
  | { type: "ADD_TO_CART"; item: CartItem }
  | { type: "REMOVE_FROM_CART"; id: number }
  | { type: "CLEAR_CART" };

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case "ADD_TO_CART":
      const existingItem = state.find((item) => item.id === action.item.id);
      if (existingItem) {
        return state.map((item) =>
          item.id === action.item.id
            ? { ...item, quantity: item.quantity + action.item.quantity }
            : item
        );
      }
      return [...state, action.item];

    case "REMOVE_FROM_CART":
      return state.filter((item) => item.id !== action.id);

    case "CLEAR_CART":
      return [];

    default:
      return state;
  }
};

const CartContext = createContext<
  | {
      cart: CartItem[];
      addToCart: (item: CartItem) => void;
      removeFromCart: (id: number) => void;
      clearCart: () => void;
    }
  | undefined
>(undefined);

export const CartProvider = ({ children }) => {
  const [cart, dispatch] = useReducer(cartReducer, []);

  const addToCart = (item: CartItem) => dispatch({ type: "ADD_TO_CART", item });
  const removeFromCart = (id: number) => dispatch({ type: "REMOVE_FROM_CART", id });
  const clearCart = () => dispatch({ type: "CLEAR_CART" });

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
