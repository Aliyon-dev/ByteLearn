"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { GraduationCap } from "lucide-react"
import type { UserRole } from "@/types"
import Link from "next/link"

export default function LoginPage() {
  const [username, setUserName] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState<UserRole>("student")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const result = await login(username, password, role)

      if (result.success) {
        router.push("/dashboard")
      } else if (result.mfaRequired) {
        // Redirect to 2FA page with username/password/role implicitly or passed
        // For security, passing via state/query is risky.
        // Better: store in a temp context or pass via query params but base64 encoded?
        // Let's pass via query params for simplicity, realizing it's not perfect security
        // but password should be re-entered or cached in memory.
        // Or better: The Login function handled the first step.
        // The 2FA page needs these creds to call login again WITH OTP.
        // We can pass them in URL params (bad practice) or sessionStorage.
        sessionStorage.setItem('temp_login_creds', JSON.stringify({ username, password, role }));
        router.push("/2fa");
      } else {
        setError(result.message || "Invalid credentials. Please try again.")
      }
    } catch (err) {
      setError("An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-education-50 via-primary/5 to-education-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4">
      <Card className="w-full max-w-md shadow-2xl border-0 bg-white/80 backdrop-blur-sm dark:bg-gray-900/80">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-primary flex items-center justify-center shadow-lg">
              <GraduationCap className="h-8 w-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl bg-gradient-to-r from-primary to-education-600 bg-clip-text text-transparent">
            Welcome to EduPlatform
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Sign in to your account to continue learning
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select value={role} onValueChange={(value: UserRole) => setRole(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="student">Student</SelectItem>
                  <SelectItem value="instructor">Instructor</SelectItem>
                  <SelectItem value="admin">Administrator</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">User Name</Label>
              <Input
                id="username"
                type="test"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUserName(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-primary to-education-600 hover:from-primary/90 hover:to-education-600/90 transition-all duration-200 shadow-lg"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">Demo credentials:</p>
            <div className="mt-2 text-xs space-y-1 p-3 bg-gradient-to-r from-muted/50 to-muted/30 rounded-lg">
              <p className="flex items-center justify-between">
                <span className="text-student-600 font-medium">Student:</span>
                <span>john@school.edu</span>
              </p>
              <p className="flex items-center justify-between">
                <span className="text-instructor-600 font-medium">Instructor:</span>
                <span>sarah@school.edu</span>
              </p>
              <p className="flex items-center justify-between">
                <span className="text-admin-600 font-medium">Admin:</span>
                <span>admin@school.edu</span>
              </p>
              <p className="text-muted-foreground text-center mt-2">Password: any</p>
            </div>
          </div>

          <div className="mt-4 text-center">
            <Link href="/register" className="text-sm text-primary hover:underline">
              New student? Register here
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
