import type { User, Course, Lesson, CodeExercise, Assessment, Progress, Notification } from "@/types";

// Mock Users
export const mockUsers: User[] = [
  {
    id: "1",
    username: "john_doe",
    email: "john@example.com",
    role: "student",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
    createdAt: "2024-01-15T10:00:00Z",
  },
  {
    id: "2",
    username: "jane_smith",
    email: "jane@example.com",
    role: "instructor",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jane",
    createdAt: "2024-01-10T10:00:00Z",
  },
  {
    id: "3",
    username: "admin_user",
    email: "admin@example.com",
    role: "admin",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Admin",
    createdAt: "2024-01-01T10:00:00Z",
  },
];

// Mock Courses
export const mockCourses: Course[] = [
  {
    id: "1",
    title: "Introduction to Python Programming",
    description: "Learn the fundamentals of Python programming from scratch. Perfect for beginners!",
    instructor: mockUsers[1],
    thumbnail: "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=800&h=400&fit=crop",
    enrolledStudents: 1250,
    totalLessons: 24,
    completedLessons: 8,
    progress: 33,
    createdAt: "2024-02-01T10:00:00Z",
    updatedAt: "2024-03-15T10:00:00Z",
  },
  {
    id: "2",
    title: "Web Development with React",
    description: "Master modern web development with React, hooks, and best practices.",
    instructor: mockUsers[1],
    thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=400&fit=crop",
    enrolledStudents: 890,
    totalLessons: 30,
    completedLessons: 15,
    progress: 50,
    createdAt: "2024-02-10T10:00:00Z",
    updatedAt: "2024-03-20T10:00:00Z",
  },
  {
    id: "3",
    title: "Data Structures and Algorithms",
    description: "Deep dive into essential data structures and algorithms for coding interviews.",
    instructor: mockUsers[1],
    thumbnail: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&h=400&fit=crop",
    enrolledStudents: 2100,
    totalLessons: 40,
    completedLessons: 5,
    progress: 12,
    createdAt: "2024-01-20T10:00:00Z",
    updatedAt: "2024-03-10T10:00:00Z",
  },
  {
    id: "4",
    title: "Machine Learning Fundamentals",
    description: "Introduction to machine learning concepts, algorithms, and practical applications.",
    instructor: mockUsers[1],
    thumbnail: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=800&h=400&fit=crop",
    enrolledStudents: 1560,
    totalLessons: 35,
    createdAt: "2024-02-15T10:00:00Z",
    updatedAt: "2024-03-18T10:00:00Z",
  },
  {
    id: "5",
    title: "Database Design and SQL",
    description: "Learn database design principles and master SQL for data management.",
    instructor: mockUsers[1],
    thumbnail: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=800&h=400&fit=crop",
    enrolledStudents: 780,
    totalLessons: 20,
    createdAt: "2024-03-01T10:00:00Z",
    updatedAt: "2024-03-22T10:00:00Z",
  },
];

// Mock Lessons
export const mockLessons: Lesson[] = [
  // Python Course Lessons
  {
    id: "1",
    courseId: "1",
    title: "Getting Started with Python",
    description: "Introduction to Python and setting up your development environment",
    content: `# Getting Started with Python

Python is a versatile, high-level programming language known for its simplicity and readability.

## Why Python?

- **Easy to Learn**: Clean syntax that's easy to read and write
- **Versatile**: Used in web development, data science, AI, automation, and more
- **Large Community**: Extensive libraries and community support
- **Cross-platform**: Works on Windows, Mac, and Linux

## Installing Python

1. Visit [python.org](https://python.org)
2. Download the latest version
3. Run the installer
4. Verify installation: \`python --version\`

## Your First Program

\`\`\`python
print("Hello, World!")
\`\`\`

Let's break this down:
- \`print()\` is a built-in function
- The text in quotes is a string
- This outputs text to the console
`,
    videoPath: "/videos/python-intro.mp4",
    duration: 15,
    order: 1,
    completed: true,
  },
  {
    id: "2",
    courseId: "1",
    title: "Variables and Data Types",
    description: "Understanding variables, data types, and basic operations in Python",
    content: `# Variables and Data Types

Variables are containers for storing data values.

## Creating Variables

\`\`\`python
name = "Alice"
age = 25
height = 5.6
is_student = True
\`\`\`

## Data Types

- **String**: Text data (\`"Hello"\`)
- **Integer**: Whole numbers (\`42\`)
- **Float**: Decimal numbers (\`3.14\`)
- **Boolean**: True or False values

## Type Conversion

\`\`\`python
age = "25"
age_int = int(age)  # Convert to integer
\`\`\`
`,
    videoPath: "/videos/python-variables.mp4",
    duration: 20,
    order: 2,
    completed: true,
  },
  {
    id: "3",
    courseId: "1",
    title: "Control Flow: If Statements",
    description: "Learn how to make decisions in your code using if statements",
    content: `# Control Flow: If Statements

Control flow allows your program to make decisions.

## Basic If Statement

\`\`\`python
age = 18
if age >= 18:
    print("You are an adult")
\`\`\`

## If-Else

\`\`\`python
temperature = 25
if temperature > 30:
    print("It's hot!")
else:
    print("It's comfortable")
\`\`\`

## If-Elif-Else

\`\`\`python
score = 85
if score >= 90:
    grade = "A"
elif score >= 80:
    grade = "B"
elif score >= 70:
    grade = "C"
else:
    grade = "F"
\`\`\`
`,
    videoPath: "/videos/python-if-statements.mp4",
    duration: 25,
    order: 3,
    completed: false,
  },
  // React Course Lessons
  {
    id: "4",
    courseId: "2",
    title: "Introduction to React",
    description: "Understanding React and its core concepts",
    content: `# Introduction to React

React is a JavaScript library for building user interfaces.

## What is React?

React is a declarative, efficient, and flexible JavaScript library for building user interfaces. It lets you compose complex UIs from small and isolated pieces of code called "components".

## Key Concepts

- **Components**: Reusable UI pieces
- **JSX**: JavaScript XML syntax
- **Props**: Data passed to components
- **State**: Component's internal data

## Your First Component

\`\`\`jsx
function Welcome() {
  return <h1>Hello, React!</h1>;
}
\`\`\`
`,
    videoPath: "/videos/react-intro.mp4",
    duration: 18,
    order: 1,
    completed: true,
  },
  {
    id: "5",
    courseId: "2",
    title: "React Hooks: useState",
    description: "Learn how to manage state in functional components",
    content: `# React Hooks: useState

The useState hook lets you add state to functional components.

## Basic Usage

\`\`\`jsx
import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
    </div>
  );
}
\`\`\`

## Multiple State Variables

\`\`\`jsx
function Form() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  
  // Use multiple state variables
}
\`\`\`
`,
    videoPath: "/videos/react-usestate.mp4",
    duration: 22,
    order: 2,
    completed: false,
  },
];

// Mock Code Exercises
export const mockCodeExercises: CodeExercise[] = [
  {
    id: "1",
    courseId: "1",
    title: "Hello World",
    description: "Write a program that prints 'Hello, World!' to the console",
    language: "python",
    starterCode: `# Write your code here\n`,
    solution: `print("Hello, World!")`,
    testCases: [
      {
        input: "",
        expectedOutput: "Hello, World!",
      },
    ],
  },
  {
    id: "2",
    courseId: "1",
    title: "Sum of Two Numbers",
    description: "Write a function that returns the sum of two numbers",
    language: "python",
    starterCode: `def add_numbers(a, b):\n    # Write your code here\n    pass\n\n# Test your function\nprint(add_numbers(5, 3))`,
    solution: `def add_numbers(a, b):\n    return a + b\n\nprint(add_numbers(5, 3))`,
    testCases: [
      {
        input: "5, 3",
        expectedOutput: "8",
      },
      {
        input: "10, 20",
        expectedOutput: "30",
      },
    ],
  },
  {
    id: "3",
    courseId: "2",
    title: "React Counter Component",
    description: "Create a counter component with increment and decrement buttons",
    language: "javascript",
    starterCode: `import { useState } from 'react';\n\nfunction Counter() {\n  // Add your code here\n  \n  return (\n    <div>\n      {/* Add your JSX here */}\n    </div>\n  );\n}\n\nexport default Counter;`,
    solution: `import { useState } from 'react';\n\nfunction Counter() {\n  const [count, setCount] = useState(0);\n  \n  return (\n    <div>\n      <p>Count: {count}</p>\n      <button onClick={() => setCount(count + 1)}>+</button>\n      <button onClick={() => setCount(count - 1)}>-</button>\n    </div>\n  );\n}\n\nexport default Counter;`,
    testCases: [
      {
        input: "Initial render",
        expectedOutput: "Count: 0",
      },
    ],
  },
];

// Mock Assessments
export const mockAssessments: Assessment[] = [
  {
    id: "1",
    courseId: "1",
    title: "Python Basics Quiz",
    description: "Test your knowledge of Python fundamentals",
    questions: [
      {
        id: "q1",
        question: "What is the correct way to print 'Hello' in Python?",
        options: [
          'echo "Hello"',
          'print("Hello")',
          'console.log("Hello")',
          'printf("Hello")',
        ],
        correctAnswer: 1,
        explanation: "In Python, we use the print() function to output text to the console.",
      },
      {
        id: "q2",
        question: "Which of these is NOT a valid Python data type?",
        options: ["int", "float", "string", "char"],
        correctAnswer: 3,
        explanation: "Python doesn't have a 'char' type. Single characters are just strings of length 1.",
      },
      {
        id: "q3",
        question: "What does the '==' operator do in Python?",
        options: [
          "Assigns a value",
          "Compares two values",
          "Adds two numbers",
          "Concatenates strings",
        ],
        correctAnswer: 1,
        explanation: "The '==' operator compares two values for equality, while '=' is used for assignment.",
      },
    ],
    timeLimit: 15,
    attempts: 1,
    score: 100,
    completed: true,
  },
  {
    id: "2",
    courseId: "2",
    title: "React Fundamentals Quiz",
    description: "Test your understanding of React basics",
    questions: [
      {
        id: "q1",
        question: "What is JSX?",
        options: [
          "A new programming language",
          "JavaScript XML - a syntax extension for JavaScript",
          "A CSS framework",
          "A database query language",
        ],
        correctAnswer: 1,
        explanation: "JSX is a syntax extension for JavaScript that looks similar to HTML and is used in React.",
      },
      {
        id: "q2",
        question: "Which hook is used to manage state in functional components?",
        options: ["useEffect", "useState", "useContext", "useReducer"],
        correctAnswer: 1,
        explanation: "useState is the primary hook for managing state in functional components.",
      },
    ],
    timeLimit: 10,
    attempts: 0,
    completed: false,
  },
  {
    id: "3",
    courseId: "3",
    title: "Data Structures Quiz",
    description: "Test your knowledge of basic data structures",
    questions: [
      {
        id: "q1",
        question: "What is the time complexity of accessing an element in an array by index?",
        options: ["O(1)", "O(n)", "O(log n)", "O(n²)"],
        correctAnswer: 0,
        explanation: "Array access by index is O(1) - constant time - because we can directly calculate the memory address.",
      },
      {
        id: "q2",
        question: "Which data structure follows LIFO (Last In First Out)?",
        options: ["Queue", "Stack", "Array", "Linked List"],
        correctAnswer: 1,
        explanation: "A Stack follows LIFO - the last element added is the first one to be removed.",
      },
    ],
    timeLimit: 20,
    attempts: 1,
    score: 50,
    completed: true,
  },
];

// Mock Progress
export const mockProgress: Progress[] = [
  {
    userId: "1",
    courseId: "1",
    lessonsCompleted: 8,
    totalLessons: 24,
    assessmentsCompleted: 1,
    totalAssessments: 3,
    timeSpent: 420, // 7 hours
    lastAccessed: "2024-03-20T14:30:00Z",
  },
  {
    userId: "1",
    courseId: "2",
    lessonsCompleted: 15,
    totalLessons: 30,
    assessmentsCompleted: 0,
    totalAssessments: 2,
    timeSpent: 680, // 11.3 hours
    lastAccessed: "2024-03-21T10:15:00Z",
  },
  {
    userId: "1",
    courseId: "3",
    lessonsCompleted: 5,
    totalLessons: 40,
    assessmentsCompleted: 1,
    totalAssessments: 4,
    timeSpent: 180, // 3 hours
    lastAccessed: "2024-03-19T16:45:00Z",
  },
];

// Mock Notifications
export const mockNotifications: Notification[] = [
  {
    id: "1",
    title: "New Lesson Available",
    message: "A new lesson has been added to 'Introduction to Python Programming'",
    type: "info",
    read: false,
    createdAt: "2024-03-21T09:00:00Z",
    userId: "1",
  },
  {
    id: "2",
    title: "Assignment Due Soon",
    message: "Your assignment for 'Web Development with React' is due in 2 days",
    type: "warning",
    read: false,
    createdAt: "2024-03-20T15:30:00Z",
    userId: "1",
  },
  {
    id: "3",
    title: "Quiz Completed",
    message: "You scored 100% on the Python Basics Quiz! Great job!",
    type: "success",
    read: true,
    createdAt: "2024-03-19T11:20:00Z",
    userId: "1",
  },
  {
    id: "4",
    title: "Course Enrollment",
    message: "You have successfully enrolled in 'Machine Learning Fundamentals'",
    type: "success",
    read: true,
    createdAt: "2024-03-18T14:00:00Z",
    userId: "1",
  },
  {
    id: "5",
    title: "System Maintenance",
    message: "Scheduled maintenance on March 25th from 2:00 AM to 4:00 AM",
    type: "info",
    read: true,
    createdAt: "2024-03-17T10:00:00Z",
  },
  {
    id: "6",
    title: "New Feature",
    message: "Check out our new code playground feature for practicing coding!",
    type: "info",
    read: true,
    createdAt: "2024-03-16T08:30:00Z",
  },
];
