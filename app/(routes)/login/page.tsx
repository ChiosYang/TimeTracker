"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { AlertCircle, Mail, Lock, User, Eye, EyeOff } from "lucide-react";
import Logo from "@/public/Logo.svg";

export default function LoginPage() {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [nameError, setNameError] = useState("");
  const router = useRouter();

  // 实时验证邮箱
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      setEmailError("");
    } else if (!emailRegex.test(email)) {
      setEmailError("邮箱格式不正确");
    } else {
      setEmailError("");
    }
  };

  // 实时验证密码
  const validatePassword = (password: string) => {
    if (!password) {
      setPasswordError("");
    } else if (password.length < 6) {
      setPasswordError("密码至少需要6位字符");
    } else {
      setPasswordError("");
    }
  };

  // 实时验证姓名
  const validateName = (name: string) => {
    if (!name.trim()) {
      setNameError("");
    } else if (name.trim().length < 2) {
      setNameError("姓名至少需要2个字符");
    } else {
      setNameError("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // 客户端验证
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email.trim()) {
      setError("请输入邮箱地址");
      setLoading(false);
      return;
    }

    if (!emailRegex.test(email)) {
      setError("请输入有效的邮箱地址");
      setLoading(false);
      return;
    }

    if (!password) {
      setError("请输入密码");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("密码长度至少需要6位字符");
      setLoading(false);
      return;
    }

    if (isRegister) {
      if (!name.trim()) {
        setError("请输入您的姓名");
        setLoading(false);
        return;
      }

      if (name.trim().length < 2) {
        setError("姓名至少需要2个字符");
        setLoading(false);
        return;
      }
    }

    try {
      // 先调用自定义验证API
      const verifyResponse = await fetch("/api/auth/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
          password,
          name: isRegister ? name.trim() : undefined,
          isRegister: isRegister.toString(),
        }),
      });

      const verifyData = await verifyResponse.json();

      if (!verifyResponse.ok) {
        setError(verifyData.error);
        return;
      }

      // 验证成功后，使用NextAuth进行登录
      const result = await signIn("credentials", {
        email: email.trim(),
        password,
        name: isRegister ? name.trim() : undefined,
        isRegister: isRegister.toString(),
        redirect: false,
      });

      if (result?.error) {
        // 如果NextAuth还是返回错误，使用我们的自定义错误信息
        setError("登录系统异常，请稍后重试");
      } else if (result?.ok) {
        router.push("/dashboard");
        router.refresh();
      } else {
        setError("登录失败，请稍后重试");
      }
    } catch (err) {
      console.error("登录异常:", err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("网络异常，请检查网络连接后重试");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center  px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Logo className='inline-flex items-center justify-center w-28 h-28 mb-3' fill='#ffffff'/>
          <h1 className="text-3xl font-bold text-white mb-2">
            {isRegister ? "创建账户" : "欢迎回来"}
          </h1>
        </div>

        {/* Card */}
        <div className="bg-neutral-900 rounded-2xl shadow-xl border border-neutral-700 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error Alert */}
            {error && (
              <div className="flex items-center gap-3 p-4 bg-neutral-800 border border-neutral-600 rounded-xl">
                <AlertCircle className="w-5 h-5 text-neutral-400 flex-shrink-0" />
                <p className="text-sm text-neutral-300">{error}</p>
              </div>
            )}

            {/* Name Field (Register only) */}
            {isRegister && (
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-neutral-300 mb-2">
                  姓名
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-500" />
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value)
                      validateName(e.target.value)
                    }}
                    required={isRegister}
                    className={`w-full pl-11 pr-4 py-3 border rounded-xl bg-neutral-800 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:border-transparent transition-all ${
                      nameError 
                        ? "border-neutral-600 focus:ring-neutral-500" 
                        : "border-neutral-700 focus:ring-neutral-400"
                    }`}
                    placeholder="输入您的姓名"
                  />
                </div>
                {nameError && (
                  <p className="mt-1 text-sm text-neutral-400 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {nameError}
                  </p>
                )}
              </div>
            )}

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-neutral-300 mb-2">
                邮箱地址
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-500" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    validateEmail(e.target.value)
                  }}
                  required
                  className={`w-full pl-11 pr-4 py-3 border rounded-xl bg-neutral-800 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:border-transparent transition-all ${
                    emailError 
                      ? "border-neutral-600 focus:ring-neutral-500" 
                      : "border-neutral-700 focus:ring-neutral-400"
                  }`}
                  placeholder="输入您的邮箱"
                />
              </div>
              {emailError && (
                <p className="mt-1 text-sm text-neutral-400 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {emailError}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-neutral-300 mb-2">
                密码
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-500" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                    validatePassword(e.target.value)
                  }}
                  required
                  className={`w-full pl-11 pr-12 py-3 border rounded-xl bg-neutral-800 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:border-transparent transition-all ${
                    passwordError 
                      ? "border-neutral-600 focus:ring-neutral-500" 
                      : "border-neutral-700 focus:ring-neutral-400"
                  }`}
                  placeholder="输入您的密码"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-500 hover:text-neutral-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {passwordError && (
                <p className="mt-1 text-sm text-neutral-400 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {passwordError}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-white hover:bg-neutral-200 disabled:bg-neutral-600 text-black font-medium py-3 px-4 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-neutral-400 focus:ring-offset-2 focus:ring-offset-neutral-900 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                  处理中...
                </div>
              ) : (
                isRegister ? "创建账户" : "登录"
              )}
            </button>
          </form>

          {/* Switch Mode */}
          <div className="mt-6 text-center">
            <p className="text-neutral-400 text-sm">
              {isRegister ? "已有账户？" : "还没有账户？"}
              <button
                type="button"
                onClick={() => {
                  setIsRegister(!isRegister)
                  setError("")
                  setEmailError("")
                  setPasswordError("")
                  setNameError("")
                  setName("")
                  setEmail("")
                  setPassword("")
                }}
                className="ml-1 font-medium text-neutral-300 hover:text-white transition-colors"
              >
                {isRegister ? "立即登录" : "免费注册"}
              </button>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            继续即表示您同意我们的服务条款和隐私政策
          </p>
        </div>
      </div>
    </div>
  );
}
