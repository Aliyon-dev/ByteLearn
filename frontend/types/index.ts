export type UserRole = "student" | "instructor" | "admin"

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  avatar?: string
  createdAt: string
}

export interface Course {
  id: string
  title: string
  description: string
  instructor: User
  thumbnail?: string
  enrolledStudents: number
  totalLessons: number
  completedLessons?: number
  progress?: number
  createdAt: string
  updatedAt: string
}

export interface Lesson {
  id: string
  courseId: string
  title: string
  description: string
  content: string // Markdown content
  videoPath?: string
  duration: number // in minutes
  order: number
  completed?: boolean
}

export interface CodeExercise {
  id: string
  courseId: string
  title: string
  description: string
  language: string
  starterCode: string
  solution?: string
  testCases: TestCase[]
}

export interface TestCase {
  input: string
  expectedOutput: string
}

export interface Assessment {
  id: string
  courseId: string
  title: string
  description: string
  questions: Question[]
  timeLimit?: number // in minutes
  attempts?: number
  score?: number
  completed?: boolean
}

export interface Question {
  id: string
  question: string
  options: string[]
  correctAnswer: number
  explanation?: string
}

export interface Progress {
  userId: string
  courseId: string
  lessonsCompleted: number
  totalLessons: number
  assessmentsCompleted: number
  totalAssessments: number
  timeSpent: number // in minutes
  lastAccessed: string
}

export interface Notification {
  id: string
  title: string
  message: string
  type: "info" | "success" | "warning" | "error"
  read: boolean
  createdAt: string
  userId?: string
}
