"use client";
import Drawer from "@/app/admin/components/Drawer";

import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  Input,
  Button,
  Image,
  Spinner
} from "@heroui/react";

import React, { useState, useRef } from "react";
import { useCart } from "@/app/cashier/actionCh/useCart";
import { useProducts } from "@/app/cashier/actionCh/useProducts";
import { useRouter } from "next/navigation";


export const SearchIcon = ({ size = 24, strokeWidth = 1.5, ...props }) => (
  <svg
    aria-hidden="true"
    fill="none"
    focusable="false"
    height={size}
    viewBox="0 0 24 24"
    width={size}
    {...props}
  >
    {" "}
    <path
      d="M11.5 21C16.7467 21 21 16.7467 21 11.5C21 6.25329 16.7467 2 11.5 2C6.25329 2 2 6.25329 2 11.5C2 16.7467 6.25329 21 11.5 21Z"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={strokeWidth}
    />{" "}
    <path
      d="M22 22L20 20"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={strokeWidth}
    />{" "}
  </svg>
);
export default function App() {
  const { cart, addToCart, removeFromCart, calculateTotal, clearCart } =
    useCart();
  const { products, loading, updateProductQuantity, revertProductQuantity } =
    useProducts();

  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const quantityRefs = useRef<{ [key: number]: HTMLInputElement | any }>({});
  const [cash, setCash] = useState<number>(0);
  const [message, setMessage] = useState<string>("");
  const cashInputRef = useRef<HTMLInputElement | null>(null);
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
     
      return [
        ...prev,
        { id: item.id, name: item.name, quantity, price: item.price },
      ];
    });

    setShowPopup(true);
  };

  if (loading) {
    return (
      
      <Spinner
        className="flex justify-center items-center m-auto w-1/2 h-1/2 "
        size="lg"
        color="danger"
        labelColor="danger"
       
      />
    );
  }

  return (
    <>
      {/* Navbar */}
      <Navbar className="bg-red-600 w-full">
        <NavbarContent justify="start">
          <NavbarBrand className="mr-4">
            <Drawer />
          </NavbarBrand>
        </NavbarContent>

        <NavbarContent
          as="div"
          className="flex items-center justify-between sm:justify-start md:justify-end "
        >
          <Input
            className="w-full max-w-full  sm:max-w-[20rem] md:max-w-[24rem] lg:max-w-[28rem] h-10 text-lg bg-transparent"
            placeholder="ค้นหา..."
            size="md"
            startContent={<SearchIcon size={18} />}
            type="search"
            
            value={searchTerm} // เพิ่ม value
            onChange={(e) => setSearchTerm(e.target.value)} // เพิ่ม onChange
          />
        </NavbarContent>
      </Navbar>

      {/* Categories */}
      <div className="p-4 sm:p-6 flex flex-wrap gap-2 justify-center">
        <Button
          className="px-4 py-2 text-sm sm:text-base bg-red-600"
          onPress={() => setSelectedCategory(null)}
        >
          All Product
        </Button>
        {categories.map((category) => (
          <Button
            key={category.id}
            onPress={() => setSelectedCategory(category.id)}
            className={`px-4 py-2 text-sm sm:text-base ${
              selectedCategory === category.id
                ? "bg-orange-600 text-white"
                : "bg-zinc-800 text-white"
            }`}
          >
            {category.name}
          </Button>
        ))}
      </div>

      {/* Products */}
      <div className="flex-1 px-2  sm:px-6">
        <div className="grid grid-cols-2 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 px-5">
          {products
            .filter(
              (item) =>
                selectedCategory === null ||
                item.categoryId === selectedCategory
            )
            .filter(
              (item) =>
                item.name.toLowerCase().includes(searchTerm.toLowerCase()) // เพิ่ม filter search
            )
            .map((item) => (
              <div
                key={item.id} //เพิ่ม key
                className="p-4 border rounded-lg shadow-lg flex flex-col items-center w-full"
              >
                <Image
                  alt={item.name}
                  src={item.images}
                  width={120}
                  height={120}
                  className="rounded-lg object-cover mb-3 mx-auto w-full sm:w-40 sm:h-40"
                />
                <h2 className="text-base sm:text-lg font-medium text-black">
                  {item.name}
                </h2>
                <div className="text-start">
                  <p className="text-gray-600 text-sm sm:text-base">
                    Price: ${item.price.toFixed(2)}
                  </p>
                  <p className="text-gray-500 text-sm sm:text-base">
                    Stock: {item.quantity}
                  </p>
                </div>
                <div className="flex flex-col justify-center sm:flex-row items-center gap-2 mt-4 w-full">
                  <input
                    type="number"
                    min="1"
                    defaultValue="1"
                    className="p-2 rounded-xl w-full sm:w-14 h-10 text-center"

                    ref={(el) => (quantityRefs.current[item.id] = el)}
                    max={item.quantity}
                    style={{
                      backgroundColor: "white",
                      border: "2px solid gray",
                      color: "black",
                    }}
                  />

                  <Button
                    onPress={() => handleAddToCart(item)}
                    className={`w-full sm:w-auto px-4 py-2 text-sm sm:text-base ${
                      item.quantity === 0
                        ? "bg-gray-400"
                        : "bg-gradient-to-tr from-pink-500 to-yellow-500"
                    }`}
                    disabled={item.quantity === 0}
                  >
                    Add
                  </Button>
                </div>
              </div>
            ))}

          {products
            .filter(
              (item) =>
                selectedCategory === null ||
                item.categoryId === selectedCategory
            )
            .filter((item) =>
              item.name.toLowerCase().includes(searchTerm.toLowerCase())
            ).length === 0 && (
            <div className="text-center col-span-full">
              <p className="text-gray-500">ไม่มีสินค้า</p>
            </div>
          )}
        </div>
      </div>

      {/* Popup แสดงรายการสินค้า */}
      {showPopup && (
        <div className="fixed bottom-5 right-5 w-11/12 sm:w-80 bg-gray-200 border rounded-lg shadow-lg p-4 z-50 max-h-96 overflow-y-auto">
          <div className="flex justify-between items-center border-b pb-2 mb-3 mt-1">
            <h1 className="text-2xl text-gray-800 font-bold text-center w-full">
              🛒 Cart Summary
            </h1>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-gray-800">
                Cart Items:
              </h2>
              <ul>
                {cart.length === 0
                  ? (setShowPopup(false), null)
                  : cart.map((item) => (
                      <li
                        key={item.id}
                        className="flex justify-between items-center mb-2 text-gray-800"
                      >
                        <span>
                          {item.name} {item.quantity} ไม้ <br />
                          {item.price * item.quantity} บาท
                        </span>
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            min="1"
                            defaultValue="1"
                            className="p-2 rounded-xl w-full sm:w-14 h-10 text-center"
                            id={`remove-quantity-${item.id}`}
                            style={{
                              backgroundColor: "white",
                              border: "2px solid gray",
                              color: "black",
                            }}
                          />
                          <Button
                            onPress={() => {
                              const quantityToRemove = parseInt(
                                (
                                  document.getElementById(
                                    `remove-quantity-${item.id}`
                                  ) as HTMLInputElement
                                )?.value || "1"
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
                            className="bg-red-500 text-white shadow-lg py-1 px-3 rounded-xl"
                          >
                            Remove
                          </Button>
                        </div>
                      </li>
                    ))}
              </ul>
            </div>
            <div className="text-lg font-bold mt-4 text-center text-gray-800">
              Total: ${calculateTotal().toFixed(2)}
            </div>
            <div className="mt-4 text-center text-gray-800">
              <div className="mb-4 mt-4">
                <h2 className="text-lg font-semibold">Payment Method:</h2>
                <div className="grid grid-cols-3 gap-x-1 mt-2 font-medium">
                  <label>
                    <input
                      type="radio"
                      name="paymentType"
                      value="cash"
                      className="mr-1"
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
                      className="mr-1"
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
                      className="mr-1"
                      checked={paymentType === "online"}
                      onChange={() => setPaymentType("online")}
                    />
                    Online
                  </label>
                </div>
              </div>
            </div>

            {/* 💵 Display change */}
            {cash >= calculateTotal() && (
              <div className=" text-center">
                <p className="text-lg font-semibold">
                  Change: ${cash - calculateTotal()}
                </p>
              </div>
            )}

            <Button
              className="w-full mt-2 h-14 text-xl text-white"
              type="submit"
              color="success"
            >
              Pay
            </Button>
          </form>

          {/* ✅ Success or error message */}
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
      )}
    </>
  );
}
