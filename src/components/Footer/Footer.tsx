"use client";

import { fetchCategories } from "@/store/features/categories/categoriesSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { Facebook, Instagram, X } from "@mui/icons-material";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";

const Footer = () => {
  const categories = useAppSelector((state) => state.categories.categories);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchCategories());
  }, []);

  // تقسيم الفئات إلى نصفين لعمل عمودين
  const half = Math.ceil(categories.length / 2);
  const firstHalf = categories.slice(0, half);
  const secondHalf = categories.slice(half);

  return (
    <footer className="bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-50">
      <div className="container p-6 mx-auto">
        <div className="lg:flex lg:justify-between">
          {/* القسم الأول: الشعار وروابط التواصل */}
          <div className="lg:w-2/5 z-10 mb-6 lg:mb-0">
            <Link href="#">
              <Image
                src="https://merakiui.com/images/full-logo.svg"
                alt="MerakiUI Logo"
                width={120}
                height={28}
                className="h-7 w-auto"
              />
            </Link>
            <p className="max-w-sm mt-2  text-gray-700 dark:text-gray-50">
              انضم لأكثر من 31,000 شخص ولا تفوّت أي نصائح أو دروس جديدة.
            </p>

            <div className="flex mt-6 space-x-4 rtl:space-x-reverse">
              {[
                { href: "#", label: "Facebook", icon: <Facebook /> },
                { href: "#", label: "Instagram", icon: <Instagram /> },
                { href: "#", label: "X", icon: <X /> },
              ].map((item, i) => (
                <Link
                  key={i}
                  href={item.href}
                  aria-label={item.label}
                  className="text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
                >
                  {item.icon}
                </Link>
              ))}
            </div>
          </div>

          {/* القسم الثاني: روابط الفئات */}
          <div className="lg:w-2/5 z-10 grid grid-cols-2 gap-4">
            {[firstHalf, secondHalf].map((group, idx) => (
              <div key={idx} className="space-y-2">
                {group.map((item, i) => (
                  <Link
                    key={i}
                    href={`/store/${item._id}`}
                    className="block text-sm hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            ))}
          </div>
        </div>

        <hr className="my-6 border-gray-800 z-10 dark:border-gray-50" />

        <div className="text-center text-sm z-10 text-gray-700 dark:text-gray-50">
          <p className="">جميع الحقوق محفوظة © 2025 | Syria Store</p>
          <p>
            Dev By Ali <span className="text-secondary-dark">Hasan</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
