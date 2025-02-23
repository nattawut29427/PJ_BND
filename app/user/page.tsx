"use client";
import Drawer from "@/app/user/components/Drawer";
import { Navbar, NavbarBrand, NavbarContent, Input, Button, Image } from "@heroui/react";
import React, { useState, useRef } from "react";
import { useCart } from "@/app/cashier/actionCh/useCart";
import { useProducts } from "@/app/cashier/actionCh/useProducts";

export const SearchIcon = ({ size = 24, strokeWidth = 1.5, ...props }) => ( <svg aria-hidden="true" fill="none" focusable="false" height={size} viewBox="0 0 24 24" width={size} {...props}> <path d="M11.5 21C16.7467 21 21 16.7467 21 11.5C21 6.25329 16.7467 2 11.5 2C6.25329 2 2 6.25329 2 11.5C2 16.7467 6.25329 21 11.5 21Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={strokeWidth} /> <path d="M22 22L20 20" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={strokeWidth} /> </svg> );
export default function App() {
  const { cart, addToCart, removeFromCart, calculateTotal, clearCart } = useCart();
  const { products, loading, updateProductQuantity } = useProducts();

  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [showPopup, setShowPopup] = useState<boolean>(false);

  const quantityRefs = useRef<{ [key: number]: HTMLInputElement | null }>({});

  const categories = [
    { id: 1, name: "เนื้อหมู" },
    { id: 2, name: "เนื้อวัว" },
    { id: 3, name: "ผัก" },
    { id: 4, name: "เครื่องดื่ม" },
    { id: 5, name: "อื่น" },
  ];

  const handleAddToCart = (item) => {
    if (item.quantity === 0) return;
    const quantity = parseInt(quantityRefs.current[item.id]?.value || "1", 10);

    if (quantity > item.quantity) {
      alert("ไม่สามารถเพิ่มเกินจำนวนสต็อกได้");
      return;
    }

    addToCart(item.id, item.name, item.price, quantity);
    updateProductQuantity(item.id, quantity);

    setCartItems((prev) => {
      const existingItem = prev.find((i) => i.id === item.id);
      if (existingItem) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + quantity } : i
        );
      }
      return [...prev, { id: item.id, name: item.name, quantity, price: item.price }];
    });

    setShowPopup(true);
  };

  // ปรับปรุงฟังก์ชันนี้
  const handleRemoveFromCart = (item) => {
    // ลดจำนวนสินค้าลง 1
    const updatedCartItems = cartItems.map((i) =>
      i.id === item.id ? { ...i, quantity: i.quantity - 1 } : i
    ).filter((i) => i.quantity > 0);

    setCartItems(updatedCartItems);

    // เพิ่มจำนวนสินค้ากลับเข้าสู่สต็อก 1 ชิ้น
    updateProductQuantity(item.id, -1);

    // อัปเดตตะกร้า
    // ปรับให้ removeFromCart รับจำนวนที่ต้องการลบด้วย
    removeFromCart(item.id, 1);

    // ถ้าตะกร้าสินค้าว่าง ให้ปิด Popup
    if (updatedCartItems.length === 0) {
      setShowPopup(false);
    }
  };

  return (
    <>
      {/* Navbar */}
      <Navbar>
        <NavbarContent justify="start">
          <NavbarBrand className="mr-4">
            <Drawer />
          </NavbarBrand>
        </NavbarContent>

        <NavbarContent as="div" className="flex items-center justify-between sm:justify-start md:justify-end">
          <Input
            className="w-full max-w-full sm:max-w-[20rem] md:max-w-[24rem] lg:max-w-[28rem] h-10"
            placeholder="ค้นหา..."
            size="md"
            startContent={<SearchIcon size={18} />}
            type="search"
          />
        </NavbarContent>
      </Navbar>

      {/* Categories */}
      <div className="p-4 sm:p-6 flex flex-wrap gap-2 justify-center">
        <Button className="px-4 py-2 text-sm sm:text-base" color="primary" onPress={() => setSelectedCategory(null)}>
          All Product
        </Button>
        {categories.map((category) => (
          <Button
            key={category.id}
            onPress={() => setSelectedCategory(category.id)}
            className={`px-4 py-2 text-sm sm:text-base ${
              selectedCategory === category.id ? "bg-blue-500 text-white" : "bg-gray-600"
            }`}
          >
            {category.name}
          </Button>
        ))}
      </div>

      {/* Products */}
      <div className="flex-1 px-2 sm:px-6">
        <div className="grid grid-cols-2 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products
            .filter((item) => selectedCategory === null || item.categoryId === selectedCategory)
            .map((item) => (
              <div key={item.id} className="p-4 border rounded-lg shadow-lg flex flex-col items-center w-full">
                <Image
                  alt={item.name}
                  src={item.images}
                  width={120}
                  height={120}
                  className="rounded-lg object-cover mb-3 mx-auto w-full sm:w-40 sm:h-40"
                />
                <h2 className="text-base sm:text-lg font-semibold text-white">{item.name}</h2>
                <div className="text-start">
                  <p className="text-gray-600 text-sm sm:text-base">Price: ${item.price.toFixed(2)}</p>
                  <p className="text-gray-500 text-sm sm:text-base">Stock: {item.quantity}</p>
                </div>
                <div className="flex flex-col sm:flex-row items-center gap-2 mt-4 w-full">
                  <input
                    type="number"
                    min="1"
                    defaultValue="1"
                    className="border p-2 rounded w-full sm:w-14 h-10 text-center"
                    ref={(el) => (quantityRefs.current[item.id] = el)}
                    max={item.quantity}
                  />
                  <Button
                    onPress={() => handleAddToCart(item)}
                    className={`w-full sm:w-auto px-4 py-2 text-sm sm:text-base ${
                      item.quantity === 0 ? "bg-gray-500" : "bg-gradient-to-tr from-pink-500 to-yellow-500"
                    }`}
                    disabled={item.quantity === 0}
                  >
                    Add
                  </Button>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Popup แสดงรายการสินค้า */}
      {showPopup && (
        <div className="fixed bottom-5 right-5 w-11/12 sm:w-80 bg-gray-700 border rounded-lg shadow-lg p-4 z-50 max-h-96 overflow-y-auto">
          <div className="flex justify-between items-center border-b pb-2 mb-2">
            <h3 className="text-lg font-semibold text-white">🛒 Carts</h3>
            <Button className="bg-green-500 text-white px-4 py-2 text-sm sm:text-base" onPress={() => setShowPopup(false)}>
              Checkout
            </Button>
          </div>
          <ul className="text-white text-sm sm:text-base">
            {cartItems.map((item) => (
              <li key={item.id} className="flex justify-between items-center mb-2">
                <span>{item.name} x {item.quantity}</span>
                <div className="flex items-center">
                  <span className="mr-2">${(item.price * item.quantity).toFixed(2)}</span>
                  <Button
                    className="bg-red-500 text-white px-2 py-1 text-xs"
                    onPress={() => handleRemoveFromCart(item)}
                  >
                    Remove
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}
