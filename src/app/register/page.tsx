"use client";
import Navbar from "@/components/navbar/navbar";
import { AppDispatch } from "@/store";
import { loginSuccess } from "@/store/features/Auth/authSlice";
import api from "@/utils/axios";
import { Email, Lock, Person, PhoneIphone } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "sonner";

const RegisterForm: React.FC = () => {
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [login, setLogin] = useState(true);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    password: "",
    phoneNum: "",
  });
  const [loginData, setLoginData] = useState({
    identifier: "",
    password: "",
  });
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setErrors({});

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^09\d{8}$/;

    if (login) {
      const newErrors: { [key: string]: string } = {};

      const identifier = loginData.identifier.trim();
      const password = loginData.password;

      if (!identifier) {
        newErrors.identifier = "هذا الحقل مطلوب.";
      } else if (!emailRegex.test(identifier) && !phoneRegex.test(identifier)) {
        newErrors.identifier = "يرجى إدخال بريد إلكتروني أو رقم هاتف صحيح.";
      }

      if (!password) {
        newErrors.password = "هذا الحقل مطلوب.";
      } else if (password.length < 8) {
        newErrors.password = "كلمة المرور يجب أن تكون 8 أحرف على الأقل.";
      }

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        toast.error("يرجى تصحيح الحقول قبل المتابعة.");
        return;
      }
    } else {
      const newErrors: { [key: string]: string } = {};

      if (!registerData.name || registerData.name.length < 3) {
        newErrors.name = "الاسم يجب أن يكون 3 أحرف على الأقل.";
      }

      if (!emailRegex.test(registerData.email)) {
        newErrors.email = "البريد الإلكتروني غير صالح.";
      }

      if (!phoneRegex.test(registerData.phoneNum)) {
        newErrors.phoneNum = "رقم الهاتف يجب أن يبدأ بـ 09 ويتكون من 10 أرقام.";
      }

      if (!registerData.password || registerData.password.length < 8) {
        newErrors.password = "كلمة المرور يجب أن تكون 8 أحرف على الأقل.";
      }

      if (registerData.password !== confirmPassword) {
        newErrors.confirmPassword = "تأكيد كلمة المرور غير متطابق.";
      }

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        toast.error("يرجى تصحيح الحقول قبل المتابعة.");
        return;
      }
    }

    try {
      setLoading(true);
      let res;

      if (login) {
        res = await api.post("/login", {
          identifier: loginData.identifier,
          password: loginData.password,
        });
      } else {
        res = await api.post("/register", {
          email: registerData.email,
          phone_num: registerData.phoneNum,
          password: registerData.password,
          name: registerData.name,
        });
      }

      if (res.data.success) {
        toast.success(
          login ? "تم تسجيل الدخول بنجاح!" : "تم إنشاء الحساب بنجاح!"
        );
        window.location.replace("/");

        dispatch(
          loginSuccess({
            user: res.data.data.user,
            token: res.data.data.token,
          })
        );
        if (res.data.data.user.role === "ADMIN") {
          router.push("/admin/dashboard");
        } else {
          router.push("/");
        }
        setConfirmPassword("");
        setLoginData({ identifier: "", password: "" });
        setRegisterData({ name: "", email: "", password: "", phoneNum: "" });
      } else {
        toast.error(res.data.message || "حدث خطأ أثناء العملية");
      } // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error(err);
      setErrors({}); // تصفير الأخطاء السابقة

      const response = err?.response?.data;
      const message = response?.message;

      const translatedMessages: { [key: string]: string } = {
        "Please enter a valid email or phone number.":
          "يرجى إدخال بريد إلكتروني أو رقم هاتف صحيح.",
        "Invalid email address": "البريد الإلكتروني غير صالح.",
        "Phone number must start with 09 and be 10 digits long":
          "يجب أن يبدأ رقم الهاتف بـ 09 ويتكون من 10 أرقام.",
        "Password must be at least 8 characters long":
          "كلمة المرور يجب أن تكون 8 أحرف على الأقل.",
        "Email is already taken.": "البريد الإلكتروني مستخدم بالفعل.",
        "Phone number is already taken.": "رقم الهاتف مستخدم بالفعل.",
        "User not found.": "البريد الإلكتروني أو رقم الهاتف غير مسجل.",
        "Invalid password.": "كلمة المرور غير صحيحة.",
      };

      if (login) {
        if (message === "User not found.") {
          setErrors({ identifier: "البريد الإلكتروني أو رقم الهاتف غير مسجل" });
        } else if (message === "Invalid password.") {
          setErrors({ password: "كلمة المرور غير صحيحة" });
        } else {
          toast.error(translatedMessages[message] || "حدث خطأ أثناء العملية");
        }
      } else {
        if (response?.field) {
          setErrors({
            [response.field]: translatedMessages[message] || message,
          });
        } else {
          toast.error(translatedMessages[message] || "حدث خطأ أثناء العملية");
        }
      }
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <Navbar isFixed />
      <div
        className="min-h-screen bg-cover bg-center relative"
        style={{
          backgroundImage:
            "url('https://img.daisyui.com/images/stock/photo-1507358522600-9f71e620c44e.webp')",
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/50 dark:bg-black/60 z-0" />
        <div className="w-full pt-20 max-w-md flex flex-col items-center justify-center px-6 py-8 overflow-hidden transition-colors duration-300 min-h-screen mx-auto relative z-10">
          <form
            onSubmit={handleSubmit}
            className="w-full flex-1"
            noValidate
            autoComplete="off"
          >
            <div className="flex backdrop-blur-md  items-center justify-center mt-6 border-b-[3px] border-secondary">
              <button
                type="button"
                onClick={() => setLogin(true)}
                className={`w-1/3 pb-4 font-medium text-center cursor-pointer capitalize transition-colors duration-200 ${
                  login
                    ? "border-b-4 border-secondary text-secondary dark:text-secondary"
                    : "text-white dark:text-gray-300 hover:text-secondary dark:hover:text-secondary"
                }`}
              >
                تسجيل الدخول
              </button>

              <button
                type="button"
                onClick={() => setLogin(false)}
                className={`w-1/3 pb-4 font-medium cursor-pointer text-center capitalize transition-colors duration-200 ${
                  !login
                    ? "border-b-4 border-secondary text-secondary dark:text-secondary"
                    : "text-white dark:text-gray-300 hover:text-secondary dark:hover:text-secondary"
                }`}
              >
                انشاء حساب{" "}
              </button>
            </div>

            {login ? (
              <>
                {/* البريد/الهاتف */}
                <div className="relative flex flex-col mt-6">
                  <div className="relative flex items-center">
                    <span className="absolute">
                      <Email className="mx-2 text-gray-400 dark:text-gray-500" />
                    </span>
                    <input
                      type="text"
                      value={loginData.identifier}
                      onChange={(e) =>
                        setLoginData({
                          ...loginData,
                          identifier: e.target.value,
                        })
                      }
                      className={`block w-full py-3 text-gray-900 bg-white border rounded-lg px-11 dark:bg-gray-700 dark:text-gray-200 ${
                        errors.identifier
                          ? "border-red-500 focus:border-red-500 focus:ring-red-300"
                          : "border-gray-300 focus:border-accent focus:ring-accent"
                      } focus:outline-none focus:ring focus:ring-opacity-40 transition-colors duration-300`}
                      placeholder="البريد الإلكتروني أو رقم الهاتف"
                      required
                    />
                  </div>
                  {errors.identifier && (
                    <span className="text-sm text-red-500 mt-1">
                      {errors.identifier}
                    </span>
                  )}
                </div>

                {/* كلمة المرور */}
                <div className="relative flex flex-col mt-4">
                  <div className="relative flex items-center">
                    <span className="absolute">
                      <Lock className="mx-2 text-gray-400 dark:text-gray-500" />
                    </span>
                    <input
                      type="password"
                      value={loginData.password}
                      onChange={(e) =>
                        setLoginData({ ...loginData, password: e.target.value })
                      }
                      className={`block w-full px-10 py-3 text-gray-900 bg-white border rounded-lg dark:bg-gray-700 dark:text-gray-200 ${
                        errors.password
                          ? "border-red-500 focus:border-red-500 focus:ring-red-300"
                          : "border-gray-300 focus:border-accent focus:ring-accent"
                      } focus:outline-none focus:ring focus:ring-opacity-40 transition-colors duration-300`}
                      placeholder="كلمة المرور"
                      required
                      minLength={8}
                    />
                  </div>
                  {errors.password && (
                    <span className="text-sm text-red-500 mt-1">
                      {errors.password}
                    </span>
                  )}
                </div>
              </>
            ) : (
              <>
                {/* الاسم */}
                <div className="relative flex items-center mt-8">
                  <span className="absolute">
                    <Person className="mx-2 text-gray-400 dark:text-gray-500" />
                  </span>
                  <input
                    type="text"
                    value={registerData.name}
                    onChange={(e) =>
                      setRegisterData({ ...registerData, name: e.target.value })
                    }
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
                    value={registerData.phoneNum}
                    onChange={(e) =>
                      setRegisterData({
                        ...registerData,
                        phoneNum: e.target.value,
                      })
                    }
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
                    value={registerData.email}
                    onChange={(e) =>
                      setRegisterData({
                        ...registerData,
                        email: e.target.value,
                      })
                    }
                    className={`block w-full py-3 text-gray-900 bg-white border rounded-lg px-11 dark:bg-gray-700 dark:text-gray-200 ${
                      errors.email
                        ? "border-red-500 focus:border-red-500 focus:ring-red-300"
                        : "dark:border-gray-600 focus:border-accent focus:ring-accent"
                    } focus:outline-none focus:ring focus:ring-opacity-40 transition-colors duration-300`}
                    placeholder="Email Address"
                    required
                  />
                </div>

                {/* كلمة المرور */}
                <div className="relative flex items-center mt-4">
                  <span className="absolute">
                    <Lock className="mx-2 text-gray-400 dark:text-gray-500" />
                  </span>
                  <input
                    type="password"
                    value={registerData.password}
                    onChange={(e) =>
                      setRegisterData({
                        ...registerData,
                        password: e.target.value,
                      })
                    }
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
                      confirmPassword &&
                      confirmPassword !== registerData.password
                        ? "border-red-500 focus:border-red-500 focus:ring-red-300"
                        : "focus:border-accent focus:ring-accent"
                    } focus:ring focus:ring-opacity-40`}
                    placeholder="Confirm Password"
                    required
                    minLength={8}
                  />
                </div>
              </>
            )}

            <div className="mt-6">
              <button
                type="submit"
                disabled={loading}
                className="w-full cursor-pointer px-6 py-3 text-sm font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-secondary rounded-lg hover:bg-secondary/80 focus:outline-none focus:ring focus:ring-secondary focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "جاري التسجيل..." : "Sign Up"}
              </button>

              <div className="mt-6 text-center">
                <button
                  type="button"
                  onClick={login ? () => setLogin(false) : () => setLogin(true)}
                  className="text-sm text-white hover:underline  transition-colors duration-300"
                >
                  {login
                    ? "ليس لدي حساب على المتجر؟"
                    : "لدي حساب بالفعل على المتجر!"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default RegisterForm;
