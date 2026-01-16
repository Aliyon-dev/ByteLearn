import type { Course, Lesson, CodeExercise, Assessment, Progress, User } from "@/types";

// Transform backend course response to frontend Course interface
export function transformCourse(backendCourse: any): Course {
  return {
    id: String(backendCourse.id),
    title: backendCourse.title,
    description: backendCourse.description,
    instructor: backendCourse.instructor_detail || backendCourse.instructor
      ? {
          id: String(backendCourse.instructor_detail?.id || backendCourse.instructor),
          username: backendCourse.instructor_detail?.username || backendCourse.instructor || "Unknown",
          email: backendCourse.instructor_detail?.email || "",
          role: backendCourse.instructor_detail?.profile?.role || "instructor",
          createdAt: backendCourse.instructor_detail?.date_joined || new Date().toISOString(),
        }
      : {
          id: "0",
          username: "Unknown",
          email: "",
          role: "instructor" as const,
          createdAt: new Date().toISOString(),
        },
    thumbnail: backendCourse.thumbnail || undefined,
    enrolledStudents: backendCourse.enrolled_students || 0,
    totalLessons: backendCourse.lessons?.length || backendCourse.total_lessons || 0,
    completedLessons: backendCourse.completed_lessons || 0,
    progress: backendCourse.progress_percentage || undefined,
    createdAt: backendCourse.created_at || new Date().toISOString(),
    updatedAt: backendCourse.updated_at || backendCourse.created_at || new Date().toISOString(),
  };
}

// Transform backend lesson response to frontend Lesson interface
export function transformLesson(backendLesson: any, completedLessons?: number[]): Lesson {
  return {
    id: String(backendLesson.id),
    courseId: String(backendLesson.course || backendLesson.course_detail?.id || ""),
    title: backendLesson.title,
    description: backendLesson.description,
    content: backendLesson.content || "",
    videoPath: backendLesson.video_path || backendLesson.video_file || undefined,
    duration: backendLesson.duration || 0,
    order: backendLesson.order || 0,
    completed: completedLessons ? completedLessons.includes(backendLesson.id) : false,
  };
}

// Transform backend coding exercise response to frontend CodeExercise interface
export function transformCodeExercise(backendExercise: any): CodeExercise {
  return {
    id: String(backendExercise.id),
    courseId: String(backendExercise.course || backendExercise.course_detail?.id || ""),
    title: backendExercise.title,
    description: backendExercise.description,
    language: backendExercise.language || "python",
    starterCode: backendExercise.starter_code || "",
    solution: backendExercise.solution || undefined,
    testCases: (backendExercise.test_cases || []).map((tc: any) => ({
      input: tc.input || "",
      expectedOutput: tc.output || tc.expected_output || "",
    })),
  };
}

// Transform backend assessment response to frontend Assessment interface
export function transformAssessment(backendAssessment: any, userSubmissions?: any[]): Assessment {
  const latestSubmission = userSubmissions && userSubmissions.length > 0 
    ? userSubmissions[0] 
    : null;

  return {
    id: String(backendAssessment.id),
    courseId: String(backendAssessment.course || backendAssessment.course_detail?.id || ""),
    title: backendAssessment.title,
    description: backendAssessment.description,
    questions: (backendAssessment.questions || []).map((q: any, idx: number) => ({
      id: String(idx),
      question: q.question || "",
      options: q.options || [],
      correctAnswer: q.answer !== undefined ? Number(q.answer) : 0,
      explanation: q.explanation || undefined,
    })),
    timeLimit: backendAssessment.time_limit || undefined,
    attempts: backendAssessment.attempts || 1,
    score: latestSubmission ? latestSubmission.percentage : undefined,
    completed: latestSubmission ? true : false,
  };
}

// Transform backend progress response to frontend Progress interface
export function transformProgress(backendProgress: any): Progress {
  return {
    userId: String(backendProgress.user || backendProgress.user_detail?.id || ""),
    courseId: String(backendProgress.course || backendProgress.course_detail?.id || ""),
    lessonsCompleted: backendProgress.lessons_completed || 0,
    totalLessons: backendProgress.total_lessons || 0,
    assessmentsCompleted: backendProgress.assessments_completed || 0,
    totalAssessments: backendProgress.total_assessments || 0,
    timeSpent: backendProgress.time_spent || 0,
    lastAccessed: backendProgress.last_accessed || new Date().toISOString(),
  };
}

// Transform user data
export function transformUser(backendUser: any): User {
  return {
    id: String(backendUser.id),
    username: backendUser.username,
    email: backendUser.email || "",
    role: backendUser.role || backendUser.profile?.role || "student",
    avatar: backendUser.avatar || undefined,
    createdAt: backendUser.date_joined || backendUser.created_at || new Date().toISOString(),
  };
}


