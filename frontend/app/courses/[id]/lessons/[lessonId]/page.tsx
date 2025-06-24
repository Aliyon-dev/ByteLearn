"use client"

import { useParams } from "next/navigation"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { mockLessons, mockCourses } from "@/lib/mock-data"
import { ArrowLeft, ArrowRight, Clock, CheckCircle } from "lucide-react"
import Link from "next/link"
import ReactMarkdown from "react-markdown"

export default function LessonPage() {
  const params = useParams()
  const courseId = params.id as string
  const lessonId = params.lessonId as string

  const lesson = mockLessons.find((l) => l.id === lessonId && l.courseId === courseId)
  const course = mockCourses.find((c) => c.id === courseId)
  const courseLessons = mockLessons.filter((l) => l.courseId === courseId).sort((a, b) => a.order - b.order)
  const currentIndex = courseLessons.findIndex((l) => l.id === lessonId)
  const previousLesson = currentIndex > 0 ? courseLessons[currentIndex - 1] : null
  const nextLesson = currentIndex < courseLessons.length - 1 ? courseLessons[currentIndex + 1] : null

  if (!lesson || !course) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">Lesson not found</h2>
            <p className="text-muted-foreground">The lesson you're looking for doesn't exist.</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href={`/courses/${courseId}`}>
              <Button variant="ghost" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Course
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold">{lesson.title}</h1>
              <p className="text-muted-foreground">{course.title}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="flex items-center space-x-1">
              <Clock className="h-3 w-3" />
              <span>{lesson.duration} min</span>
            </Badge>
            {lesson.completed && (
              <Badge variant="secondary" className="flex items-center space-x-1">
                <CheckCircle className="h-3 w-3" />
                <span>Completed</span>
              </Badge>
            )}
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-4">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Video Player */}
            {lesson.videoPath && (
              <Card>
                <CardContent className="p-0">
                  <div className="aspect-video bg-black rounded-lg overflow-hidden">
                    <video controls className="w-full h-full" poster="/placeholder.svg?height=400&width=600">
                      <source src={lesson.videoPath} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Lesson Content */}
            <Card>
              <CardHeader>
                <CardTitle>Lesson Content</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-sm max-w-none dark:prose-invert">
                <ReactMarkdown>{lesson.content}</ReactMarkdown>
              </CardContent>
            </Card>

            {/* Navigation */}
            <div className="flex items-center justify-between">
              {previousLesson ? (
                <Link href={`/courses/${courseId}/lessons/${previousLesson.id}`}>
                  <Button variant="outline">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Previous: {previousLesson.title}
                  </Button>
                </Link>
              ) : (
                <div />
              )}

              {nextLesson ? (
                <Link href={`/courses/${courseId}/lessons/${nextLesson.id}`}>
                  <Button>
                    Next: {nextLesson.title}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              ) : (
                <Button>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Mark Complete
                </Button>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Course Progress</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {courseLessons.map((l, index) => (
                  <Link key={l.id} href={`/courses/${courseId}/lessons/${l.id}`}>
                    <div
                      className={`flex items-center space-x-3 p-2 rounded-lg transition-colors ${
                        l.id === lessonId ? "bg-primary/10" : "hover:bg-muted"
                      }`}
                    >
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                          l.completed
                            ? "bg-green-500 text-white"
                            : l.id === lessonId
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {l.completed ? <CheckCircle className="h-3 w-3" /> : index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-medium truncate ${l.id === lessonId ? "text-primary" : ""}`}>
                          {l.title}
                        </p>
                        <p className="text-xs text-muted-foreground">{l.duration} min</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
