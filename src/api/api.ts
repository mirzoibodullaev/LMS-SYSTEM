import type { Student, Assignment, Submission, DashboardStats, User } from '@/types'
import { students, assignments, submissions } from './mock-data'

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

const mockUsers: Array<User & { password: string }> = [
  { id: '1', email: 'admin@lms.com', password: 'admin', name: 'Администратор', role: 'admin' },
  { id: '2', email: 'teacher@lms.com', password: 'teacher', name: 'Иван Петров', role: 'teacher' },
]

export async function login(email: string, password: string): Promise<User> {
  await delay(500)
  const user = mockUsers.find((u) => u.email === email && u.password === password)
  if (!user) {
    throw new Error('Неверный email или пароль')
  }
  const { password: _, ...userWithoutPassword } = user
  return userWithoutPassword
}

export async function getStudents(): Promise<Student[]> {
  await delay(500)
  return students
}

export async function getStudent(id: string): Promise<Student | undefined> {
  await delay(300)
  return students.find((s) => s.id === id)
}

export async function getAssignments(): Promise<Assignment[]> {
  await delay(500)
  return assignments
}

export async function getAssignment(id: string): Promise<Assignment | undefined> {
  await delay(300)
  return assignments.find((a) => a.id === id)
}

export async function getSubmissions(): Promise<Submission[]> {
  await delay(400)
  return submissions.map((sub) => ({
    ...sub,
    student: students.find((s) => s.id === sub.studentId),
    assignment: assignments.find((a) => a.id === sub.assignmentId),
  }))
}

export async function getRecentSubmissions(limit = 5): Promise<Submission[]> {
  await delay(400)
  const enrichedSubmissions = submissions
    .map((sub) => ({
      ...sub,
      student: students.find((s) => s.id === sub.studentId),
      assignment: assignments.find((a) => a.id === sub.assignmentId),
    }))
    .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime())
    .slice(0, limit)
  return enrichedSubmissions
}

export async function getDashboardStats(): Promise<DashboardStats> {
  await delay(600)
  const gradedSubmissions = submissions.filter((s) => s.status === 'graded')
  const averageScore =
    gradedSubmissions.length > 0
      ? gradedSubmissions.reduce((acc, s) => acc + (s.score ?? 0), 0) / gradedSubmissions.length
      : 0

  return {
    totalStudents: students.filter((s) => s.status === 'active').length,
    totalAssignments: assignments.length,
    totalSubmissions: submissions.length,
    pendingReviews: submissions.filter((s) => s.status === 'pending').length,
    averageScore: Math.round(averageScore),
  }
}

// Student CRUD
export async function createStudent(data: Omit<Student, 'id'>): Promise<Student> {
  await delay(300)
  const newStudent: Student = {
    ...data,
    id: String(Date.now()),
  }
  students.push(newStudent)
  return newStudent
}

export async function updateStudent(id: string, data: Partial<Omit<Student, 'id'>>): Promise<Student> {
  await delay(300)
  const index = students.findIndex((s) => s.id === id)
  if (index === -1) throw new Error('Студент не найден')
  students[index] = { ...students[index], ...data }
  return students[index]
}

export async function deleteStudent(id: string): Promise<void> {
  await delay(300)
  const index = students.findIndex((s) => s.id === id)
  if (index === -1) throw new Error('Студент не найден')
  students.splice(index, 1)
}

// Assignment CRUD
export async function createAssignment(data: Omit<Assignment, 'id' | 'totalSubmissions'>): Promise<Assignment> {
  await delay(300)
  const newAssignment: Assignment = {
    ...data,
    id: String(Date.now()),
    totalSubmissions: 0,
  }
  assignments.push(newAssignment)
  return newAssignment
}

export async function updateAssignment(id: string, data: Partial<Omit<Assignment, 'id'>>): Promise<Assignment> {
  await delay(300)
  const index = assignments.findIndex((a) => a.id === id)
  if (index === -1) throw new Error('Задание не найдено')
  assignments[index] = { ...assignments[index], ...data }
  return assignments[index]
}

export async function deleteAssignment(id: string): Promise<void> {
  await delay(300)
  const index = assignments.findIndex((a) => a.id === id)
  if (index === -1) throw new Error('Задание не найдено')
  assignments.splice(index, 1)
}
