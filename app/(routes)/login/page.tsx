"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { AlertCircle, Mail, Lock, User, Eye, EyeOff } from "lucide-react";
import Logo from "@/components/ui/icon/Logo.svg";

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

          {/* Divider */}
          <div className="my-6 flex items-center">
            <div className="flex-grow border-t border-neutral-700"></div>
            <span className="mx-4 flex-shrink text-sm text-neutral-500">
              或使用以下方式登录
            </span>
            <div className="flex-grow border-t border-neutral-700"></div>
          </div>

          {/* Social Logins */}
          <div className="space-y-4">
            <button
              onClick={() => signIn("github")}
              className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-neutral-700 rounded-xl hover:bg-neutral-800 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:ring-offset-2 focus:ring-offset-neutral-900 transform hover:scale-[1.02] active:scale-[0.98]"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
              <span className="font-medium text-white">使用GitHub登录</span>
            </button>
            <button
              onClick={() => signIn("google")}
              className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-neutral-700 rounded-xl hover:bg-neutral-800 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:ring-offset-2 focus:ring-offset-neutral-900 transform hover:scale-[1.02] active:scale-[0.98]"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 48 48" fill="currentColor"><path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path><path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path><path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path><path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571l6.19,5.238C42.012,36.49,44,30.638,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path></svg>
              <span className="font-medium text-white">使用Google登录</span>
            </button>
          </div>

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
