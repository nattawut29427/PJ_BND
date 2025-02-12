"use client";

import type { Selection } from "@heroui/react";
import ModalPD from "@/app/admin/product/Component/ModalPD";
import Find from "@/components/Find";
import ModalEdit from "@/app/admin/product/Component/ModalEdit";

import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
} from "@heroui/react";

import React, { useEffect, useState, SVGProps } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  User,
  Chip,
  Tooltip,
  ChipProps,
  Pagination,
  Spinner,
  Image,
} from "@heroui/react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export const columns = [
  { name: "Id", uid: "id" },
  { name: "Images", uid: "images" },
  { name: "Name", uid: "name" },
  { name: "Price", uid: "price" },
  { name: "Quantity", uid: "quantity" },
  { name: "ACTIONS", uid: "actions" },
];

export const EyeIcon = (props: IconSvgProps) => (
  <svg
    aria-hidden="true"
    fill="none"
    focusable="false"
    height="1em"
    role="presentation"
    viewBox="0 0 20 20"
    width="1em"
    {...props}
  >
    <path
      d="M12.9833 10C12.9833 11.65 11.65 12.9833 10 12.9833C8.35 12.9833 7.01666 11.65 7.01666 10C7.01666 8.35 8.35 7.01666 10 7.01666C11.65 7.01666 12.9833 8.35 12.9833 10Z"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
    />
    <path
      d="M9.99999 16.8916C12.9417 16.8916 15.6833 15.1583 17.5917 12.1583C18.3417 10.9833 18.3417 9.00831 17.5917 7.83331C15.6833 4.83331 12.9417 3.09998 9.99999 3.09998C7.05833 3.09998 4.31666 4.83331 2.40833 7.83331C1.65833 9.00831 1.65833 10.9833 2.40833 12.1583C4.31666 15.1583 7.05833 16.8916 9.99999 16.8916Z"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
    />
  </svg>
);

// Other icons here...

const statusColorMap: Record<string, ChipProps["color"]> = {
  active: "success",
  paused: "danger",
  vacation: "warning",
};

type Skewer = {
  id: number;
  name: string;
  status: string;
  images: string;
  category: string;
  quantity: GLfloat;
  price: GLfloat;
};

export default function App() {
  const [skewer, setSkewer] = useState<Skewer[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedKeys, setSelectedKeys] = React.useState<Selection>(
    new Set(["Columns"])
  );
  const [searchQuery, setSearchQuery] = useState(""); // เก็บคำค้นหา

  const selectedValue = React.useMemo(
    () => Array.from(selectedKeys).join(", ").replace(/_/g, ""),
    [selectedKeys]
  );
  const filteredUsers = React.useMemo(() => {
    return skewer.filter((skewer) =>
      skewer.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [skewer, searchQuery]);

  const [page, setPage] = React.useState(1);
  const rowsPerPage = 6;

  const pages = Math.ceil(skewer.length / rowsPerPage);

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return filteredUsers.slice(start, end);
  }, [page, filteredUsers]);


  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/api/productService"
        ); // Replace with your API URL
        const data = await response.json();
        setSkewer(data);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, []);

  const renderCell = React.useCallback(
    (skewer: Skewer, columnKey: React.Key) => {
      const cellValue = skewer[columnKey as keyof Skewer];
  
      switch (columnKey) {
        case "id" :
          return (
           <p>{skewer.id}</p>
          )
        case "images":
          return (
            <Image
              src={skewer.images}
              width={300}
              height={300}
              className="object-cover"
            />
          );
        case "name":
          return (
            <div className="flex flex-col">
              <p className="text-bold text-sm capitalize">{skewer.name}</p>
            </div>
          );
        case "quantity":
          return <p>{skewer.quantity}</p>;
        case "price":
          return <p>${skewer.price.toFixed(2)}</p>;
        case "actions":
          return (
            <div className="relative flex items-center justify-center gap-2">
              <ModalEdit id={skewer.id} />
            </div>
          );
        default:
          return cellValue;
      }
    },
    []
  );

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

  return (
    <>
      <div className="flex-row">
        <div className="flex justify-end pb-5 gap-5">
          <Find
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)} // อัปเดตคำค้นหา
            className="border rounded px-2 py-1"
          />
          <Dropdown className="">
            <DropdownTrigger>
              <Button className="capitalize" variant="bordered">
                {selectedValue}
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              disallowEmptySelection
              aria-label="Multiple selection example"
              closeOnSelect={false}
              selectedKeys={selectedKeys}
              selectionMode="multiple"
              variant="flat"
              onSelectionChange={setSelectedKeys}
            >
              <DropdownItem key="id">id</DropdownItem>
              <DropdownItem key="name">Name</DropdownItem>
              <DropdownItem key="Email">Email</DropdownItem>
              <DropdownItem key="Role">Role</DropdownItem>
              <DropdownItem key="Tell">phone</DropdownItem>
            </DropdownMenu>
          </Dropdown>
          <ModalPD />
        </div>

        <Table aria-label="Example table with custom cells">
          <TableHeader columns={columns}>
            {(column) => (
              <TableColumn
                key={column.uid}
                align={column.uid === "actions" ? "center" : "start"}
              >
                {column.name}
              </TableColumn>
            )}
          </TableHeader>
          <TableBody items={items}>
            {(item) => (
              <TableRow key={item.id}>
                {(columnKey) => (
                  <TableCell>{renderCell(item, columnKey)}</TableCell>
                )}
              </TableRow>
            )}
          </TableBody>
        </Table>

        <div className="flex justify-end pt-5">
          {/* แก้ไขส่วน Pagination */}
          <Pagination
            isCompact
            showControls
            showShadow
            color="primary"
            page={page}
            total={pages}
            onChange={(page) => setPage(page)}
          />
        </div>
      </div>
    </>
  );
}
