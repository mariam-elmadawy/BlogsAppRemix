import { Outlet } from "@remix-run/react";
import React from "react";

export default function auth() {
  return (
    <div>
      <Outlet />
    </div>
  );
}
