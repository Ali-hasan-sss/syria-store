"use client";

import HeroSection from "@/components/hero/HeroSection";
import LatestProduct from "@/components/home/latest-products";
import Navbar from "@/components/navbar/navbar";

export default function HomePage() {
  return (
    <div className="">
      <Navbar isFixed />
      <HeroSection />
      <LatestProduct type="latest" />
      <LatestProduct type="top-rated" />
    </div>
  );
}
