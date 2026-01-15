"use client"
import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Course, Lesson } from "@/types"
import api from "@/lib/api"
import { BookOpen, Clock, Users, Play, Code, FileText, CheckCircle, ArrowLeft } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function CourseDetailPage() {
  const params = useParams()
  const courseId = params.id as string

  const [course, setCourse] = useState<Course | null>(null)
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [codeExercises, setCodeExercises] = useState<any[]>([])
  const [progress, setProgress] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [completionLoading, setCompletionLoading] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)

        // Fetch course details
        const courseResponse = await api.get(`courses/courses/${courseId}/`)
        const backendCourse = courseResponse.data

        setCourse({
          id: backendCourse.id.toString(),
          title: backendCourse.title,
          description: backendCourse.description,
          instructor: { id: backendCourse.instructor.toString(), username: "admin", email: "admin@bytelearn.com", role: "instructor", createdAt: "" },
          enrolledStudents: 0,
          totalLessons: 0,
          createdAt: backendCourse.created_at,
          updatedAt: backendCourse.created_at,
        })

        // Fetch lessons for this course
        const lessonsResponse = await api.get(`lessons/?course=${courseId}`)
        const backendLessons = Array.isArray(lessonsResponse.data) ? lessonsResponse.data : lessonsResponse.data.results || []

        const transformedLessons: Lesson[] = backendLessons.map((l: any) => ({
          id: l.id.toString(),
          courseId: l.course.toString(),
          title: l.title,
          description: l.description,
          content: l.content,
          videoPath: l.video_path || undefined,
          duration: l.duration,
          order: l.order,
        }))

        setLessons(transformedLessons)

        // Fetch coding exercises for this course
        try {
          const exercisesResponse = await api.get(`courses/exercises/?course=${courseId}`)
          const backendExercises = Array.isArray(exercisesResponse.data) 
            ? exercisesResponse.data 
            : exercisesResponse.data.results || []
          
          setCodeExercises(backendExercises)
        } catch (exerciseErr) {
          console.error("Failed to fetch coding exercises:", exerciseErr)
          // Don't fail the whole page if exercises fail to load
          setCodeExercises([])
        }
      } catch (err: any) {
        console.error("Failed to fetch course:", err)
        setError(err.response?.data?.message || "Failed to load course")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [courseId])

  const assessments: any[] = []

  if (loading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <Skeleton className="h-[300px] w-full rounded-xl" />
          <div className="grid gap-6 md:grid-cols-3">
            <div className="md:col-span-2 space-y-4">
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
            </div>
            <Skeleton className="h-64 w-full" />
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (error || !course) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-[calc(100vh-200px)]">
          <div className="text-center space-y-4">
            <div className="bg-red-50 text-red-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
              <span className="text-2xl">!</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Course not found</h2>
            <p className="text-muted-foreground">{error || "The course you're looking for doesn't exist."}</p>
            <Button onClick={() => window.history.back()}>Go Back</Button>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="relative -mx-6 -mt-6 mb-8">
        {/* Dynamic Hero Section */}
        <div className="bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900 text-white p-8 md:p-12 lg:p-16 relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]" />
          <div className="relative z-10 grid gap-8 md:grid-cols-3 items-center max-w-7xl mx-auto">
            <div className="md:col-span-2 space-y-6">
              <Badge variant="secondary" className="bg-white/10 text-white hover:bg-white/20 border-white/20 backdrop-blur-sm">
                 {course.instructor.username}
              </Badge>
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white drop-shadow-sm">
                {course.title}
              </h1>
              <p className="text-lg text-indigo-100/90 leading-relaxed max-w-2xl">
                {course.description}
              </p>
              
              <div className="flex flex-wrap items-center gap-6 pt-4">
                <div className="flex items-center space-x-2 text-sm font-medium text-indigo-100">
                  <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm">
                    <Users className="h-5 w-5" />
                  </div>
                  <span>{course.enrolledStudents} Students</span>
                </div>
                <div className="flex items-center space-x-2 text-sm font-medium text-indigo-100">
                   <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm">
                    <BookOpen className="h-5 w-5" />
                  </div>
                  <span>{course.totalLessons} Lessons</span>
                </div>
                <div className="flex items-center space-x-2 text-sm font-medium text-indigo-100">
                   <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm">
                    <CheckCircle className="h-5 w-5" />
                  </div>
                  <span>Last updated {new Date(course.updatedAt).toLocaleDateString()}</span>
                </div>
              </div>

               {course.progress !== undefined && (
                <div className="block mt-8 p-4 bg-white/5 rounded-xl border border-white/10 backdrop-blur-sm max-w-md">
                   <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-white">Course Progress</span>
                    <span className="text-sm font-bold text-indigo-200">{course.progress}%</span>
                  </div>
                  <Progress value={course.progress} className="h-2 bg-white/10 [&>div]:bg-indigo-400" />
                </div>
              )}
            </div>

            {/* Hero Card */}
            <div className="hidden md:block">
              <Card className="overflow-hidden border-0 shadow-2xl bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl">
                 <div className="aspect-video relative">
                    <Image
                      src={course.thumbnail || "/placeholder.svg?height=400&width=600"}
                      alt={course.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                        <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center shadow-lg cursor-pointer hover:scale-105 transition-transform">
                             <Play className="h-6 w-6 text-indigo-600 ml-1" />
                        </div>
                    </div>
                 </div>
                 <CardContent className="p-6">
                    <Button className="w-full h-12 text-lg font-semibold bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-600/20 mb-4 transition-all hover:scale-[1.02]">
                        Start Learning Now
                    </Button>
                    <p className="text-xs text-center text-muted-foreground">
                        Full lifetime access • Certificate of completion
                    </p>
                 </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        <Tabs defaultValue="lessons" className="space-y-8">
          <TabsList className="w-full justify-start p-1 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl border border-border/50 rounded-xl overflow-x-auto">
            <TabsTrigger value="lessons" className="rounded-lg px-6 py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm dark:data-[state=active]:bg-slate-800 transition-all">
                <BookOpen className="w-4 h-4 mr-2" />
                Lessons
            </TabsTrigger>
            <TabsTrigger value="coding" className="rounded-lg px-6 py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm dark:data-[state=active]:bg-slate-800 transition-all">
                 <Code className="w-4 h-4 mr-2" />
                 Coding Exercises
            </TabsTrigger>
             <TabsTrigger value="assessments" className="rounded-lg px-6 py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm dark:data-[state=active]:bg-slate-800 transition-all">
                 <FileText className="w-4 h-4 mr-2" />
                 Assessments
            </TabsTrigger>
             <TabsTrigger value="progress" className="rounded-lg px-6 py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm dark:data-[state=active]:bg-slate-800 transition-all">
                 <div className="w-4 h-4 mr-2 rounded-full border-2 border-current" />
                 Progress
            </TabsTrigger>
          </TabsList>

          <TabsContent value="lessons" className="animate-in fade-in-50 slide-in-from-bottom-2 duration-500">
             <div className="grid gap-4">
              {lessons.map((lesson, index) => (
                <div key={lesson.id} className="group relative bg-card hover:bg-accent/50 border rounded-xl overflow-hidden transition-all hover:shadow-md cursor-pointer">
                    <Link href={`/courses/${courseId}/lessons/${lesson.id}`} className="absolute inset-0 z-10">
                        <span className="sr-only">Go to lesson</span>
                    </Link>
                  <div className="p-5 flex items-start gap-4">
                     <div className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center text-base font-bold ${
                         lesson.completed 
                           ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" 
                           : "bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400"
                     }`}>
                        {lesson.completed ? <CheckCircle className="h-6 w-6" /> : index + 1}
                     </div>
                     <div className="flex-1 min-w-0">
                         <div className="flex items-center justify-between mb-1">
                             <h3 className="text-lg font-semibold truncate pr-4 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                 {lesson.title}
                             </h3>
                             <div className="flex-shrink-0">
                                  {lesson.videoPath && (
                                    <Badge variant="secondary" className="bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300 pointer-events-none">
                                        <Play className="w-3 h-3 mr-1" /> Video
                                    </Badge>
                                  )}
                             </div>
                         </div>
                         <p className="text-muted-foreground text-sm line-clamp-2 mb-3">
                             {lesson.description}
                         </p>
                         <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span className="flex items-center">
                                <Clock className="w-3.5 h-3.5 mr-1" /> {lesson.duration}m
                            </span>
                             <span className="flex items-center">
                                {lesson.completed ? "Completed" : "Not started"}
                            </span>
                         </div>
                     </div>
                     <div className="flex-shrink-0 self-center pl-2">
                        <Button variant="ghost" size="icon" className="rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                             <Play className="w-4 h-4" />
                        </Button>
                     </div>
                  </div>
                </div>
              ))}
              {lessons.length === 0 && (
                   <div className="text-center py-12 bg-muted/30 rounded-xl border border-dashed">
                      <p className="text-muted-foreground">No lessons available yet.</p>
                   </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="coding" className="animate-in fade-in-50 slide-in-from-bottom-2 duration-500">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {codeExercises.map((exercise) => (
                <Link key={exercise.id} href={`/courses/${courseId}/coding/${exercise.id}`}>
                    <Card className="h-full hover:shadow-lg transition-all hover:-translate-y-1 hover:border-indigo-500/50 cursor-pointer group">
                        <CardContent className="p-6 space-y-4">
                            <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                                <Code className="h-6 w-6" />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{exercise.title}</h3>
                                <p className="text-sm text-muted-foreground line-clamp-2">{exercise.description}</p>
                            </div>
                            <div className="flex items-center justify-between pt-2">
                                <Badge variant="outline" className="font-mono text-xs">{exercise.language}</Badge>
                                <span className="text-xs font-medium text-blue-600 dark:text-blue-400 flex items-center">
                                    Solve Challenge <ArrowLeft className="w-3 h-3 ml-1 rotate-180" />
                                </span>
                            </div>
                        </CardContent>
                    </Card>
                </Link>
              ))}
              {codeExercises.length === 0 && (
                  <div className="col-span-full text-center py-12 bg-muted/30 rounded-xl border border-dashed">
                     <p className="text-muted-foreground">No coding exercises available yet.</p>
                  </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="assessments" className="space-y-4">
            {/* Same premium card style as Coding Exercises suitable for assessments */}
             <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {assessments.map((assessment) => (
                 <Link key={assessment.id} href={`/courses/${courseId}/assessments/${assessment.id}`}>
                    <Card className="h-full hover:shadow-lg transition-all hover:-translate-y-1 hover:border-green-500/50 cursor-pointer group">
                         <CardContent className="p-6 space-y-4">
                             <div className="w-12 h-12 rounded-xl bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                                <FileText className="h-6 w-6" />
                            </div>
                             <div>
                                <h3 className="font-bold text-lg mb-1 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">{assessment.title}</h3>
                                <p className="text-sm text-muted-foreground line-clamp-2">{assessment.description}</p>
                            </div>
                             <div className="flex items-center justify-between pt-2">
                                 <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                     <span className="flex items-center"><Clock className="w-3 h-3 mr-1" />{assessment.timeLimit}m</span>
                                     <span className="flex items-center"><FileText className="w-3 h-3 mr-1" />{assessment.questions.length} Qs</span>
                                 </div>
                                 {assessment.score && (<Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-900/30">{assessment.score}%</Badge>)}
                            </div>
                        </CardContent>
                    </Card>
                 </Link>
              ))}
               {assessments.length === 0 && (
                  <div className="col-span-full text-center py-12 bg-muted/30 rounded-xl border border-dashed">
                     <p className="text-muted-foreground">No assessments available yet.</p>
                  </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="progress" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Learning Progress</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm font-medium">
                      <span>Lessons Completed</span>
                      <span className="text-muted-foreground">
                        {course.completedLessons || 0}/{course.totalLessons}
                      </span>
                    </div>
                    <Progress value={((course.completedLessons || 0) / (course.totalLessons || 1)) * 100} className="h-3 rounded-full" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm font-medium">
                      <span>Assessments Completed</span>
                      <span className="text-muted-foreground">
                        {assessments.filter((a) => a.completed).length}/{assessments.length}
                      </span>
                    </div>
                    <Progress value={assessments.length > 0 ? (assessments.filter((a) => a.completed).length / assessments.length) * 100 : 0} className="h-3 rounded-full" />
                  </div>
                  <div className="p-4 bg-muted rounded-lg flex items-center justify-between">
                     <span className="font-semibold">Overall Completion</span>
                     <span className="text-xl font-bold text-primary">{course.progress || 0}%</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Your Statistics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-0 divide-y">
                  <div className="flex items-center justify-between py-4">
                    <span className="text-sm text-muted-foreground">Time Spent</span>
                    <span className="font-medium">4.2 hours</span>
                  </div>
                  <div className="flex items-center justify-between py-4">
                    <span className="text-sm text-muted-foreground">Average Quiz Score</span>
                    <span className="font-medium">87%</span>
                  </div>
                  <div className="flex items-center justify-between py-4">
                    <span className="text-sm text-muted-foreground">Last Activity</span>
                    <span className="font-medium">2 days ago</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
