"use client";

import React, { useState, useEffect } from "react";
import { Input, Button, Alert } from "@heroui/react";

import Selected from "@/components/Selected";

type User = {
  id: string;
  email: string;
  name: string;
  role: string;
  password: string;
  image: string;
};

type Props = {
  email: string;
};

export default function UpdateUser({ email }: Props) {
  const [formData, setFormData] = useState<User>({
    id: "",
    email: "",
    name: "",
    password: "",
    role: "",
    image: "",
  });
// eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [fileUrl, _setFileUrl] = useState<string | null>(null);
  const [alertStatus, setAlertStatus] = useState<"success" | "error" | null>(null);
  const [alertMessage, setAlertMessage] = useState("");

  // ตัวเลือก Roles
  const roles = [
    { key: "admin", label: "Admin" },
    { key: "cashier", label: "Cashier" },
    { key: "customer", label: "Customer" },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/users?email=${email}`);
        const data: User = await response.json();
        
        setFormData({
        
          id: data.id || "",
          email: data.email || "",
          name: data.name || "",
          password: data.password || "",
          role: data.role || "",
          image: data.image || "",
        });
      
      } catch (error) {
       return(error)
      }
    };

    if (email) fetchData();
  }, [email]);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { email:  _email, ...rest } = formData;
    
    localStorage.setItem("formData", JSON.stringify(rest));
  
  }, [formData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    setFormData((prev) => ({ ...prev, [name]: value }));
 
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const metadata = {
      email: formData.email,
      name: formData.name || undefined,
      password: formData.password || undefined,
      roles: formData.role || undefined,
      fileUrl: fileUrl || null,
    };

    try {
      const response = await fetch("/api/users", {
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
        setTimeout(() => window.location.reload(), 2000);
      } else {
        setAlertStatus("error");
        setAlertMessage(`Failed to save data: ${result.error || "Unknown error"}`);
      }
    } catch (error) {
      return(
        (
          setAlertStatus("error"),
          setAlertMessage("Error saving data")
        ),
        error
      )
        
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {alertStatus && (
        <Alert
        className="mb-4"
        color={alertStatus === "success" ? "success" : "danger"}
        description={alertMessage}
        title={alertStatus === "success" ? "Success" : "Error"}
        onClose={() => setAlertStatus(null)}
        />
      )}

      <form onSubmit={handleSubmit}>
        <div className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4">
          <Input
            isReadOnly
            isRequired
            label="Email"
            labelPlacement="outside"
            name="email"
            placeholder="Email"
            size="lg"
            type="email"
            value={formData.email}
          />
          <Input
            label="Name"
            labelPlacement="outside"
            name="name"
            placeholder="Input new name..."
            size="lg"
            type="text"
            value={formData.name}
            onChange={handleChange}
          />
          <Input
            label="Password"
            labelPlacement="outside"
            name="password"
            placeholder="Input new password..."
            size="lg"
            type="password"
            value={formData.password}
            onChange={handleChange}
          />
        </div>

        <div className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4 pt-2">
          <Selected
            label="ประเภท"
            options={roles}
            placeholder="เลือกประเภท"
            value={formData.role}
            onChange={(newRole) => setFormData({ ...formData, role: newRole })}
          />
        </div>

        <div className="flex justify-end mt-6">
          <Button 
          className="w-full md:w-auto"
          color="primary" 
          type="submit" 
          >
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
}
