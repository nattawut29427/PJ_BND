"use client";

import React, { useState, useEffect } from "react";
import { Input } from "@heroui/react";
import Selected from "@/components/Selected";
import { UploadButton } from "@uploadthing/react";
import {Button , Alert } from "@heroui/react";

export default function UserUpload() {
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    password: "",
    role: "",
  });

  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("");

  // ตัวเลือก Roles
  const roles = [
    { key: "admin", label: "Admin" },
    { key: "cashier", label: "Cashier" },
    { key: "customer", label: "Customer" },
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

    
      const metadata = {
        email: formData.email,
        name: formData.name,
        password: formData.password,
        role: formData.role,
        fileUrl,
      };

      try {
        const response = await fetch("/api/auth/signup", {
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
  };

  return (
    <div className="flex flex-col gap-4">
      <form onSubmit={handleSubmit}>
        <div className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4">
          <Input
            label="Email"
            labelPlacement="outside"
            placeholder="you@examle.com"
            value={formData.email}
            onChange={handleChange}
            size="lg"
            type="email"
            name="email"
          />
          <Input
            label="Name"
            labelPlacement="outside"
            placeholder="Input your name..."
            value={formData.name}
            onChange={handleChange}
            size="lg"
            type="text"
            name="name"
          />
        </div>

        <div className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4 pt-4">
          <Input
            label="Password"
            labelPlacement="outside"
            placeholder="Input your password...."
            value={formData.password}
            onChange={handleChange}
            size="lg"
            type="password"
            name="password"
          />
          <Selected
            label="Role"
            placeholder="Selected Role"
            options={roles}
            value={formData.role}
            onChange={(newRole) =>
              setFormData({ ...formData, role: newRole })
            }
          />
        </div>
          <p className="pt-5">Upload image</p>
        <div className="flex justify-start pt-3 ">
          <UploadButton<FileRouter>
            endpoint="skewerImageUpload"
            onClientUploadComplete={handleUploadComplete}
            // metadata={{
            //   name: formData.name,
            //   price: formData.price,
            //   categoryId: formData.categoryId,
            //   quantity: formData.quantity,
            // }}
          />
        </div>
        <div className="flex justify-end ">

        <Button type="submit" color="primary">Save</Button>
        </div>
      </form>
    </div>
  );
}
