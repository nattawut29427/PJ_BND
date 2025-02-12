import React, { useState } from "react";
import Link from "next/link";
import { Drawer, DrawerContent, DrawerHeader, DrawerBody, Button } from "@heroui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse, faUsers, faBook, faTableCellsLarge, faFlag, faGear } from "@fortawesome/free-solid-svg-icons";

export default function App() {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { name: "Dashboard", path: "/admin", icon: faHouse },
    { name: "Users", path: "/admin/dashboard", icon: faUsers },
    { name: "Products", path: "/admin/product", icon: faBook },
    { name: "Orders", path: "/admin/orders", icon: faTableCellsLarge },
    { name: "Reports", path: "/admin/reports", icon: faFlag },
    { name: "Settings", path: "/admin/settings", icon: faGear },
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
                <Button className="w-full h-14 bg-zinc-900 hover:bg-zinc-700 text-white text-base" radius="none">
                  {item.icon && <FontAwesomeIcon icon={item.icon} className="mr-2" />}
                  {item.name}
                </Button>
              </Link>
            ))}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}
