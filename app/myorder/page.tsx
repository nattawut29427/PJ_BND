"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

// กำหนด interface สำหรับโครงสร้างข้อมูล
interface Skewer {
  name: string;
}

interface OrderItem {
  id: string;
  skewer?: Skewer;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  orderDate: string;
  orderItems: OrderItem[];
  totalPrice: number;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch("/api/myorder");
        const data: Order[] = await response.json();

        setOrders(data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">My Orders</h1>
      <ul>
        {orders.map((order) => (
          <li
            key={order.id}
            className="border rounded-lg p-4 my-2 shadow-sm hover:shadow-md transition-shadow border-gray-500"
          >
            <div className="flex justify-between items-start ">
              <div>
                <p className="font-semibold text-lg">Order #{order.id}</p>
                <p className="text-gray-500 text-sm">
                  Date: {new Date(order.orderDate).toLocaleString()}
                </p>
              </div>
              <Link
                href={`/order/${order.id}`}
                className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                ดูรายละเอียด
              </Link>
            </div>

            <ul className="mt-3 pl-4 border-t pt-3">
              {order.orderItems.map((item) => (
                <li
                  key={item.id}
                  className="text-white text-base flex justify-between items-center py-1"
                >
                  <span>
                    {item.skewer?.name || "Unknown Item"} ({item.quantity} pcs)
                  </span>
                  <span className="font-medium">{item.price} $</span>
                </li>
              ))}
              <div className="flex justify-between text-lg pt-4">
                <p>Total Price</p>
                <p>{order.totalPrice} บาท</p>
              </div>
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
}
