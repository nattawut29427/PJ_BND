"use client";

import { useEffect, useState } from "react";

type Skewer = {
  id: number;
  name: string;
  price: number;
  spicyLevel: string;
  images: string | null;
  categoryId: number;
  quantity: number;
};

const SkewerList = () => {
  const [skewers, setSkewers] = useState<Skewer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // ดึงข้อมูล skewers จาก API ที่สร้างไว้
    const fetchSkewers = async () => {
      try {
        const response = await fetch("/api/productService"); // ปรับ URL ตาม API ที่คุณตั้งไว้
        if (response.ok) {
          const data = await response.json();
          setSkewers(data); // ตั้งค่า skewers ที่ดึงมา
        } else {
          console.error("Failed to fetch skewers");
        }
      } catch (error) {
        console.error("Error fetching skewers:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSkewers();
  }, []); // useEffect จะทำงานเมื่อ component ถูก mount เท่านั้น

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Skewers List</h1>
      <table>
        <thead>
          <tr>
            
            <th >Name</th>
            <th>Price</th>
            <th>Spicy Level</th>
            <th>Image</th>
            <th>Category ID</th>
            <th>Quantity</th>

          </tr>
        </thead>
        <tbody className="text-center">
          {skewers.map((skewer) => (
            <tr key={skewer.id}>
              <td>{skewer.name}</td>
              <td>{skewer.price}</td>
              <td>{skewer.spicyLevel}</td>
              <td>
                {skewer.images ? (
                  <img src={skewer.images} alt={skewer.name} width={100} />
                ) : (
                  <span>No image</span>
                )}
              </td>
              <td>{skewer.categoryId}</td>
              <td>{skewer.quantity}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SkewerList;
