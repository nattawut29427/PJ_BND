  "use client";

  import React, { useState, useEffect } from "react";
  import { Input } from "@heroui/react";
  import Selected from "@/components/Selected";
  import { UploadButton } from "@uploadthing/react";
  import { Button, Alert } from "@heroui/react";
  import { useSearchParams } from "next/navigation";


  type User = {
    id: string
    email: string
    name: string;
    role: string;
    password:string;
    image: string;
  };


  type Props = {
    email: string;
  };

  export default function UpdateUser({ email }: Props) {
    const [formData, setFormData] = useState<User>({
      id:"",
      email: "",
      name: "",
      password: "",
      role: "",
      image: "",
    });

    const [fileUrl, setFileUrl] = useState<string | null>(null);
    const [alertStatus, setAlertStatus] = useState<"success" | "error" | null>(null);
    const [alertMessage, setAlertMessage] = useState("");
    const [selectedId, setSelectedId] = useState<string | null>(null);

    // ตัวเลือก Roles
    const roles = [
      { key: "admin", label: "Admin" },
      { key: "cashier", label: "Cashier" },
      { key: "customer", label: "Customer" },
    ];

    // ดึงข้อมูลและคำนวณ ID ถัดไป
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
            image: data.image || ""
          });
        } catch (error) {
          console.error("Failed to fetch product:", error);
        }
      };

      if (email) fetchData();
    }, [email]);

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

    // useEffect(() => {
    //   const savedData = localStorage.getItem("formData");
    //   if (savedData) {
    //     const parsedData = JSON.parse(savedData);
    //     setFormData({ ...parsedData, id: "" });
    //   }
    // }, []);

    useEffect(() => {
      const { email, ...rest } = formData;
      localStorage.setItem("formData", JSON.stringify(rest));
    }, [formData]);


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
             label="Email"
             labelPlacement="outside"
             placeholder="Email"
             value={formData.email}
             size="lg"
             type="email"
             name="email"
             isReadOnly // เพิ่มคุณสมบัตินี้เพื่อปิดการแก้ไข
             isRequired
            />
            <Input
              label="Name"
              labelPlacement="outside"
              placeholder="Input new name..."
              value={formData.name}
              onChange={handleChange}
              size="lg"
              type="text"
              name="name"
              
            />
            <Input
              label="Password"
              labelPlacement="outside"
              placeholder="Input new password..."
              value={formData.password}
              onChange={handleChange}
              size="lg"
              type="password"
              name="password"
            
            />
          </div>

          <div className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4 pt-2">
          
            <Selected
              label="ประเภท"
              placeholder="เลือกประเภท"
              options={roles}
              value={formData.role}
              onChange={(newRole) =>
                setFormData({ ...formData, role: newRole })
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