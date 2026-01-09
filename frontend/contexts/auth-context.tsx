"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { User, UserRole } from "@/types"
import { headers } from "next/headers"

import axios from "axios"

interface AuthContextType {
  user: User | null
  login: (email: string, password: string, role: UserRole) => Promise<boolean>
  logout: () => void
  Register: (formData: any) => Promise<boolean>
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])

const login = async (username: string, password: string, role: string) => {
  try {
    const response = await axios.post("http://127.0.0.1:8000/api/auth/login/", {username, password, role});
    if (response.status === 200) {
      console.log(response.data.user);
      setUser(response.data.user);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      return true;
    }
    return false;
  } catch (err) {
    console.error("Login error:", err);
    return false;
  }
};


  const Register = async (formData: any): Promise<boolean> => {
    try{
        const payload = {
            username: formData.studentId, // Mapping studentId to username
            email: formData.email,
            password: formData.password,
            password2: formData.confirmPassword, // Ensure this matches backend serializer field
            first_name: formData.firstName,
            last_name: formData.lastName,
            role: 'student' // Defaulting to student for this form
        };
      const response = await axios.post('http://127.0.0.1:8000/api/auth/register/', payload);
      if(response.status === 201){
        // setUser(response.data.user) // Usually registration doesn't auto-login or return user object in the same way, but if it does, uncomment.
        // For now, let's assume we redirect to login, or if the backend returns tokens we could auto-login.
        // The backend returns: { message, refresh, access } but not the full user object immediately usable for context unless we decode it or fetch profile.
        // Ideally, we redirect to login page.
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
