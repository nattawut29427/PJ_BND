"use client";
import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";


export default function Layout({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
        <main className="flex flex-col items-center h-full  justify-center">
          <div className="bg-white w-full h-full flex justify-center">{children}</div>
        </main>
    </SessionProvider>
  );
}
