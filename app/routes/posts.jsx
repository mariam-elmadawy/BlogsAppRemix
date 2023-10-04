import { Outlet } from "@remix-run/react";
import React from "react";

export default function posts() {
  return (
    <div>
      <Outlet />
    </div>
  );
}
