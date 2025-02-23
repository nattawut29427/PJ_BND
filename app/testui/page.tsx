"use client";

import React, { useState, useRef, useEffect } from "react";
import { Button, Image, Spinner } from "@heroui/react";
import { useCart } from "@/app/cashier/actionCh/useCart";
import { useProducts } from "@/app/cashier/actionCh/useProducts";
import Drawer from "@/app/admin/components/Drawer";
import { useRouter } from "next/navigation";
import { fetchData } from "next-auth/client/_utils";

export default function Page() {
  const { cart, addToCart, removeFromCart, calculateTotal, clearCart } =
    useCart();
  const { products, loading, updateProductQuantity, revertProductQuantity } =
    useProducts();

  const [cash, setCash] = useState<number>(0);
  const [message, setMessage] = useState<string>("");
  const cashInputRef = useRef<HTMLInputElement | null>(null);

  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [paymentType, setPaymentType] = useState<"cash" | "card" | "online">(
    "cash"
  );
  const [status, setStatus] = useState<string>("");

  const customerId = "customer-session-id";

  const categories = [
    { id: 1, name: "เนื้อหมู" },
    { id: 2, name: "เนื้อวัว" },
    { id: 3, name: "ผัก" },
    { id: 4, name: "เครื่องดื่ม" },
    { id: 5, name: "อื่น" },
  ];

  // const handleAddItem = () => {
  //   setItems([...items, { skewerId: 1, quantity: 1 }]);
  // };

  // const handleRemoveItem = (index: number) => {
  //   setItems(items.filter((_, i) => i !== index));
  // };

  const router = useRouter(); // ใช้งาน useRouter
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const totalPrice = calculateTotal();

    try {
      const res = await fetch("/api/order/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cart.map((item) => ({
            skewerId: item.id,
            quantity: item.quantity,
            price: item.price,
          })),
          paymentType,
          totalPrice,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        router.push(`/order/${data.orderId}`);
      } else {
        setStatus(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error(error);
      setStatus("Error processing order.");
    }
  };

  useEffect(() => {
    // คำนวณยอดรวมเมื่อ cart เปลี่ยนแปลง
    calculateTotal();
    
  }, [cart]);



  if (loading) {
    return (
      <Spinner
        className="flex justify-center items-center m-auto w-1/2 h-1/2"
        size="lg"
        color="primary"
        labelColor="primary"
      />
    );
  }

  return (
    <>
      <div className="absolute top-5 left-5">
        <Drawer />
      </div>
      <div className="p-6 gap-4  flex">
        <Button
          className="bg-red-500"
          onPress={() => setSelectedCategory(null)}
        >
          All Product
        </Button>
        {categories.map((category) => (
          <Button
            key={category.id}
            onPress={() => setSelectedCategory(category.id)}
            className={
              selectedCategory === category.id
                ? "bg-blue-500 text-white"
                : "bg-gray-600"
            }
          >
            {category.name}
          </Button>
        ))}
      </div>

      <div className="p-6 min-h-screen flex flex-col md:flex-row gap-6 ">
        {/* สินค้า */}
        <div className="flex-1">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 p">
            {products
              .filter(
                (item) =>
                  selectedCategory === null ||
                  item.categoryId === selectedCategory
              )
              .map((item, index) => (
                <div
                  key={index}
                  className="p-4 border rounded-lg shadow-lg flex flex-col items-center"
                >
                  <Image
                    alt={`Product ${index + 1}`}
                    src={item.images}
                    width={150}
                    height={150}
                    className="rounded-lg object-cover mb-4 mx-auto"
                  />
                  <h2 className="text-lg font-semibold text-white">
                    {item.name}
                  </h2>
                  <div className="text-start">
                    <p className="text-gray-600">
                      Price: ${item.price.toFixed(2)}
                    </p>
                    <p className="text-gray-500">Stock: {item.quantity}</p>
                  </div>
                  <div className="flex flex-rows items-center gap-2 mt-4">
                    <input
                      type="number"
                      min="1"
                      defaultValue="1"
                      className="border p-2 rounded w-14 h-10  text-center"
                      id={`quantity-${index}`}
                      max={item.quantity}
                    />
                    <Button
                      onPress={() => {
                        if (item.quantity === 0) return;
                        const quantity = parseInt(
                          (
                            document.getElementById(
                              `quantity-${index}`
                            ) as HTMLInputElement
                          ).value
                        );
                      
                        if (quantity > item.quantity) {
                          alert("Cannot add more than available stock.");
                          return;
                        }
                        addToCart(item.id, item.name, item.price, quantity);
                        updateProductQuantity(item.id, quantity);
                      }}
                      className={`w-full py-2 ${
                        item.quantity === 0
                          ? "bg-gray-500"
                          : "bg-gradient-to-tr from-pink-500 to-yellow-500"
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

        {/* Cart Summary ฝั่งขวา */}
        <div className="w-full md:w-[350px] lg:w-[400px]  p-4 rounded-lg shadow-lg sticky top-6 h-fit">
          <h1 className="text-2xl font-bold mb-4 text-center">
            🛒 Cart Summary
          </h1>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <h2 className="text-lg font-semibold">Cart Items:</h2>
              <ul>
                {cart.map((item) => (
                  <li
                    key={item.id}
                    className="flex justify-between items-center mb-2"
                  >
                    <span>
                      {item.name} - {item.quantity} qty - $
                      {item.price * item.quantity}
                    </span>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min="1"
                        defaultValue="1"
                        className="border p-1 rounded w-16 text-center"
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
                            alert(
                              "Cannot remove more than what is in the cart."
                            );
                            return;
                          }
                          removeFromCart(item.id, quantityToRemove);
                          revertProductQuantity(item.id, quantityToRemove);
                        }}
                        className="bg-red-500 text-white shadow-lg py-1 px-3 rounded"
                      >
                        Remove
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="text-lg font-bold mt-4 text-center">
              Total: ${calculateTotal().toFixed(2)}
            </div>

            <div className="mb-4 mt-4">
              <h2 className="text-lg font-semibold">Payment Method:</h2>
              <div className="flex gap-4">
                <label>
                  <input
                    type="radio"
                    name="paymentType"
                    value="cash"
                    checked={paymentType === "cash"}
                    onChange={() => setPaymentType("cash")}
                  />
                  Cash
                </label>
                <label>
                  <input
                    type="radio"
                    name="paymentType"
                    value="card"
                    checked={paymentType === "card"}
                    onChange={() => setPaymentType("card")}
                  />
                  Card
                </label>
                <label>
                  <input
                    type="radio"
                    name="paymentType"
                    value="online"
                    checked={paymentType === "online"}
                    onChange={() => setPaymentType("online")}
                  />
                  Online
                </label>
              </div>
            </div>

            {/* 💵 แสดงเงินทอน */}
            {cash >= calculateTotal() && (
              <div className="mt-4 text-center">
                <p className="text-lg font-semibold">
                  Change: ${cash - calculateTotal()}
                </p>
              </div>
            )}

            <Button
              type="submit"
              color="primary"
              className="w-full mt-6 py-3 h-14 text-xl"
            >
              Pay
            </Button>
          </form>

          {/* ✅ แจ้งเตือนสำเร็จหรือผิดพลาด */}
          {message && (
            <div
              className={`mt-4 p-4 rounded-lg text-center ${
                message.includes("สำเร็จ")
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {message}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
