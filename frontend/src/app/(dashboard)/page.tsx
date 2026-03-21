'use client'

import React from 'react'
import {
  Globe,
  Users,
  UserCheck,
  Home,
  Activity,
  TrendingUp,
  TrendingDown,
  Award,
  Clock,
  Zap,
  MapPin,
} from 'lucide-react'

// ===== DEMO DATA CONSTANTS =====

// Employee distribution data for scatter plot
const SCATTER_PLOT_DATA = [
  { x: 25, y: 60, category: 'risk', color: '#EF4444' },
  { x: 28, y: 55, category: 'risk', color: '#F87171' },
  { x: 22, y: 65, category: 'risk', color: '#DC2626' },
  { x: 30, y: 50, category: 'risk', color: '#B91C1C' },
  { x: 35, y: 40, category: 'fluctuation', color: '#F97316' },
  { x: 38, y: 38, category: 'fluctuation', color: '#FB923C' },
  { x: 40, y: 45, category: 'fluctuation', color: '#FED7AA' },
  { x: 42, y: 42, category: 'fluctuation', color: '#FDBA74' },
  { x: 45, y: 48, category: 'fluctuation', color: '#F59E0B' },
  { x: 55, y: 70, category: 'legend', color: '#3B82F6' },
  { x: 58, y: 72, category: 'legend', color: '#60A5FA' },
  { x: 60, y: 68, category: 'legend', color: '#93C5FD' },
  { x: 62, y: 75, category: 'legend', color: '#DBEAFE' },
  { x: 65, y: 80, category: 'legend', color: '#1F2937' },
  { x: 70, y: 85, category: 'legend', color: '#374151' },
]

// Company blob score fluctuation timeline
const SCORE_TIMELINE = [
  { month: 'Confidential', score: 72 },
  { month: 'Burnout', score: 68 },
  { month: 'Q1', score: 71 },
  { month: 'Holiday', score: 76 },
  { month: 'Company Event', score: 79 },
  { month: 'August', score: 77 },
  { month: 'September', score: 81 },
  { month: 'October', score: 80 },
]

// Department score movements
const DEPARTMENT_DATA = [
  { name: 'Marketing', value: 5 },
  { name: 'Sales', value: 3 },
  { name: 'Finance', value: 0 },
  { name: 'HR', value: 6 },
  { name: 'Engineering', value: 0 },
  { name: 'CS', value: 1 },
  { name: 'Legal', value: 3 },
  { name: 'Leadership', value: 1 },
]

// Live blob programmes with employee data
const LIVE_PROGRAMMES_EMPLOYEES = [
  { name: 'Sarah Chen', score: 45, trend: 'up' },
  { name: 'Marcus Wright', score: 40, trend: 'up' },
  { name: 'Elena Rossi', score: 38, trend: 'up' },
  { name: 'James Hunter', score: 35, trend: 'neutral' },
]

// Quick cohort comparison data
const COHORT_COMPARISON = [
  { label: 'Remote', value: 72, color: '#8B5CF6' },
  { label: 'Hybrid', value: 78, color: '#3B82F6' },
  { label: 'Onsite', value: 81, color: '#EC4899' },
]

// ===== SVG VISUALIZATION COMPONENTS =====

// Simple SVG World Map
const WorldMapVisualization = () => (
  <svg viewBox="0 0 300 200" className="w-full h-auto">
    {/* Simple world map outline */}
    <rect x="10" y="10" width="280" height="180" fill="none" stroke="#e5e7eb" strokeWidth="1" />

    {/* Simplified continents as rectangles */}
    <rect x="20" y="40" width="40" height="60" fill="#f3f4f6" stroke="#cbd5e1" strokeWidth="1" />
    <rect x="80" y="30" width="50" height="80" fill="#f3f4f6" stroke="#cbd5e1" strokeWidth="1" />
    <rect x="150" y="50" width="45" height="70" fill="#f3f4f6" stroke="#cbd5e1" strokeWidth="1" />
    <rect x="210" y="60" width="35" height="50" fill="#f3f4f6" stroke="#cbd5e1" strokeWidth="1" />

    {/* Employee distribution dots */}
    <circle cx="35" cy="55" r="5" fill="#EF4444" opacity="0.8" />
    <circle cx="90" cy="45" r="5" fill="#F59E0B" opacity="0.8" />
    <circle cx="95" cy="80" r="5" fill="#3B82F6" opacity="0.8" />
    <circle cx="160" cy="65" r="5" fill="#10B981" opacity="0.8" />
    <circle cx="170" cy="85" r="5" fill="#3B82F6" opacity="0.8" />
    <circle cx="220" cy="75" r="5" fill="#EC4899" opacity="0.8" />

    {/* Grid lines */}
    <line x1="155" y1="10" x2="155" y2="190" stroke="#e5e7eb" strokeWidth="0.5" opacity="0.5" />
    <line x1="10" y1="100" x2="290" y2="100" stroke="#e5e7eb" strokeWidth="0.5" opacity="0.5" />
  </svg>
)

// Scatter plot with dots
const ScatterPlotVisualization = () => (
  <svg viewBox="0 0 500 400" className="w-full h-auto">
    {/* Background */}
    <rect width="500" height="400" fill="#fafafa" />

    {/* Grid lines */}
    {[1, 2, 3, 4, 5].map((i) => (
      <line
        key={`vline-${i}`}
        x1={i * 100}
        y1="30"
        x2={i * 100}
        y2="350"
        stroke="#e5e7eb"
        strokeWidth="1"
        strokeDasharray="2,2"
      />
    ))}
    {[1, 2, 3].map((i) => (
      <line
        key={`hline-${i}`}
        x1="50"
        y1={i * 100 + 30}
        x2="480"
        y2={i * 100 + 30}
        stroke="#e5e7eb"
        strokeWidth="1"
        strokeDasharray="2,2"
      />
    ))}

    {/* Axes */}
    <line x1="50" y1="350" x2="480" y2="350" stroke="#000" strokeWidth="2" />
    <line x1="50" y1="30" x2="50" y2="350" stroke="#000" strokeWidth="2" />

    {/* Axis labels */}
    <text x="20" y="360" fontSize="12" fill="#666">
      Score -
    </text>
    <text x="460" y="360" fontSize="12" fill="#666">
      Score +
    </text>

    {/* Category labels */}
    <text x="60" y="390" fontSize="11" fill="#666" fontWeight="500">
      Risks
    </text>
    <text x="210" y="390" fontSize="11" fill="#666" fontWeight="500">
      Natural Fluctuation
    </text>
    <text x="380" y="20" fontSize="11" fill="#666" fontWeight="500">
      Legends
    </text>

    {/* Data points */}
    {SCATTER_PLOT_DATA.map((point, idx) => (
      <circle
        key={idx}
        cx={50 + (point.x / 100) * 430}
        cy={350 - (point.y / 100) * 320}
        r="6"
        fill={point.color}
        opacity="0.7"
      />
    ))}
  </svg>
)

// Line chart for score fluctuation
const LineChartVisualization = () => {
  const maxScore = 85
  const points = SCORE_TIMELINE.map((d, idx) => {
    const x = 50 + (idx / (SCORE_TIMELINE.length - 1)) * 420
    const y = 300 - (d.score / maxScore) * 250
    return { x, y, score: d.score }
  })

  const pathData = points.map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')

  return (
    <svg viewBox="0 0 550 350" className="w-full h-auto">
      {/* Background */}
      <rect width="550" height="350" fill="#fafafa" />

      {/* Grid */}
      {[1, 2, 3, 4].map((i) => (
        <line
          key={`hline-${i}`}
          x1="50"
          y1={i * 75 + 25}
          x2="520"
          y2={i * 75 + 25}
          stroke="#e5e7eb"
          strokeWidth="1"
          strokeDasharray="2,2"
        />
      ))}

      {/* Y-axis */}
      <line x1="50" y1="25" x2="50" y2="300" stroke="#ccc" strokeWidth="1" />
      <text x="5" y="30" fontSize="12" fill="#666">
        85
      </text>
      <text x="15" y="110" fontSize="12" fill="#666">
        70
      </text>
      <text x="15" y="190" fontSize="12" fill="#666">
        55
      </text>

      {/* Line chart */}
      <path d={pathData} fill="none" stroke="#D8B4FE" strokeWidth="3" strokeLinecap="round" />
      <path
        d={`${pathData} L ${points[points.length - 1].x} 300 L 50 300`}
        fill="url(#gradient)"
        opacity="0.2"
      />

      {/* Gradient definition */}
      <defs>
        <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#D8B4FE" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#D8B4FE" stopOpacity="0.1" />
        </linearGradient>
      </defs>

      {/* Data points */}
      {points.map((p, idx) => (
        <circle key={idx} cx={p.x} cy={p.y} r="4" fill="#A855F7" />
      ))}

      {/* Event markers */}
      {SCORE_TIMELINE.map((d, idx) => (
        <g key={idx}>
          <line x1={50 + (idx / (SCORE_TIMELINE.length - 1)) * 420} y1="310" x2={50 + (idx / (SCORE_TIMELINE.length - 1)) * 420} y2="320" stroke="#94a3b8" strokeWidth="1" />
          <text x={50 + (idx / (SCORE_TIMELINE.length - 1)) * 420} y="335" fontSize="11" fill="#666" textAnchor="middle">
            {d.month}
          </text>
        </g>
      ))}
    </svg>
  )
}

// Horizontal bar charts for departments
const DepartmentBarsVisualization = () => {
  const maxValue = Math.max(...DEPARTMENT_DATA.map((d) => d.value)) || 10
  const colorGradient = ['#10B981', '#6EE7B7', '#F59E0B', '#EF4444']

  return (
    <div className="space-y-4">
      {DEPARTMENT_DATA.map((dept, idx) => {
        const percentage = (dept.value / maxValue) * 100
        const colorIndex = Math.floor((idx / DEPARTMENT_DATA.length) * colorGradient.length)
        const color = colorGradient[Math.min(colorIndex, colorGradient.length - 1)]

        return (
          <div key={dept.name}>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">{dept.name}</span>
              <span className="text-sm font-bold text-gray-900">x{dept.value}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="h-2 rounded-full transition-all"
                style={{ width: `${Math.max(percentage, 5)}%`, backgroundColor: color }}
              />
            </div>
          </div>
        )
      })}

      {/* Legend */}
      <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <span className="text-xs text-gray-600">Negative Score</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-green-500" />
          <span className="text-xs text-gray-600">Positive Score</span>
        </div>
      </div>
    </div>
  )
}

// Mini bar charts for sidebar
const MiniBarChart = ({ data, label }: { data: { value: number; color: string }[]; label?: string }) => (
  <div className="flex items-end justify-center gap-1 h-10">
    {data.map((item, idx) => (
      <div
        key={idx}
        className="flex-1"
        style={{
          height: `${(item.value / 100) * 100}%`,
          backgroundColor: item.color,
          borderRadius: '2px 2px 0 0',
        }}
      />
    ))}
  </div>
)

// Gauge/Sentiment visualization
const SentimentGaugeVisualization = () => (
  <svg viewBox="0 0 200 120" className="w-full h-auto">
    {/* Background arc */}
    <path
      d="M 30 100 A 70 70 0 0 1 170 100"
      fill="none"
      stroke="#e5e7eb"
      strokeWidth="12"
      strokeLinecap="round"
    />

    {/* Colored arc segments */}
    <path
      d="M 30 100 A 70 70 0 0 1 60 50"
      fill="none"
      stroke="#EF4444"
      strokeWidth="12"
      strokeLinecap="round"
    />
    <path d="M 60 50 A 70 70 0 0 1 120 35" fill="none" stroke="#F59E0B" strokeWidth="12" strokeLinecap="round" />
    <path d="M 120 35 A 70 70 0 0 1 170 100" fill="none" stroke="#10B981" strokeWidth="12" strokeLinecap="round" />

    {/* Needle */}
    <line x1="100" y1="100" x2="100" y2="40" stroke="#1F2937" strokeWidth="2" />
    <circle cx="100" cy="100" r="4" fill="#1F2937" />

    {/* Center circle */}
    <circle cx="100" cy="100" r="8" fill="#FFF" stroke="#1F2937" strokeWidth="1" />

    {/* Labels */}
    <text x="40" y="115" fontSize="11" fill="#666" textAnchor="middle">
      Poor
    </text>
    <text x="100" y="115" fontSize="11" fill="#666" textAnchor="middle">
      Fair
    </text>
    <text x="160" y="115" fontSize="11" fill="#666" textAnchor="middle">
      Great
    </text>

    {/* Center score */}
    <text x="100" y="108" fontSize="14" fontWeight="bold" fill="#1F2937" textAnchor="middle">
      78%
    </text>
  </svg>
)

// Meeting productivity small bars
const MeetingProductivityVisualization = () => (
  <div className="flex items-end gap-2 h-16">
    <div className="flex-1 bg-red-400 rounded-t" style={{ height: '40%' }} title="Q1: 45%" />
    <div className="flex-1 bg-orange-400 rounded-t" style={{ height: '55%' }} title="Q2: 62%" />
    <div className="flex-1 bg-blue-400 rounded-t" style={{ height: '70%' }} title="Q3: 78%" />
    <div className="flex-1 bg-green-400 rounded-t" style={{ height: '82%' }} title="Q4: 88%" />
  </div>
)

// ===== MAIN COMPONENT =====

export default function CompanyDashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* TOP SECTION: Company Header */}
      <div className="mb-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Blob Score Ring + Company Info */}
        <div className="flex items-center gap-6 bg-white rounded-lg border border-gray-200 p-6">
          {/* Blob Score Ring */}
          <div className="flex-shrink-0 relative w-28 h-28">
            <svg className="w-full h-full" viewBox="0 0 120 120">
              {/* Background circle */}
              <circle cx="60" cy="60" r="54" fill="none" stroke="#e5e7eb" strokeWidth="8" />
              {/* Filled circle (85%) */}
              <circle
                cx="60"
                cy="60"
                r="54"
                fill="none"
                stroke="#10B981"
                strokeWidth="8"
                strokeDasharray={`${0.85 * 2 * Math.PI * 54} ${2 * Math.PI * 54}`}
                strokeLinecap="round"
                transform="rotate(-90 60 60)"
              />
              {/* Score text */}
              <text x="60" y="68" fontSize="28" fontWeight="bold" fill="#10B981" textAnchor="middle">
                85
              </text>
            </svg>
          </div>

          {/* Company Info */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Avengers Inc.</h2>
            <p className="text-sm font-medium text-blob-primary mt-1">AVENGERS STRONGEST</p>
            <p className="text-xs text-gray-500 mt-2">244 employees monitored</p>
          </div>
        </div>

        {/* Center: World Map */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Globe className="w-4 h-4" />
            Employee Distribution
          </h3>
          <div className="h-40">
            <WorldMapVisualization />
          </div>
        </div>

        {/* Right: Status Cards */}
        <div className="space-y-3">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">Online</span>
              <span className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <span className="text-lg font-bold text-gray-900">4</span>
              </span>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">Offline</span>
              <span className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-gray-400" />
                <span className="text-lg font-bold text-gray-900">137</span>
              </span>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">WFH</span>
              <span className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-500" />
                <span className="text-lg font-bold text-gray-900">103</span>
              </span>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">Monitored</span>
              <span className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blob-primary" />
                <span className="text-lg font-bold text-gray-900">244</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left/Center Column (spans 3 columns) */}
        <div className="lg:col-span-3 space-y-8">
          {/* Section 1: Live Blob Improvement Programmes */}
          <div className="bg-white rounded-lg border border-gray-200 p-8">
            <div className="mb-6">
              <h3 className="text-lg font-bold text-gray-900">Live Blob Improvement Programmes</h3>
              <p className="text-sm text-gray-600 mt-1">
                Frameworks that help get at risk employees back on track
              </p>
            </div>

            <div className="h-80 border border-gray-200 rounded-lg p-4 bg-gray-50">
              <ScatterPlotVisualization />
            </div>
          </div>

          {/* Section 2: Company Blob Score Fluctuation */}
          <div className="bg-white rounded-lg border border-gray-200 p-8">
            <div className="mb-6">
              <h3 className="text-lg font-bold text-gray-900">Company Blob Score Fluctuation</h3>
              <p className="text-sm text-gray-600 mt-1">
                How has the overall Blob score of the business changed over time
              </p>
            </div>

            <div className="h-80 border border-gray-200 rounded-lg p-4 bg-gray-50">
              <LineChartVisualization />
            </div>
          </div>

          {/* Section 3: Score Movements by Department */}
          <div className="bg-white rounded-lg border border-gray-200 p-8">
            <div className="mb-6">
              <h3 className="text-lg font-bold text-gray-900">Score Movements by Dept.</h3>
            </div>

            <div className="grid grid-cols-2 gap-8">
              <div>
                <DepartmentBarsVisualization />
              </div>
              <div className="flex items-end">
                <div className="w-full h-64 border border-gray-200 rounded-lg p-4 bg-gray-50 flex items-end justify-around pb-4">
                  {DEPARTMENT_DATA.slice(0, 4).map((dept, idx) => {
                    const colors = ['#10B981', '#6EE7B7', '#F59E0B', '#EF4444']
                    return (
                      <div key={dept.name} className="flex flex-col items-center gap-2">
                        <div
                          className="w-6 rounded"
                          style={{
                            height: `${(dept.value / 6) * 100}px`,
                            backgroundColor: colors[idx],
                          }}
                        />
                        <span className="text-xs text-gray-600">{dept.name.slice(0, 3)}</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar (narrower, dark-themed cards) */}
        <div className="space-y-6">
          {/* Card 1: Live Blob Programmes */}
          <div className="bg-blob-dark text-white rounded-lg p-6 border border-blob-border">
            <h4 className="text-sm font-bold mb-4 flex items-center gap-2">
              <Zap className="w-4 h-4 text-blob-primary" />
              Live Blob Programmes
            </h4>
            <div className="space-y-4">
              {LIVE_PROGRAMMES_EMPLOYEES.map((emp, idx) => (
                <div key={idx}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-medium">{emp.name}</span>
                    <span className="text-xs font-bold text-blob-primary">+{emp.score}pts</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className="flex-1 h-1.5 rounded-full"
                        style={{
                          backgroundColor: i < Math.ceil(emp.score / 10) ? '#10B981' : '#334155',
                        }}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Card 2: Quick Cohort Comparison */}
          <div className="bg-blob-dark text-white rounded-lg p-6 border border-blob-border">
            <h4 className="text-sm font-bold mb-4 flex items-center gap-2">
              <Users className="w-4 h-4 text-blob-primary" />
              Quick Cohort Comparison
            </h4>
            <div className="h-24">
              <MiniBarChart data={COHORT_COMPARISON.map((c) => ({ value: c.value, color: c.color }))} />
            </div>
            <div className="grid grid-cols-3 gap-2 mt-4 text-center">
              {COHORT_COMPARISON.map((cohort) => (
                <div key={cohort.label}>
                  <p className="text-xs text-gray-400">{cohort.label}</p>
                  <p className="text-sm font-bold text-white">{cohort.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Card 3: Overall Company Sentiment */}
          <div className="bg-blob-dark text-white rounded-lg p-6 border border-blob-border">
            <h4 className="text-sm font-bold mb-4 flex items-center gap-2">
              <Activity className="w-4 h-4 text-blob-primary" />
              Overall Company Sentiment
            </h4>
            <div className="h-24">
              <SentimentGaugeVisualization />
            </div>
          </div>

          {/* Card 4: Trophy/Leaderboard */}
          <div className="bg-blob-dark text-white rounded-lg p-6 border border-blob-border">
            <h4 className="text-sm font-bold mb-4 flex items-center gap-2">
              <Award className="w-4 h-4 text-blob-primary" />
              Top Performer
            </h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blob-primary/20 flex items-center justify-center">
                  <span className="text-xs font-bold text-blob-primary">1</span>
                </div>
                <div>
                  <p className="text-sm font-medium">Elena Rossi</p>
                  <p className="text-xs text-gray-400">Score: 92</p>
                </div>
              </div>
              <div className="flex items-center gap-3 opacity-75">
                <div className="w-10 h-10 rounded-full bg-blob-surface/50 flex items-center justify-center">
                  <span className="text-xs font-bold text-gray-300">2</span>
                </div>
                <div>
                  <p className="text-sm font-medium">Marcus Wright</p>
                  <p className="text-xs text-gray-400">Score: 88</p>
                </div>
              </div>
              <div className="flex items-center gap-3 opacity-50">
                <div className="w-10 h-10 rounded-full bg-blob-surface/30 flex items-center justify-center">
                  <span className="text-xs font-bold text-gray-400">3</span>
                </div>
                <div>
                  <p className="text-sm font-medium">Sarah Chen</p>
                  <p className="text-xs text-gray-400">Score: 85</p>
                </div>
              </div>
            </div>
          </div>

          {/* Card 5: Meeting Productivity Score */}
          <div className="bg-blob-dark text-white rounded-lg p-6 border border-blob-border">
            <h4 className="text-sm font-bold mb-4 flex items-center gap-2">
              <Clock className="w-4 h-4 text-blob-primary" />
              Meeting Productivity
            </h4>
            <div className="h-20 mb-4">
              <MeetingProductivityVisualization />
            </div>
            <div className="grid grid-cols-4 gap-2 text-center text-xs">
              <div>
                <p className="text-gray-400">Q1</p>
                <p className="font-bold">45%</p>
              </div>
              <div>
                <p className="text-gray-400">Q2</p>
                <p className="font-bold">62%</p>
              </div>
              <div>
                <p className="text-gray-400">Q3</p>
                <p className="font-bold">78%</p>
              </div>
              <div>
                <p className="text-gray-400">Q4</p>
                <p className="font-bold">88%</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
