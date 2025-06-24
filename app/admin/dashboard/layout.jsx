"use client";

import React from "react";
import AdminHeader from "../component/AdminHeader";

export default function DashboardLayout({ children }) {
  return (
    <>
      <AdminHeader />
      {children}
    </>
  );
}
