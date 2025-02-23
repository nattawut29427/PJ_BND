"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { pusherClient } from "@/lib/pusher-client";

interface Order {
  id: number;
  totalPrice: number;
  status: string;
}

export default function OrderPage() {
  const params = useParams();
  const id = params.id as string;
  const [order, setOrder] = useState<Order | null>(null);
  const [navigated, setNavigated] = useState(false); // เพิ่มสถานะเพื่อตรวจสอบว่าเปลี่ยนหน้าแล้ว
  const router = useRouter();

  const fetchOrder = async () => {
    const res = await fetch(`/api/order/${id}`);
    if (res.ok) {
      const data = await res.json();
      setOrder(data);
    }
  };

  useEffect(() => {
    if (!id) return;

    // ดึงข้อมูลออเดอร์
    fetchOrder();

    const channel = pusherClient.subscribe(`orders-${id}`);
    console.log("Subscribed to channel:", `orders-${id}`);

    // อัปเดตข้อมูลสถานะใน realtime เมื่อมีการเปลี่ยนแปลง
    channel.bind("status-updated", (data: { orderId: number; status: string }) => {
      console.log("Received status update:", data);
      if (data.orderId === Number(id)) {
        // รีเฟรชข้อมูลออเดอร์ทุกครั้งที่สถานะเปลี่ยน
        fetchOrder();
      }
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, [id]);

  useEffect(() => {
   
  }, [order,router]);

  if (!order) return <p>Loading...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Order #{order.id}</h1>
      <p className="text-green-500">Status: {order?.status}</p>
      <p className="text-gray-600">Total Price: ${order.totalPrice}</p>

      {/* ถ้าสถานะเป็น completed, ให้แสดงปุ่มเพื่อไปหน้า testui */}
       
        <button
          onClick={() => {
            setNavigated(true); // ตั้งสถานะว่าได้เปลี่ยนหน้าแล้ว
            router.push("/testui"); // เปลี่ยนหน้าไปยัง testui
          }}
          className="mt-4 bg-blue-500 text-white py-2 px-4 rounded"
        >
          Go to Test UI
        </button>
    </div>
  );
}
