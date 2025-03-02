"use client";

import React, { useState, useEffect } from "react";
import { Input, Button } from "@heroui/react";
import { UploadButton } from "@uploadthing/react";
import type { OurFileRouter } from "@/app/api/uploadthing/core";

import Selected from "@/components/Selected";

export default function UserUpload() {
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    password: "",
    role: "",
  });

  

  const [fileUrl, setFileUrl] = useState<string | null>(null);

  const roles = [
    { key: "admin", label: "Admin" },
    { key: "cashier", label: "Cashier" },
    { key: "customer", label: "Customer" },
  ];

  const isFormValid =
    formData.email.trim() !== "" &&
    formData.name.trim() !== "" &&
    formData.password.trim() !== "" &&
    formData.role !== "" &&
    fileUrl !== null;

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

    if (!isFormValid) {
      alert("Please fill in all required fields and upload an image.");

      return;
    }

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
      return alert("Error saving data"), error;
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <form onSubmit={handleSubmit}>
        <div className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4">
          <Input
            label="Email"
            labelPlacement="outside"
            name="email"
            placeholder="you@examle.com"
            size="lg"
            type="email"
            value={formData.email}
            onChange={handleChange}
          />
          <Input
            label="Name"
            labelPlacement="outside"
            name="name"
            placeholder="Input your name..."
            size="lg"
            type="text"
            value={formData.name}
            onChange={handleChange}
          />
        </div>

        <div className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4 pt-4">
          <Input
            label="Password"
            labelPlacement="outside"
            name="password"
            placeholder="Input your password...."
            size="lg"
            type="password"
            value={formData.password}
            onChange={handleChange}
          />
          <Selected
            label="Role"
            options={roles}
            placeholder="Selected Role"
            value={formData.role}
            onChange={(newRole) => setFormData({ ...formData, role: newRole })}
          />
        </div>

        <div className="pt-5">
          <p>Upload image</p>
          <div className="flex justify-start pt-3">
          <UploadButton<OurFileRouter, "imageUploader">
              onClientUploadComplete={handleUploadComplete}
              endpoint="imageUploader"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <Button color="primary" type="submit">
            Save
          </Button>
        </div>
      </form>
    </div>
  );
}
