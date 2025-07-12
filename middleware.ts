import { auth } from "@/auth"

export default auth((req) => {
  const isLoggedIn = !!req.auth
  const isAuthPage = req.nextUrl.pathname.startsWith('/login') || 
                    req.nextUrl.pathname.startsWith('/register')
  const isPublicPage = req.nextUrl.pathname === '/'
  
  // 如果未登录且访问受保护页面，重定向到登录
  if (!isLoggedIn && !isAuthPage && !isPublicPage) {
    return Response.redirect(new URL('/login', req.url))
  }
  
  // 如果已登录且访问认证页面，重定向到仪表板
  if (isLoggedIn && isAuthPage) {
    return Response.redirect(new URL('/dashboard', req.url))
  }
})

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"]
}