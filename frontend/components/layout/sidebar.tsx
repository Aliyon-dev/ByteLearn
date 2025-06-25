"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useAuth } from "@/contexts/auth-context"
import { BookOpen, FileText, GraduationCap, Home, Settings, Users, BarChart3, Bell, Menu, X } from "lucide-react"

const studentNavItems = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "My Courses", href: "/courses", icon: BookOpen },
  { name: "Progress", href: "/progress", icon: BarChart3 },
  { name: "Notifications", href: "/notifications", icon: Bell },
]

const instructorNavItems = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "My Courses", href: "/courses", icon: BookOpen },
  { name: "Create Course", href: "/courses/create", icon: FileText },
  { name: "Students", href: "/students", icon: Users },
  { name: "Notifications", href: "/notifications", icon: Bell },
]

const adminNavItems = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "All Courses", href: "/courses", icon: BookOpen },
  { name: "Users", href: "/users", icon: Users },
  { name: "Analytics", href: "/analytics", icon: BarChart3 },
  { name: "Notifications", href: "/notifications", icon: Bell },
  { name: "Settings", href: "/settings", icon: Settings },
]

export function Sidebar() {
  const { user } = useAuth()
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)

  if (!user) return null

  const navItems =
    user.role === "student" ? studentNavItems : user.role === "instructor" ? instructorNavItems : adminNavItems

  return (
    <div
      className={cn(
        "flex flex-col h-full border-r transition-all duration-300",
        "bg-gradient-to-b from-card to-card/80 backdrop-blur-sm",
        isCollapsed ? "w-16" : "w-64",
      )}
    >
      <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-primary/10 to-education-500/10">
        {!isCollapsed && (
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
              <GraduationCap className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-lg bg-gradient-to-r from-primary to-education-600 bg-clip-text text-transparent">
              ByteLearn
            </span>
          </div>
        )}
        <Button variant="ghost" size="icon" onClick={() => setIsCollapsed(!isCollapsed)} className="h-8 w-8">
          {isCollapsed ? <Menu className="h-4 w-4" /> : <X className="h-4 w-4" />}
        </Button>
      </div>

      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link key={item.name} href={item.href}>
                <Button
                  variant={isActive ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start transition-all duration-200",
                    isCollapsed && "px-2",
                    isActive &&
                      "bg-gradient-to-r from-primary/20 to-education-500/20 border-l-2 border-primary shadow-sm",
                    !isActive && "hover:bg-gradient-to-r hover:from-primary/5 hover:to-education-500/5",
                  )}
                >
                  <item.icon className={cn("h-4 w-4", isActive && "text-primary")} />
                  {!isCollapsed && <span className="ml-2">{item.name}</span>}
                </Button>
              </Link>
            )
          })}
        </nav>
      </ScrollArea>

      {!isCollapsed && (
        <div className="p-4 border-t bg-gradient-to-r from-muted/50 to-muted/30">
          <div
            className={cn(
              "flex items-center space-x-3 p-3 rounded-lg",
              user.role === "student" && "role-student",
              user.role === "instructor" && "role-instructor",
              user.role === "admin" && "role-admin",
            )}
          >
            <div
              className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold",
                user.role === "student" && "bg-gradient-to-r from-student-500 to-student-600",
                user.role === "instructor" && "bg-gradient-to-r from-instructor-500 to-instructor-600",
                user.role === "admin" && "bg-gradient-to-r from-admin-500 to-admin-600",
              )}
            >
              <span className="text-sm">
                {user.username}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user.username}</p>
              <p
                className={cn(
                  "text-xs font-medium capitalize",
                  user.role === "student" && "text-student-600",
                  user.role === "instructor" && "text-instructor-600",
                  user.role === "admin" && "text-admin-600",
                )}
              >
                {user.role}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
