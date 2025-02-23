"use client";

import { useCart } from "@/app/user/components/CartContext";
import { Navbar, NavbarBrand, NavbarContent, Input, Button, Image } from "@heroui/react";


export default function CartPage() {
  const { cart, removeFromCart, clearCart } = useCart();

  return (
    <div>
      <h1 className="text-3xl">🛒 Your Cart</h1>
      <div className="m-4 p-4 sm:p-6 bg-white text-black rounded-lg">
        <span className="text-xl font-semibold">Oder {1}</span>
        <div className="flex items-center gap-5 p-5 ">
        <Image
          alt={"รูป"}
          src={"รูป"}
          width={120}
          height={120}
          className="rounded-lg object-cover mb-3 mx-auto w-full sm:w-40 sm:h-40"
        />

        <div className="w-full flex justify-between">
                      <div className="">item.name - item.quantity ไม้</div>
                      <div className="text-xl font-bold">item.price * item.quantity $</div>
        </div>
        </div>

        <div className="flex justify-end text-xl font-bold p-5">Total 0000 $</div>
        <div className="flex justify-end"><Button className="bg-green-500 text-white px-4 ">confirm</Button></div>
        
      </div>
    </div>
  );
}
