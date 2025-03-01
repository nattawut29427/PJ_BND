"use client";

import { Spinner } from "@heroui/react";
import { useEffect, useState, useCallback } from "react";

import { pusherClient } from "@/lib/pusher-client";

interface Order {
  id: number;
  totalPrice: number;
  status: "pending" | "cooking" | "completed" | "canceled";
  orderItems?: OrderItem[];
}

interface OrderItem {
  id: number;
  quantity: number;
  price: number;
  skewer: {
    id: number;
    name: string;
    price: number;
    quantity: number;
  };
}

export default function CashierOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ดึงข้อมูลออเดอร์ครั้งแรก
  const fetchOrders = useCallback(async () => {
    try {
      const res = await fetch(`/api/Findorder/accept?timestamp=${Date.now()}`);

      if (!res.ok) throw new Error(`HTTP error! ${res.status}`);

      const data = await res.json();

      setOrders(data.orders.filter((o: Order) => o.status !== "completed"));

      setError("");
    } catch (error) {
      setError("ไม่สามารถดึงข้อมูลออเดอร์ได้");

      return error;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();

    // เชื่อมต่อ Pusher
    const ordersChannel = pusherClient.subscribe("orders");
    const channel = pusherClient.subscribe("orders");

    channel.bind("new-order", (newOrder: Order) => {
      setOrders((prev) => [...prev, newOrder]);
    });

    // // จัดการออเดอร์ใหม่
    // const handleNewOrder = (newOrder: Order) => {
    //   if (newOrder.status !== "completed") {
    //     setOrders((prev) => [...prev, newOrder]);
    //   }
    // };

    // จัดการอัปเดตสถานะ
    const handleStatusUpdate = (updatedOrder: Order) => {
      setOrders((prev) => {
        // ถ้าสถานะเป็น completed ให้ลบออก
        if (updatedOrder.status === "completed") {
          return prev.filter((order) => order.id !== updatedOrder.id);
        }

        // อัปเดตข้อมูลเดิม
        return prev.map((order) =>
          order.id === updatedOrder.id ? updatedOrder : order
        );
      });
    };

    // ordersChannel.bind("new-order", handleNewOrder);
    ordersChannel.bind("status-updated", handleStatusUpdate);

    return () => {
      ordersChannel.unbind_all();
      ordersChannel.unsubscribe();
    };
  }, [fetchOrders]);

  // ฟังก์ชันรับออเดอร์
  const handleAcceptOrder = async (order: Order) => {
    try {
      const newStatus = order.status === "pending" ? "cooking" : "completed";

      // Optimistic Update
      setOrders((prev) =>
        prev.map((o) => (o.id === order.id ? { ...o, status: newStatus } : o))
      );

      // ส่ง request อัปเดต
      const res = await fetch("/api/Findorder/accept", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: order.id }),
      });

      if (!res.ok) throw new Error(`HTTP error! ${res.status}`);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("อัปเดตสถานะล้มเหลว:", error);
      alert("เกิดข้อผิดพลาดในการอัปเดตสถานะ");
      // Rollback หากเกิดข้อผิดพลาด
      setOrders((prev) =>
        prev.map((o) =>
          o.id === order.id ? { ...o, status: order.status } : o
        )
      );
    }
  };

  // ฟังก์ชันลบออเดอร์
  const handleDeleteOrder = (orderId: number) => {
    setOrders((prev) => prev.filter((order) => order.id !== orderId));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner color="primary" size="lg" />
      </div>
    );
  }

  if (error) {
    return <div className="p-6 text-red-500">{error}</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 ml-40">รายการออเดอร์</h1>
      {orders.length === 0 ? (
        <p className="mt-10 ml-40">ยังไม่มีออเดอร์ใหม่</p>
      ) : (
        <ul className="space-y-4">
          {orders.map((order) => (
            <li
              key={order.id}
              className="border border-gray-400 p-4 rounded-lg"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-bold">ออเดอร์ #{order.id}</p>
                  <p className="text-gray-600">รวม: ${order.totalPrice}</p>
                  <div className="mt-2">
                    <p className="font-semibold">สินค้า:</p>
                    <ul className="list-disc pl-6">
                      {order.orderItems?.map((item) => (
                        <li key={item.id}>
                          {/* ใช้ชื่อจากข้อมูลออเดอร์โดยตรง */}
                          {item.skewer?.name || "ไม่มีชื่อสินค้า"}{" "}
                          {item.quantity} ไม้
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span
                    className={`px-2 py-1 rounded ${
                      order.status === "canceled"
                        ? "bg-red-100 text-red-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {order.status}
                  </span>
                  {order.status !== "canceled" && (
                    <button
                      className="px-3 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700"
                      onClick={() => handleAcceptOrder(order)}
                    >
                      {order.status === "pending" ? "เริ่มทำ" : "เสร็จสิ้น"}
                    </button>
                  )}
                  {order.status === "canceled" && (
                    <button
                      className="px-3 py-1.5 bg-red-600 text-white rounded hover:bg-red-700"
                      onClick={() => handleDeleteOrder(order.id)}
                    >
                      ลบ
                    </button>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
