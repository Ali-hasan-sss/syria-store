"use client";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

export default function HomePage() {
  const mode = useSelector((state: RootState) => state.theme.mode);
  return <div className="dard:bg-red-500">Current Theme: {mode}</div>;
}
