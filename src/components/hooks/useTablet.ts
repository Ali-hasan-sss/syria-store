// src/hooks/useIsTablet.ts
import { useEffect, useState } from "react";

export default function useTablet(min = 768, max = 1024): boolean {
  const [isTablet, setIsTablet] = useState(false);

  useEffect(() => {
    const checkScreen = () => {
      const width = window.innerWidth;
      setIsTablet(width >= min && width <= max);
    };

    checkScreen();
    window.addEventListener("resize", checkScreen);

    return () => window.removeEventListener("resize", checkScreen);
  }, [min, max]);

  return isTablet;
}
