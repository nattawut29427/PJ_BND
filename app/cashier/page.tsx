"use client";

import React, { useState, useRef } from "react";
import { Button, Image } from "@heroui/react";
import { useCart } from "@/app/cashier/actionCh/useCart"; 
import { useProducts } from "./actionCh/useProducts";

export default function Page() {
  const { cart, addToCart, removeFromCart, calculateTotal, clearCart } = useCart();
  const { products, loading, updateProductQuantity, revertProductQuantity } = useProducts();

  const [cash, setCash] = useState<number>(0);
  const [message, setMessage] = useState<string>("");
  const cashInputRef = useRef<HTMLInputElement | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) {
      setMessage("กรุณาเพิ่มสินค้าในตะกร้าก่อนชำระเงิน");
      return;
    }

    const totalPrice = calculateTotal();
   
    try {

      // ส่งข้อมูลเพื่อทำรายการสินค้า ไปบันทึกใน db
      const response = await fetch("/api/saleService", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        
        body: JSON.stringify({
          sales: cart.map((item) => ({
            skewerId: item.id,
            quantity: item.quantity,
          })),
          totalPrice,
        }),
      });

      if (!response.ok) {
        throw new Error("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
      }

      // เคลียร์ cart หลังจากการชำระเงินสำเร็จ
      clearCart();

      setCash(0);
      setMessage("ชำระเงินสำเร็จ!");
    } catch (error) {
      setMessage("เกิดข้อผิดพลาด: " + message);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="grid grid-cols-3 gap-4 p-4">
        {products.map((item, index) => (
          <div key={index} className="p-2 border rounded shadow">
            <Image
              alt={`Product ${index + 1}`}
              src={item.images}
              width={300}
              height={300}
              className="rounded"
            />
            <h2 className="text-lg font-semibold mt-2">{item.name}</h2>
            <p className="text-gray-600">Price: ${item.price.toFixed(2)}</p>
            <p className="text-gray-600">Quantity: {item.quantity}</p>
            <div className="flex items-center gap-2 mt-2">
              <input
                type="number"
                min="1"
                defaultValue="1"
                className="border p-1 rounded w-16 text-center"
                id={`quantity-${index}`}
                max={item.quantity} // ไม่ให้เลือกจำนวนเกินสินค้าคงเหลือ
              />
              <Button
                onPress={() => {
                  if (item.quantity === 0) return; // ไม่ให้เพิ่มสินค้าเมื่อสินค้าหมด
                  const quantity = parseInt(
                    (
                      document.getElementById(
                        `quantity-${index}`
                      ) as HTMLInputElement
                    ).value
                  );
                 
                  if (quantity > item.quantity) {
                    alert("ไม่สามารถเพิ่มจำนวนสินค้ามากกว่าจำนวนที่มีในสต็อก");
                    return;
                  }
                  addToCart(item.id, item.name, item.price, quantity);
                  updateProductQuantity(item.id, quantity); // ลดจำนวนสินค้าในสต็อก
                }}
               
                className={`${
                  item.quantity === 0
                    ? "bg-gray-500"
                    : "bg-gradient-to-tr from-pink-500 to-yellow-500"
                } text-white shadow-lg`}
                radius="full"
                disabled={item.quantity === 0} // ถ้าหมด ไม่ให้กดปุ่ม
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
                <li
                  key={item.id}
                  className="mb-2 flex justify-between items-center"
                >
                  <span>
                    {item.name} - {item.quantity} quantity - $
                    {(item.price * item.quantity).toFixed(2)}
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
                     
                     onPress={() => {
                       
                        const quantityToRemove = parseInt(
                          (
                            document.getElementById(
                              `remove-quantity-${item.id}`
                            ) as HTMLInputElement
                          ).value
                        );
                      
                        if (quantityToRemove > item.quantity) {
                          alert("ไม่สามารถลบจำนวนสินค้ามากกว่าที่มีในตะกร้า");
                          return;
                        }
                        removeFromCart(item.id, quantityToRemove);
                        revertProductQuantity(item.id, quantityToRemove); // คืนจำนวนสินค้าในสต็อก
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

          <div className="text-lg font-bold mt-4">
            Total: ${calculateTotal().toFixed(2)}
          </div>

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
              <Button onPress={() => setCash(calculateTotal())}>Exact</Button>
            </div>
          </div>

          {cash >= calculateTotal() && (
            <div className="mt-4">
              <p>Change: ${calculateTotal() - cash}</p>
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
            message.includes("สำเร็จ")
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {message}
        </div>
      )}
    </div>
  );
}
