"use client";
import Drawer from "@/app/user/components/Drawer";

import { Navbar, NavbarBrand, NavbarContent, Input } from "@heroui/react";

import React, { useState, useRef } from "react";

export default function App() {

    
  return (
    <>
      <Navbar>
        <NavbarContent justify="start">
          <NavbarBrand className="mr-4">
            <Drawer />
          </NavbarBrand>
        </NavbarContent>
      </Navbar>

    </>
  );
}
