"use client";

import { ReactElement } from "react";
import Drawer from "@/app/admin/components/Drawer";
import { SessionProvider } from "next-auth/react";

export default function Layout({ children }: { children: ReactElement }) {
  return (
    <>
      <SessionProvider>
        <div className="absolute top-5 left-5">
          <Drawer />
        </div>
        <main className="flex flex-col items-center justify-center py-8 md:py-10">
          <div className="inline-block w-screen px-72">{children}</div>
        </main>
      </SessionProvider>
    </>
  );
}
