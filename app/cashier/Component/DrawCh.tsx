import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
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

  const menuItems = [
    { name: "Dashboard", path: "/admin" },
    { name: "Settings", path: "/admin/settings" },
  ];

  return (
    <>
      <Button 
      color="primary" 
      variant="flat" 
      onPress={() => setIsOpen(true)}>
        Open Menu
      </Button>
      <Drawer
        backdrop="blur"
        isOpen={isOpen}
        placement="left"
        size="xs"
        onOpenChange={setIsOpen}
      >
        <DrawerContent className="p-4 bg-gray-100 shadow-lg">
          <DrawerHeader className="text-xl font-bold text-gray-700">
            Cashier Panel
          </DrawerHeader>

          {/* User Info */}
          <div className="flex flex-col items-center gap-2 p-4 border-b">
            <Image
             
             alt="Profile"
             className="w-20 h-20 rounded-full border"
             src={session?.user?.image || "/default-profile.jpg"}
             
           
            />
            <h2 className="text-lg font-semibold text-gray-800">
              {session?.user?.name }
            </h2>
            <p className="text-sm text-gray-500">{session?.user?.email}</p>
            <p className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
              {session?.user?.role}
            </p>
          </div>

          {/* Menu Items */}
          <DrawerBody className="flex flex-col gap-4 mt-4">
            {menuItems.map((item) => (
              <Link 
              key={item.path} 
              passHref
              href={item.path} 
              >
                <Button
                  className="w-full text-start border hover:bg-blue-500 hover:text-white"
                >
                  {item.name}
                </Button>
              </Link>
            ))}

            {/* Sign Out Button */}
            <Button
              className="w-full bg-red-500 text-white hover:bg-red-600"
              onPress={() => signOut({ callbackUrl: "/" })}
            >
              Sign Out
            </Button>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}
