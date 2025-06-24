"use client"

import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { mockCourses, mockProgress, mockAssessments } from "@/lib/mock-data"
import { BookOpen, Clock, Trophy, TrendingUp, Calendar } from "lucide-react"

export default function ProgressPage() {
  const enrolledCourses = mockCourses.filter((course) => course.progress !== undefined)
  const totalTimeSpent = mockProgress.reduce((sum, p) => sum + p.timeSpent, 0)
  const averageScore =
    mockAssessments.filter((a) => a.completed && a.score).reduce((sum, a) => sum + (a.score || 0), 0) /
    mockAssessments.filter((a) => a.completed && a.score).length

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Learning Progress</h2>
          <p className="text-muted-foreground">Track your learning journey and achievements.</p>
        </div>

        {/* Stats Overview */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Courses Enrolled</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{enrolledCourses.length}</div>
              <p className="text-xs text-muted-foreground">
                {enrolledCourses.filter((c) => (c.progress || 0) === 100).length} completed
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Time Spent</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{Math.round(totalTimeSpent / 60)}h</div>
              <p className="text-xs text-muted-foreground">{totalTimeSpent % 60}m this week</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Score</CardTitle>
              <Trophy className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{Math.round(averageScore)}%</div>
              <p className="text-xs text-muted-foreground">+5% from last month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Streak</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">7 days</div>
              <p className="text-xs text-muted-foreground">Keep it up!</p>
            </CardContent>
          </Card>
        </div>

        {/* Course Progress */}
        <Card>
          <CardHeader>
            <CardTitle>Course Progress</CardTitle>
            <CardDescription>Your progress in each enrolled course</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {enrolledCourses.map((course) => {
              const courseProgress = mockProgress.find((p) => p.courseId === course.id)
              return (
                <div key={course.id} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">{course.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {courseProgress?.lessonsCompleted || 0} of {courseProgress?.totalLessons || course.totalLessons}{" "}
                        lessons completed
                      </p>
                    </div>
                    <Badge variant="secondary">{course.progress}%</Badge>
                  </div>
                  <Progress value={course.progress} className="h-2" />
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <BookOpen className="h-4 w-4 text-muted-foreground" />
                      <span>
                        {courseProgress?.lessonsCompleted || 0}/{courseProgress?.totalLessons || course.totalLessons}{" "}
                        lessons
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Trophy className="h-4 w-4 text-muted-foreground" />
                      <span>
                        {courseProgress?.assessmentsCompleted || 0}/{courseProgress?.totalAssessments || 0} assessments
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>
                        {Math.round((courseProgress?.timeSpent || 0) / 60)}h {(courseProgress?.timeSpent || 0) % 60}m
                      </span>
                    </div>
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Recent Achievements</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center">
                  <Trophy className="h-5 w-5 text-green-500" />
                </div>
                <div>
                  <p className="font-medium">Quiz Master</p>
                  <p className="text-sm text-muted-foreground">Scored 90%+ on Python Basics Quiz</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                  <BookOpen className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <p className="font-medium">Fast Learner</p>
                  <p className="text-sm text-muted-foreground">Completed 5 lessons this week</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-purple-500" />
                </div>
                <div>
                  <p className="font-medium">Consistent Learner</p>
                  <p className="text-sm text-muted-foreground">7-day learning streak</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Learning Calendar</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Today</span>
                  </div>
                  <Badge variant="secondary">2 lessons</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Yesterday</span>
                  </div>
                  <Badge variant="secondary">1 quiz</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">This Week</span>
                  </div>
                  <Badge variant="secondary">8 activities</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">This Month</span>
                  </div>
                  <Badge variant="secondary">24 activities</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
