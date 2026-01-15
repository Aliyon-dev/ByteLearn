"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { VideoPlayer } from "@/components/video-player"
import { Skeleton } from "@/components/ui/skeleton"
import type { Lesson, Course } from "@/types"
import api from "@/lib/api"
import { ArrowLeft, ArrowRight, Clock, CheckCircle } from "lucide-react"
import Link from "next/link"
import ReactMarkdown from "react-markdown"

interface BackendLesson {
  id: number
  course: number
  course_detail: {
    id: number
    title: string
    description: string
  }
  title: string
  description: string
  content: string
  video_path: string | null
  video_file: string | null
  duration: number
  order: number
  created_at: string
  updated_at: string
}

export default function LessonPage() {
  const params = useParams()
  const courseId = params.id as string
  const lessonId = params.lessonId as string

  const [lesson, setLesson] = useState<Lesson | null>(null)
  const [course, setCourse] = useState<Course | null>(null)
  const [courseLessons, setCourseLessons] = useState<Lesson[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)

        // Fetch lesson details
        const lessonResponse = await api.get(`lessons/${lessonId}/`)
        const backendLesson: BackendLesson = lessonResponse.data

        // Transform lesson data
        const transformedLesson: Lesson = {
          id: backendLesson.id.toString(),
          courseId: backendLesson.course.toString(),
          title: backendLesson.title,
          description: backendLesson.description,
          content: backendLesson.content,
          videoPath: backendLesson.video_path || undefined,
          duration: backendLesson.duration,
          order: backendLesson.order,
        }
        setLesson(transformedLesson)

        // Set course from lesson data
        setCourse({
          id: backendLesson.course_detail.id.toString(),
          title: backendLesson.course_detail.title,
          description: backendLesson.course_detail.description,
          instructor: { id: "1", username: "admin", email: "admin@bytelearn.com", role: "instructor", createdAt: "" },
          enrolledStudents: 0,
          totalLessons: 0,
          createdAt: backendLesson.created_at,
          updatedAt: backendLesson.updated_at,
        })

        // Fetch all lessons for this course
        const lessonsResponse = await api.get(`lessons/?course=${courseId}`)
        const backendLessons: BackendLesson[] = Array.isArray(lessonsResponse.data)
          ? lessonsResponse.data
          : lessonsResponse.data.results || []

        const transformedLessons: Lesson[] = backendLessons
          .map((l) => ({
            id: l.id.toString(),
            courseId: l.course.toString(),
            title: l.title,
            description: l.description,
            content: l.content,
            videoPath: l.video_path || undefined,
            duration: l.duration,
            order: l.order,
          }))
          .sort((a, b) => a.order - b.order)

        setCourseLessons(transformedLessons)
      } catch (err: any) {
        console.error("Failed to fetch lesson:", err)
        setError(err.response?.data?.message || "Failed to load lesson")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [lessonId, courseId])

  const currentIndex = courseLessons.findIndex((l) => l.id === lessonId)
  const previousLesson = currentIndex > 0 ? courseLessons[currentIndex - 1] : null
  const nextLesson = currentIndex < courseLessons.length - 1 ? courseLessons[currentIndex + 1] : null

  if (loading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <Skeleton className="h-12 w-3/4" />
          <Skeleton className="h-96 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </DashboardLayout>
    )
  }

  if (error || !lesson || !course) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">Lesson not found</h2>
            <p className="text-muted-foreground">{error || "The lesson you're looking for doesn't exist."}</p>
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
              <VideoPlayer
                src={lesson.videoPath}
                poster="/placeholder.svg?height=400&width=600"
                className="mb-6"
              />
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
