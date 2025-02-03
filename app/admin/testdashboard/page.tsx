"use client";

import React, { useEffect, useState } from "react";
import { Spinner } from "@heroui/react"; 

interface SaleData {
  date?: string;
  month?: string;
  year?: string;
  totalAmount: number;
}

export default function Page() {
  const [dailySale, setDailySale] = useState<SaleData[]>([]);
  const [monthlySale, setMonthlySale] = useState<SaleData[]>([]);
  const [yearlySale, setYearlySale] = useState<SaleData[]>([]);
  const [stats, setStats] = useState({ totalAmount: 0, totalUser: 0, totalProduct: 0, quanSale: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async (key: string, setter: (data: SaleData[]) => void) => {
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

        if (![sumRes, userRes, productRes, quanRes].every(res => res.ok)) throw new Error("Failed to fetch stats");

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

  if (loading) return <Spinner className="flex justify-center items-center m-auto w-1/2 h-1/2" size="lg" color="primary" />;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h2>Total Users: {stats.totalUser} คน</h2>
      <h2>Total Product Sale: {stats.quanSale} ชิ้น</h2>
      <h2>Total Product: {stats.totalProduct} ชิ้น</h2>
      <h2>Total Sales: {stats.totalAmount} บาท</h2>

      {[{ title: " รายการขายรายวัน", data: dailySale, key: "date" },
        { title: " รายการขายรายเดือน", data: monthlySale, key: "month" },
        { title: " รายการขายรายปี", data: yearlySale, key: "year" }].map(({ title, data, key }) => (
        <div key={title}>
          <h3 className="mt-4 font-bold">{title}</h3>
          <ul>
            {data.map((sale, index) => (
              <li key={index}> {sale[key as keyof SaleData]} |  {sale.totalAmount} บาท</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
