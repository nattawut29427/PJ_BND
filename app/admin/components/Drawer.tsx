import React, { useState } from "react";
import Link from "next/link";
import { Drawer, DrawerContent, DrawerHeader, DrawerBody, Button } from "@heroui/react";

export default function App() {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { name: "Dashboard", path: "/admin" },
    { name: "Users", path: "/admin/dashboard" },
    { name: "Products", path: "/admin/product" },
    { name: "Orders", path: "/admin/orders" },
    { name: "Reports", path: "/admin/reports" },
    { name: "Settings", path: "/admin/settings" },
  ];

  return (
    <>
      <Button variant="flat" color="primary" onPress={() => setIsOpen(true)}>Open Menu</Button>
      <Drawer isOpen={isOpen} placement="left" size="xs" backdrop="blur" onOpenChange={setIsOpen}>
        <DrawerContent>
          <DrawerHeader>Admin Panel</DrawerHeader>
          <DrawerBody className="flex flex-col gap-5 text-start">
            {menuItems.map((item) => (
              <Link key={item.path} href={item.path}>
                <Button className="w-full hover:bg-primary">{item.name}</Button>
              </Link>
            ))}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}
