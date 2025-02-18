"use client";
import Drawer from "@/app/user/components/Drawer";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  Input,
  Avatar,
} from "@heroui/react";
import { Button, Image, Spinner } from "@heroui/react";
import React, { useState, useRef } from "react";
import { useCart } from "@/app/cashier/actionCh/useCart";
import { useProducts } from "@/app/cashier/actionCh/useProducts"



export const SearchIcon = ({
  size = 24,
  strokeWidth = 1.5,
  width,
  height,
  ...props
}) => {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      focusable="false"
      height={height || size}
      role="presentation"
      viewBox="0 0 24 24"
      width={width || size}
      {...props}
    >
      <path
        d="M11.5 21C16.7467 21 21 16.7467 21 11.5C21 6.25329 16.7467 2 11.5 2C6.25329 2 2 6.25329 2 11.5C2 16.7467 6.25329 21 11.5 21Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={strokeWidth}
      />
      <path
        d="M22 22L20 20"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={strokeWidth}
      />
    </svg>
  );
};



export default function App() {

  const { cart, addToCart, removeFromCart, calculateTotal, clearCart } =
      useCart();
    const { products, loading, updateProductQuantity, revertProductQuantity } =
      useProducts();
  
    const [cash, setCash] = useState<number>(0);
    const [message, setMessage] = useState<string>("");
    const cashInputRef = useRef<HTMLInputElement | null>(null);

  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);


  const categories = [
    { id: 1, name: "เนื้อหมู" },
    { id: 2, name: "เนื้อวัว" },
    { id: 3, name: "ผัก" },
    { id: 4, name: "เครื่องดื่ม" },
    { id: 5, name: "อื่น" },
  ];
  return (
    <>
      {" "}
      <Navbar>
        <NavbarContent justify="start">
          <NavbarBrand className="mr-4">
            <Drawer />
          </NavbarBrand>
        </NavbarContent>

        <NavbarContent
          as="div"
          className="flex items-center justify-between sm:justify-start md:justify-end"
        >
          <Input
            className="w-full max-w-full sm:max-w-[20rem] md:max-w-[24rem] lg:max-w-[28rem] h-10"
            classNames={{
              mainWrapper: "h-full",
              input: "text-small md:text-base lg:text-lg",
              inputWrapper:
                "h-full font-normal text-default-500 bg-default-400/20 dark:bg-default-500/20 " +
                "sm:bg-default-300/20 md:bg-default-200/20 lg:bg-default-100/20",
            }}
            placeholder="Type to search..."
            size="sm"
            startContent={<SearchIcon size={18} />}
            type="search"
          />
        </NavbarContent>
      </Navbar>

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
    </>
  );
}
