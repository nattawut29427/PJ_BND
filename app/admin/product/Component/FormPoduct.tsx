"use client";

import React, { useState, useEffect } from "react";
import { Input } from "@heroui/react";
import { UploadButton } from "@uploadthing/react";
import { Button } from "@heroui/react";
import type { OurFileRouter } from "@/app/api/uploadthing/core";
import Selected from "@/components/Selected";

export default function SkewerUpload() {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    categoryId: "",
    quantity: "",
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [quantity, setQuantity] = useState("");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [price, setPrice] = useState("");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [name, setName] = useState("");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [role, setRole] = useState("");

  // ตัวเลือก Roles
  const roles = [
    { key: "1", label: "เนื้อหมู" },
    { key: "2", label: "เนื้อวัว" },
    { key: "3", label: "ผัก" },
    { key: "4", label: "เครื่องดื่ม" },
    { key: "5", label: "อื่นๆ" },
  ];

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleRoleChange = (newRole: string) => {
    setRole(newRole);
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
    if (res[0]?.url) {
      setFileUrl(res[0]?.url);
      alert("Upload complete! Please submit the form to save data.");
    } else {
      alert("Upload failed, please try again.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

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
      return error;
      alert("Error saving data");
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <form onSubmit={handleSubmit}>
        <div className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4">
          <Input
            label="Name"
            labelPlacement="outside"
            name="name"
            placeholder="Name product..."
            size="lg"
            type="text"
            value={formData.name}
            onChange={handleChange}
          />
          <Input
            label="Price"
            labelPlacement="outside"
            name="price"
            placeholder="Input Price..."
            size="lg"
            type="float"
            value={formData.price}
            onChange={handleChange}
          />
        </div>

        <div className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4 pt-4">
          <Input
            label="Quantity"
            labelPlacement="outside"
            name="quantity"
            placeholder="Input your Quantity...."
            size="lg"
            type="number"
            value={formData.quantity}
            onChange={handleChange}
          />
          <Selected
            label="ประเภท"
            options={roles}
            placeholder="เลือกประเภท"
            value={formData.categoryId}
            onChange={(newCategoryId) =>
              setFormData({ ...formData, categoryId: newCategoryId })
            }
          />
        </div>
        <p className="pt-5">Upload image</p>
        <div className="flex justify-start pt-3 ">
          <UploadButton<OurFileRouter, "imageUploader">
            onClientUploadComplete={handleUploadComplete}
            endpoint="imageUploader"
          />
        </div>
        <div className="flex justify-end ">
          <Button color="primary" type="submit">
            Save
          </Button>
        </div>
      </form>
    </div>
  );
}
