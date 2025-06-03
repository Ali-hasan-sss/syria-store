"use client";

import SideBar from "@/components/dashboard/sideBar";
import "@/app/globals.css";
export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex">
      <SideBar />{" "}
      <div className="w-full h-[90vh] overflow-y-auto bg-background-light dark:bg-background-dark admin-scrollbar">
        {children}{" "}
      </div>
    </div>
  );
}
