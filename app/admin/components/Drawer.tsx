import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation"; // ใช้เช็ค path ปัจจุบัน
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  Button,
} from "@heroui/react";
import { useSession, signOut } from "next-auth/react";

export default function App() {
  const [isOpen, setIsOpen] = useState(false);
  const { data: session } = useSession();
  const pathname = usePathname(); // ดึง path ปัจจุบัน

  const menuItems = [
    { name: "Dashboard", path: "/admin" },
    { name: "Cashier", path: "/cashier" },
    { name: "Order", path: "/cashier/reqorder" },
    { name: "User", path: "/admin/dashboard" },
    { name: "Product", path: "/admin/product" },
    { name: "RecordSale", path: "/admin/recordSale" },
    { name: "My order", path: "/myorder" },
    { name: "Settings", path: "/admin/settings" },
  ];

  const filteredMenuItemsCh =
    session?.user?.role === "cashier"
      ? menuItems.filter(
          (item) =>
            item.name === "Order" ||
            item.name === "Settings" ||
            item.name === "Cashier"
        )
      : menuItems.filter(
          (item) => item.name === "Settings" || item.name === "My order"
        );

  const filteredMenuItems =
    session?.user?.role === "admin" ? menuItems : filteredMenuItemsCh;

  const panelTitle = pathname.startsWith("/admin")
    ? "Admin Panel"
    : "Cashier Panel";

  return (
    <>
      <Button
        variant="flat"
        className="font-semibold text-black bg-teal-50 "
        onPress={() => setIsOpen(true)}
      >
        Open Menu
      </Button>
      <Drawer
        isOpen={isOpen}
        placement="left"
        size="xs"
        backdrop="blur"
        onOpenChange={setIsOpen}
      >
        <DrawerContent className="p-4 bg-gray-100 shadow-lg h-screen">
          <DrawerHeader className="text-xl font-bold text-gray-700">
            {panelTitle}
          </DrawerHeader>

          {/* ข้อมูลผู้ใช้ */}
          <div className="flex flex-col items-center gap-2 p-4 border-b">
            <img
              src={session?.user?.image || "/default-profile.jpg"}
              alt="Profile"
              className="w-16 h-16 rounded-full border"
            />
            <h2 className="text-lg font-semibold text-gray-800">
              {session?.user?.name}
            </h2>
            <p className="text-sm text-gray-500">{session?.user?.email}</p>
            <p className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
              {session?.user?.role}
            </p>
          </div>

          {/* รายการเมนู */}
          <DrawerBody className="flex flex-col gap-4 mt-4 overflow-y-auto">
            {filteredMenuItems.map((item) => (
              <Link key={item.path} href={item.path} passHref>
                <Button className="w-full text-start border hover:bg-blue-500 hover:text-white">
                  {item.name}
                </Button>
              </Link>
            ))}
          </DrawerBody>
          <div className="sticky bottom-0 bg-gray-100 pt-4">
            <Button
              onPress={() => signOut({ callbackUrl: "/" })}
              className="w-full  bg-red-500 text-white hover:bg-red-600"
            >
              Sign Out
            </Button>
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
}
