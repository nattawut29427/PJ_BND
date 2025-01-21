"use client";

import { Input } from "@heroui/react";
import Selected from "./Selected";
import { useState } from "react";
import { UploadButton } from "@uploadthing/react";


export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("");

  // ตัวเลือก Roles
  const roles = [
    { key: "Admin", label: "Admin" },
    { key: "Staff", label: "Staff" },
    { key: "Customer", label: "Customer" },
  ];

  const handleRoleChange = (newRole: string) => {
    setRole(newRole);
    console.log(setRole);
  };


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
    <div className="flex flex-col gap-4">
      <div className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4">
        <Input
          label="Email"
          labelPlacement="outside"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          size="lg"
          type="email"
        />
        <Input
          label="Name"
          labelPlacement="outside"
          placeholder="Input your name..."
          value={name}
          onChange={(e) => setName(e.target.value)}
          size="lg"
          type="text"
        />
      </div>

      <div className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4">
        <Input
          label="Password"
          labelPlacement="outside"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          size="lg"
          type="password"
        />
        <Selected
          label="Role"
          placeholder="Select a role"
          options={roles}
          value={role} 
          onChange={handleRoleChange} 
        />
      </div>
    </div>
  );
}
