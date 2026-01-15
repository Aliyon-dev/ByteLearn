"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { useAuth } from "@/contexts/auth-context"
import api from "@/lib/api"
import {
  ProgressChart,
  ScoreDistributionChart,
  TimeSpentChart,
  EngagementChart,
  CompletionRateChart,
  StatsCard,
} from "@/components/analytics-charts"
import {
  BookOpen,
  Clock,
  Trophy,
  TrendingUp,
  Users,
  GraduationCap,
  Target,
  Award,
  Activity,
  BarChart3,
} from "lucide-react"

export default function AnalyticsPage() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [studentAnalytics, setStudentAnalytics] = useState<any>(null)
  const [instructorAnalytics, setInstructorAnalytics] = useState<any>(null)
  const [systemAnalytics, setSystemAnalytics] = useState<any>(null)
  const [progressOverTime, setProgressOverTime] = useState<any[]>([])
  const [assessmentScores, setAssessmentScores] = useState<any[]>([])

  useEffect(() => {
    fetchAnalytics()
  }, [user])

  const fetchAnalytics = async () => {
    try {
      setLoading(true)

      // Fetch based on user role
      if (user?.role === "student") {
        const [studentRes, progressRes, scoresRes] = await Promise.all([
          api.get("analytics/student/"),
          api.get("analytics/progress_over_time/?days=30"),
          api.get("analytics/assessment_scores/"),
        ])
        setStudentAnalytics(studentRes.data)
        setProgressOverTime(progressRes.data)
        setAssessmentScores(scoresRes.data)
      } else if (user?.role === "instructor") {
        const instructorRes = await api.get("analytics/instructor/")
        setInstructorAnalytics(instructorRes.data)
      } else if (user?.role === "admin") {
        const [instructorRes, systemRes] = await Promise.all([
          api.get("analytics/instructor/"),
          api.get("analytics/system/"),
        ])
        setInstructorAnalytics(instructorRes.data)
        setSystemAnalytics(systemRes.data)
      }
    } catch (error) {
      console.error("Failed to fetch analytics:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </DashboardLayout>
    )
  }

  // Student View
  if (user?.role === "student" && studentAnalytics) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Learning Analytics</h2>
            <p className="text-muted-foreground">Track your progress and performance</p>
          </div>

          {/* Stats Overview */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatsCard
              title="Total Courses"
              value={studentAnalytics.total_courses}
              description={`${studentAnalytics.completed_courses} completed`}
              icon={<BookOpen className="h-4 w-4 text-muted-foreground" />}
            />
            <StatsCard
              title="Time Spent"
              value={`${studentAnalytics.total_time_spent} min`}
              description="Total learning time"
              icon={<Clock className="h-4 w-4 text-muted-foreground" />}
            />
            <StatsCard
              title="Average Score"
              value={`${studentAnalytics.avg_assessment_score}%`}
              description={`${studentAnalytics.total_assessments} assessments taken`}
              icon={<Trophy className="h-4 w-4 text-muted-foreground" />}
            />
            <StatsCard
              title="Learning Streak"
              value={`${studentAnalytics.learning_streak} days`}
              description="Keep it up!"
              icon={<TrendingUp className="h-4 w-4 text-muted-foreground" />}
            />
          </div>

          {/* Charts */}
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Progress Over Time</CardTitle>
                <CardDescription>Lessons completed in the last 30 days</CardDescription>
              </CardHeader>
              <CardContent>
                {progressOverTime.length > 0 ? (
                  <ProgressChart data={progressOverTime} />
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    No progress data available yet
                  </p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Assessment Scores</CardTitle>
                <CardDescription>Your performance on assessments</CardDescription>
              </CardHeader>
              <CardContent>
                {assessmentScores.length > 0 ? (
                  <ScoreDistributionChart data={assessmentScores} />
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    No assessment data available yet
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Additional Stats */}
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Coding Exercises</CardTitle>
                <CardDescription>Your coding performance</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Total Exercises</span>
                  <span className="text-2xl font-bold">{studentAnalytics.total_coding_exercises}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Success Rate</span>
                  <span className="text-2xl font-bold text-green-500">
                    {studentAnalytics.coding_success_rate}%
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Last 7 days</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <BookOpen className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Lessons</span>
                  </div>
                  <span className="font-bold">{studentAnalytics.recent_activity.lessons}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Trophy className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Assessments</span>
                  </div>
                  <span className="font-bold">{studentAnalytics.recent_activity.assessments}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Target className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Coding Exercises</span>
                  </div>
                  <span className="font-bold">{studentAnalytics.recent_activity.coding_exercises}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  // Instructor/Admin View
  if ((user?.role === "instructor" || user?.role === "admin") && instructorAnalytics) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">
              {user?.role === "admin" ? "System Analytics" : "Instructor Analytics"}
            </h2>
            <p className="text-muted-foreground">
              {user?.role === "admin"
                ? "Platform-wide metrics and insights"
                : "Track your courses and student performance"}
            </p>
          </div>

          <Tabs defaultValue={user?.role === "admin" ? "system" : "courses"} className="space-y-6">
            <TabsList>
              {user?.role === "admin" && <TabsTrigger value="system">System Overview</TabsTrigger>}
              <TabsTrigger value="courses">Courses</TabsTrigger>
            </TabsList>

            {/* System Overview (Admin Only) */}
            {user?.role === "admin" && systemAnalytics && (
              <TabsContent value="system" className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <StatsCard
                    title="Total Users"
                    value={systemAnalytics.total_users}
                    description={`${systemAnalytics.total_students} students, ${systemAnalytics.total_instructors} instructors`}
                    icon={<Users className="h-4 w-4 text-muted-foreground" />}
                  />
                  <StatsCard
                    title="Total Courses"
                    value={systemAnalytics.total_courses}
                    description={`${systemAnalytics.total_lessons} lessons`}
                    icon={<BookOpen className="h-4 w-4 text-muted-foreground" />}
                  />
                  <StatsCard
                    title="Platform Score"
                    value={`${systemAnalytics.avg_assessment_score}%`}
                    description="Average assessment score"
                    icon={<Trophy className="h-4 w-4 text-muted-foreground" />}
                  />
                  <StatsCard
                    title="Active Users"
                    value={systemAnalytics.recent_active_users}
                    description="Last 30 days"
                    icon={<Activity className="h-4 w-4 text-muted-foreground" />}
                  />
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>Platform Activity</CardTitle>
                      <CardDescription>Last 30 days</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Lesson Completions</span>
                        <span className="text-2xl font-bold">{systemAnalytics.recent_lesson_completions}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Assessments Taken</span>
                        <span className="text-2xl font-bold">{systemAnalytics.recent_assessments}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Total Submissions</span>
                        <span className="text-2xl font-bold">{systemAnalytics.total_coding_submissions}</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Popular Courses</CardTitle>
                      <CardDescription>Most enrolled courses</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {systemAnalytics.popular_courses.map((course: any, index: number) => (
                          <div key={course.id} className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <span className="text-sm font-medium text-muted-foreground">#{index + 1}</span>
                              <span className="text-sm">{course.title}</span>
                            </div>
                            <span className="text-sm font-bold">{course.student_count} students</span>
                          </div>
                        ))}
                        {systemAnalytics.popular_courses.length === 0 && (
                          <p className="text-sm text-muted-foreground text-center py-4">
                            No course data available
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            )}

            {/* Courses Tab */}
            <TabsContent value="courses" className="space-y-6">
              <div className="grid gap-4 md:grid-cols-3">
                <StatsCard
                  title="Total Courses"
                  value={instructorAnalytics.total_courses}
                  description="Courses you teach"
                  icon={<GraduationCap className="h-4 w-4 text-muted-foreground" />}
                />
                <StatsCard
                  title="Total Students"
                  value={instructorAnalytics.total_students}
                  description="Across all courses"
                  icon={<Users className="h-4 w-4 text-muted-foreground" />}
                />
                <StatsCard
                  title="Courses"
                  value={instructorAnalytics.courses.length}
                  description="Active courses"
                  icon={<BarChart3 className="h-4 w-4 text-muted-foreground" />}
                />
              </div>

              {/* Course Details */}
              <div className="space-y-4">
                {instructorAnalytics.courses.map((course: any) => (
                  <Card key={course.course_id}>
                    <CardHeader>
                      <CardTitle>{course.course_title}</CardTitle>
                      <CardDescription>Course Analytics</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-4 md:grid-cols-4 mb-4">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Students</p>
                          <p className="text-2xl font-bold">{course.total_students}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Completion Rate</p>
                          <p className="text-2xl font-bold text-green-500">{course.completion_rate}%</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Avg Score</p>
                          <p className="text-2xl font-bold">{course.avg_assessment_score}%</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Total Time</p>
                          <p className="text-2xl font-bold">{course.total_time_spent} min</p>
                        </div>
                      </div>

                      {course.most_engaged_students.length > 0 && (
                        <div>
                          <h4 className="text-sm font-medium mb-2">Most Engaged Students</h4>
                          <div className="space-y-2">
                            {course.most_engaged_students.map((student: any, index: number) => (
                              <div key={index} className="flex items-center justify-between text-sm">
                                <span>{student.username}</span>
                                <span className="text-muted-foreground">
                                  {student.lessons_completed} lessons · {student.time_spent} min
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}

                {instructorAnalytics.courses.length === 0 && (
                  <Card>
                    <CardContent className="py-8">
                      <p className="text-center text-muted-foreground">No courses found</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">No analytics data available</p>
      </div>
    </DashboardLayout>
  )
}
