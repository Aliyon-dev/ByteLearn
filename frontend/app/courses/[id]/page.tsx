"use client"
import { useParams } from "next/navigation"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { mockCourses, mockLessons, mockAssessments, mockCodeExercises } from "@/lib/mock-data"
import { BookOpen, Clock, Users, Play, Code, FileText, CheckCircle } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function CourseDetailPage() {
  const params = useParams()
  const courseId = params.id as string

  const course = mockCourses.find((c) => c.id === courseId)
  const lessons = mockLessons.filter((l) => l.courseId === courseId)
  const assessments = mockAssessments.filter((a) => a.courseId === courseId)
  const codeExercises = mockCodeExercises.filter((e) => e.courseId === courseId)

  if (!course) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">Course not found</h2>
            <p className="text-muted-foreground">The course you're looking for doesn't exist.</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Course Header */}
        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2 space-y-4">
            <div>
              <h1 className="text-3xl font-bold">{course.title}</h1>
              <p className="text-muted-foreground mt-2">{course.description}</p>
            </div>

            <div className="flex items-center space-x-4">
              <Badge variant="secondary">{course.instructor.name}</Badge>
              <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                <Users className="h-4 w-4" />
                <span>{course.enrolledStudents} students</span>
              </div>
              <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                <BookOpen className="h-4 w-4" />
                <span>{course.totalLessons} lessons</span>
              </div>
            </div>

            {course.progress !== undefined && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Course Progress</span>
                  <span className="text-sm text-muted-foreground">{course.progress}%</span>
                </div>
                <Progress value={course.progress} className="h-2" />
              </div>
            )}
          </div>

          <Card>
            <CardContent className="p-6">
              <div className="aspect-video relative mb-4">
                <Image
                  src={course.thumbnail || "/placeholder.svg?height=200&width=300"}
                  alt={course.title}
                  fill
                  className="object-cover rounded-lg"
                />
              </div>
              <Button className="w-full mb-4">
                <Play className="mr-2 h-4 w-4" />
                Start Learning
              </Button>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Lessons:</span>
                  <span>{lessons.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Assessments:</span>
                  <span>{assessments.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Code Exercises:</span>
                  <span>{codeExercises.length}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Course Content Tabs */}
        <Tabs defaultValue="lessons" className="space-y-4">
          <TabsList>
            <TabsTrigger value="lessons">Lessons</TabsTrigger>
            <TabsTrigger value="coding">Coding</TabsTrigger>
            <TabsTrigger value="assessments">Assessments</TabsTrigger>
            <TabsTrigger value="progress">Progress</TabsTrigger>
          </TabsList>

          <TabsContent value="lessons" className="space-y-4">
            <div className="grid gap-4">
              {lessons.map((lesson, index) => (
                <Card key={lesson.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          {lesson.completed ? (
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          ) : (
                            <span className="text-sm font-medium">{index + 1}</span>
                          )}
                        </div>
                        <div>
                          <h3 className="font-semibold">{lesson.title}</h3>
                          <p className="text-sm text-muted-foreground">{lesson.description}</p>
                          <div className="flex items-center space-x-4 mt-1">
                            <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                              <Clock className="h-3 w-3" />
                              <span>{lesson.duration} min</span>
                            </div>
                            {lesson.videoPath && (
                              <Badge variant="outline" className="text-xs">
                                Video
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      <Link href={`/courses/${courseId}/lessons/${lesson.id}`}>
                        <Button size="sm" variant={lesson.completed ? "outline" : "default"}>
                          {lesson.completed ? "Review" : "Start"}
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="coding" className="space-y-4">
            <div className="grid gap-4">
              {codeExercises.map((exercise) => (
                <Card key={exercise.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                          <Code className="h-5 w-5 text-blue-500" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{exercise.title}</h3>
                          <p className="text-sm text-muted-foreground">{exercise.description}</p>
                          <Badge variant="outline" className="text-xs mt-1">
                            {exercise.language}
                          </Badge>
                        </div>
                      </div>
                      <Link href={`/courses/${courseId}/coding/${exercise.id}`}>
                        <Button size="sm">
                          <Code className="mr-2 h-4 w-4" />
                          Code
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="assessments" className="space-y-4">
            <div className="grid gap-4">
              {assessments.map((assessment) => (
                <Card key={assessment.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center">
                          <FileText className="h-5 w-5 text-green-500" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{assessment.title}</h3>
                          <p className="text-sm text-muted-foreground">{assessment.description}</p>
                          <div className="flex items-center space-x-4 mt-1">
                            <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                              <Clock className="h-3 w-3" />
                              <span>{assessment.timeLimit} min</span>
                            </div>
                            <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                              <FileText className="h-3 w-3" />
                              <span>{assessment.questions.length} questions</span>
                            </div>
                            {assessment.completed && assessment.score && (
                              <Badge variant="secondary" className="text-xs">
                                Score: {assessment.score}%
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      <Link href={`/courses/${courseId}/assessments/${assessment.id}`}>
                        <Button size="sm" variant={assessment.completed ? "outline" : "default"}>
                          {assessment.completed ? "Review" : "Take Quiz"}
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="progress" className="space-y-4">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Learning Progress</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Lessons Completed</span>
                      <span>
                        {course.completedLessons || 0}/{course.totalLessons}
                      </span>
                    </div>
                    <Progress value={((course.completedLessons || 0) / course.totalLessons) * 100} />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Assessments Completed</span>
                      <span>
                        {assessments.filter((a) => a.completed).length}/{assessments.length}
                      </span>
                    </div>
                    <Progress value={(assessments.filter((a) => a.completed).length / assessments.length) * 100} />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Overall Progress</span>
                      <span>{course.progress || 0}%</span>
                    </div>
                    <Progress value={course.progress || 0} />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Statistics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Time Spent</span>
                    <span className="font-medium">4.2 hours</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Average Score</span>
                    <span className="font-medium">87%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Last Activity</span>
                    <span className="font-medium">2 days ago</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Completion Rate</span>
                    <span className="font-medium">78%</span>
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
