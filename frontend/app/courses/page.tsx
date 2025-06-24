"use client"

import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { mockCourses } from "@/lib/mock-data"
import { BookOpen, Users, Search, Plus } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function CoursesPage() {
  const { user } = useAuth()
  const [searchTerm, setSearchTerm] = useState("")

  const filteredCourses = mockCourses.filter(
    (course) =>
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getCoursesForUser = () => {
    switch (user?.role) {
      case "student":
        return filteredCourses.filter((course) => course.progress !== undefined)
      case "instructor":
        return filteredCourses.filter((course) => course.instructor.role === "instructor")
      case "admin":
        return filteredCourses
      default:
        return []
    }
  }

  const courses = getCoursesForUser()

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">
              {user?.role === "student" ? "My Courses" : user?.role === "instructor" ? "My Courses" : "All Courses"}
            </h2>
            <p className="text-muted-foreground">
              {user?.role === "student"
                ? "Continue your learning journey"
                : user?.role === "instructor"
                  ? "Manage your courses"
                  : "System-wide course overview"}
            </p>
          </div>
          {user?.role === "instructor" && (
            <Link href="/courses/create">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create Course
              </Button>
            </Link>
          )}
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search courses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Courses Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <Card
              key={course.id}
              className="overflow-hidden interactive-card border-0 shadow-lg bg-gradient-to-br from-card to-primary/5"
            >
              <div className="aspect-video relative">
                <Image
                  src={course.thumbnail || "/placeholder.svg?height=200&width=300"}
                  alt={course.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute top-2 right-2">
                  <Badge className="bg-gradient-to-r from-primary/90 to-education-600/90 text-white border-0">
                    {course.instructor.name}
                  </Badge>
                </div>
              </div>
              <CardHeader>
                <CardTitle className="line-clamp-1 bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
                  {course.title}
                </CardTitle>
                <CardDescription className="line-clamp-2">{course.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <div className="w-4 h-4 rounded bg-gradient-to-r from-student-500 to-student-600 flex items-center justify-center">
                      <Users className="h-3 w-3 text-white" />
                    </div>
                    <span>{course.enrolledStudents} students</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-4 h-4 rounded bg-gradient-to-r from-education-500 to-education-600 flex items-center justify-center">
                      <BookOpen className="h-3 w-3 text-white" />
                    </div>
                    <span>{course.totalLessons} lessons</span>
                  </div>
                </div>

                {user?.role === "student" && course.progress !== undefined && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Progress</span>
                      <span className="font-medium text-primary">{course.progress}%</span>
                    </div>
                    <Progress value={course.progress} className="h-2" />
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <Badge variant="secondary" className="bg-gradient-to-r from-muted to-muted/80">
                    {course.instructor.name}
                  </Badge>
                  <Link href={`/courses/${course.id}`}>
                    <Button
                      size="sm"
                      className="bg-gradient-to-r from-primary to-education-600 hover:from-primary/90 hover:to-education-600/90 transition-all duration-200"
                    >
                      {user?.role === "student" ? "Continue" : "Manage"}
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {courses.length === 0 && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No courses found</h3>
              <p className="text-muted-foreground text-center">
                {searchTerm ? "Try adjusting your search terms." : "No courses available at the moment."}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
}
