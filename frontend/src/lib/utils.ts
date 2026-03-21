import clsx, { type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

type Grade = 'A+' | 'A' | 'B' | 'C' | 'D' | 'F'

export function formatScore(score: number): Grade {
  if (score >= 95) return 'A+'
  if (score >= 90) return 'A'
  if (score >= 80) return 'B'
  if (score >= 70) return 'C'
  if (score >= 60) return 'D'
  return 'F'
}

export function getGradeColor(grade: Grade): string {
  switch (grade) {
    case 'A+':
    case 'A':
      return 'text-emerald-600 bg-emerald-50'
    case 'B':
      return 'text-blue-600 bg-blue-50'
    case 'C':
      return 'text-yellow-600 bg-yellow-50'
    case 'D':
      return 'text-orange-600 bg-orange-50'
    case 'F':
      return 'text-red-600 bg-red-50'
    default:
      return 'text-gray-600 bg-gray-50'
  }
}
