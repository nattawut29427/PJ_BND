import { useState } from "react";

type CartItem = {
  id: number;
  name: string;
  quantity: number;
  price: number;
};

export const useCart = () => {
  const [cart, setCart] = useState<CartItem[]>([]);

  // เพิ่มสินค้าในตะกร้า
  const addToCart = (id: number, name: string, price: number, quantity: number) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === id);
     
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        return [...prevCart, { id, name, quantity, price }];
      }
    });
  };

  // ลบสินค้าออกจากตะกร้า
  const removeFromCart = (id: number, quantityToRemove: number) => {
    setCart((prevCart) => {
      return prevCart
        .map((item) => {
          if (item.id === id) {
            const newQuantity = item.quantity - quantityToRemove;
           
            return newQuantity > 0 ? { ...item, quantity: newQuantity } : null;
          }
         
          return item;
        })
        .filter((item) => item !== null) as CartItem[];
    });
  };

  // คำนวณราคารวม
  const calculateTotal = (): number => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };
  
  // clear cart
  const clearCart = () => {
    setCart([]);  
  };

  return {
    cart,
    addToCart,
    removeFromCart,
    calculateTotal,
    clearCart,
  };
};
