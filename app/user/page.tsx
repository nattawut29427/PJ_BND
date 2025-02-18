"use client";
import Drawer from "@/app/user/components/Drawer";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  Input,
  Avatar,
} from "@heroui/react";

export const SearchIcon = ({
  size = 24,
  strokeWidth = 1.5,
  width,
  height,
  ...props
}) => {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      focusable="false"
      height={height || size}
      role="presentation"
      viewBox="0 0 24 24"
      width={width || size}
      {...props}
    >
      <path
        d="M11.5 21C16.7467 21 21 16.7467 21 11.5C21 6.25329 16.7467 2 11.5 2C6.25329 2 2 6.25329 2 11.5C2 16.7467 6.25329 21 11.5 21Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={strokeWidth}
      />
      <path
        d="M22 22L20 20"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={strokeWidth}
      />
    </svg>
  );
};

export default function App() {
  return (
    <>
      {" "}
      <Navbar>
        <NavbarContent justify="start">
          <NavbarBrand className="mr-4">
            <Drawer />
          </NavbarBrand>
        </NavbarContent>

        <NavbarContent
          as="div"
          className="flex items-center justify-between sm:justify-start md:justify-end"
        >
          <Input
            className="w-full max-w-full sm:max-w-[20rem] md:max-w-[24rem] lg:max-w-[28rem] h-10"
            classNames={{
              mainWrapper: "h-full",
              input: "text-small md:text-base lg:text-lg",
              inputWrapper:
                "h-full font-normal text-default-500 bg-default-400/20 dark:bg-default-500/20 " +
                "sm:bg-default-300/20 md:bg-default-200/20 lg:bg-default-100/20",
            }}
            placeholder="Type to search..."
            size="sm"
            startContent={<SearchIcon size={18} />}
            type="search"
          />
        </NavbarContent>
      </Navbar>
    </>
  );
}
