"use client";

import React, { useEffect, useState } from "react";
import { Spinner } from "@heroui/react"; // หรือ component spinner ที่คุณใช้

interface Sale {
  date: string;
  totalAmount: number;
}

export default function Page() {
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
    <div>
      <h2>Total Users (total): {totalUser}</h2>
      <h2>Total Product Sale (total): {quanSale}</h2>
      <h2>Total Product (total): {totalProduct}</h2>
      <h2>Total Sales (Sum): {totalAmount}</h2>
      <ul>
        {totalsale.map((sale, index) => (
          <li key={index}>
            Date: {sale.date} | Total: {sale.totalAmount}
          </li>
        ))}
      </ul>
    </div>
  );
}
