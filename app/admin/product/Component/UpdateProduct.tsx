"use client";

import React, { useState, useEffect } from "react";
import { Input } from "@heroui/react";
import Selected from "@/components/Selected";
import { UploadButton } from "@uploadthing/react";
import { Button, Alert } from "@heroui/react";
import { useSearchParams } from "next/navigation";

type Skewer = {
  id: number;
  name: string;
  price: number;
  categoryId: string;
  quantity: number;
};

type Props = {
  id: number; // รับค่า ID เป็น number
};

export default function UpdateProduct({ id }: Props) {
  const [formData, setFormData] = useState<Skewer>({
    id: "",
    name: "",
    price: "",
    categoryId: "",
    quantity: "",
  });

  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [alertStatus, setAlertStatus] = useState<"success" | "error" | null>(null);
  const [alertMessage, setAlertMessage] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // ตัวเลือก Roles
  const roles = [
    { key: "1", label: "เนื้อหมู" },
    { key: "2", label: "เนื้อวัว" },
    { key: "3", label: "ผัก" },
  ];

  // ดึงข้อมูลและคำนวณ ID ถัดไป
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/productService?id=${id}`);
        const data: Skewer = await response.json();
        setFormData(data);
      } catch (error) {
        console.error("Failed to fetch product:", error);
      }
    };

    if (id) fetchData();
  }, [id]);

  // ตั้งค่า ID เมื่อได้รับจากภายนอก (เช่น router query)
  useEffect(() => {
    // ตัวอย่าง: รับ ID จาก URL เช่น /edit/7
    const params = new URLSearchParams(window.location.search);
    const idFromUrl = params.get("id");
    if (idFromUrl) setSelectedId(idFromUrl);
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // เก็บข้อมูลใน localStorage (ยกเว้น ID)
  useEffect(() => {
    const savedData = localStorage.getItem("formData");
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      setFormData({ ...parsedData, id: "" }); // ล้าง ID ที่เก็บไว้
    }
  }, []);

  useEffect(() => {
    const { id, ...rest } = formData;
    localStorage.setItem("formData", JSON.stringify(rest));
  }, [formData]);



  // useEffect(() => {
  //   const fetchSkewers = async () => {
  //     try {
  //       const response = await fetch("/api/productService");
  //       const data: Skewer[] = await response.json(); // แก้ไขบรรทัดนี้
        
  //       // คำนวณ ID ถัดไป
  //       const ids = data.map((item) => item.id);
  //       const maxId = Math.max(...ids, 0);
  //       const nextId = (maxId).toString();
        
  //       setSkewer(data);
  //       setFormData(prev => ({ ...prev, id: nextId }));
  //     } catch (error) {
  //       console.error("Failed to fetch skewers:", error);
  //     }
  //   };
  
  //   fetchSkewers();
  // }, []);

  const handleUploadComplete = (res: any) => {
    console.log("Upload complete response:", res);
    if (res[0]?.url) {
      setFileUrl(res[0]?.url);
      setAlertStatus("success");
      setAlertMessage("Upload complete! Please submit the form to save data.");
    } else {
      setAlertStatus("error");
      setAlertMessage("Upload failed, please try again.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const metadata = {
      id: formData.id,
      name: formData.name || undefined,
      price: formData.price ? parseFloat(formData.price) : undefined,
      categoryId: formData.categoryId || undefined,
      quantityChange: parseInt(formData.quantity, 10),
      fileUrl: fileUrl || null,
    };

    try {
      const response = await fetch("/api/productService", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(metadata),
      });

      const result = await response.json();

      if (response.ok) {
        setAlertStatus("success");
        setAlertMessage("Data saved successfully");
        // รีเฟรชหน้าหลังจาก 2 วินาที
        setTimeout(() => window.location.reload(), 2000);
      } else {
        setAlertStatus("error");
        setAlertMessage(`Failed to save data: ${result.error || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error:", error);
      setAlertStatus("error");
      setAlertMessage("Error saving data");
    }
  };

  return (
    <div className="flex flex-col gap-4">

      {/* Alert สำหรับแสดงสถานะ */}
      {alertStatus && (
        <Alert
          color={alertStatus}
          title={alertStatus === "success" ? "Success" : "Error"}
          description={alertMessage}
          className="mb-4"
          onClose={() => setAlertStatus(null)}
        />
      )}
      <form onSubmit={handleSubmit}>
        <div className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4">
          <Input
            label="ID"
            labelPlacement="outside"
            placeholder="Name product..."
            value={formData.id}
            onChange={handleChange}
            size="lg"
            type="number"
            name="id"
            isRequired
          />
          <Input
            label="Name"
            labelPlacement="outside"
            placeholder="Name product..."
            value={formData.name}
            onChange={handleChange}
            size="lg"
            type="text"
            name="name"
            
          />
          <Input
            label="Price"
            labelPlacement="outside"
            placeholder="Input Price..."
            value={formData.price}
            onChange={handleChange}
            size="lg"
            type="number"
            name="price"
           
          />
        </div>

        <div className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4 pt-2">
          <Input
            label="Quantity"
            labelPlacement="outside"
            placeholder="Input your Quantity...."
            value={formData.quantity}
            onChange={handleChange}
            size="lg"
            type="number"
            name="quantity"
            
          />
          <Selected
            label="ประเภท"
            placeholder="เลือกประเภท"
            options={roles}
            value={formData.categoryId}
            onChange={(newCategoryId) =>
              setFormData({ ...formData, categoryId: newCategoryId })
            }
            
          />
        </div>

        <div className="upload-section">
          {/* <p className="pt-5">Upload image</p> */}
          {/* <div className="flex justify-start pt-3">
            <UploadButton
              endpoint="skewerImageUpload"
              onClientUploadComplete={handleUploadComplete}
              appearance={{
                button: "ut-ready:bg-green-500 ut-uploading:cursor-not-allowed",
              }}
              metadata={{
                name: formData.name,
                price: formData.price,
                categoryId: formData.categoryId,
                quantity: formData.quantity,
              }}
            />
          </div> */}
        </div>

        <div className="flex justify-end mt-6">
          <Button type="submit" color="primary" className="w-full md:w-auto">
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
}