"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { ArrowLeft, CheckCircle, XCircle } from "lucide-react"
import Link from "next/link"
import api from "@/lib/api"

interface Question {
    question: string;
    options: string[];
    answer: number; // Index of correct option
}

interface Assessment {
    id: number;
    title: string;
    description: string;
    questions: Question[];
    time_limit: number;
}

export default function AssessmentPage() {
  const params = useParams()
  const courseId = params.id as string
  const assessmentId = params.assessmentId as string
  const router = useRouter()

  const [assessment, setAssessment] = useState<Assessment | null>(null)
  const [loading, setLoading] = useState(true)
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const [result, setResult] = useState<any>(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const fetchAssessment = async () => {
        try {
            const res = await api.get(`assessments/${assessmentId}/`)
            setAssessment(res.data)
        } catch (e) {
            console.error(e)
        } finally {
            setLoading(false)
        }
    }
    fetchAssessment()
  }, [assessmentId])

  const handleOptionSelect = (qIdx: number, optionIdx: number) => {
    if (result) return; // Disable changing after submission
    setAnswers(prev => ({
        ...prev,
        [qIdx]: optionIdx
    }))
  }

  const handleSubmit = async () => {
    setSubmitting(true)
    try {
        const res = await api.post(`assessments/${assessmentId}/submit/`, {
            answers: answers
        })
        setResult(res.data)
    } catch (e) {
        console.error(e)
    } finally {
        setSubmitting(false)
    }
  }

  if (loading) return <DashboardLayout><div>Loading...</div></DashboardLayout>
  if (!assessment) return <DashboardLayout><div>Assessment not found</div></DashboardLayout>

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-3xl mx-auto">
        <div className="flex items-center space-x-4 mb-6">
          <Link href={`/courses/${courseId}`}>
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Course
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">{assessment.title}</h1>
            <p className="text-muted-foreground">Time Limit: {assessment.time_limit} mins</p>
          </div>
        </div>

        {result && (
            <Alert className={result.percentage >= 70 ? "bg-green-50 border-green-200" : "bg-yellow-50 border-yellow-200"}>
                <AlertTitle className="text-lg font-semibold">
                    Score: {result.score} / {result.total} ({result.percentage.toFixed(1)}%)
                </AlertTitle>
                <AlertDescription>
                    {result.percentage >= 70 ? "Great job! You passed." : "Keep studying and try again."}
                </AlertDescription>
            </Alert>
        )}

        <div className="space-y-6">
            {assessment.questions.map((q, qIdx) => {
                const isCorrect = result?.results[qIdx]?.correct;
                const userAnswer = result?.results[qIdx]?.user_answer;

                return (
                <Card key={qIdx} className={`border-l-4 ${result ? (isCorrect ? "border-l-green-500" : "border-l-red-500") : "border-l-primary"}`}>
                    <CardHeader>
                        <CardTitle className="text-lg font-medium">
                            {qIdx + 1}. {q.question}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <RadioGroup
                            value={answers[qIdx]?.toString()}
                            onValueChange={(val) => handleOptionSelect(qIdx, parseInt(val))}
                            disabled={!!result}
                        >
                            {q.options.map((opt, oIdx) => (
                                <div key={oIdx} className="flex items-center space-x-2 space-y-2">
                                    <RadioGroupItem value={oIdx.toString()} id={`q${qIdx}-o${oIdx}`} />
                                    <Label htmlFor={`q${qIdx}-o${oIdx}`} className={
                                        result && oIdx === q.answer ? "text-green-600 font-bold" :
                                        result && oIdx !== q.answer && oIdx === userAnswer ? "text-red-600 font-bold" : ""
                                    }>{opt}</Label>
                                    {result && oIdx === q.answer && <CheckCircle className="h-4 w-4 text-green-500" />}
                                    {result && oIdx !== q.answer && oIdx === userAnswer && <XCircle className="h-4 w-4 text-red-500" />}
                                </div>
                            ))}
                        </RadioGroup>
                    </CardContent>
                </Card>
            )})}
        </div>

        {!result && (
            <div className="flex justify-end">
                <Button onClick={handleSubmit} disabled={submitting} size="lg">
                    {submitting ? "Submitting..." : "Submit Assessment"}
                </Button>
            </div>
        )}
      </div>
    </DashboardLayout>
  )
}
