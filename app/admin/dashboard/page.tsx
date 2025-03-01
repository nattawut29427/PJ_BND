"use client";

import type { Selection } from "@heroui/react";

import React, { useEffect, useState } from "react";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
} from "@heroui/react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  User,
  Chip,
  ChipProps,
  Pagination,
  Spinner,
  Alert,
} from "@heroui/react";


import ModalUS from "@/app/admin/dashboard/Component/ModalUS";
import Find from "@/components/Find";
import ModalEdit from "@/app/admin/dashboard/Component/ModalEdit";
import Delete from "@/app/admin/dashboard/Component/Delete";


const columns = [
  { name: "No", uid: "No" },
  { name: "NAME", uid: "name" },
  { name: "ROLE", uid: "role" },
  { name: "Phone", uid: "phone" },
  { name: "ACTIONS", uid: "actions" },
  { name: "DELETE", uid: "delete" },
];


const statusColorMap: Record<string, ChipProps["color"]> = {
  active: "success",
  paused: "danger",
  vacation: "warning",
};

type User = {
  id: number;
  name: string;
  role: string;
  phone: string;
  status: string;
  image: string;
  email: string;
  no:number;
};
// export type IconSvgProps = SVGProps<SVGSVGElement> & {
//   size?: number;
// };


// export const EyeIcon = (props: IconSvgProps) => (
//   <svg
//     aria-hidden="true"
//     fill="none"
//     focusable="false"
//     height="1em"
//     role="presentation"
//     viewBox="0 0 20 20"
//     width="1em"
//     {...props}
//   >
//     <path
//       d="M12.9833 10C12.9833 11.65 11.65 12.9833 10 12.9833C8.35 12.9833 7.01666 11.65 7.01666 10C7.01666 8.35 8.35 7.01666 10 7.01666C11.65 7.01666 12.9833 8.35 12.9833 10Z"
//       stroke="currentColor"
//       strokeLinecap="round"
//       strokeLinejoin="round"
//       strokeWidth={1.5}
//     />
//     <path
//       d="M9.99999 16.8916C12.9417 16.8916 15.6833 15.1583 17.5917 12.1583C18.3417 10.9833 18.3417 9.00831 17.5917 7.83331C15.6833 4.83331 12.9417 3.09998 9.99999 3.09998C7.05833 3.09998 4.31666 4.83331 2.40833 7.83331C1.65833 9.00831 1.65833 10.9833 2.40833 12.1583C4.31666 15.1583 7.05833 16.8916 9.99999 16.8916Z"
//       stroke="currentColor"
//       strokeLinecap="round"
//       strokeLinejoin="round"
//       strokeWidth={1.5}
//     />
//   </svg>
// );




export default function App() {
  const [alertStatus, setAlertStatus] = useState<"success" | "error" | null>(
    null
  );
  const [alertMessage, setAlertMessage] = useState("");

  const [users, setUsers] = useState<User[]>([]);
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
    return users.filter((user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [users, searchQuery]);

  const showAlert = (status: "success" | "error", message: string) => {
    setAlertStatus(status);
    setAlertMessage(message);

    setTimeout(() => {
      window.location.reload();
    }, 3000); // 3 วินาทีหลังจากแสดง Alert
  };

  const handleUserDeleted = () => {
    showAlert("success", "User deleted successfully!");
  };

  const [currentPage, setCurrentPage] = React.useState(1);
  const rowsPerPage = 6;

  const pages = Math.ceil(users.length / rowsPerPage);

  const items = React.useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    const end = start + rowsPerPage;
   
    return filteredUsers.slice(start, end);
 
  }, [currentPage, filteredUsers]);

  function formatPhoneNumber(phone: string) {
    if (phone) {
      return phone.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3");
    } else {
      return false;
    }
  }

  // Fetch users from API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/users");
        const data = await response.json();
   
        setUsers(data);
    
      } catch (error) {
     
        return (error)
     
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const itemsWithIndex = items.map((item) => {
    const index = users.findIndex((s) => s.id === item.id);
 
    return { ...item, no: index + 1 };
 
  });

  const renderCell = React.useCallback((user: User, columnKey: React.Key) => {
    const cellValue = user[columnKey as keyof User];

    switch (columnKey) {
      case "No":
        return(
          <p>{user.no}</p>
        )
      case "name":
        return (
          <User
            avatarProps={{ radius: "lg", src: user.image }}
            description={user.email}
            name={cellValue}
          >
            {user.email}
          </User>
        );
      case "role":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-sm capitalize">{cellValue}</p>
          </div>
        );
      case "phone":
        return cellValue ? (
          <Chip
            className="capitalize"
            color={statusColorMap[user.phone] || undefined}
            size="sm"
            variant="flat"
          >
            {formatPhoneNumber(cellValue as string)}
          </Chip>
        ) : null;
      case "actions":
        return (
          <div className="relative flex items-center justify-center gap-2">
            <ModalEdit email={user.email} />
            {/* Other action icons */}
          </div>
        );
      case "delete":
        return (
          <div>
            <Delete email={user.email} onUserDeleted={handleUserDeleted} />
          </div>
        );
      default:
        return cellValue;
    }
  }, []);

  if (loading) {
    return (
      <Spinner
        className="flex justify-center items-center m-auto w-1/2 h-1/2"
        color="primary"
        size="lg"
      />
    );
  }

  return (
    <>
      <div className="flex-row">
        {alertStatus && (
          <Alert
          className="fixed bottom-4 left-4 z-50"
          color={alertStatus === "success" ? "success" : "danger"}
          description={alertMessage}
          title={alertStatus === "success" ? "Success" : "Error"}
          onClose={() => setAlertStatus(null)}
          />
        )}
        <div className="flex justify-end pb-5 gap-5">
          <Find
            className="border rounded px-2 py-1"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)} // อัปเดตคำค้นหา
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
          <ModalUS />
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
          <TableBody items={itemsWithIndex}>
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
            page={currentPage}
            total={pages}
            onChange={(page) => setCurrentPage(page)}
          />
        </div>
      </div>
    </>
  );
}
