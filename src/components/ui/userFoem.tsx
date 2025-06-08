import { Email, Lock, Person, PhoneIphone } from "@mui/icons-material";
import { FormControl, MenuItem, Select } from "@mui/material";
import { useState } from "react";

interface UserFormProps {
  isNew: boolean;
  onChange: (data: {
    name: string;
    email: string;
    role: string;
    password: string;
    phone_num: string;
  }) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initialData: any;
}

export default function UserForm({ onChange, initialData }: UserFormProps) {
  const [userData, setUserData] = useState({
    name: initialData.name || "",
    email: initialData.email || "",
    role: initialData.role || "",
    password: "",
    phone_num: initialData.phone_num || "",
  });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors] = useState<{ [key: string]: string }>({});

  // تحديث البيانات عند كل تغيير
  const updateAndNotify = (newData: typeof userData) => {
    setUserData(newData);
    onChange({ ...newData });
  };

  return (
    <>
      {/* الاسم */}
      <div className="relative flex items-center mt-8 admin-scrollbar">
        <span className="absolute">
          <Person className="mx-2 text-gray-400 dark:text-gray-500" />
        </span>
        <input
          type="text"
          value={userData.name}
          onChange={(e) => {
            const newData = { ...userData, name: e.target.value };
            updateAndNotify(newData);
          }}
          className="block w-full py-3 text-gray-900 bg-white border rounded-lg px-11 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 focus:border-accent focus:ring-accent focus:outline-none focus:ring focus:ring-opacity-40 transition-colors duration-300"
          placeholder="Name"
          required
        />
      </div>

      {/* رقم الهاتف */}
      <div className="relative flex items-center mt-4">
        <span className="absolute">
          <PhoneIphone className="mx-2 text-gray-400 dark:text-gray-500" />
        </span>
        <input
          dir="rtl"
          type="tel"
          value={userData.phone_num}
          onChange={(e) => {
            const newData = { ...userData, phone_num: e.target.value };
            updateAndNotify(newData);
          }}
          className={`block w-full py-3 text-gray-900 bg-white border rounded-lg px-11 dark:bg-gray-700 dark:text-gray-200 ${
            errors.phone_num
              ? "border-red-500 focus:border-red-500 focus:ring-red-300"
              : "dark:border-gray-600 focus:border-accent focus:ring-accent"
          } focus:outline-none focus:ring focus:ring-opacity-40 transition-colors duration-300`}
          placeholder="Phone Number"
          required
          style={{ textAlign: "right" }} // هنا أضفت هذا السطر
        />
      </div>

      {/* البريد الإلكتروني */}
      <div className="relative flex items-center mt-4">
        <span className="absolute">
          <Email className="mx-2 text-gray-400 dark:text-gray-500" />
        </span>
        <input
          type="email"
          value={userData.email}
          onChange={(e) => {
            const newData = { ...userData, email: e.target.value };
            updateAndNotify(newData);
          }}
          className={`block w-full py-3 text-gray-900 bg-white border rounded-lg px-11 dark:bg-gray-700 dark:text-gray-200 ${
            errors.email
              ? "border-red-500 focus:border-red-500 focus:ring-red-300"
              : "dark:border-gray-600 focus:border-accent focus:ring-accent"
          } focus:outline-none focus:ring focus:ring-opacity-40 transition-colors duration-300`}
          placeholder="Email Address"
          required
        />
      </div>
      <FormControl fullWidth size="small">
        <Select
          className="w-full mt-2"
          value={userData.role}
          onChange={(e) => {
            const selected = e.target.value;
            const newData = { ...userData, role: selected };
            updateAndNotify(newData);
          }}
        >
          <MenuItem value={"ADMIN"}>مسؤول</MenuItem>
          <MenuItem value={"USER"}>مستخدم</MenuItem>
        </Select>
      </FormControl>
      {/* كلمة المرور */}
      <div className="relative flex items-center mt-4">
        <span className="absolute">
          <Lock className="mx-2 text-gray-400 dark:text-gray-500" />
        </span>
        <input
          type="password"
          value={userData.password}
          onChange={(e) => {
            const newData = { ...userData, password: e.target.value };
            updateAndNotify(newData);
          }}
          className={`block w-full px-10 py-3 text-gray-900 bg-white border rounded-lg dark:bg-gray-700 dark:text-gray-200 ${
            errors.password
              ? "border-red-500 focus:border-red-500 focus:ring-red-300"
              : "dark:border-gray-600 focus:border-accent focus:ring-accent"
          } focus:outline-none focus:ring focus:ring-opacity-40 transition-colors duration-300`}
          placeholder="Password"
          required
          minLength={8}
        />
      </div>

      {/* تأكيد كلمة المرور */}
      <div className="relative flex items-center mt-4">
        <span className="absolute">
          <Lock className="mx-2 text-gray-400 dark:text-gray-500" />
        </span>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className={`block w-full px-10 py-3 text-gray-900 bg-white border rounded-lg dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 focus:outline-none transition-colors duration-300 ${
            confirmPassword && confirmPassword !== userData.password
              ? "border-red-500 focus:border-red-500 focus:ring-red-300"
              : "focus:border-accent focus:ring-accent"
          } focus:ring focus:ring-opacity-40`}
          placeholder="Confirm Password"
          required
          minLength={8}
        />
      </div>
    </>
  );
}
