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
import { CodeEditor } from "@/components/code-editor"

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
  const [activeTab, setActiveTab] = useState("description")

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
     return (
        <div className="h-screen w-full flex items-center justify-center bg-zinc-950 text-white">
             <div className="flex flex-col items-center gap-4">
                 <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
                 <p className="text-sm text-zinc-400">Loading Environment...</p>
             </div>
        </div>
     )
  }

  if (!exercise || !course) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">Exercise not found</h2>
            <p className="text-muted-foreground">The coding exercise you're looking for doesn't exist.</p>
            <Link href={`/courses/${courseId}`}>
                <Button className="mt-4">Back to Course</Button>
            </Link>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  const handleRunCode = async () => {
    setIsRunning(true)
    setOutput("Running code...\n")

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
    setOutput("Submission functionality not fully implemented yet. Please use 'Run Code' to verify your solution against test cases manually.");
  }

  // We'll return a full-screen layout, bypassing the default DashboardLayout to give an IDE feel
  // But we might want to keep the sidebar? For now let's make it look like a standalone IDE mode
  // and provide a clear "Exit" button.
  
  return (
    <div className="h-screen flex flex-col bg-zinc-950 text-zinc-100 overflow-hidden font-sans">
      {/* Top Navigation Bar */}
      <header className="h-14 border-b border-zinc-800 flex items-center justify-between px-4 bg-zinc-900/50 backdrop-blur-sm shrink-0 z-50">
        <div className="flex items-center gap-4">
            <Link href={`/courses/${courseId}`}>
              <Button variant="ghost" size="sm" className="text-zinc-400 hover:text-white hover:bg-white/10">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Exit
              </Button>
            </Link>
            <div className="h-4 w-[1px] bg-zinc-700" />
            <div>
              <h1 className="text-sm font-semibold tracking-tight">{exercise.title}</h1>
              <p className="text-xs text-zinc-500">{course.title}</p>
            </div>
        </div>

        <div className="flex items-center gap-2">
            <Select value={language} onValueChange={setLanguage} disabled={true}>
                <SelectTrigger className="w-[120px] h-8 bg-zinc-900 border-zinc-700 text-xs focus:ring-0 focus:ring-offset-0">
                <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-zinc-900 border-zinc-700 text-zinc-100">
                <SelectItem value="python">Python</SelectItem>
                <SelectItem value="javascript">JavaScript</SelectItem>
                <SelectItem value="java">Java</SelectItem>
                <SelectItem value="cpp">C++</SelectItem>
                </SelectContent>
            </Select>
            <Button 
                size="sm" 
                onClick={handleRunCode} 
                disabled={isRunning} 
                className="h-8 bg-green-600 hover:bg-green-700 text-white border-0"
            >
                <Play className="mr-2 h-3.5 w-3.5" />
                {isRunning ? "Running..." : "Run"}
            </Button>
             <Button 
                size="sm" 
                onClick={handleSubmit} 
                variant="outline"
                className="h-8 border-zinc-700 bg-transparent text-zinc-300 hover:bg-zinc-800 hover:text-white"
            >
                <CheckCircle className="mr-2 h-3.5 w-3.5" />
                Submit
            </Button>
        </div>
      </header>

      {/* Main Workspace Split */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel: Problem Description */}
        <div className="w-1/3 min-w-[300px] border-r border-zinc-800 flex flex-col bg-zinc-900/30">
            <div className="flex items-center border-b border-zinc-800 px-2">
                <button 
                    className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'description' ? 'border-indigo-500 text-white' : 'border-transparent text-zinc-500 hover:text-zinc-300'}`}
                    onClick={() => setActiveTab('description')}
                >
                    Description
                </button>
                 <button 
                    className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'tests' ? 'border-indigo-500 text-white' : 'border-transparent text-zinc-500 hover:text-zinc-300'}`}
                    onClick={() => setActiveTab('tests')}
                >
                    Test Cases
                </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent">
                {activeTab === 'description' ? (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                         <div className="prose prose-invert prose-sm max-w-none">
                            <p className="text-zinc-300 leading-relaxed">{exercise.description}</p>
                        </div>

                        {exercise.solution && (
                        <div className="mt-8 border border-zinc-800 rounded-lg overflow-hidden">
                            <details className="group">
                            <summary className="cursor-pointer bg-zinc-900/50 p-3 text-xs font-semibold text-zinc-400 hover:text-white flex items-center select-none transition-colors">
                                <span className="mr-2 group-open:rotate-90 transition-transform">▶</span>
                                Show Solution
                            </summary>
                            <div className="p-4 bg-black/50 overflow-x-auto">
                                <pre className="text-xs font-mono text-emerald-400">
                                <code>{exercise.solution}</code>
                                </pre>
                            </div>
                            </details>
                        </div>
                        )}
                    </div>
                ) : (
                    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                         {exercise.test_cases.length > 0 ? (
                             exercise.test_cases.map((testCase, index) => (
                                <div key={index} className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-4 space-y-3">
                                    <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Test Case {index + 1}</h3>
                                    <div className="grid gap-2">
                                        <div className="bg-black/30 rounded p-2 font-mono text-xs">
                                            <span className="text-zinc-500 block mb-1">Input:</span>
                                            <span className="text-zinc-300">{testCase.input || "None"}</span>
                                        </div>
                                        <div className="bg-black/30 rounded p-2 font-mono text-xs">
                                            <span className="text-zinc-500 block mb-1">Expected Output:</span>
                                            <span className="text-emerald-400">{testCase.expectedOutput}</span>
                                        </div>
                                    </div>
                                </div>
                             ))
                         ) : (
                             <p className="text-zinc-500 text-sm text-center py-8">No specific test cases provided.</p>
                         )}
                    </div>
                )}
            </div>
        </div>

        {/* Right Panel: Editor & Output */}
        <div className="flex-1 flex flex-col min-w-0 bg-zinc-950">
            {/* Editor Area */}
            <div className="flex-1 relative">
                <div className="absolute inset-0">
                    <CodeEditor
                        value={code}
                        onChange={setCode}
                        language={language}
                        height="100%"
                    />
                </div>
                 <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={handleReset} 
                    className="absolute top-4 right-4 z-10 bg-zinc-800/50 hover:bg-zinc-700 text-zinc-400 hover:text-white backdrop-blur-sm p-2 h-8 w-8 rounded-lg border border-white/5"
                    title="Reset Code"
                >
                    <RotateCcw className="h-4 w-4" />
                </Button>
            </div>

            {/* Terminal Area */}
            <div className="h-[35%] min-h-[150px] border-t border-zinc-800 flex flex-col bg-black">
                <div className="h-9 px-4 border-b border-zinc-800 flex items-center justify-between shrink-0 bg-zinc-900/30">
                    <span className="text-xs font-mono text-zinc-400 flex items-center">
                        <span className="w-2 h-2 rounded-full bg-zinc-600 mr-2"></span>
                        TERMINAL
                    </span>
                    <button 
                        onClick={() => setOutput("")}
                        className="text-[10px] text-zinc-500 hover:text-zinc-300 uppercase tracking-wider font-semibold"
                    >
                        Clear
                    </button>
                </div>
                <div className="flex-1 p-4 overflow-auto font-mono text-sm bg-black/95">
                    {output ? (
                        <pre className={`${
                            output.toLowerCase().includes('error') ? 'text-red-400' : 'text-zinc-300'
                        } whitespace-pre-wrap`}>
                            {output}
                        </pre>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-zinc-600 space-y-2">
                             <div className="p-3 rounded-xl bg-zinc-900/50">
                                <Play className="w-5 h-5 opacity-50" />
                             </div>
                             <p className="text-xs">Run your code to see the output here</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
      </div>
    </div>
  )
}
