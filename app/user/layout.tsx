"use client";

import { ReactElement } from "react";
import { SessionProvider } from "next-auth/react";

export default function Layout({ children }: { children: ReactElement }) {
  return (
    <>
      <SessionProvider>
        <main className="flex flex-col items-center h-full  justify-center">
          <div className="bg-white inline-block w-screen h-full">{children}</div>
        </main>
      </SessionProvider>
    </>
  );
}
