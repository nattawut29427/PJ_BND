"use client";
import React, { useState, useEffect, useRef, useMemo } from "react";
import { Image, Button } from "@heroui/react";

type Skewer = {
  id: number;
  name: string;
  status: string;
  images: string;
  category: string;
  quantity: number;
  price: number;
};

type CartItem = {
  id: number;
  name: string;
  quantity: number;
  price: number;
};

export default function Page() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [skewer, setSkewer] = useState<Skewer[]>([]);
  const [loading, setLoading] = useState(true);
  const [cash, setCash] = useState<number>(0);
  const [message, setMessage] = useState<string>("");
  const cashInputRef = useRef<HTMLInputElement | null>(null);

  // Fetch products
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/productService");
        const data = await response.json();
        setSkewer(data);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, []);

  // Add item to cart
  const handleAddToCart = (id: number, name: string, price: number, quantity: number) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === id ? { ...item, quantity: item.quantity + quantity } : item
        );
      } else {
        return [...prevCart, { id, name, quantity, price }];
      }
    });
  };

  // Remove item from cart
  const handleRemoveFromCart = (id: number, quantityToRemove: number) => {
    setCart((prevCart) =>
      prevCart
        .map((item) => {
          if (item.id === id) {
            const newQuantity = item.quantity - quantityToRemove;
            return newQuantity > 0 ? { ...item, quantity: newQuantity } : null;
          }
          return item;
        })
        .filter((item) => item !== null) as CartItem[]
    );
  };

  // Calculate total price
  const totalPrice = useMemo(() => cart.reduce((total, item) => total + item.price * item.quantity, 0), [cart]);

  // Calculate change
  const change = useMemo(() => (cash >= totalPrice ? cash - totalPrice : 0), [cash, totalPrice]);

  // Handle payment submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) {
      setMessage("กรุณาเพิ่มสินค้าในตะกร้าก่อนชำระเงิน");
      return;
    }
    try {
      const response = await fetch("/api/saleService", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sales: cart.map((item) => ({ skewerId: item.id, quantity: item.quantity })),
          totalPrice,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        setMessage("ชำระเงินสำเร็จ! รายการสั่งซื้อถูกบันทึกแล้ว");
        setCart([]);
        setCash(0);
      } else {
        setMessage(`เกิดข้อผิดพลาด: ${data.error || "ไม่สามารถบันทึกข้อมูลได้"}`);
      }
    } catch (error) {
      setMessage("เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์");
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <>
      <div className="grid grid-cols-3 gap-4 p-4">
        {skewer.map((item, index) => (
          <div key={index} className="p-2 border rounded shadow">
            <Image alt={item.name} src={item.images} width={300} height={300} className="rounded" />
            <h2 className="text-lg font-semibold mt-2">{item.name}</h2>
            <p className="text-gray-600">Price: ${item.price.toFixed(2)}</p>
            <div className="flex items-center gap-2 mt-2">
              <input
                type="number"
                min="1"
                defaultValue="1"
                className="border p-1 rounded w-16 text-center"
                id={`quantity-${index}`}
              />
              <Button
                onClick={() => {
                  const quantity = parseInt(
                    (document.getElementById(`quantity-${index}`) as HTMLInputElement).value
                  );
                  handleAddToCart(item.id, item.name, item.price, quantity);
                }}
                className="bg-gradient-to-tr from-pink-500 to-yellow-500 text-white shadow-lg"
                radius="full"
              >
                Add to Cart
              </Button>
            </div>
          </div>
        ))}
      </div>
      <div className="p-4">
        <h1 className="text-xl font-bold mb-4">Cart Summary</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <h2 className="text-lg font-semibold">Cart Items:</h2>
            <ul>
              {cart.map((item) => (
                <li key={item.id} className="mb-2 flex justify-between items-center">
                  <span>
                    {item.name} - {item.quantity} quantity - ${(item.price * item.quantity).toFixed(2)}
                  </span>
                  <div>
                    <input
                      type="number"
                      min="1"
                      defaultValue="1"
                      className="border p-1 rounded w-16 text-center mr-2"
                      id={`remove-quantity-${item.id}`}
                    />
                    <Button
                      onClick={() => {
                        const quantityToRemove = parseInt(
                          (document.getElementById(`remove-quantity-${item.id}`) as HTMLInputElement).value
                        );
                        handleRemoveFromCart(item.id, quantityToRemove);
                      }}
                      className="bg-red-500 text-white shadow-lg"
                    >
                      Remove
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="text-lg font-bold mt-4">Total: ${totalPrice.toFixed(2)}</div>
          <div>
            <p>Amount Paid:</p>
            <input
              ref={cashInputRef}
              type="number"
              placeholder="Enter amount..."
              value={cash}
              onChange={(e) => setCash(parseFloat(e.target.value))}
              className="border p-2 rounded w-64"
            />
            <div className="pt-4 gap-2 flex">
              <Button onPress={() => setCash(100)}>100</Button>
              <Button onPress={() => setCash(500)}>500</Button>
              <Button onPress={() => setCash(1000)}>1000</Button>
              <Button onPress={() => setCash(totalPrice)}>พอดี</Button>
            </div>
          </div>
          {cash >= totalPrice && (
            <div className="mt-4">
              <p>Change: ${change.toFixed(2)}</p>
            </div>
          )}
          <Button type="submit" color="primary">
            ชำระเงิน
          </Button>
        </form>
      </div>
      {message && (
        <div
          className={`mt-4 p-4 rounded-lg ${
            message.includes("สำเร็จ") ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
          }`}
        >
          {message}
        </div>
      )}
    </>
  );
}