"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Play, RotateCcw, CheckCircle } from "lucide-react"
import Link from "next/link"
import { Textarea } from "@/components/ui/textarea"
import api from "@/lib/api"

// Simple type definitions for data we expect
interface Exercise {
    id: number;
    title: string;
    description: string;
    starter_code: string;
    solution: string;
    test_cases: any[];
    language: string;
    course: number;
}

interface Course {
    id: number;
    title: string;
}

export default function CodingExercisePage() {
  const params = useParams()
  const courseId = params.id as string
  const exerciseId = params.exerciseId as string

  const [exercise, setExercise] = useState<Exercise | null>(null)
  const [course, setCourse] = useState<Course | null>(null)
  const [loading, setLoading] = useState(true)

  const [code, setCode] = useState("")
  const [output, setOutput] = useState("")
  const [isRunning, setIsRunning] = useState(false)
  const [language, setLanguage] = useState("python")

  useEffect(() => {
    const fetchData = async () => {
        try {
            const [exRes, courseRes] = await Promise.all([
                api.get(`courses/exercises/${exerciseId}/`),
                api.get(`courses/courses/${courseId}/`)
            ]);
            setExercise(exRes.data);
            setCourse(courseRes.data);
            setCode(exRes.data.starter_code);
            setLanguage(exRes.data.language);
        } catch (e) {
            console.error("Failed to fetch exercise data", e);
        } finally {
            setLoading(false);
        }
    };
    fetchData();
  }, [courseId, exerciseId]);


  if (loading) {
     return <DashboardLayout><div>Loading...</div></DashboardLayout>
  }

  if (!exercise || !course) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">Exercise not found</h2>
            <p className="text-muted-foreground">The coding exercise you're looking for doesn't exist.</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  const handleRunCode = async () => {
    setIsRunning(true)
    setOutput("Running code...")

    try {
        const res = await api.post('courses/execute/', {
            code: code,
            language: language
        });
        setOutput(res.data.output);
    } catch (e: any) {
        setOutput(e.response?.data?.error || "Error running code");
    } finally {
        setIsRunning(false);
    }
  }

  const handleReset = () => {
    setCode(exercise.starter_code)
    setOutput("")
  }

  const handleSubmit = () => {
    // Basic mock submission for now
    setOutput("Submission functionality not fully implemented yet. Please use 'Run Code' to verify your solution against test cases manually.");
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
              <h1 className="text-2xl font-bold">{exercise.title}</h1>
              <p className="text-muted-foreground">{course.title}</p>
            </div>
          </div>
          <Badge variant="outline">{exercise.language}</Badge>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Problem Description */}
          <Card>
            <CardHeader>
              <CardTitle>Problem Description</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm">{exercise.description}</p>

              {exercise.test_cases.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2">Test Cases:</h4>
                  <div className="space-y-2">
                    {exercise.test_cases.map((testCase, index) => (
                      <div key={index} className="bg-muted p-3 rounded-lg text-sm">
                        <div>
                          <strong>Input:</strong> {testCase.input || "None"}
                        </div>
                        <div>
                          <strong>Expected Output:</strong> {testCase.expectedOutput}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {exercise.solution && (
                <details className="mt-4">
                  <summary className="cursor-pointer font-semibold text-sm">💡 Show Solution (Click to reveal)</summary>
                  <pre className="mt-2 bg-muted p-3 rounded-lg text-sm overflow-x-auto">
                    <code>{exercise.solution}</code>
                  </pre>
                </details>
              )}
            </CardContent>
          </Card>

          {/* Code Editor */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Code Editor</CardTitle>
                  <div className="flex items-center space-x-2">
                    <Select value={language} onValueChange={setLanguage} disabled={true}>
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="python">Python</SelectItem>
                        <SelectItem value="javascript">JavaScript</SelectItem>
                        <SelectItem value="java">Java</SelectItem>
                        <SelectItem value="cpp">C++</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button variant="outline" size="sm" onClick={handleReset}>
                      <RotateCcw className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="min-h-[300px] font-mono text-sm"
                  placeholder="Write your code here..."
                />
                <div className="flex items-center space-x-2 mt-4">
                  <Button onClick={handleRunCode} disabled={isRunning}>
                    <Play className="mr-2 h-4 w-4" />
                    {isRunning ? "Running..." : "Run Code"}
                  </Button>
                  <Button onClick={handleSubmit} variant="outline">
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Submit
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Output */}
            <Card>
              <CardHeader>
                <CardTitle>Output</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="bg-muted p-4 rounded-lg text-sm min-h-[150px] overflow-x-auto">
                  {output || 'Click "Run Code" to see the output...'}
                </pre>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
