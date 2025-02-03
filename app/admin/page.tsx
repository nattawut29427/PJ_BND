"use client";

import { Button } from "@heroui/react";
import { useState, useEffect } from "react";
import BarChart from "@/app/admin/dashboard/Component/BarChart";
import { Spinner } from "@heroui/react"; 

interface Sale {
  date: string;
  totalAmount: number;
}

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

  const [totalsale, setTotalsale] = useState<Sale[]>([]);
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [totalUser, setTotalUser] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [totalProduct, setTotalProduct] = useState<number>(0);
  const [quanSale, setQuanSale] = useState<number>(0)
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      setError("");
      try {
        const [
          dailySaleResponse,
          totalSaleResponse,
          totalUserResponse,
          totalProductResponse,
          totalQuanSaleResponse
        ] = await Promise.all([
          fetch("/api/saleService?dailySale=true"),
          fetch("/api/saleService?sum=true"),
          fetch("/api/users?count=true"),
          fetch("/api/productService?count=true"),
          fetch("/api/saleService?quanSale=true")
        ]);

        if (
          !dailySaleResponse.ok ||
          !totalSaleResponse.ok ||
          !totalUserResponse.ok ||
          !totalProductResponse.ok ||
          !totalQuanSaleResponse.ok 
        ) {
          throw new Error("Failed to fetch sales data");
        }
        
        const totalQuanSale = await totalQuanSaleResponse.json();
        const totalProduct = await totalProductResponse.json();
        const totalUserData = await totalUserResponse.json();
        const dailySaleData = await dailySaleResponse.json();
        const totalSaleData = await totalSaleResponse.json();

        // อัปเดต state
        setQuanSale(totalQuanSale.totalAmount || 0);
        setTotalProduct(totalProduct.total || 0);
        setTotalsale(dailySaleData);
        setTotalAmount(totalSaleData.totalAmount || 0);
        setTotalUser(totalUserData.total || 0);
      } catch (error) {
        console.error("Failed to fetch sales:", error);

        setError("Failed to fetch sales data");
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  if (loading) {
    return (
      <Spinner
        className="flex justify-center items-center m-auto w-1/2 h-1/2"
        size="lg"
        color="primary"
        labelColor="primary"
      />
    );
  }

  if (error) {
    return <div>{error}</div>;
  }
  return (
    <>
      <h1 className="text-2xl pb-6">Dashboard/รายงาน ระบบร้านอาหาร</h1>
      <div className="">
        <div className="grid grid-cols-4 gap-4">
          <Button color="primary" className="h-[125px]">
            <h4 className="text-white font-medium text-xl">
            จำนวนผู้ใช้งาน<p>{totalUser} คน</p>
            </h4>
          </Button>
          <Button color="success" className="h-[125px]">
            <h4 className="text-white font-medium text-xl">
            จำนวนขายสินค้า<p>{quanSale} รายการ</p>
            </h4>
          </Button>
          <Button color="danger" className="h-[125px]">
            <h4 className="text-white font-medium text-xl">
              จำนวนสินค้า<p>{totalProduct} รายการ</p>
            </h4>
          </Button>
          <Button color="secondary" className="h-[125px]">
            <h4 className="text-white font-medium text-xl">
            ยอดขายทั้งหมด<p>{totalAmount} บาท</p>
            </h4>
          </Button>
        </div>
        <div className="pt-6">
          <Button variant="ghost" color="primary" className="w-1/12  mr-2">
            <h4 className="font-medium text-base">รายเดือน</h4>
          </Button>
          <Button variant="ghost" color="success" className="w-1/12">
            <h4 className="font-medium text-base">รายปี</h4>
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
