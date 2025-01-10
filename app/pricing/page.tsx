"use client";

import { UploadButton } from "@uploadthing/react";
import { useState } from "react";

const SkewerUpload = () => {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    spicyLevel: "medium",
    categoryId: "",
    quantity: "",
  });

  const [fileUrl, setFileUrl] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUploadComplete = (res: any) => {
    
    console.log("Upload complete response:", res);
    if (res[0]?.url) {
      setFileUrl(res[0]?.url); 
      alert("Upload complete! Please submit the form to save data.");
    } else {
      alert("Upload failed, please try again.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (fileUrl) {
     
      const metadata = {
        name: formData.name,
        price: formData.price,
        spicyLevel: formData.spicyLevel,
        categoryId: formData.categoryId,
        quantity: formData.quantity,
        fileUrl, 
      };

      try {
        const response = await fetch("/api/productService", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(metadata),
        });

        if (response.ok) {
          alert("Data saved successfully");
        } else {
          alert("Failed to save data");
        }
      } catch (error) {
        console.error("Error:", error);
        alert("Error saving data");
      }
    } 
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Skewer Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Price:</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Spicy Level:</label>
          <select
            name="spicyLevel"
            value={formData.spicyLevel}
            onChange={handleChange}
          >
            <option value="mild">Mild</option>
            <option value="medium">Medium</option>
            <option value="hot">Hot</option>
          </select>
        </div>
        <div>
          <label>Category ID:</label>
          <input
            type="number"
            name="categoryId"
            value={formData.categoryId}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Quantity:</label>
          <input
            type="number"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
          />
        </div>

        {/* UploadButton ใช้สำหรับการอัปโหลดไฟล์ */}
        <UploadButton<FileRouter>
          endpoint="skewerImageUpload"
          onClientUploadComplete={handleUploadComplete}
          metadata={{
            name: formData.name,
            price: formData.price,
            spicyLevel: formData.spicyLevel,
            categoryId: formData.categoryId,
            quantity: formData.quantity,
          }}
        />

        {/* ปุ่ม submit เพื่อส่งข้อมูลทั้งหมด */}
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default SkewerUpload;
