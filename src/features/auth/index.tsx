/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { apiClient } from "../../api/client";

const Auth: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isRegister, setIsRegister] = useState(false);

  const [loginData, setLoginData] = useState({
    username: "",
    password: "",
  });

  const [registerData, setRegisterData] = useState({
    username: "",
    first_name: "",
    last_name: "",
    password: "",
    confirmPassword: "",
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!loginData.username || !loginData.password) {
      toast.error("لطفاً همه فیلدها را پر کنید");
      return;
    }

    setIsLoading(true);
    try {
      const response = await apiClient.post("/auth/login", {
        username: loginData.username,
        password: loginData.password,
      });

      const { token, user } = response.data;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      toast.success(`خوش آمدید ${user.username} 👋`);
      navigate("/dashboard");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "خطا در ورود");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !registerData.username ||
      !registerData.first_name ||
      !registerData.last_name ||
      !registerData.password
    ) {
      toast.error("لطفاً همه فیلدها را پر کنید");
      return;
    }

    if (registerData.password !== registerData.confirmPassword) {
      toast.error("رمز عبور و تکرار آن مطابقت ندارند");
      return;
    }

    if (registerData.password.length < 5) {
      toast.error("رمز عبور باید حداقل 5 کاراکتر باشد");
      return;
    }

    setIsLoading(true);
    try {
      await apiClient.post("/auth/register", {
        username: registerData.username,
        first_name: registerData.first_name,
        last_name: registerData.last_name,
        password: registerData.password,
      });

      toast.success("حساب کاربری با موفقیت ایجاد شد ✅");
      setIsRegister(false);
      setLoginData({
        username: registerData.username,
        password: "",
      });
    } catch (error: any) {
      toast.error(error.response?.data?.message || "خطا در ثبت‌نام");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setIsRegister(!isRegister);
    setLoginData({ username: "", password: "" });
    setRegisterData({
      username: "",
      first_name: "",
      last_name: "",
      password: "",
      confirmPassword: "",
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-gray-100/50 dark:border-gray-700/50">
          <div className="flex justify-center mb-6">
            <div className="max-w-55 rounded-2xl overflow-hidden flex items-center justify-center shadow-lg shadow-blue-500/25">
              <img src="/assets/images/logo/inline-logo.webp" className="" />
            </div>
          </div>

          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
              {isRegister ? "ایجاد حساب کاربری" : "خوش آمدید"}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {isRegister
                ? "برای استفاده از ستاک اسکن ثبت‌نام کنید"
                : "برای ورود به ستاک اسکن اطلاعات خود را وارد کنید"}
            </p>
          </div>

          {!isRegister && (
            <motion.form
              key="login"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onSubmit={handleLogin}
              className="space-y-5"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  نام کاربری
                </label>
                <div className="pr-2 relative flex items-center border-2 border-gray-300 dark:border-gray-600 rounded-xl transition-all duration-200 focus-within:border-primary">
                  <span className=" text-gray-400">
                    <i className="fas fa-user"></i>
                  </span>
                  <input
                    type="text"
                    value={loginData.username}
                    autoComplete="username"
                    onChange={(e) =>
                      setLoginData({ ...loginData, username: e.target.value })
                    }
                    placeholder="نام کاربری خود را وارد کنید"
                    className="w-full pr-10 pl-4 py-2! rounded-xl transition-all duration-200 border-0! "
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  رمز عبور
                </label>
                <div className="pr-2 relative flex items-center border-2 border-gray-300 dark:border-gray-600 rounded-xl transition-all duration-200 focus-within:border-primary">
                  <span className=" text-gray-400">
                    <i className="fas fa-lock"></i>
                  </span>
                  <input
                    type="password"
                    value={loginData.password}
                    onChange={(e) =>
                      setLoginData({ ...loginData, password: e.target.value })
                    }
                    autoComplete="current-password"
                    placeholder="رمز عبور خود را وارد کنید"
                    className="w-full pr-10 pl-4 py-2! rounded-xl transition-all duration-200 border-0! "
                  />
                </div>
                <div className="flex justify-end mt-1">
                  <button
                    type="button"
                    className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    رمز عبور را فراموش کرده‌اید؟
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-xl hover:scale-[1.02] transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    در حال ورود...
                  </span>
                ) : (
                  "ورود"
                )}
              </button>
            </motion.form>
          )}

          {isRegister && (
            <motion.form
              key="register"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onSubmit={handleRegister}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  نام
                </label>
                <div className="pr-2 relative flex items-center border-2 border-gray-300 dark:border-gray-600 rounded-xl transition-all duration-200 focus-within:border-primary">
                  <span className=" text-gray-400">
                    <i className="fas fa-user-circle"></i>
                  </span>
                  <input
                    type="text"
                    value={registerData.first_name}
                    onChange={(e) =>
                      setRegisterData({
                        ...registerData,
                        first_name: e.target.value,
                      })
                    }
                    placeholder="حسین"
                    className="w-full pr-10 pl-4 py-2! rounded-xl transition-all duration-200 border-0! "
                  />
                </div>
              </div>{" "}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  نام خانوادگی
                </label>
                <div className="pr-2 relative flex items-center border-2 border-gray-300 dark:border-gray-600 rounded-xl transition-all duration-200 focus-within:border-primary">
                  <span className=" text-gray-400">
                    <i className="fas fa-user-circle"></i>
                  </span>
                  <input
                    type="text"
                    value={registerData.last_name}
                    onChange={(e) =>
                      setRegisterData({
                        ...registerData,
                        last_name: e.target.value,
                      })
                    }
                    placeholder="دریس"
                    className="w-full pr-10 pl-4 py-2! rounded-xl transition-all duration-200 border-0! "
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  نام کاربری
                </label>
                <div className="pr-2 relative flex items-center border-2 border-gray-300 dark:border-gray-600 rounded-xl transition-all duration-200 focus-within:border-primary">
                  <span className=" text-gray-400">
                    <i className="fas fa-user"></i>
                  </span>
                  <input
                    type="text"
                    value={registerData.username}
                    onChange={(e) =>
                      setRegisterData({
                        ...registerData,
                        username: e.target.value,
                      })
                    }
                    placeholder="نام کاربری (فقط حروف و اعداد)"
                    className="w-full pr-10 pl-4 py-2! rounded-xl transition-all duration-200 border-0! "
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  رمز عبور
                </label>
                <div className="pr-2 relative flex items-center border-2 border-gray-300 dark:border-gray-600 rounded-xl transition-all duration-200 focus-within:border-primary">
                  <span className=" text-gray-400">
                    <i className="fas fa-lock"></i>
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
                    placeholder="حداقل 5 کاراکتر"
                    className="w-full pr-10 pl-4 py-2! rounded-xl transition-all duration-200 border-0! "
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  تکرار رمز عبور
                </label>
                <div className="pr-2 relative flex items-center border-2 border-gray-300 dark:border-gray-600 rounded-xl transition-all duration-200 focus-within:border-primary">
                  <span className=" text-gray-400">
                    <i className="fas fa-check-circle"></i>
                  </span>
                  <input
                    type="password"
                    value={registerData.confirmPassword}
                    onChange={(e) =>
                      setRegisterData({
                        ...registerData,
                        confirmPassword: e.target.value,
                      })
                    }
                    placeholder="رمز عبور را دوباره وارد کنید"
                    className="w-full pr-10 pl-4 py-2! rounded-xl transition-all duration-200 border-0! "
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-xl hover:scale-[1.02] transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    در حال ثبت‌نام...
                  </span>
                ) : (
                  "ثبت‌نام"
                )}
              </button>
            </motion.form>
          )}

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {isRegister ? "قبلاً ثبت‌نام کرده‌اید؟" : "حساب کاربری ندارید؟"}
              <button
                type="button"
                onClick={toggleMode}
                className="mr-2 text-blue-600 dark:text-blue-400 font-medium hover:underline"
              >
                {isRegister ? "وارد شوید" : "ثبت‌نام کنید"}
              </button>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Auth;
