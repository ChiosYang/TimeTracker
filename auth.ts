import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

// 密码验证函数 - 避免在edge runtime中直接使用bcryptjs
async function verifyPasswordInNodeRuntime(password: string, hashedPassword: string): Promise<boolean> {
  // 调用我们的验证API来处理密码验证
  try {
    const bcrypt = await import('bcrypt');
    return bcrypt.compare(password, hashedPassword);
  } catch {
    return false;
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { 
          label: "Email", 
          type: "email",
          placeholder: "输入邮箱"
        },
        password: { 
          label: "Password", 
          type: "password",
          placeholder: "输入密码" 
        },
        name: {
          label: "Name",
          type: "text", 
          placeholder: "输入姓名（仅注册时需要）"
        },
        isRegister: {
          label: "Is Register",
          type: "hidden"
        }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const email = credentials.email as string;
        const password = credentials.password as string;
        const isRegister = credentials.isRegister === "true";

        try {
          if (isRegister) {
            // 注册逻辑 - 用户已在API中创建，这里只需获取用户信息
            const user = await sql`
              SELECT id, email, name, image 
              FROM users 
              WHERE email = ${email}
            `;

            if (user.length === 0) {
              return null;
            }

            return {
              id: user[0].id,
              email: user[0].email,
              name: user[0].name,
              image: user[0].image
            };
          } else {
            // 登录逻辑 - 简化版
            const user = await sql`
              SELECT id, email, name, image, password_hash 
              FROM users 
              WHERE email = ${email}
            `;

            if (user.length === 0) {
              return null;
            }

            const isValidPassword = await verifyPasswordInNodeRuntime(password, user[0].password_hash);
            if (!isValidPassword) {
              return null;
            }

            return {
              id: user[0].id,
              email: user[0].email,
              name: user[0].name,
              image: user[0].image
            };
          }
        } catch (error) {
          console.error("Auth.js认证错误:", error);
          return null;
        }
      }
    })
  ],
  session: { 
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30天
  },
  pages: {
    signIn: "/login",
    error: "/login"
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string
      }
      return session
    }
  },
  // 自定义错误处理
  events: {
    async signIn(message) {
      console.log("Sign in event:", message)
    }
  }
})