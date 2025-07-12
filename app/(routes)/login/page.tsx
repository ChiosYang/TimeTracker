"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { AlertCircle, Mail, Lock, User, Eye, EyeOff } from "lucide-react"

export default function LoginPage() {
  const [isRegister, setIsRegister] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [emailError, setEmailError] = useState("")
  const [passwordError, setPasswordError] = useState("")
  const [nameError, setNameError] = useState("")
  const router = useRouter()

  // 实时验证邮箱
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!email.trim()) {
      setEmailError("")
    } else if (!emailRegex.test(email)) {
      setEmailError("邮箱格式不正确")
    } else {
      setEmailError("")
    }
  }

  // 实时验证密码
  const validatePassword = (password: string) => {
    if (!password) {
      setPasswordError("")
    } else if (password.length < 6) {
      setPasswordError("密码至少需要6位字符")
    } else {
      setPasswordError("")
    }
  }

  // 实时验证姓名
  const validateName = (name: string) => {
    if (!name.trim()) {
      setNameError("")
    } else if (name.trim().length < 2) {
      setNameError("姓名至少需要2个字符")
    } else {
      setNameError("")
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    // 客户端验证
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    
    if (!email.trim()) {
      setError("请输入邮箱地址")
      setLoading(false)
      return
    }
    
    if (!emailRegex.test(email)) {
      setError("请输入有效的邮箱地址")
      setLoading(false)
      return
    }
    
    if (!password) {
      setError("请输入密码")
      setLoading(false)
      return
    }
    
    if (password.length < 6) {
      setError("密码长度至少需要6位字符")
      setLoading(false)
      return
    }
    
    if (isRegister) {
      if (!name.trim()) {
        setError("请输入您的姓名")
        setLoading(false)
        return
      }
      
      if (name.trim().length < 2) {
        setError("姓名至少需要2个字符")
        setLoading(false)
        return
      }
    }

    try {
      // 先调用自定义验证API
      const verifyResponse = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
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
        redirect: false
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
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-4">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
              <div className="w-4 h-4 bg-blue-600 rounded-sm"></div>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
            {isRegister ? "创建账户" : "欢迎回来"}
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            {isRegister ? "注册新账户开始使用" : "登录到您的账户"}
          </p>
        </div>

        {/* Card */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error Alert */}
            {error && (
              <div className="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
                <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" />
                <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
              </div>
            )}

            {/* Name Field (Register only) */}
            {isRegister && (
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  姓名
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value)
                      validateName(e.target.value)
                    }}
                    required={isRegister}
                    className={`w-full pl-11 pr-4 py-3 border rounded-xl bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:border-transparent transition-all ${
                      nameError 
                        ? "border-red-500 dark:border-red-400 focus:ring-red-500" 
                        : "border-slate-300 dark:border-slate-600 focus:ring-blue-500"
                    }`}
                    placeholder="输入您的姓名"
                  />
                </div>
                {nameError && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {nameError}
                  </p>
                )}
              </div>
            )}

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                邮箱地址
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    validateEmail(e.target.value)
                  }}
                  required
                  className={`w-full pl-11 pr-4 py-3 border rounded-xl bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:border-transparent transition-all ${
                    emailError 
                      ? "border-red-500 dark:border-red-400 focus:ring-red-500" 
                      : "border-slate-300 dark:border-slate-600 focus:ring-blue-500"
                  }`}
                  placeholder="输入您的邮箱"
                />
              </div>
              {emailError && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {emailError}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                密码
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                    validatePassword(e.target.value)
                  }}
                  required
                  className={`w-full pl-11 pr-12 py-3 border rounded-xl bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:border-transparent transition-all ${
                    passwordError 
                      ? "border-red-500 dark:border-red-400 focus:ring-red-500" 
                      : "border-slate-300 dark:border-slate-600 focus:ring-blue-500"
                  }`}
                  placeholder="输入您的密码"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {passwordError && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {passwordError}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-3 px-4 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  处理中...
                </div>
              ) : (
                isRegister ? "创建账户" : "登录"
              )}
            </button>
          </form>

          {/* Switch Mode */}
          <div className="mt-6 text-center">
            <p className="text-slate-600 dark:text-slate-400 text-sm">
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
                className="ml-1 font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
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
  )
}