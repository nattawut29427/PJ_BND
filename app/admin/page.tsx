"use client";

import { Button } from "@heroui/react";
import React from "react";
import BarChart from "@/app/admin/dashboard/Component/BarChart";

export default function App() {
  const data = {
    labels: ["January", "February", "March", "April", "May", "June"],
    datasets: [
      {
        label: "Sales",
        data: [200000, 244198, 0, 0, 0, 0],
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 206, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
          "rgba(153, 102, 255, 0.2)",
          "rgba(255, 159, 64, 0.2)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };
  return (
    <>
      <h1 className="text-2xl pb-6">Dashboard/รายงาน ระบบร้านอาหาร</h1>
      <div className="">
        <div className="grid grid-cols-4 gap-4">
          <Button color="primary" className="h-[125px]">
            <h4 className="text-white font-medium text-xl">
              ยอดขายทั้งหมด<p>444,198.00 บาท</p>
            </h4>
          </Button>
          <Button color="success" className="h-[125px]">
            <h4 className="text-white font-medium text-xl">
              จำนวนบิล<p>682.00 รายการ</p>
            </h4>
          </Button>
          <Button color="danger" className="h-[125px]">
            <h4 className="text-white font-medium text-xl">
              จำนวนสินค้า<p>6 รายการ</p>
            </h4>
          </Button>
          <Button color="secondary" className="h-[125px]">
            <h4 className="text-white font-medium text-xl">
              จำนวนโต๊ะ<p>20 รายการ</p>
            </h4>
          </Button>
        </div>
        <div className="pt-6">
        <Button variant="ghost" color="primary" className="w-1/12  mr-2">
            <h4 className="font-medium text-base">
              รายเดือน
            </h4>
          </Button>
          <Button variant="ghost" color="success" className="w-1/12">
            <h4 className="font-medium text-base">
              รายปี
            </h4>
          </Button>
        </div>
        <div style={{ width: "75%", margin: "0 auto" }}>
          <h1 className="pt-16 text-center font-semibold text-xl">
            ยอดขายรายเดือน
          </h1>
          <BarChart data={data} options={options} />
        </div>

      </div>
    </>
  );
}
