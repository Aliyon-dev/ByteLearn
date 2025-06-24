"use client"

import { useAuth } from "@/contexts/auth-context"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { mockCourses, mockNotifications } from "@/lib/mock-data"
import { BookOpen, Clock, Trophy, TrendingUp, Plus, Bell } from "lucide-react"
import Link from "next/link"

function StudentDashboard() {
  const enrolledCourses = mockCourses.filter((course) => course.progress !== undefined)
  const recentNotifications = mockNotifications.slice(0, 3)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">Welcome back! Here's your learning progress.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="interactive-card border-0 shadow-lg bg-gradient-to-br from-student-50 to-student-100/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-student-700">Enrolled Courses</CardTitle>
            <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-student-500 to-student-600 flex items-center justify-center">
              <BookOpen className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-student-700">{enrolledCourses.length}</div>
          </CardContent>
        </Card>

        <Card className="interactive-card border-0 shadow-lg bg-gradient-to-br from-education-50 to-education-100/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-education-700">Hours Learned</CardTitle>
            <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-education-500 to-education-600 flex items-center justify-center">
              <Clock className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-education-700">24.5</div>
          </CardContent>
        </Card>

        <Card className="interactive-card border-0 shadow-lg bg-gradient-to-br from-warning-50 to-warning-100/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-warning-700">Certificates</CardTitle>
            <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-warning-500 to-warning-600 flex items-center justify-center">
              <Trophy className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning-700">2</div>
          </CardContent>
        </Card>

        <Card className="interactive-card border-0 shadow-lg bg-gradient-to-br from-success-50 to-success-100/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-success-700">Average Score</CardTitle>
            <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-success-500 to-success-600 flex items-center justify-center">
              <TrendingUp className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success-700">87%</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Continue Learning */}
        <Card className="border-0 shadow-lg bg-gradient-to-br from-card to-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <div className="w-6 h-6 rounded bg-gradient-to-r from-primary to-education-600 flex items-center justify-center">
                <BookOpen className="h-4 w-4 text-white" />
              </div>
              <span>Continue Learning</span>
            </CardTitle>
            <CardDescription>Pick up where you left off</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {enrolledCourses.map((course) => (
              <div key={course.id} className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <BookOpen className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">{course.title}</p>
                  <div className="flex items-center space-x-2">
                    <Progress value={course.progress} className="flex-1" />
                    <span className="text-xs text-muted-foreground">{course.progress}%</span>
                  </div>
                </div>
                <Link href={`/courses/${course.id}`}>
                  <Button size="sm">Continue</Button>
                </Link>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Notifications */}
        <Card className="border-0 shadow-lg bg-gradient-to-br from-card to-muted/20">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <div className="w-6 h-6 rounded bg-gradient-to-r from-primary to-education-600 flex items-center justify-center">
                <Bell className="h-4 w-4 text-white" />
              </div>
              <span>Recent Notifications</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentNotifications.map((notification) => (
              <div key={notification.id} className="flex items-start space-x-3">
                <div
                  className={`w-2 h-2 rounded-full mt-2 ${
                    notification.type === "success"
                      ? "bg-green-500"
                      : notification.type === "warning"
                        ? "bg-yellow-500"
                        : notification.type === "error"
                          ? "bg-red-500"
                          : "bg-blue-500"
                  }`}
                />
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium">{notification.title}</p>
                  <p className="text-xs text-muted-foreground">{notification.message}</p>
                </div>
                {!notification.read && (
                  <Badge variant="secondary" className="text-xs">
                    New
                  </Badge>
                )}
              </div>
            ))}
            <Link href="/notifications">
              <Button variant="outline" size="sm" className="w-full">
                View All Notifications
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function InstructorDashboard() {
  const myCourses = mockCourses.filter((course) => course.instructor.role === "instructor")

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Instructor Dashboard</h2>
          <p className="text-muted-foreground">Manage your courses and track student progress.</p>
        </div>
        <Link href="/courses/create">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create Course
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">My Courses</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{myCourses.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {myCourses.reduce((sum, course) => sum + course.enrolledStudents, 0)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Completion</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">78%</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+12</div>
            <p className="text-xs text-muted-foreground">new enrollments</p>
          </CardContent>
        </Card>
      </div>

      {/* My Courses */}
      <Card>
        <CardHeader>
          <CardTitle>My Courses</CardTitle>
          <CardDescription>Courses you've created and are teaching</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {myCourses.map((course) => (
              <Card key={course.id}>
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <h3 className="font-semibold">{course.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">{course.description}</p>
                    <div className="flex items-center justify-between text-sm">
                      <span>{course.enrolledStudents} students</span>
                      <span>{course.totalLessons} lessons</span>
                    </div>
                    <Link href={`/courses/${course.id}`}>
                      <Button size="sm" className="w-full">
                        Manage Course
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Admin Dashboard</h2>
        <p className="text-muted-foreground">System overview and management tools.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,234</div>
            <p className="text-xs text-muted-foreground">+12% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Courses</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">89</div>
            <p className="text-xs text-muted-foreground">+3 new this week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Health</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">99.9%</div>
            <p className="text-xs text-muted-foreground">uptime</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Storage Used</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.4TB</div>
            <p className="text-xs text-muted-foreground">of 10TB available</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link href="/users">
              <Button variant="outline" className="w-full justify-start">
                Manage Users
              </Button>
            </Link>
            <Link href="/courses">
              <Button variant="outline" className="w-full justify-start">
                View All Courses
              </Button>
            </Link>
            <Link href="/analytics">
              <Button variant="outline" className="w-full justify-start">
                System Analytics
              </Button>
            </Link>
            <Link href="/notifications">
              <Button variant="outline" className="w-full justify-start">
                Send Notification
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <div className="flex-1">
                <p className="text-sm font-medium">New course published</p>
                <p className="text-xs text-muted-foreground">2 hours ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 rounded-full bg-blue-500" />
              <div className="flex-1">
                <p className="text-sm font-medium">25 new user registrations</p>
                <p className="text-xs text-muted-foreground">4 hours ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 rounded-full bg-yellow-500" />
              <div className="flex-1">
                <p className="text-sm font-medium">System maintenance scheduled</p>
                <p className="text-xs text-muted-foreground">1 day ago</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function DashboardPage() {
  const { user } = useAuth()

  const renderDashboard = () => {
    switch (user?.role) {
      case "student":
        return <StudentDashboard />
      case "instructor":
        return <InstructorDashboard />
      case "admin":
        return <AdminDashboard />
      default:
        return <div>Loading...</div>
    }
  }

  return <DashboardLayout>{renderDashboard()}</DashboardLayout>
}
