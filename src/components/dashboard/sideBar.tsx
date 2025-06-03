import { Home, PanTool, Person, Shop, ShoppingCart } from "@mui/icons-material";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function SideBar() {
  const pathname = usePathname();
  const sideItems = [
    { label: "Home", icon: <Home />, path: "/admin/dashboard" },
    { label: "Users", icon: <Person />, path: "/admin/dashboard/users" },
    {
      label: "Product",
      icon: <ShoppingCart />,
      path: "/admin/dashboard/product",
    },
    { label: "Sales", icon: <Shop />, path: "/admin/dashboard/sales" },
  ];
  const sideItems1 = [
    {
      label: "Sittings",
      icon: <PanTool />,
      path: "//admin/dashboard/sittings",
    },
  ];
  return (
    <aside className="flex flex-col w-64 px-4 py-8 overflow-y-auto bg-gray-100 border-r rtl:border-r-0 rtl:border-l dark:bg-background-dark dark:border-gray-700">
      <div className="flex flex-col justify-between flex-1 mt-6">
        <nav>
          {sideItems.map((item, index) => (
            <Link
              className={`flex items-center mt-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-secondary hover:dark:bg-secondary rounded-md dark:bg-gray-800 dark:text-gray-200 ${
                item.path === pathname ? "bg-secondary dark:bg-secondary" : ""
              }`}
              href={item.path}
              key={index}
            >
              {item.icon}
              <span className="mx-4 font-medium">{item.label}</span>
            </Link>
          ))}
          <hr className="my-6 border-gray-200 dark:border-gray-600" />
          {sideItems1.map((item, index) => (
            <Link
              className={`flex items-center mt-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-secondary hover:dark:bg-secondary rounded-md dark:bg-gray-800 dark:text-gray-200 ${
                item.path === pathname ? "bg-secondary dark:bg-secondary" : ""
              }`}
              href={item.path}
              key={index}
            >
              {item.icon}
              <span className="mx-4 font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>

        <a href="#" className="flex items-center px-4 -mx-2">
          <img
            className="object-cover mx-2 rounded-full h-9 w-9"
            src="https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80"
            alt="avatar"
          />
          <span className="mx-2 font-medium text-gray-800 dark:text-gray-200">
            Ali hasan
          </span>
        </a>
      </div>
    </aside>
  );
}
