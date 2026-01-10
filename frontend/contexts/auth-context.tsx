"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { User, UserRole } from "@/types"
import api from "@/lib/api"
import { useRouter } from "next/navigation"

interface AuthContextType {
  user: User | null
  login: (username: string, password: string, role: UserRole, otp?: string) => Promise<{ success: boolean; mfaRequired?: boolean; message?: string }>
  logout: () => void
  Register: (formData: any) => Promise<boolean>
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem("user")
    const accessToken = localStorage.getItem("access_token")
    if (storedUser && accessToken) {
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])

  const login = async (username: string, password: string, role: string, otp?: string) => {
    try {
      const payload: any = { username, password, role };
      if (otp) {
        payload.otp = otp;
      }

      const response = await api.post("auth/login/", payload);

      if (response.status === 200) {
        if (response.data.mfa_required) {
          return { success: false, mfaRequired: true, message: response.data.message };
        }

        const userData = response.data.user;
        const accessToken = response.data.access;
        const refreshToken = response.data.refresh;

        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("access_token", accessToken);
        localStorage.setItem("refresh_token", refreshToken);

        return { success: true };
      }
      return { success: false, message: "Invalid credentials" };
    } catch (err: any) {
      console.error("Login error:", err);
      // Check for 401
      if (err.response && err.response.status === 401) {
          return { success: false, message: err.response.data.message || "Invalid credentials" };
      }
      return { success: false, message: "An error occurred" };
    }
  };


  const Register = async (formData: any): Promise<boolean> => {
    try{
        const payload = {
            username: formData.studentId, // Using studentID as username
            email: formData.email,
            password: formData.password,
            password2: formData.confirmPassword,
            first_name: formData.firstName,
            last_name: formData.lastName,
            studentId: formData.studentId,
            role: 'student'
        };
      const response = await api.post('auth/register/', payload);
      if(response.status === 201){
        return true
      }
    }
    catch(error){
      console.log(error);
    }
    return false
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
    localStorage.removeItem("access_token")
    localStorage.removeItem("refresh_token")
    router.push("/login")
  }

  return <AuthContext.Provider value={{ user, login, logout, isLoading, Register }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
