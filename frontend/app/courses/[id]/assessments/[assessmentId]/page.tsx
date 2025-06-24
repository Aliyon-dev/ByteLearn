"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { mockAssessments, mockCourses } from "@/lib/mock-data"
import { ArrowLeft, Clock, CheckCircle } from "lucide-react"
import Link from "next/link"

export default function AssessmentPage() {
  const params = useParams()
  const courseId = params.id as string
  const assessmentId = params.assessmentId as string

  const assessment = mockAssessments.find((a) => a.id === assessmentId && a.courseId === courseId)
  const course = mockCourses.find((c) => c.id === courseId)

  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [timeLeft, setTimeLeft] = useState(assessment?.timeLimit ? assessment.timeLimit * 60 : 0)

  if (!assessment || !course) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">Assessment not found</h2>
            <p className="text-muted-foreground">The assessment you're looking for doesn't exist.</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  const question = assessment.questions[currentQuestion]
  const progress = ((currentQuestion + 1) / assessment.questions.length) * 100

  const handleAnswerChange = (questionId: string, answerIndex: number) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answerIndex,
    }))
  }

  const handleNext = () => {
    if (currentQuestion < assessment.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const handleSubmit = () => {
    setIsSubmitted(true)
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  const calculateScore = () => {
    let correct = 0
    assessment.questions.forEach((q) => {
      if (answers[q.id] === q.correctAnswer) {
        correct++
      }
    })
    return Math.round((correct / assessment.questions.length) * 100)
  }

  if (isSubmitted) {
    const score = calculateScore()
    return (
      <DashboardLayout>
        <div className="max-w-2xl mx-auto space-y-6">
          <Card>
            <CardHeader className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500/10 flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
              <CardTitle className="text-2xl">Assessment Completed!</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <div className="text-4xl font-bold text-green-500">{score}%</div>
              <p className="text-muted-foreground">
                You scored {score}% on {assessment.title}
              </p>

              <div className="grid gap-4 md:grid-cols-3 mt-6">
                <div className="text-center">
                  <div className="text-2xl font-bold">{Object.keys(answers).length}</div>
                  <div className="text-sm text-muted-foreground">Questions Answered</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-500">
                    {assessment.questions.filter((q) => answers[q.id] === q.correctAnswer).length}
                  </div>
                  <div className="text-sm text-muted-foreground">Correct</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-500">
                    {assessment.questions.filter((q) => answers[q.id] !== q.correctAnswer).length}
                  </div>
                  <div className="text-sm text-muted-foreground">Incorrect</div>
                </div>
              </div>

              <div className="flex justify-center space-x-4 mt-6">
                <Link href={`/courses/${courseId}`}>
                  <Button>Back to Course</Button>
                </Link>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsSubmitted(false)
                    setCurrentQuestion(0)
                    setAnswers({})
                  }}
                >
                  Retake Quiz
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
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
              <h1 className="text-2xl font-bold">{assessment.title}</h1>
              <p className="text-muted-foreground">{course.title}</p>
            </div>
          </div>
          {assessment.timeLimit && (
            <Badge variant="outline" className="flex items-center space-x-1">
              <Clock className="h-3 w-3" />
              <span>{formatTime(timeLeft)}</span>
            </Badge>
          )}
        </div>

        {/* Progress */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">
                Question {currentQuestion + 1} of {assessment.questions.length}
              </span>
              <span className="text-sm text-muted-foreground">{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} />
          </CardContent>
        </Card>

        {/* Question */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{question.question}</CardTitle>
          </CardHeader>
          <CardContent>
            <RadioGroup
              value={answers[question.id]?.toString()}
              onValueChange={(value) => handleAnswerChange(question.id, Number.parseInt(value))}
            >
              {question.options.map((option, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                  <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={handlePrevious} disabled={currentQuestion === 0}>
            Previous
          </Button>

          <div className="flex items-center space-x-2">
            {currentQuestion === assessment.questions.length - 1 ? (
              <Button onClick={handleSubmit} disabled={!answers[question.id]}>
                Submit Assessment
              </Button>
            ) : (
              <Button onClick={handleNext} disabled={!answers[question.id]}>
                Next
              </Button>
            )}
          </div>
        </div>

        {/* Question Navigation */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Question Navigation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-10 gap-2">
              {assessment.questions.map((_, index) => (
                <Button
                  key={index}
                  variant={currentQuestion === index ? "default" : "outline"}
                  size="sm"
                  className="w-10 h-10 p-0"
                  onClick={() => setCurrentQuestion(index)}
                >
                  {answers[assessment.questions[index].id] !== undefined ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    index + 1
                  )}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
