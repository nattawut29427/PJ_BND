"use client";

import React from "react";
import Drawer from "@/app/admin/components/Drawer";

function orderpage() {
  return (
    <>
      <div>Order</div>
      <div className="absolute top-5 left-5">
        <Drawer />
      </div>
    </>
  );
}

export default orderpage;
