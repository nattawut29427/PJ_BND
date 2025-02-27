'use client';

import React, { useEffect,useState } from "react";
import { pusherClient } from "@/lib/pusher-client";

interface Order {
  id: number;
  totalPrice: number;
  status: string;
}

export default function CashierOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const channel = pusherClient.subscribe("orders");

    // เมื่อมีออเดอร์ใหม่เข้ามา
    channel.bind("new-order", (newOrder: Order) => {
      console.log("New order received:", newOrder);
      setOrders((prevOrders) => [...prevOrders, newOrder]);
    });

    // เมื่อสถานะออเดอร์ถูกอัปเดต
    channel.bind("status-updated", (updatedOrder: Order) => {
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === updatedOrder.id ? updatedOrder : order
        )
      );
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, []);

  const handleAcceptOrder = async (orderId: number) => {
    try {
      const res = await fetch("/api/order/accept", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId }),
      });
      const data = await res.json();

      if (res.ok) {
        console.log("Order status updated:", data);
      } else {
        console.error("Error accepting order:", data.error);
      }
    } catch (error) {
      console.error("Error processing accept order:", error);
    }
  };

  return (
    <div className="p-6 bg-white w-screen h-screen">
      <h1 className="text-2xl font-bold mb-4 text-black">รายการออเดอร์ (Cashier)</h1>
      {orders.length === 0 ? (
        <p className="text-black">ยังไม่มีออเดอร์ใหม่</p>
      ) : (
        <ul>
          {orders.map((order) => (
            <li key={order.id} className="mb-2 border-3 border-zinc-300 p-4 rounded">
              <p className="text-black">Order ID : {order.id}</p>
              <p className="text-black">Total Price : ${order.totalPrice}</p>
              <p className="text-green-500">Status : {order.status}</p>
              {order.status !== "completed" && (
                <button
                  onClick={() => handleAcceptOrder(order.id)}
                  className="mt-2 px-4 py-2 bg-green-500 text-white rounded"
                >
                  รับออเดอร์
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
