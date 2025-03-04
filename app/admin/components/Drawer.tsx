import React, { useState } from "react";

import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  Button,
} from "@heroui/react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function App() {
  const [isOpen, setIsOpen] = useState(false);
  const { data: session } = useSession();
  const pathname = usePathname();
  const router = useRouter();

  const menuItems = [
    { name: "Dashboard", path: "/admin" },
    { name: "Cashier", path: "/cashier" },
    { name: "User Cashier", path: "/user" },
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
        className="font-semibold text-black bg-teal-50"
        variant="flat"
        onPress={() => setIsOpen(true)}
      >
        Open Menu
      </Button>
      <Drawer
        backdrop="blur"
        isOpen={isOpen}
        placement="left"
        size="xs"
        onOpenChange={setIsOpen}
      >
        <DrawerContent className="p-4 bg-gray-100 shadow-lg ">
          <DrawerHeader className="text-xl font-bold text-gray-700">
            {panelTitle}
          </DrawerHeader>

          <div className="flex flex-col items-center gap-2 p-4 border-b">
            <Image
              alt="Profile"
              className="w-16 h-16 rounded-full border"
              height={64}
              src={session?.user?.image || "/default-profile.jpg"}
              width={64}
            />
            <h2 className="text-lg font-semibold text-gray-800">
              {session?.user?.name}
            </h2>
            <p className="text-sm text-gray-500">{session?.user?.email}</p>
            <p className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
              {session?.user?.role}
            </p>
          </div>

          <DrawerBody className="flex flex-col  gap-4 mt-4 overflow-y-auto">
            {filteredMenuItems.map((item) => (
              <Button
                key={item.path}
                className="w-full text-start border hover:bg-blue-500 hover:text-white"
                onPress={() => {
                  router.push(item.path); 
                  setIsOpen(false); 
                }}
              >
                {item.name}
              </Button>
            ))}
          </DrawerBody>
          <div className="sticky bottom-0 bg-gray-100 pt-4 flex justify-center mr-5">
            <Button
              className="w-3/4 bg-red-500 text-white hover:bg-red-600"
              onPress={() => signOut({ callbackUrl: "/" })}
            >
              Sign Out
            </Button>
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
}
