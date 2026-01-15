export interface Student {
  id: string
  firstName: string
  lastName: string
  email: string
  group: string
  enrolledAt: string
  status: 'active' | 'inactive' | 'graduated'
}

export interface Assignment {
  id: string
  title: string
  description: string
  dueDate: string
  status: 'open' | 'closed' | 'in_review'
  totalSubmissions: number
  maxScore: number
}

export interface Submission {
  id: string
  studentId: string
  assignmentId: string
  submittedAt: string
  score: number | null
  status: 'pending' | 'graded' | 'returned'
  student?: Student
  assignment?: Assignment
}

export interface DashboardStats {
  totalStudents: number
  totalAssignments: number
  totalSubmissions: number
  pendingReviews: number
  averageScore: number
}

export interface User {
  id: string
  email: string
  name: string
  role: 'admin' | 'teacher' | 'student'
}
