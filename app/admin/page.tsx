"use client";

import { Button } from "@heroui/react";
import { useState, useEffect } from "react";
import BarChart from "@/app/admin/dashboard/Component/BarChart";
import { Spinner } from "@heroui/react";
import Link from "next/link";

interface SaleData {
  date?: string;
  month?: string;
  year?: string;
  totalAmount: number;
  labels: string;
}

export default function App() {
  const [dailySale, setDailySale] = useState<SaleData[]>([]);
  const [monthlySale, setMonthlySale] = useState<SaleData[]>([]);
  const [yearlySale, setYearlySale] = useState<SaleData[]>([]);
  const [stats, setStats] = useState({
    totalAmount: 0,
    totalUser: 0,
    totalProduct: 0,
    quanSale: 0,
  });
  const [chartTitle, setChartTitle] = useState("ยอดขายรายวัน");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [chartData, setChartData] = useState<{
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      backgroundColor: string[];
      borderColor: string[];
      borderWidth: number;
    }[];
  }>({
    labels: [],
    datasets: [],
  });

  useEffect(() => {
    const fetchData = async (
      key: string,
      setter: (data: SaleData[]) => void
    ) => {
      try {
        const res = await fetch(`/api/saleService?${key}=true`);
        if (!res.ok) throw new Error(`Failed to fetch ${key}`);
        setter(await res.json());
      } catch {
        setError(`Error loading ${key}`);
      }
    };

    const fetchStats = async () => {
      try {
        const [sumRes, userRes, productRes, quanRes] = await Promise.all([
          fetch("/api/saleService?sum=true"),
          fetch("/api/users?count=true"),
          fetch("/api/productService?count=true"),
          fetch("/api/saleService?quanSale=true"),
        ]);

        if (![sumRes, userRes, productRes, quanRes].every((res) => res.ok))
          throw new Error("Failed to fetch stats");

        setStats({
          totalAmount: (await sumRes.json()).totalAmount || 0,
          totalUser: (await userRes.json()).total || 0,
          totalProduct: (await productRes.json()).total || 0,
          quanSale: (await quanRes.json()).totalAmount || 0,
        });
      } catch {
        setError("Error loading stats");
      }
    };

    (async () => {
      setLoading(true);
      await Promise.all([
        fetchData("dailySale", setDailySale),
        fetchData("monthlySale", setMonthlySale),
        fetchData("yearlySale", setYearlySale),
        fetchStats(),
      ]);
      setLoading(false);
    })();
  }, []);

  useEffect(() => {
    if (dailySale.length > 0) {
      updateChartData(dailySale, "ยอดขายรายวัน");
    }
  }, [dailySale]);

  const updateChartData = (sales: SaleData[], label: string) => {
    const labels = sales
      .map((sale) => sale.date || sale.month || sale.year)
      .filter((label): label is string => label !== undefined);

    const data = sales.map((sale) => sale.totalAmount);
    const backgroundColors = data.map((_, index) => {
      const colors = [
        "rgba(255, 99, 132, 0.2)",
        "rgba(54, 162, 235, 0.2)",
        "rgba(255, 206, 86, 0.2)",
        "rgba(75, 192, 192, 0.2)",
        "rgba(153, 102, 255, 0.2)",
        "rgba(255, 159, 64, 0.2)",
      ];
      return colors[index % colors.length];
    });
    const borderColors = data.map((_, index) => {
      const colors = [
        "rgba(255, 99, 132, 1)",
        "rgba(54, 162, 235, 1)",
        "rgba(255, 206, 86, 1)",
        "rgba(75, 192, 192, 1)",
        "rgba(153, 102, 255, 1)",
        "rgba(255, 159, 64, 1)",
      ];
      return colors[index % colors.length];
    });

    setChartData({
      labels,
      datasets: [
        {
          label,
          data,
          backgroundColor: backgroundColors,
          borderColor: borderColors,
          borderWidth: 1,
        },
      ],
    });
    setChartTitle(label);
  };

  if (loading)
    return (
      <Spinner
        className="flex justify-center items-center m-auto w-1/2 h-1/2"
        size="lg"
        color="primary"
      />
    );
  if (error) return <div>{error}</div>;

  return (
    <>
      <h1 className="text-2xl pb-6">Dashboard/รายงาน ระบบร้านอาหาร</h1>
      <div className="grid grid-cols-4 gap-4">
        <Button color="primary" className="h-[125px]">
          <Link href="/admin/dashboard">
            <h4 className="text-white font-medium text-xl">
              จำนวนผู้ใช้งาน<p>{stats.totalUser} คน</p>
            </h4>
          </Link>
        </Button>
        <Button color="success" className="h-[125px]">
          <h4 className="text-white font-medium text-xl">
            จำนวนขายสินค้า<p>{stats.quanSale} รายการ</p>
          </h4>
        </Button>
        <Button color="danger" className="h-[125px]">
          <Link href="/admin/product">
            <h4 className="text-white font-medium text-xl">
              จำนวนสินค้า<p>{stats.totalProduct} รายการ</p>
            </h4>
          </Link>
        </Button>

        <Button color="secondary" className="h-[125px] ">
          <a href="/admin/sale" className="text-white font-medium text-xl">
            ยอดขายทั้งหมด<p>{stats.totalAmount} บาท</p>
          </a>
        </Button>
      </div>
      <div className="pt-6">
        <Button
          variant="ghost"
          color="success"
          className="w-1/12 mr-2"
          onClick={() => updateChartData(dailySale, "ยอดขายรายวัน")}
        >
          <h4 className="font-medium text-base">รายวัน</h4>
        </Button>
        <Button
          variant="ghost"
          color="danger"
          className="w-1/12 mr-2"
          onClick={() => updateChartData(monthlySale, "ยอดขายรายเดือน")}
        >
          <h4 className="font-medium text-base">รายเดือน</h4>
        </Button>
        <Button
          variant="ghost"
          color="primary"
          className="w-1/12"
          onClick={() => updateChartData(yearlySale, "ยอดขายรายปี")}
        >
          <h4 className="font-medium text-base">รายปี</h4>
        </Button>
      </div>
      <div style={{ width: "75%", margin: "0 auto" }}>
        <h1 className="pt-16 text-center font-semibold text-xl">
          {chartTitle}
        </h1>
        <BarChart
          data={chartData}
          options={{
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
          }}
        />
      </div>
    </>
  );
}
