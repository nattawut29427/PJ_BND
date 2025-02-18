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
    { name: "Product", path: "" },
    { name: "Cart", path: "" },
    { name: "Settings", path: "" },
  ];

  // ถ้า role เป็น admin ให้แสดงทั้งหมด ถ้าไม่ใช่ให้กรอง
  const filteredMenuItems =
    session?.user?.role === "admin"
      ? menuItems
      : menuItems.filter((item) => item.name === "Settings");

  // ตรวจสอบว่าอยู่ใน /admin หรือไม่
  const panelTitle = pathname.startsWith("/admin") ? "Admin Panel" : "Cashier Panel";

  return (
    <>
      <Button variant="flat" color="primary" onPress={() => setIsOpen(true)}>
        Open Menu
      </Button>
      <Drawer
        isOpen={isOpen}
        placement="left"
        size="xs"
        backdrop="blur"
        onOpenChange={setIsOpen}
      >
        <DrawerContent className="p-4 bg-gray-100 shadow-lg">
          <DrawerHeader className="text-xl font-bold text-gray-700">
            {panelTitle}
          </DrawerHeader>

          {/* ข้อมูลผู้ใช้ */}
          <div className="flex flex-col items-center gap-2 p-4 border-b">
            <img
              src={session?.user?.image || "/default-profile.jpg"}
              alt="Profile"
              className="w-20 h-20 rounded-full border"
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
          <DrawerBody className="flex flex-col gap-4 mt-4">
            {filteredMenuItems.map((item) => (
              <Link key={item.path} href={item.path} passHref>
                <Button className="w-full text-start border hover:bg-blue-500 hover:text-white">
                  {item.name}
                </Button>
              </Link>
            ))}

            {/* ปุ่ม Sign Out */}
            <Button
              onPress={() => signOut({ callbackUrl: "/" })}
              className="w-full bg-red-500 text-white hover:bg-red-600"
            >
              Sign Out
            </Button>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}
