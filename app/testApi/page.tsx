"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@heroui/react";

type Skewer = {
  id: number;
  name: string;
  price: number;
};

export default function SaleForm() {
  const [skewers, setSkewers] = useState<Skewer[]>([]);
  const [selectedSkewerId, setSelectedSkewerId] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(1);
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    const fetchSkewers = async () => {
      const response = await fetch("/api/productService"); // หรือ API ที่คุณใช้เพื่อดึงข้อมูล skewers
      const data = await response.json();
      setSkewers(data);
    };

    fetchSkewers();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // ส่งข้อมูลไปยัง API ที่เราสร้างไว้
    try {
      const response = await fetch("/api/saleService", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
        //   skewerId: selectedSkewerId,
          quantity: quantity,
        }),
      });

      const data = await response.json();

      if (response.status === 201) {
        setMessage(`Sale successfully recorded!`);
      } else {
        setMessage(`Error: ${data.error}`);
      }
    } catch (error) {
      setMessage(`Error: Failed to create sale`);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Record a Sale</h1>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="skewer" className="block text-lg font-semibold">
            Select Skewer
          </label>
          <select
            id="skewer"
            value={selectedSkewerId}
            onChange={(e) => setSelectedSkewerId(parseInt(e.target.value))}
            className="border p-2 rounded w-full"
            required
          >
            <option value={0}>Select a skewer</option>
            {skewers.map((skewer) => (
              <option key={skewer.id} value={skewer.id}>
                {skewer.name}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label htmlFor="quantity" className="block text-lg font-semibold">
            Quantity
          </label>
          <input
            type="number"
            id="quantity"
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value))}
            min="1"
            className="border p-2 rounded w-full"
            required
          />
        </div>

        <Button type="submit" className="bg-blue-500 text-white p-2 rounded">
          Record Sale
        </Button>
      </form>

      {message && <p className="mt-4 text-red-500">{message}</p>}
    </div>
  );
}
