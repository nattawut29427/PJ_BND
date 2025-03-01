"use client";
import { ReactNode } from "react";
import { SessionProvider } from "next-auth/react";

import Drawer from "@/app/admin/components/Drawer";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <div className="absolute top-5 left-5">
        <Drawer />
      </div>
      <div className="text-black w-full">{children}</div>
    </SessionProvider>
  );
}
