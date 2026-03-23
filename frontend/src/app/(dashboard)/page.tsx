'use client'

import React from 'react'
import {
  Users,
  Trophy,
  Sparkles,
  Filter,
  Plus,
  ChevronDown,
  ArrowDown,
  ArrowUp,
} from 'lucide-react'

// ===== DEMO DATA CONSTANTS =====

const SCATTER_PLOT_DATA = [
  // Risks (left cluster)
  { x: 12, y: 72, color: '#EF4444' },
  { x: 15, y: 58, color: '#F87171' },
  { x: 10, y: 65, color: '#DC2626' },
  { x: 18, y: 50, color: '#EF4444' },
  { x: 14, y: 45, color: '#F87171' },
  { x: 20, y: 68, color: '#DC2626' },
  { x: 8, y: 55, color: '#EF4444' },
  { x: 16, y: 62, color: '#F97316' },
  { x: 22, y: 42, color: '#FB923C' },
  // Natural Fluctuation (middle cluster)
  { x: 38, y: 60, color: '#F59E0B' },
  { x: 42, y: 55, color: '#FBBF24' },
  { x: 45, y: 48, color: '#F97316' },
  { x: 40, y: 65, color: '#FB923C' },
  { x: 48, y: 52, color: '#FCD34D' },
  { x: 35, y: 58, color: '#F59E0B' },
  { x: 44, y: 70, color: '#FBBF24' },
  { x: 50, y: 45, color: '#F97316' },
  // Legends (right cluster)
  { x: 68, y: 75, color: '#3B82F6' },
  { x: 72, y: 80, color: '#6366F1' },
  { x: 75, y: 70, color: '#8B5CF6' },
  { x: 70, y: 85, color: '#3B82F6' },
  { x: 78, y: 78, color: '#6366F1' },
  { x: 82, y: 72, color: '#8B5CF6' },
  { x: 74, y: 65, color: '#3B82F6' },
  { x: 80, y: 82, color: '#6366F1' },
]

const SCORE_TIMELINE_MAIN = [
  62, 60, 58, 55, 54, 56, 58, 62, 65, 68, 72, 70, 68, 66, 65, 67, 70, 74, 78, 76, 74, 72, 70, 73,
  76, 78, 80, 78,
]

const SCORE_TIMELINE_REF = [
  58, 57, 56, 55, 55, 56, 57, 58, 60, 62, 63, 64, 64, 63, 62, 62, 63, 64, 66, 67, 67, 66, 65, 65,
  66, 67, 68, 68,
]

const EVENTS = [
  { icon: 'knife', label: 'Sales Conference', color: '#F59E0B', position: 20 },
  { icon: 'cn', label: 'New Feature Release', color: '#EF4444', position: 40 },
  { icon: 'gear', label: 'Company Update', color: '#6B7280', position: 60 },
  { icon: 'money', label: 'Payday', color: '#10B981', position: 80 },
]

const DEPARTMENT_SCORES = [
  { name: 'Marketing', count: 5, score: 81, downLabel: 'Sentiment', upLabel: 'Presence' },
  { name: 'Sales', count: 3, score: 78, downLabel: 'Participation', upLabel: 'Sentiment' },
  { name: 'Finance', count: 2, score: 70, downLabel: 'Social Rep', upLabel: 'Sentiment' },
  { name: 'HR', count: 6, score: 54, downLabel: 'Presence', upLabel: 'Participation' },
  { name: 'Engineering', count: 0, score: 64, downLabel: 'Sentiment', upLabel: 'Engagement Vol' },
  { name: 'CS', count: 1, score: 79, downLabel: 'Sentiment', upLabel: 'Engagement Vol' },
  { name: 'Legal', count: 5, score: 40, downLabel: 'Social Rep', upLabel: 'Reaction Time' },
  { name: 'Leadership', count: 2, score: 69, downLabel: 'Reaction Time', upLabel: 'Social Rep' },
]

const LIVE_PROGRAMMES = [
  { name: 'Jessica Adams', framework: 'Framework XYZ', status: 'LIVE', pts: '+40pts', trend: 'up' },
  {
    name: 'Mark Thompson',
    framework: 'Framework XYZ',
    status: 'RISK',
    pts: '+13pts',
    trend: 'up',
  },
  {
    name: 'Laura Chen',
    framework: 'Framework XYZ',
    status: 'RISK',
    pts: '-19pts',
    trend: 'down',
  },
  {
    name: 'David Kim',
    framework: 'Framework XYZ',
    status: 'SUCCESSFUL',
    pts: '+56pts',
    trend: 'up',
  },
]

const MEETING_PRODUCTIVITY = [
  { name: 'Marketing', value: 72 },
  { name: 'Sales', value: 65 },
  { name: 'Finance', value: 58 },
  { name: 'HR', value: 45 },
  { name: 'Engineering', value: 80 },
  { name: 'CS', value: 68 },
  { name: 'Legal', value: 42 },
  { name: 'Leadership', value: 75 },
]

const TIME_PERIODS = ['1W', '2W', '1M', '3M', '6M', '9M', '1Y', '2Y']

// ===== SVG VISUALIZATION COMPONENTS =====

const WorldMapSVG = () => (
  <svg viewBox="0 0 400 200" className="w-full h-full opacity-30">
    {/* Simplified world map paths */}
    <path
      d="M60,40 Q80,30 100,35 L110,45 Q120,55 115,70 L100,80 Q85,85 70,75 L60,60 Z"
      fill="#4B5563"
      opacity="0.4"
    />
    <path
      d="M65,85 Q75,80 85,90 L90,110 Q85,130 70,135 L55,125 Q50,110 55,95 Z"
      fill="#4B5563"
      opacity="0.4"
    />
    <path
      d="M130,30 Q160,20 190,25 L210,35 Q230,45 235,65 L225,80 Q200,90 175,85 L155,75 Q135,60 130,45 Z"
      fill="#4B5563"
      opacity="0.4"
    />
    <path
      d="M150,90 Q165,85 180,95 L185,115 Q175,135 160,130 L145,120 Q140,105 150,90 Z"
      fill="#4B5563"
      opacity="0.4"
    />
    <path
      d="M240,35 Q280,25 320,30 L340,45 Q355,60 350,80 L335,95 Q310,105 280,100 L255,85 Q235,65 240,45 Z"
      fill="#4B5563"
      opacity="0.4"
    />
    <path
      d="M300,120 Q330,110 350,130 L355,155 Q340,175 315,170 L295,155 Q290,135 300,120 Z"
      fill="#4B5563"
      opacity="0.4"
    />
    {/* Dots for employee locations */}
    <circle cx="90" cy="55" r="3" fill="#10B981" opacity="0.8" />
    <circle cx="75" cy="100" r="3" fill="#10B981" opacity="0.8" />
    <circle cx="170" cy="50" r="3" fill="#10B981" opacity="0.8" />
    <circle cx="200" cy="60" r="3" fill="#10B981" opacity="0.8" />
    <circle cx="290" cy="55" r="3" fill="#10B981" opacity="0.8" />
    <circle cx="320" cy="70" r="3" fill="#10B981" opacity="0.8" />
    <circle cx="160" cy="100" r="3" fill="#10B981" opacity="0.6" />
    <circle cx="310" cy="140" r="3" fill="#10B981" opacity="0.6" />
  </svg>
)

const ScoreRing = () => (
  <svg viewBox="0 0 120 120" className="w-full h-full">
    <circle cx="60" cy="60" r="52" fill="none" stroke="#1E293B" strokeWidth="8" />
    <circle
      cx="60"
      cy="60"
      r="52"
      fill="none"
      stroke="#10B981"
      strokeWidth="8"
      strokeDasharray={`${0.85 * 2 * Math.PI * 52} ${2 * Math.PI * 52}`}
      strokeLinecap="round"
      transform="rotate(-90 60 60)"
    />
    <text x="60" y="55" fontSize="28" fontWeight="bold" fill="#10B981" textAnchor="middle">
      85
    </text>
    <text x="60" y="72" fontSize="10" fill="#10B981" textAnchor="middle">
      +5% MoM
    </text>
  </svg>
)

const ScatterPlotChart = () => (
  <svg viewBox="0 0 600 300" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
    {/* Y-axis label */}
    <text x="8" y="150" fontSize="11" fill="#9CA3AF" textAnchor="middle" transform="rotate(-90,8,150)">
      Score
    </text>

    {/* Grid lines */}
    {[0, 1, 2, 3, 4].map((i) => (
      <line
        key={`h${i}`}
        x1="40"
        y1={40 + i * 55}
        x2="580"
        y2={40 + i * 55}
        stroke="#E5E7EB"
        strokeWidth="0.5"
        strokeDasharray="4,4"
      />
    ))}

    {/* Category zone backgrounds */}
    <rect x="40" y="30" width="180" height="240" fill="#FEF2F2" opacity="0.3" rx="4" />
    <rect x="220" y="30" width="180" height="240" fill="#FFFBEB" opacity="0.3" rx="4" />
    <rect x="400" y="30" width="180" height="240" fill="#EEF2FF" opacity="0.3" rx="4" />

    {/* Category labels at top */}
    <text x="130" y="22" fontSize="11" fill="#EF4444" textAnchor="middle" fontWeight="500">
      Risks
    </text>
    <text x="310" y="22" fontSize="11" fill="#F59E0B" textAnchor="middle" fontWeight="500">
      Natural Fluctuation
    </text>
    <text x="490" y="22" fontSize="11" fill="#6366F1" textAnchor="middle" fontWeight="500">
      Legends
    </text>

    {/* Data points */}
    {SCATTER_PLOT_DATA.map((point, idx) => (
      <circle
        key={idx}
        cx={40 + (point.x / 100) * 540}
        cy={270 - (point.y / 100) * 240}
        r="7"
        fill={point.color}
        opacity="0.75"
      />
    ))}

    {/* X-axis */}
    <line x1="40" y1="270" x2="580" y2="270" stroke="#D1D5DB" strokeWidth="1" />
    <text x="40" y="290" fontSize="11" fill="#9CA3AF">
      Score -
    </text>
    <text x="560" y="290" fontSize="11" fill="#9CA3AF" textAnchor="end">
      Score +
    </text>
  </svg>
)

const LineChartVisualization = () => {
  const dataLen = SCORE_TIMELINE_MAIN.length
  const chartW = 600
  const chartH = 250
  const padL = 50
  const padR = 20
  const padT = 30
  const padB = 60
  const w = chartW - padL - padR
  const h = chartH - padT - padB

  const mainPath = SCORE_TIMELINE_MAIN.map((v, i) => {
    const x = padL + (i / (dataLen - 1)) * w
    const y = padT + h - ((v - 50) / 40) * h
    return `${i === 0 ? 'M' : 'L'}${x},${y}`
  }).join(' ')

  const refPath = SCORE_TIMELINE_REF.map((v, i) => {
    const x = padL + (i / (dataLen - 1)) * w
    const y = padT + h - ((v - 50) / 40) * h
    return `${i === 0 ? 'M' : 'L'}${x},${y}`
  }).join(' ')

  const areaPath = `${mainPath} L${padL + w},${padT + h} L${padL},${padT + h} Z`

  // Annotation position (around index 20)
  const annIdx = 20
  const annX = padL + (annIdx / (dataLen - 1)) * w
  const annY = padT + h - ((SCORE_TIMELINE_MAIN[annIdx] - 50) / 40) * h

  return (
    <svg viewBox={`0 0 ${chartW} ${chartH}`} className="w-full h-full" preserveAspectRatio="xMidYMid meet">
      <defs>
        <linearGradient id="lineGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.02" />
        </linearGradient>
      </defs>

      {/* Grid lines */}
      {[0, 1, 2, 3].map((i) => (
        <line
          key={i}
          x1={padL}
          y1={padT + (i * h) / 3}
          x2={padL + w}
          y2={padT + (i * h) / 3}
          stroke="#E5E7EB"
          strokeWidth="0.5"
          strokeDasharray="4,4"
        />
      ))}

      {/* Y-axis labels */}
      <text x="15" y={padT + 5} fontSize="10" fill="#9CA3AF">90</text>
      <text x="15" y={padT + h / 3 + 5} fontSize="10" fill="#9CA3AF">77</text>
      <text x="15" y={padT + (2 * h) / 3 + 5} fontSize="10" fill="#9CA3AF">63</text>
      <text x="15" y={padT + h + 5} fontSize="10" fill="#9CA3AF">50</text>

      {/* Area fill */}
      <path d={areaPath} fill="url(#lineGrad)" />

      {/* Reference line (dashed gray) */}
      <path d={refPath} fill="none" stroke="#9CA3AF" strokeWidth="1.5" strokeDasharray="6,4" />

      {/* Main line */}
      <path d={mainPath} fill="none" stroke="#8B5CF6" strokeWidth="2.5" strokeLinecap="round" />

      {/* +16 pts annotation */}
      <rect x={annX - 22} y={annY - 28} width="44" height="20" rx="4" fill="#8B5CF6" />
      <text x={annX} y={annY - 15} fontSize="10" fill="white" textAnchor="middle" fontWeight="600">
        +16 pts
      </text>

      {/* Month labels */}
      {['Mar', 'Apr', 'May', 'Jun 2022', 'Jul', 'Aug', 'Sep'].map((m, i) => (
        <text
          key={m}
          x={padL + (i / 6) * w}
          y={padT + h + 20}
          fontSize="10"
          fill="#9CA3AF"
          textAnchor="middle"
        >
          {m}
        </text>
      ))}

      {/* Event markers at bottom */}
      {EVENTS.map((evt, i) => {
        const ex = padL + (evt.position / 100) * w
        const ey = padT + h + 35
        return (
          <g key={i}>
            <line x1={ex} y1={padT + h} x2={ex} y2={ey - 8} stroke="#D1D5DB" strokeWidth="1" strokeDasharray="2,2" />
            <circle cx={ex} cy={ey} r="8" fill={evt.color} opacity="0.9" />
            <text x={ex} y={ey + 4} fontSize="7" fill="white" textAnchor="middle" fontWeight="bold">
              {evt.icon === 'knife' ? '🔪' : evt.icon === 'cn' ? 'CN' : evt.icon === 'gear' ? '⚙' : '$'}
            </text>
            <text x={ex} y={ey + 20} fontSize="8" fill="#6B7280" textAnchor="middle">
              {evt.label}
            </text>
          </g>
        )
      })}
    </svg>
  )
}

const DepartmentBars = () => {
  const avg = 71
  const maxScore = 100

  return (
    <div className="relative">
      <div className="space-y-3">
        {DEPARTMENT_SCORES.map((dept) => {
          const barWidth = (dept.score / maxScore) * 100
          return (
            <div key={dept.name} className="flex items-center gap-3">
              {/* Dept name and count */}
              <div className="w-28 flex-shrink-0">
                <div className="flex items-center gap-1">
                  <span className="text-sm font-medium text-gray-800">{dept.name}</span>
                  <span className="text-xs text-gray-500">x{dept.count}</span>
                </div>
              </div>

              {/* Down indicator */}
              <div className="w-24 flex-shrink-0 flex items-center gap-1">
                <ArrowDown className="w-3 h-3 text-red-400" />
                <span className="text-xs text-gray-500">{dept.downLabel}</span>
              </div>

              {/* Bar */}
              <div className="flex-1 relative h-6">
                <div className="absolute inset-0 bg-gray-100 rounded" />
                <div
                  className="absolute top-0 left-0 h-full rounded"
                  style={{
                    width: `${barWidth}%`,
                    background: `linear-gradient(90deg, #10B981 0%, #6EE7B7 40%, #FCD34D 70%, #F59E0B 100%)`,
                  }}
                />
                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-semibold text-gray-700">
                  {dept.score}
                </span>
              </div>

              {/* Up indicator */}
              <div className="w-28 flex-shrink-0 flex items-center gap-1">
                <ArrowUp className="w-3 h-3 text-green-500" />
                <span className="text-xs text-gray-500">{dept.upLabel}</span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Average line */}
      <div
        className="absolute top-0 bottom-0 border-l-2 border-dashed border-gray-400"
        style={{ left: `calc(${((avg / maxScore) * 100)}% * 0.45 + 220px)` }}
      >
        <div className="absolute -top-6 -left-5 text-xs font-medium text-gray-500 bg-white px-1">
          Avg {avg}
        </div>
      </div>
    </div>
  )
}

const SparkLine = ({ trend }: { trend: string }) => {
  const points =
    trend === 'up'
      ? 'M0,14 L6,12 L12,10 L18,8 L24,11 L30,6 L36,4'
      : 'M0,4 L6,6 L12,8 L18,10 L24,8 L30,12 L36,14'
  const color = trend === 'up' ? '#10B981' : '#EF4444'
  return (
    <svg viewBox="0 0 36 18" className="w-12 h-5">
      <path d={points} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

const SentimentGauge = () => (
  <svg viewBox="0 0 200 120" className="w-full h-auto">
    <defs>
      <linearGradient id="gaugeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#EF4444" />
        <stop offset="50%" stopColor="#F59E0B" />
        <stop offset="100%" stopColor="#10B981" />
      </linearGradient>
    </defs>
    <path
      d="M 30 100 A 70 70 0 0 1 170 100"
      fill="none"
      stroke="#374151"
      strokeWidth="14"
      strokeLinecap="round"
    />
    <path
      d="M 30 100 A 70 70 0 0 1 170 100"
      fill="none"
      stroke="url(#gaugeGrad)"
      strokeWidth="14"
      strokeLinecap="round"
      strokeDasharray={`${0.75 * Math.PI * 70} ${Math.PI * 70}`}
    />
    <line
      x1="100"
      y1="100"
      x2="135"
      y2="52"
      stroke="#E5E7EB"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <circle cx="100" cy="100" r="5" fill="#E5E7EB" />
    <text x="100" y="95" fontSize="10" fill="#9CA3AF" textAnchor="middle">
      Positive
    </text>
  </svg>
)

const MeetingProductivityBars = () => (
  <div className="space-y-2">
    {MEETING_PRODUCTIVITY.map((dept) => (
      <div key={dept.name} className="flex items-center gap-2">
        <span className="text-xs text-gray-400 w-20 text-right">{dept.name}</span>
        <div className="flex-1 h-3 bg-blob-surface rounded-full overflow-hidden">
          <div
            className="h-full rounded-full"
            style={{
              width: `${dept.value}%`,
              background: 'linear-gradient(90deg, #8B5CF6, #EC4899)',
            }}
          />
        </div>
        <span className="text-xs text-gray-400 w-8">{dept.value}</span>
      </div>
    ))}
  </div>
)

// ===== MAIN COMPONENT =====

export default function CompanyDashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* MAIN LAYOUT: 3/4 + 1/4 */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* LEFT MAIN CONTENT */}
        <div className="lg:col-span-3 space-y-6">
          {/* TOP SECTION: Company Header */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left: Company Banner */}
            <div className="relative bg-gradient-to-br from-blob-dark to-blob-darker rounded-xl p-6 overflow-hidden min-h-[180px]">
              {/* World map background */}
              <div className="absolute inset-0 pointer-events-none">
                <WorldMapSVG />
              </div>

              <div className="relative z-10 flex items-center gap-5 h-full">
                {/* Score Ring */}
                <div className="w-24 h-24 flex-shrink-0">
                  <ScoreRing />
                </div>

                {/* Company Info */}
                <div>
                  <h1 className="text-xl font-bold text-white">Avengers Inc.</h1>
                  <p className="text-sm text-gray-400 mt-0.5">Assembly on demand</p>
                  {/* Team indicator squares */}
                  <div className="flex gap-1.5 mt-3">
                    <div className="w-3 h-3 rounded-sm bg-red-500" />
                    <div className="w-3 h-3 rounded-sm bg-yellow-400" />
                    <div className="w-3 h-3 rounded-sm bg-blue-500" />
                    <div className="w-3 h-3 rounded-sm bg-green-500" />
                    <div className="w-3 h-3 rounded-sm bg-purple-500" />
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Status Card */}
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-gray-700">Status:</span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-green-500" />
                    <span className="text-sm font-bold text-gray-900">67</span>
                  </span>
                  <span className="text-sm text-gray-400">/</span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-red-500" />
                    <span className="text-sm font-bold text-gray-900">133</span>
                  </span>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span className="font-semibold">23</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <Trophy className="w-4 h-4 text-yellow-500" />
                    <span className="font-semibold">44</span>
                  </span>
                </div>
              </div>

              {/* Filter */}
              <div className="flex items-center gap-3 mb-4">
                <button className="flex items-center gap-1.5 text-xs text-gray-600 bg-gray-100 rounded-lg px-3 py-1.5">
                  <Filter className="w-3 h-3" />
                  Filter: All Company
                  <ChevronDown className="w-3 h-3" />
                </button>
              </div>

              {/* Time period buttons */}
              <div className="flex gap-1">
                {TIME_PERIODS.map((period) => (
                  <button
                    key={period}
                    className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                      period === '1M'
                        ? 'bg-blob-primary text-white'
                        : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                    }`}
                  >
                    {period}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* SECTION 1: Live Blob Improvement Programmes */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-1">
              <div>
                <h3 className="text-base font-bold text-gray-900">
                  Live Blob Improvement Programmes
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Frameworks that help get at risk employees back on track
                </p>
              </div>
              <div className="flex rounded-lg overflow-hidden border border-gray-200">
                <button className="px-4 py-1.5 text-xs font-semibold bg-purple-600 text-white">
                  By Individual
                </button>
                <button className="px-4 py-1.5 text-xs font-semibold bg-white text-gray-600 hover:bg-gray-50">
                  By Department
                </button>
              </div>
            </div>

            <div className="h-72 mt-4">
              <ScatterPlotChart />
            </div>
          </div>

          {/* SECTION 2: Company Blob Score Fluctuation */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-1">
              <div>
                <h3 className="text-base font-bold text-gray-900">
                  Company Blob Score Fluctuation
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  How has the overall Blob score of the business changed over time
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-blob-primary text-white rounded-lg">
                  <Plus className="w-3 h-3" />
                  Add Event
                </button>
                <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-white text-gray-600 border border-gray-200 rounded-lg">
                  Event Types (4)
                  <ChevronDown className="w-3 h-3" />
                </button>
              </div>
            </div>

            <div className="h-64 mt-4">
              <LineChartVisualization />
            </div>
          </div>

          {/* SECTION 3: Score Movements by Dept */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-base font-bold text-gray-900">Score Movements by Dept.</h3>
              <div className="flex rounded-lg overflow-hidden border border-gray-200">
                <button className="px-4 py-1.5 text-xs font-semibold bg-purple-600 text-white">
                  By Blob Score
                </button>
                <button className="px-4 py-1.5 text-xs font-semibold bg-white text-gray-600 hover:bg-gray-50">
                  Meeting Productivity
                </button>
              </div>
            </div>

            <DepartmentBars />
          </div>
        </div>

        {/* RIGHT SIDEBAR */}
        <div className="space-y-5">
          {/* Card 1: Live Blob Programmes */}
          <div className="bg-blob-dark text-white rounded-xl p-5 border border-blob-border">
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-4 h-4 text-blob-primary" />
              <h4 className="text-sm font-bold">Live Blob Programmes</h4>
            </div>
            <p className="text-xs text-gray-400 mb-4">
              Frameworks that help get at risk employees back on track.
            </p>

            <div className="space-y-3">
              {LIVE_PROGRAMMES.map((emp, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  {/* Status badge */}
                  <span
                    className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                      emp.status === 'LIVE'
                        ? 'bg-green-500/20 text-green-400'
                        : emp.status === 'RISK'
                          ? 'bg-red-500/20 text-red-400'
                          : 'bg-green-500/20 text-green-400'
                    }`}
                  >
                    {emp.status}
                  </span>

                  {/* Name & framework */}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium truncate">{emp.name}</p>
                    <p className="text-[10px] text-gray-500">{emp.framework}</p>
                  </div>

                  {/* Points */}
                  <span
                    className={`text-xs font-bold ${emp.trend === 'up' ? 'text-green-400' : 'text-red-400'}`}
                  >
                    {emp.pts}
                  </span>

                  {/* Sparkline */}
                  <SparkLine trend={emp.trend} />
                </div>
              ))}
            </div>
          </div>

          {/* Card 2: Quick Cohort Comparison */}
          <div className="bg-blob-dark text-white rounded-xl p-5 border border-blob-border">
            <h4 className="text-sm font-bold mb-1">Quick Cohort Comparison</h4>
            <p className="text-xs text-gray-400 mb-4">WFH vs Office comparison</p>

            {/* Small bar chart */}
            <div className="flex items-end justify-center gap-3 h-16 mb-3">
              <div className="flex flex-col items-center gap-1">
                <div className="w-10 rounded-t bg-purple-500" style={{ height: '70%' }} />
                <span className="text-[10px] text-gray-400">Office</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <div className="w-10 rounded-t bg-pink-500" style={{ height: '55%' }} />
                <span className="text-[10px] text-gray-400">WFH</span>
              </div>
            </div>
          </div>

          {/* Card 3: Overall Company Sentiment */}
          <div className="bg-blob-dark text-white rounded-xl p-5 border border-blob-border">
            <h4 className="text-sm font-bold mb-3">
              Overall Company Sentiment:{' '}
              <span className="text-blob-primary">Positive</span>
            </h4>
            <div className="h-24 mb-3">
              <SentimentGauge />
            </div>
            <p className="text-xs text-gray-400">
              This is an increase of +7 Blob score of 7. Main factors are identified within.
            </p>
          </div>

          {/* Card 4: Leaderboard */}
          <div className="bg-blob-dark text-white rounded-xl p-5 border border-blob-border">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-full bg-blob-primary/20 flex items-center justify-center">
                <Trophy className="w-6 h-6 text-yellow-400" />
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">
                  Leaderboard
                </h4>
                <p className="text-xs text-gray-500 mt-0.5">
                  The top 3 Players in this market
                </p>
              </div>
            </div>
          </div>

          {/* Card 5: Meeting Productivity Score */}
          <div className="bg-blob-dark text-white rounded-xl p-5 border border-blob-border">
            <h4 className="text-sm font-bold mb-4">Meeting Productivity Score</h4>
            <MeetingProductivityBars />
            <p className="text-xs text-gray-400 mt-3">
              This is an increase of +7 Blob score of 7. Main factors are identified within.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
