"use client";

import React, { useState, useEffect } from "react";
import { Input } from "@nextui-org/react";
import Selected from "@/components/Selected";
import { UploadButton } from "@uploadthing/react";
import {Button} from "@nextui-org/react";

export default function SkewerUpload() {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    categoryId: "",
    quantity: "",
  });

  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("");

  // ตัวเลือก Roles
  const roles = [
    { key: "1", label: "เนื้อหมู" },
    { key: "2", label: "เนื้อวัว" },
    { key: "3", label: "ผัก" },
  ];

  const handleRoleChange = (newRole: string) => {
    setRole(newRole);
    console.log(setRole);
  };

  const [fileUrl, setFileUrl] = useState<string | null>(null);

  // ใช้ useEffect เก็บข้อมูลใน localStorage
  useEffect(() => {
    const savedData = localStorage.getItem("formData");
    if (savedData) {
      setFormData(JSON.parse(savedData));
    }
  }, []);

  useEffect(() => {
    if (formData) {
      localStorage.setItem("formData", JSON.stringify(formData));
    }
  }, [formData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
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
    <div className="flex flex-col gap-4">
      <form onSubmit={handleSubmit}>
        <div className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4">
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
            type="float"
            name="price"
          />
        </div>

        <div className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4">
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
          <p className="pt-5">Upload image</p>
        <div className="flex justify-start pt-3 ">
          <UploadButton<FileRouter>
            endpoint="skewerImageUpload"
            onClientUploadComplete={handleUploadComplete}
            metadata={{
              name: formData.name,
              price: formData.price,
              categoryId: formData.categoryId,
              quantity: formData.quantity,
            }}
          />
        </div>
        <div className="flex justify-end ">

        <Button type="submit" color="primary">Save</Button>
        </div>
      </form>
    </div>
  );
}
