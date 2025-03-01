"use client";
import React from "react";
import { useEffect, useState } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  Pagination,
  Spinner,
} from "@heroui/react";

interface Skewer {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface OrderItem {
  skewer: Skewer;
  quantity: number;
}

interface Order {
  id: number;
  totalPrice: number;
  orderDate: string;
  status: "COMPLETED";
  orderItems: OrderItem[];
  customer: {
    name: string;
  };
  no: number;
}


const columns = [
  
  { name: "ORDER ID", uid: "id", sortable: true },
  { name: "TOTAL", uid: "total", sortable: true },
  { name: "DATE", uid: "createdAt", sortable: true },
  { name: "STATUS", uid: "status", sortable: true },
  { name: "ITEMS", uid: "items" },
  { name: "Order By", uid: "customerName" },
];



export default function CompletedOrdersTable() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [error, setError] = useState<string | null>(null);

  // State สำหรับการจัดการตาราง
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [filterValue, setFilterValue] = useState("");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [sortDescriptor, setSortDescriptor] = useState({
    column: "createdAt",
    direction: "ascending",
  });
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [rowsPerPage, setRowsPerPage] = useState(5);
 
  const [page, setPage] = useState(1);

 
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch("/api/Findorder");
      
        if (!response.ok) throw new Error("Failed to fetch orders");
       
        const data = await response.json();
       
        setOrders(data);
      
      } catch (error) {
        return error
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);



  
  const renderCell = (order: Order, columnKey: React.Key) => {
    const cellValue = order[columnKey as keyof Order];

    switch (columnKey) {
      case "No":
        return (
          <p>{order.no}</p>
        )
      case "id":
        return (
          <span className="font-medium">
            #{order.id.toString().slice(0, 8)}
          </span>
        );

      case "total":
        return `฿${order.totalPrice.toFixed(2)}`;

      case "createdAt":
        return new Date(order.orderDate).toLocaleDateString();

      case "status":
        return (
          <Chip color={"success"} size="sm" variant="flat">
            {order.status}
          </Chip>
        );

      case "items":
        return (
          <div className="flex flex-col gap-1">
            {order.orderItems.map((item) => (
              <div key={item.skewer.id} className="flex gap-2 text-sm">
                <span>{item.skewer.name}</span>
                <span>(x{item.quantity})</span>
                <span className="text-default-400">
                  ฿{(item.skewer.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        );

      case "customerName":
        return order.customer.name;

      default:
        return cellValue;
    }
  };

  // การจัดการ Pagination และ Sorting
  const filteredItems = [...orders];
  const pages = Math.ceil(filteredItems.length / rowsPerPage);

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  const sortedItems = React.useMemo(() => {
    return [...items].sort((a, b) => {
      const first = a[sortDescriptor.column as keyof Order];
      const second = b[sortDescriptor.column as keyof Order];

      if (sortDescriptor.column === "orderDate") {
        return sortDescriptor.direction === "ascending"
          ? new Date(a.orderDate).getTime() - new Date(b.orderDate).getTime()
          : new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime();
      }

      // เรียงลำดับสำหรับตัวเลข
      const cmp = Number(first) < Number(second) ? -1 : 1;
    
      return sortDescriptor.direction === "ascending" ? cmp : -cmp;
   

    });
  }, [sortDescriptor, items]);

  // const topContent = (
  //   <div className="flex flex-col gap-4 ">
  //     <div className="flex gap-3 items-end">
  //       <Input
  //         isClearable
  //         className="w-full sm:max-w-[44%]"
  //         placeholder="Search by Order ID..."
  //         startContent="test"
  //         value={filterValue}
  //         onClear={() => setFilterValue("")}
  //         onValueChange={setFilterValue}
  //       />
  //     </div>
  //   </div>
  // );

  const bottomContent = (
    <div className="py-2 px-2 flex justify-end items-center">
      <Pagination
        isCompact
        showControls
        showShadow
        color="primary"
        page={page}
        total={pages}
        onChange={setPage}
      />
    </div>
  );

  if (loading) {
    return (
      <Spinner
        className="flex justify-center items-center m-auto w-1/2 h-1/2"
        color="primary"
        size="lg"
      />
    );
  }
  if (error) return <div>Error: {error}</div>;

  return (
    <>
      {/* <div className="mb-5">{topContent}</div> */}

      <Table
        aria-label="Completed Orders Table"
        bottomContent={bottomContent}
        bottomContentPlacement="outside"
        // sortDescriptor={sortDescriptor}
        // onSortChange={setSortDescriptor}
      >
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn key={column.uid} allowsSorting={column.sortable}>
              {column.name}
            </TableColumn>
          )}
        </TableHeader>

        <TableBody items={sortedItems}>
          {(item) => (
            <TableRow key={item.id}>
              {(columnKey) => (
                <TableCell>{renderCell(item, columnKey) as string}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </>
  );
}
