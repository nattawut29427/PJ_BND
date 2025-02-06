"use client";

import {
  Button,
  useDisclosure,
} from "@heroui/react";
import { ReactElement } from "react";

export default function Sidebar() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      <div className="bg-zinc-900 w-64 h-full fixed top-16 bottom-5 left-0 z-50 ">
        <div className="border-b-1 w-full">
          <Button className="w-full h-14 bg-zinc-900 hover:bg-zinc-800 text-white text-lg" radius="none"><i className="fa-solid fa-house"></i>หน้าหลัก</Button>
        </div>
        <Button className="w-full h-14 bg-zinc-900 hover:bg-zinc-800 text-white text-base" radius="none"><i className="fa-solid fa-chart-simple"></i>Dashboard</Button>
        <Button className="w-full h-14 bg-zinc-900 hover:bg-zinc-800 text-white text-base" radius="none"><i className="fa-solid fa-users"></i>ข้อมูลบุคลากร</Button>
        <Button className="w-full h-14 bg-zinc-900 hover:bg-zinc-800 text-white text-base" radius="none"><i className="fa-solid fa-book"></i>ข้อมูลอาหาร</Button>
        <Button className="w-full h-14 bg-zinc-900 hover:bg-zinc-800 text-white text-base" radius="none"><i className="fa-solid fa-table-cells-large"></i>ข้อมูลโต๊ะ</Button>
        <Button className="w-full h-14 bg-zinc-900 hover:bg-zinc-800 text-white text-base" radius="none"><i className="fa-solid fa-pen-to-square"></i>ข้อมูลร้านค้า</Button>
        <Button className="w-full h-14 bg-zinc-900 hover:bg-zinc-800 text-white text-base" radius="none"><i className="fa-solid fa-money-bill"></i>รายการขาย</Button>
        <Button className="w-full h-14 bg-zinc-900 hover:bg-zinc-800 text-white text-base" radius="none"><i className="fa-solid fa-right-to-bracket"></i>ออกจากระบบ</Button>
      </div>
    </>
  );
}
