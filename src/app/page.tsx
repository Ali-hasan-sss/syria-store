"use client";
import dynamic from "next/dynamic";

export default function Home() {
  const NavBar = dynamic(() => import("@/components/navbar/navbar"), {
    ssr: false,
  });
  return (
    <div className="min-h-screen flex justify-center bg-primary dark:bg-gray-900 transition-colors duration-300">
      <NavBar />
    </div>
  );
}
