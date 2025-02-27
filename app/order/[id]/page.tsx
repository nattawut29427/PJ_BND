"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { redirect, useParams } from "next/navigation";
import { pusherClient } from "@/lib/pusher-client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "@heroui/button";
import {
  faBox,
  faTruck,
  faCheckCircle,
  faClock,
  faUtensilSpoon,
} from "@fortawesome/free-solid-svg-icons";

interface OrderItems {
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
interface Order {
  id: number;
  totalPrice: number;
  status: string;
  orderItems: OrderItems[];
  date: Date;
}

// interface OrderStatusProps {
//   order: Order;
//   onCancel: (orderId: number) => void;
// }

export default function OrderPage() {
  const params = useParams();
  const id = params.id as string;
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchOrder = async () => {
      try {
        const res = await fetch(`/api/order/${id}`);
       
        if (res.ok) {
          const data = await res.json();
          
          setOrder(data);
        }
      } catch (error) {
      
        console.error("Error fetching order:", error);
     
      }
    };

    fetchOrder();

    // Subscribe
    const channel = pusherClient.subscribe(`order-${id}`);
    
    channel.bind("status-updated", (updatedOrder: Order) => {
      setOrder(updatedOrder);
      console.log(updatedOrder) // อัปเดต State ทันที
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, [id]);

  if (!order)
    return <p className="text-center text-gray-500 mt-10">Loading...</p>;

  return <OrderStatusComponent order={order} />;
}

const OrderStatusComponent: React.FC<{ order: Order }> = ({ order }) => {
  const router = useRouter();
  const statuses = [
    { name: "pending", icon: faClock },
    { name: "cooking", icon: faUtensilSpoon },
    { name: "completed", icon: faCheckCircle },
  ];
  const handleCancledOrder = async (orderId: number) => {
    try {
      const res = await fetch("/api/order/cancled", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId }),
      });

      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

      alert("ยกเลิกรายการเเล้วครับ");
      router.push("/testui");
   
    } catch (error) {
     
      // console.error("เกิดข้อผิดพลาด:", error);
      alert("พนักงานได้รับออเดอร์เเล้ว จึงไม่สามาถรยกเลิกได้");
      window.location.reload();
    }
  };

  const handleBackToTestUI = () => {
    router.push("/testui");
  };

  const getStatusIndex = (status: string) =>
    statuses.findIndex((s) => s.name === status);

  return (
    <div className="w-full max-w-7xl mx-auto bg-white shadow-lg rounded-b-2xl overflow-hidden mt-0 sm:mt-10 mt-20">
    <div className="p-6 sm:p-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">Order #{order.id}</h2>
      </div>
      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-1/3">
          <div className="relative">
            {statuses.map((status, index) => {
              const isCompleted = getStatusIndex(order.status) >= index;
              const isCurrent = order.status === status.name;

              return (
                <div key={status.name} className="mb-8 flex">
                  <div className="flex flex-col items-center mr-4">
                    <div
                      className={`rounded-full h-12 w-12 flex items-center justify-center ${
                        isCompleted ? "bg-green-500" : "bg-gray-200"
                      } ${isCurrent ? "ring-4 ring-green-200" : ""}`}
                    >
                      <FontAwesomeIcon
                        icon={status.icon}
                        className={`${isCompleted ? "text-white" : "text-gray-500"}`}
                      />
                    </div>
                    {index < statuses.length - 1 && (
                      
                      <div
                        className={`w-0.5 h-6 ${isCompleted ? "bg-green-500" : "bg-gray-200"}`}
                      >

                      </div>
                    )}
                  </div>
                  <div
                    className={`${isCurrent ? "text-green-600 font-semibold" : "text-gray-600"}`}
                  >
                    <span className="text-lg flex">{status.name}</span>
                    {isCurrent && <span className="text-sm">Current Status</span>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="w-full md:w-2/3">
          <div className="space-y-4">
            {order.orderItems?.length ? (
              order.orderItems.map((item, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center p-4 bg-gray-50 rounded-lg"
                >
                  <div>
                    <p className="font-semibold text-gray-800">{item.skewer.name}</p>
                    <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                  </div>
                  <p className="font-bold text-green-600">${item.price.toFixed(2)}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No items in this order</p>
            )}
          </div>
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex justify-between items-center font-bold text-lg">
              <p className="text-gray-800">Total</p>
              <p className="text-green-600">${order.totalPrice.toFixed(2)}</p>
            </div>
          </div>
          <div className="justify-end flex pt-10">
            {order.status === "completed" ? (
              <Button color="success" className="text-white" onPress={handleBackToTestUI}>
                Completed
              </Button>
            ) : (
              <Button color="danger" onPress={() => handleCancledOrder(order.id)}>
                Cancel Order
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  </div>
);
};