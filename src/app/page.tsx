"use client";

import HeroSection from "@/components/hero/HeroSection";
import Navbar from "@/components/navbar/navbar";

export default function HomePage() {
  return (
    <div className="">
      <Navbar isFixed />
      <HeroSection />
    </div>
  );
}
