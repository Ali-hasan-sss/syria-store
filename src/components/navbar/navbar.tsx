"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ThemeToggle from "../ui/them_toggle";
import { useSelector } from "react-redux";
import { IsLoggedIn, logout } from "@/store/features/Auth/authSlice";
import NotificationMenu from "./notificationMenu";
import { useDispatch } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { Login } from "@mui/icons-material";

interface NavItem {
  label: string;
  href: string;
}

const navItems: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Pricing", href: "/pricing" },
  { label: "Contact", href: "/contact" },
];

const Navbar: React.FC = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };
  const isLoggedIn = useSelector(IsLoggedIn);
  const user = useSelector((state: RootState) => state.auth.user);
  const isAdmin = user?.role === "ADMIN";
  const dispatch = useDispatch<AppDispatch>();
  const handleLogOut = () => {
    dispatch(logout());
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <nav className="bg-white border-gray-200 dark:bg-gray-900">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <Link
          href="/"
          className="flex items-center space-x-3 rtl:space-x-reverse"
        >
          <img
            src="https://flowbite.com/docs/images/logo.svg"
            className="h-8"
            alt="Flowbite Logo"
          />
        </Link>
        <ThemeToggle />
        {/* زر المستخدم */}
        {!mounted ? null : !isLoggedIn ? (
          <button
            className="text-secondary hover:text-gray-50 font-bold flex gap-2 py-1 px-2 border-[2px] border-secondary hover:border-transparent hover:bg-secondary rounded"
            onClick={() => window.location.replace("/register")}
          >
            <Login />
            التسجيل
          </button>
        ) : (
          <>
            <NotificationMenu />
            <button
              type="button"
              className="flex text-sm bg-gray-800 rounded-full md:me-0 focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
              id="user-menu-button"
              aria-expanded={dropdownOpen}
              onClick={toggleDropdown}
            >
              <span className="sr-only">Open user menu</span>
              <img
                className="w-8 h-8 rounded-full"
                src="/images/profile-picture-3.jpg"
                alt="user photo"
              />
            </button>

            {/* Dropdown menu */}
            {dropdownOpen && (
              <div
                className="z-50 fixed left-5 top-10 my-4 text-base list-none bg-white divide-y divide-gray-100 rounded-lg shadow-sm dark:bg-gray-700 dark:divide-gray-600"
                id="user-dropdown"
              >
                <div className="px-4 py-3">
                  <span className="block text-sm text-gray-900 dark:text-white">
                    {user?.name}
                  </span>
                  <span className="block text-sm text-gray-500 truncate dark:text-gray-400">
                    {user?.email}{" "}
                  </span>
                </div>
                <ul className="py-2" aria-labelledby="user-menu-button">
                  {isAdmin && (
                    <li>
                      <a
                        href="/admin/dashboard"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                      >
                        لوحة التحكم
                      </a>
                    </li>
                  )}

                  <li>
                    <button
                      onClick={handleLogOut}
                      className="block w-full px-4 py-2 text-sm text-red-700 hover:bg-red-200 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                    >
                      تسجيل الخروج
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </>
        )}
        <div className="flex items-center md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
          {/* زر القائمة المتحركة في الأجهزة الصغيرة */}
          <button
            data-collapse-toggle="navbar-user"
            type="button"
            className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
            aria-controls="navbar-user"
            aria-expanded="false"
            onClick={() => {
              const nav = document.getElementById("navbar-user");
              if (nav) nav.classList.toggle("hidden");
            }}
          >
            <span className="sr-only">Open main menu</span>
            <svg
              className="w-5 h-5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 17 14"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M1 1h15M1 7h15M1 13h15"
              />
            </svg>
          </button>
        </div>
        {/* القائمة */}
        <div
          className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1"
          id="navbar-user"
        >
          <ul className="flex flex-col font-medium p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`block py-2 px-3 rounded-sm md:p-0 ${
                      isActive
                        ? "text-secondary  md:bg-transparent md:text-secondary md:dark:text-secondary"
                        : "text-gray-900 hover:bg-gray-100 md:hover:bg-transparent md:hover:text-secondary dark:text-white md:dark:hover:text-secondary dark:hover:bg-gray-700 dark:hover:text-secondary md:dark:hover:bg-transparent"
                    }`}
                    aria-current={isActive ? "page" : undefined}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
