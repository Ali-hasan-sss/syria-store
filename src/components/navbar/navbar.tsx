"use client";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ThemeToggle from "../ui/them_toggle";
import { useSelector, useDispatch } from "react-redux";
import { IsLoggedIn, logout } from "@/store/features/Auth/authSlice";
import { AppDispatch, RootState } from "@/store";
import NotificationMenu from "./notificationMenu";
import { Login } from "@mui/icons-material";
import ClientOnly from "../hooks/ClientOnly";
import { Menu } from "@mui/icons-material";

interface NavItem {
  label: string;
  href: string;
}

const navItems: NavItem[] = [
  { label: "الرئيسية", href: "/" },
  { label: "المنتجات", href: "/store" },
];

interface NavbarProps {
  isFixed?: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ isFixed = false }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const pathname = usePathname();
  const dispatch = useDispatch<AppDispatch>();

  const isLoggedIn = useSelector(IsLoggedIn);
  const user = useSelector((state: RootState) => state.auth.user);
  const isAdmin = user?.role === "ADMIN";

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);
  const handleLogOut = () => dispatch(logout());
  return (
    <nav
      className={`${
        isFixed
          ? "fixed top-0 left-0 right-0 z-50 text-gray-100 dark:text-white backdrop-blur-md"
          : "relative bg-gray-200 text-gray-900 dark:text-gray-100 dark:bg-gray-900"
      } transition-all`}
    >
      <div className="max-w-screen-xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between md:justify-start">
          {/* Right side: Logo + Theme toggle */}
          <div className="hidden md:flex  items-center gap-3 order-1 md:order-1">
            <Link href="/" className="flex items-center">
              <img
                src="https://flowbite.com/docs/images/logo.svg"
                className="h-8"
                alt="Logo"
              />
            </Link>
            <ClientOnly>
              <ThemeToggle />
            </ClientOnly>
          </div>

          {/* Middle: Nav links (only for md and up) */}
          <div className="hidden md:flex justify-center flex-1 order-2">
            <ul className="flex gap-6 font-medium">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`px-3 py-2 rounded-sm ${
                        isActive ? "text-secondary" : " hover:text-secondary"
                      }`}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Left side (on md+): Notification + avatar or login */}
          <div className="hidden md:flex items-center gap-3 ms-auto order-3">
            <ClientOnly>
              {isLoggedIn ? (
                <>
                  <NotificationMenu />
                  <button
                    type="button"
                    className="flex text-sm bg-gray-800 rounded-full focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
                    onClick={toggleDropdown}
                  >
                    <img
                      className="w-8 h-8 rounded-full"
                      src="/images/profile-picture-3.jpg"
                      alt="user photo"
                    />
                  </button>
                </>
              ) : (
                <button
                  className="text-sm border border-secondary hover:bg-primary  px-3 py-1 rounded-md"
                  onClick={() => window.location.replace("/register")}
                >
                  <Login fontSize="small" className="inline mr-1" />
                  التسجيل
                </button>
              )}
            </ClientOnly>
          </div>

          {/* Small screen: hamburger + avatar center */}
          <div className="flex md:hidden items-center justify-between w-full mt-3">
            {/* Center: avatar + notifications */}
            <div className="flex md:hidden  items-center gap-3">
              <Link href="/" className="flex items-center">
                <img
                  src="https://flowbite.com/docs/images/logo.svg"
                  className="h-8"
                  alt="Logo"
                />
              </Link>
              <ClientOnly>
                {" "}
                <ThemeToggle />
              </ClientOnly>
            </div>{" "}
            <div className="flex items-center gap-3 mx-auto">
              <ClientOnly>
                {isLoggedIn ? (
                  <>
                    <NotificationMenu />
                    <button
                      type="button"
                      className="flex text-sm bg-gray-800 rounded-full focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
                      onClick={toggleDropdown}
                    >
                      <img
                        className="w-8 h-8 rounded-full"
                        src="/images/profile-picture-3.jpg"
                        alt="user photo"
                      />
                    </button>
                  </>
                ) : (
                  <button
                    className="text-sm border border-secondary hover:bg-primary  px-3 py-1 rounded-md"
                    onClick={() => window.location.replace("/register")}
                  >
                    <Login fontSize="small" className="inline mr-1" />
                    التسجيل
                  </button>
                )}{" "}
              </ClientOnly>
            </div>
            {/* Hamburger on left */}
            <button
              type="button"
              className="p-2 text-secondary-light rounded-lg hover:bg-secondary/10 transition"
              onClick={() => {
                const nav = document.getElementById("navbar-user");
                if (nav) nav.classList.toggle("hidden");
              }}
            >
              <Menu />
            </button>
          </div>
        </div>

        {/* Dropdown user menu */}
        <ClientOnly>
          {dropdownOpen && isLoggedIn && (
            <div className="z-50 absolute left-5 top-20 md:top-16 w-60 bg-white dark:bg-gray-700 divide-y divide-gray-100 dark:divide-gray-600 rounded-lg shadow-md">
              <div className="px-4 py-3">
                <span className="block text-sm font-semibold text-gray-900 dark:text-white">
                  {user?.name}
                </span>
                <span className="block text-sm text-gray-500 truncate dark:text-gray-400">
                  {user?.email}
                </span>
              </div>
              <ul className="py-2">
                {isAdmin && (
                  <li>
                    <Link
                      href="/admin/dashboard"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-600"
                    >
                      لوحة التحكم
                    </Link>
                  </li>
                )}
                <li>
                  <button
                    onClick={handleLogOut}
                    className="block w-full px-4 py-2 text-sm text-red-700 hover:bg-red-200 dark:text-red-400 dark:hover:bg-gray-600"
                  >
                    تسجيل الخروج
                  </button>
                </li>
              </ul>
            </div>
          )}
        </ClientOnly>

        {/* Mobile nav menu */}
        <div
          id="navbar-user"
          className="hidden md:hidden mt-3 border-t pt-3 dark:border-gray-700"
        >
          <ul className="flex flex-col gap-3 text-center">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`block py-2 rounded-lg px-4 ${
                      isActive
                        ? "text-secondary bg-gray-100 dark:bg-gray-800"
                        : "text-gray-800 dark:text-white hover:text-secondary  hover:bg-gray-100 hover:dark:bg-gray-800"
                    }`}
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
