"use client";

import React, { useState, useEffect } from "react";
import { Input, Button, Alert } from "@heroui/react";

import Selected from "@/components/Selected";

type Skewer = {
  id: number;
  name: string;
  price: number;
  categoryId: string;
  quantity: number;
};

type Props = {
  id: number;
};

export default function UpdateProduct({ id }: Props) {
  const [formData, setFormData] = useState<Skewer>({
    id: 0,
    name: "",
    price: 0,
    categoryId: "",
    quantity: 0,
  });

  const [alertStatus, setAlertStatus] = useState<"success" | "error" | null>(null);
  const [alertMessage, setAlertMessage] = useState("");

  const roles = [
    { key: "1", label: "เนื้อหมู" },
    { key: "2", label: "เนื้อวัว" },
    { key: "3", label: "ผัก" },
    { key: "4", label: "เครื่องดื่ม" },
    { key: "5", label: "อื่นๆ" }
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/productService?id=${id}`);
        const data: Skewer = await response.json();
       
        setFormData(data);
      
      } catch (error) {
        return error
      }
    };

    if (id) fetchData();
  }, [id]);

  useEffect(() => {
    const savedData = localStorage.getItem("formData");
    
    if (savedData) {
      const parsedData = JSON.parse(savedData);
    
      setFormData({ ...parsedData, id: 0 });
  
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id: id, ...rest } = formData;
    
    localStorage.setItem("formData", JSON.stringify(rest));
 
  }, [formData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
   
    setFormData((prev) => ({ ...prev, [name]: value }));
  
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const metadata = {
      id: formData.id,
      name: formData.name || undefined,
      price: formData.price ? parseFloat(formData.price.toString()) : undefined,
      categoryId: formData.categoryId || undefined,
      quantityChange: parseInt(formData.quantity.toString(), 10),
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
        setTimeout(() => window.location.reload(), 2000);
      } else {
        setAlertStatus("error");
        setAlertMessage(`Failed to save data: ${result.error || "Unknown error"}`);
      }
    } catch (error) {
      return (( setAlertStatus("error"),
      setAlertMessage("Error saving data")),error)
     
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
            isRequired
            label="ID"
            labelPlacement="outside"
            name="id"
            placeholder="Name product..."
            size="lg"
            type="number"
            value={formData.id.toString()}
            onChange={handleChange}
          />

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
            type="number"
            value={formData.price.toString()}
            onChange={handleChange}
          />
        </div>

        <div className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4 pt-2">
          <Input
            label="Quantity"
            labelPlacement="outside"
            name="quantity"
            placeholder="Input your Quantity...."
            size="lg"
            type="number"
            value={formData.quantity.toString()}
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