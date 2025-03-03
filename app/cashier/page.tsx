"use client";

import React, { useState, useRef } from "react";
import { Button, Image, Spinner } from "@heroui/react";

import { useProducts } from "./actionCh/useProducts";

import { useCart } from "@/app/cashier/actionCh/useCart";
import Drawer from "@/app/admin/components/Drawer";

export default function Page() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { cart, addToCart, removeFromCart, calculateTotal, clearCart } =
    useCart();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { products, loading, updateProductQuantity, revertProductQuantity } =
    useProducts();

  const [cash, setCash] = useState<number>(0);
  const [message, setMessage] = useState<string>("");
  const cashInputRef = useRef<HTMLInputElement | null>(null);

  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [paymentType, setPaymentType] = useState<"cash" | "card" | "online">(
    "cash"
  );

  const categories = [
    { id: 1, name: "เนื้อหมู" },
    { id: 2, name: "เนื้อวัว" },
    { id: 3, name: "ผัก" },
    { id: 4, name: "เครื่องดื่ม" },
    { id: 5, name: "อื่น" },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) {
      setMessage("กรุณาเพิ่มสินค้าในตะกร้าก่อนชำระเงิน");

      return;
    }

    const totalPrice = calculateTotal();

    try {
      // ส่งข้อมูลเพื่อทำรายการสินค้า
      const response = await fetch("/api/order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },

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

      if (!response.ok) {
        throw new Error("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
      }

      // เคลียร์ cart หลังจากการชำระเงินสำเร็จ
      clearCart();

      setCash(0);
      setMessage("ชำระเงินสำเร็จ!");
    } catch (error) {
      setMessage(error + message);
    }
  };

  if (loading) {
    return (
      <Spinner
        className="flex justify-center items-center m-auto w-1/2 h-1/2"
        color="primary"
        labelColor="primary"
        size="lg"
      />
    );
  }

  return (
    <>
      <div className="absolute top-5 left-5">
        <Drawer />
      </div>
      <div className="">
        <div className="p-6 gap-4 flex flex-wrap">
          <Button
            className="bg-red-500"
            onPress={() => setSelectedCategory(null)}
          >
            All Product
          </Button>
          {categories.map((category) => (
            <Button
              key={category.id}
              className={
                selectedCategory === category.id
                  ? "bg-amber-600 text-white"
                  : "bg-gray-600"
              }
              onPress={() => setSelectedCategory(category.id)}
            >
              {category.name}
            </Button>
          ))}
        </div>

        <div className="p-6 h-fit flex flex-col lg:flex-row gap-6">
          {/* สินค้า */}
          <div className="flex flex-wrap">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
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
                      className="rounded-lg object-cover mb-4 mx-auto"
                      height={150}
                      src={item.images}
                      width={150}
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
                    <div className="flex flex-row items-center gap-2 mt-4">
                      <input
                        className="p-2 rounded-xl w-full sm:w-14 h-10 text-center"
                        defaultValue="1"
                        id={`quantity-${index}`}
                        max={item.quantity}
                        min="1"
                        style={{
                          backgroundColor: "white",
                          border: "2px solid gray",
                          color: "black",
                        }}
                        type="number"
                      />
                      <Button
                        className={`w-full py-2 ${
                          item.quantity === 0
                            ? "bg-gray-500"
                            : "bg-gradient-to-tr from-pink-500 to-yellow-500"
                        }`}
                        disabled={item.quantity === 0}
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
                          removeFromCart(item.id, item.name, item.price, quantity);
                          updateProductQuantity(item.id, quantity);
                        }}
                      >
                        Add
                      </Button>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Cart Summary ฝั่งขวา */}
          <div className="ml-3 w-full mx-3 md:w-[250px] lg:w-[350px] rounded-lg shadow-lg sticky top-6 h-fit bg-gray-200 text-gray-800">
            <h1 className="text-2xl font-bold mb-3 mt-3 text-center">
              🛒 Cart Summary
            </h1>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <h2 className="text-lg font-semibold ml-3">Cart Items:</h2>
                <ul>
                  {cart.map((item) => (
                    <li
                      key={item.id}
                      className="flex justify-between items-center mb-2"
                    >
                      <span>
                        <div className="ml-3">
                          {item.name} {item.quantity} 
                        </div>
                        <div className="ml-3">
                          {item.price * item.quantity} บาท
                        </div>
                      </span>
                      <div className="flex items-center gap-2 mr-3">
                        <input
                          className="p-2 rounded-xl w-full sm:w-14 h-10 text-center"
                          defaultValue="1"
                          id={`remove-quantity-${item.id}`}
                          min="1"
                          style={{
                            backgroundColor: "white",
                            border: "2px solid gray",
                            color: "black",
                          }}
                          type="number"
                        />
                        <Button
                          className="bg-red-500 text-white shadow-lg py-1 px-3 rounded-xl"
                          onPress={() => {
                            if (item.quantity === 0) return;
                            const quantity = parseInt(
                              (
                                document.getElementById(
                                  `quantity-${item.id}`
                                ) as HTMLInputElement
                              ).value
                            );

                            if (quantity > item.quantity) {
                              alert("Cannot add more than available stock.");

                              return;
                            }
                            addToCart(item.id, item.name, item.price, quantity);
                            revertProductQuantity(item.id, quantity);
                          }}
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

              {/* 💰 ช่องกรอกเงินสด */}
              <div className="mt-6 text-center">
                <div className="flex justify-between items-center mb-2">
                  <p className="text-base ml-16">Amount Paid:</p>
                  <input
                    ref={cashInputRef}
                    className="mr-20 p-2 rounded-xl w-full sm:w-20 h-10 text-center"
                    placeholder="Enter amount..."
                    style={{
                      backgroundColor: "white",
                      border: "2px solid gray",
                      color: "black",
                    }}
                    type="number"
                    value={cash}
                    onChange={(e) => setCash(parseFloat(e.target.value))}
                  />
                </div>
                <div className="pt-3 flex justify-center gap-2">
                  <Button
                    className="py-2 px-4 bg-amber-600 text-white rounded"
                    onPress={() => setCash(100)}
                  >
                    100
                  </Button>
                  <Button
                    className="py-2 px-4 bg-amber-600 text-white rounded"
                    onPress={() => setCash(500)}
                  >
                    500
                  </Button>
                  <Button
                    className="py-2 px-4 bg-amber-600 text-white rounded"
                    onPress={() => setCash(1000)}
                  >
                    1000
                  </Button>
                  <Button
                    className="py-2 px-4 bg-green-500 text-white rounded"
                    onPress={() => setCash(calculateTotal())}
                  >
                    Exact
                  </Button>
                </div>
              </div>

              {/* 💵 แสดงเงินทอน */}
              {cash >= calculateTotal() && (
                <div className="mt-8 text-center">
                  <p className="text-lg font-semibold">
                    Change: ${cash - calculateTotal()}
                  </p>
                </div>
              )}

              <div className="flex justify-center">
                {" "}
                <Button
                  className="w-3/5 mt-6 mb-3 py-3 h-14 text-xl text-white"
                  color="success"
                  type="submit"
                >
                  Pay
                </Button>
              </div>
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
      </div>
    </>
  );
}
