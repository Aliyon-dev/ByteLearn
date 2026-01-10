"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Shield } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"

export default function TwoFactorPage() {
  const [code, setCode] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { login } = useAuth()
  const [creds, setCreds] = useState<any>(null)

  useEffect(() => {
    const stored = sessionStorage.getItem('temp_login_creds')
    if (stored) {
      setCreds(JSON.parse(stored))
    } else {
      router.push('/login')
    }
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    if (!creds) {
      setError("Session expired. Please login again.")
      setIsLoading(false)
      return
    }

    try {
      const result = await login(creds.username, creds.password, creds.role, code)
      if (result.success) {
        sessionStorage.removeItem('temp_login_creds')
        router.push("/dashboard")
      } else {
        setError(result.message || "Invalid verification code.")
      }
    } catch (e) {
       setError("An error occurred.")
    } finally {
       setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Shield className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-2xl">Two-Factor Authentication</CardTitle>
          <CardDescription>Enter the 6-digit code from your authenticator app</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="code">Verification Code</Label>
              <Input
                id="code"
                type="text"
                placeholder="000000"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                className="text-center text-2xl tracking-widest"
                maxLength={6}
                required
              />
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" className="w-full" disabled={isLoading || code.length !== 6}>
              {isLoading ? "Verifying..." : "Verify Code"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
