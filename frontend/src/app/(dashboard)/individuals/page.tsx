'use client'

import React, { useState } from 'react'
import { ChevronRight, Grid3x3, List, Search, Filter } from 'lucide-react'
import Link from 'next/link'

// ===== DEMO DATA CONSTANTS =====

interface Employee {
  id: string
  name: string
  role: string
  department: string
  score: number
  grade: 'A+' | 'A' | 'B' | 'C' | 'D' | 'F'
  trend: number
  risk: 'healthy' | 'watch' | 'at-risk'
  activeProgram: boolean
  programName?: string
  sparklineData: number[]
}

const EMPLOYEES: Employee[] = [
  {
    id: '1',
    name: 'Sarah Chen',
    role: 'Senior Engineer',
    department: 'Engineering',
    score: 92,
    grade: 'A+',
    trend: 8.2,
    risk: 'healthy',
    activeProgram: true,
    programName: 'Engagement Operator',
    sparklineData: [60, 65, 68, 72, 75, 82, 88, 92],
  },
  {
    id: '2',
    name: 'Marcus Wright',
    role: 'Product Manager',
    department: 'Product',
    score: 88,
    grade: 'A',
    trend: 5.1,
    risk: 'healthy',
    activeProgram: false,
    sparklineData: [75, 78, 80, 82, 84, 85, 87, 88],
  },
  {
    id: '3',
    name: 'Elena Rossi',
    role: 'Marketing Manager',
    department: 'Marketing',
    score: 85,
    grade: 'A',
    trend: 3.5,
    risk: 'healthy',
    activeProgram: true,
    programName: 'Responsiveness Specialist',
    sparklineData: [72, 74, 76, 78, 80, 82, 84, 85],
  },
  {
    id: '4',
    name: 'James Hunter',
    role: 'Sales Executive',
    department: 'Sales',
    score: 72,
    grade: 'B',
    trend: -2.3,
    risk: 'watch',
    activeProgram: false,
    sparklineData: [80, 78, 76, 74, 73, 72, 72, 72],
  },
  {
    id: '5',
    name: 'Lisa Park',
    role: 'HR Specialist',
    department: 'Human Resources',
    score: 79,
    grade: 'A',
    trend: 1.8,
    risk: 'healthy',
    activeProgram: false,
    sparklineData: [75, 76, 77, 77, 78, 78, 79, 79],
  },
  {
    id: '6',
    name: 'David Okonkwo',
    role: 'Financial Analyst',
    department: 'Finance',
    score: 45,
    grade: 'D',
    trend: -15.4,
    risk: 'at-risk',
    activeProgram: true,
    programName: 'Burnout Recovery',
    sparklineData: [92, 85, 76, 68, 58, 52, 48, 45],
  },
  {
    id: '7',
    name: 'Priya Malhotra',
    role: 'Content Creator',
    department: 'Marketing',
    score: 82,
    grade: 'A',
    trend: 4.2,
    risk: 'healthy',
    activeProgram: false,
    sparklineData: [70, 72, 74, 76, 78, 80, 81, 82],
  },
  {
    id: '8',
    name: 'Carlos Mendez',
    role: 'Support Engineer',
    department: 'Customer Success',
    score: 38,
    grade: 'F',
    trend: -8.1,
    risk: 'at-risk',
    activeProgram: true,
    programName: 'Engagement Operator',
    sparklineData: [65, 60, 55, 50, 45, 42, 40, 38],
  },
  {
    id: '9',
    name: 'Yuki Tanaka',
    role: 'Data Scientist',
    department: 'Engineering',
    score: 86,
    grade: 'A',
    trend: 6.3,
    risk: 'healthy',
    activeProgram: false,
    sparklineData: [68, 70, 73, 76, 79, 82, 85, 86],
  },
]

const DEPARTMENTS = ['All', 'Engineering', 'Product', 'Marketing', 'Sales', 'Human Resources', 'Finance', 'Customer Success']

// ===== SVG COMPONENTS =====

// Blob Score Ring
const ScoreRing = ({ score }: { score: number }) => {
  const radius = 45
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (score / 100) * circumference

  let ringColor = '#10B981' // Green
  if (score < 50) ringColor = '#EF4444' // Red
  else if (score < 70) ringColor = '#F59E0B' // Amber

  return (
    <svg className="w-full h-full" viewBox="0 0 120 120">
      {/* Background circle */}
      <circle cx="60" cy="60" r={radius} fill="none" stroke="#334155" strokeWidth="6" />
      {/* Filled circle */}
      <circle
        cx="60"
        cy="60"
        r={radius}
        fill="none"
        stroke={ringColor}
        strokeWidth="6"
        strokeDasharray={circumference}
        strokeDashoffset={strokeDashoffset}
        strokeLinecap="round"
        transform="rotate(-90 60 60)"
      />
      {/* Score text */}
      <text x="60" y="68" fontSize="24" fontWeight="bold" fill={ringColor} textAnchor="middle">
        {score}
      </text>
    </svg>
  )
}

// Mini sparkline
const Sparkline = ({ data }: { data: number[] }) => {
  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min || 1
  const padding = 4
  const width = 100
  const height = 40

  const points = data.map((value, idx) => {
    const x = padding + (idx / (data.length - 1)) * (width - padding * 2)
    const y = height - padding - ((value - min) / range) * (height - padding * 2)
    return [x, y]
  })

  const pathData = points.map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${p[0]} ${p[1]}`).join(' ')

  let lineColor = '#10B981'
  const avgScore = data[data.length - 1]
  if (avgScore < 50) lineColor = '#EF4444'
  else if (avgScore < 70) lineColor = '#F59E0B'

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full">
      <path d={pathData} fill="none" stroke={lineColor} strokeWidth="2" strokeLinecap="round" />
      {points.map((p, idx) => (
        <circle key={idx} cx={p[0]} cy={p[1]} r="2" fill={lineColor} />
      ))}
    </svg>
  )
}

// Grade Badge Component
const GradeBadge = ({ grade }: { grade: string }) => {
  const colors: Record<string, { bg: string; text: string }> = {
    'A+': { bg: '#065F46', text: '#D1FAE5' },
    A: { bg: '#047857', text: '#D1FAE5' },
    B: { bg: '#1E40AF', text: '#DBEAFE' },
    C: { bg: '#92400E', text: '#FEF3C7' },
    D: { bg: '#B45309', text: '#FEF3C7' },
    F: { bg: '#991B1B', text: '#FEE2E2' },
  }

  const color = colors[grade] || colors.F

  return (
    <span
      className="px-3 py-1 rounded-full text-xs font-bold"
      style={{ backgroundColor: color.bg, color: color.text }}
    >
      {grade}
    </span>
  )
}

// ===== STAT CARD COMPONENT =====

const StatCard = ({
  label,
  value,
  color,
}: {
  label: string
  value: string | number
  color: 'green' | 'red' | 'blue' | 'gray'
}) => {
  const colorClasses = {
    green: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600',
    red: 'bg-red-500/10 border-red-500/30 text-red-600',
    blue: 'bg-blue-500/10 border-blue-500/30 text-blue-600',
    gray: 'bg-slate-500/10 border-slate-500/30 text-slate-600',
  }

  return (
    <div className={`rounded-lg border p-6 ${colorClasses[color]}`}>
      <p className="text-sm font-medium text-opacity-70">{label}</p>
      <p className="text-3xl font-bold mt-2">{value}</p>
    </div>
  )
}

// ===== EMPLOYEE CARD COMPONENT =====

const EmployeeCard = ({ employee }: { employee: Employee }) => {
  const riskBorderColor = {
    healthy: '#10B981',
    watch: '#F59E0B',
    'at-risk': '#EF4444',
  }[employee.risk]

  return (
    <Link href={`/individuals/${employee.id}`}>
      <div
        className="bg-white rounded-lg border border-blob-border hover:shadow-lg transition-shadow cursor-pointer p-6"
        style={{
          borderLeftWidth: '4px',
          borderLeftColor: riskBorderColor,
        }}
      >
        {/* Top Row: Avatar + Score Ring + Info */}
        <div className="flex gap-4 mb-4">
          {/* Score Ring */}
          <div className="flex-shrink-0 w-24 h-24">
            <ScoreRing score={employee.score} />
          </div>

          {/* Name, Role, Department */}
          <div className="flex-1">
            <h3 className="text-lg font-bold text-blob-dark mb-1">{employee.name}</h3>
            <p className="text-sm font-medium text-gray-600">{employee.role}</p>
            <p className="text-xs text-gray-500 mt-1">{employee.department}</p>
          </div>
        </div>

        {/* Grade and Trend */}
        <div className="flex items-center justify-between mb-4 gap-3">
          <GradeBadge grade={employee.grade} />
          <div className="flex items-center gap-1">
            {employee.trend > 0 ? (
              <span className="text-green-600 font-bold text-sm">↑ {employee.trend}%</span>
            ) : (
              <span className="text-red-600 font-bold text-sm">↓ {Math.abs(employee.trend)}%</span>
            )}
          </div>
        </div>

        {/* Sparkline */}
        <div className="h-10 mb-4">
          <Sparkline data={employee.sparklineData} />
        </div>

        {/* Active Program Badge */}
        {employee.activeProgram && employee.programName && (
          <div className="bg-blob-primary/10 border border-blob-primary/30 rounded px-3 py-1 mb-3">
            <p className="text-xs font-medium text-blob-primary">✓ {employee.programName}</p>
          </div>
        )}

        {/* Risk Indicator Text */}
        <div className="text-xs font-medium">
          {employee.risk === 'healthy' && <span className="text-blob-primary">Healthy</span>}
          {employee.risk === 'watch' && <span className="text-amber-600">Watch List</span>}
          {employee.risk === 'at-risk' && <span className="text-red-600">At Risk</span>}
        </div>
      </div>
    </Link>
  )
}

// ===== MAIN PAGE COMPONENT =====

export default function EmployeeDirectoryPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedDepartment, setSelectedDepartment] = useState('All')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  // Filter employees
  const filteredEmployees = EMPLOYEES.filter((emp) => {
    const matchesSearch =
      emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.role.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesDept = selectedDepartment === 'All' || emp.department === selectedDepartment
    return matchesSearch && matchesDept
  })

  // Calculate stats
  const totalEmployees = EMPLOYEES.length
  const atRiskCount = EMPLOYEES.filter((e) => e.risk === 'at-risk').length
  const thrivingCount = EMPLOYEES.filter((e) => e.risk === 'healthy').length
  const avgScore = Math.round((EMPLOYEES.reduce((sum, e) => sum + e.score, 0) / EMPLOYEES.length) * 10) / 10

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-blob-dark mb-2">Employee Directory</h1>
        <p className="text-gray-600">Monitor and manage your workforce wellbeing</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Employees" value={totalEmployees} color="gray" />
        <StatCard label="At Risk" value={atRiskCount} color="red" />
        <StatCard label="Thriving" value={thrivingCount} color="green" />
        <StatCard label="Average Score" value={avgScore} color="blue" />
      </div>

      {/* Controls Bar */}
      <div className="bg-white rounded-lg border border-blob-border p-4 mb-6 flex items-center gap-4 flex-wrap">
        {/* Search Bar */}
        <div className="flex-1 min-w-80 flex items-center gap-2 bg-gray-50 rounded px-4 py-2 border border-blob-border">
          <Search className="w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search employees..."
            className="bg-transparent outline-none text-sm flex-1"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Department Filter */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-600" />
          <select
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            className="px-4 py-2 rounded border border-blob-border bg-white text-sm font-medium text-blob-dark outline-none"
          >
            {DEPARTMENTS.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>
        </div>

        {/* View Mode Toggle */}
        <div className="flex gap-2 border border-blob-border rounded">
          <button
            onClick={() => setViewMode('grid')}
            className={`px-3 py-2 ${
              viewMode === 'grid'
                ? 'bg-blob-primary text-white'
                : 'bg-white text-blob-dark hover:bg-gray-50'
            }`}
          >
            <Grid3x3 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`px-3 py-2 ${
              viewMode === 'list'
                ? 'bg-blob-primary text-white'
                : 'bg-white text-blob-dark hover:bg-gray-50'
            }`}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Employee Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEmployees.map((employee) => (
            <EmployeeCard key={employee.id} employee={employee} />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredEmployees.map((employee) => (
            <Link key={employee.id} href={`/individuals/${employee.id}`}>
              <div className="bg-white rounded-lg border border-blob-border p-4 hover:shadow-md transition-shadow cursor-pointer flex items-center justify-between">
                <div className="flex items-center gap-4 flex-1">
                  <div className="flex-shrink-0 w-12 h-12">
                    <ScoreRing score={employee.score} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-blob-dark">{employee.name}</h3>
                    <p className="text-sm text-gray-600">{employee.role}</p>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="text-sm text-gray-600">{employee.department}</p>
                    <GradeBadge grade={employee.grade} />
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {filteredEmployees.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">No employees found matching your filters.</p>
        </div>
      )}
    </div>
  )
}
