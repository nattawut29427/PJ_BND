"use client";

import { ReactElement } from "react";
import { SessionProvider } from "next-auth/react";
import { CartProvider } from "./components/CartContext";

export default function Layout({ children }: { children: ReactElement }) {
  return (
    <>
      <SessionProvider>
        <CartProvider>
        <main className="flex flex-col items-center justify-center py-8 md:py-10">
          <div className="inline-block w-screen px-4 md:px-16 lg:px-32 xl:px-72">{children}</div>
        </main>
        </CartProvider>
      </SessionProvider>
    </>
  );
}
