'use client'

import { Download, Users, AlertTriangle, Flame, TrendingUp } from 'lucide-react'
import React from 'react'

interface StatCard {
  label: string
  value: string | number
  subtext?: string
  icon: React.ReactNode
}

interface RiskFactor {
  name: string
  percentage: number
}

const ScoreDistributionChart = () => {
  const data = [
    { range: '0-49', count: 18, color: '#EF4444' },
    { range: '50-59', count: 42, color: '#F97316' },
    { range: '60-69', count: 85, color: '#EAB308' },
    { range: '70-79', count: 156, color: '#84CC16' },
    { range: '80-89', count: 312, color: '#10B981' },
    { range: '90-100', count: 234, color: '#059669' },
  ]

  const maxCount = Math.max(...data.map((d) => d.count))
  const width = 500
  const height = 280
  const barWidth = 60
  const spacing = 12
  const totalWidth = data.length * (barWidth + spacing) + 40
  const padding = 40

  return (
    <svg viewBox={`0 0 ${totalWidth} ${height}`} className="w-full h-full">
      {/* Y-axis line */}
      <line
        x1={padding}
        y1={height - padding}
        x2={padding}
        y2={20}
        stroke="#D1D5DB"
        strokeWidth="1"
      />

      {/* X-axis line */}
      <line
        x1={padding}
        y1={height - padding}
        x2={totalWidth - 20}
        y2={height - padding}
        stroke="#D1D5DB"
        strokeWidth="1"
      />

      {/* Grid lines and labels */}
      {[0, 50, 100, 150, 200, 250, 300].map((value) => {
        const y = height - padding - (value / maxCount) * (height - 2 * padding)
        return (
          <g key={value}>
            <line
              x1={padding}
              y1={y}
              x2={totalWidth - 20}
              y2={y}
              stroke="#F3F4F6"
              strokeWidth="1"
            />
            <text
              x={padding - 10}
              y={y + 4}
              textAnchor="end"
              fontSize="12"
              fill="#9CA3AF"
            >
              {value}
            </text>
          </g>
        )
      })}

      {/* Bars */}
      {data.map((item, idx) => {
        const barHeight = (item.count / maxCount) * (height - 2 * padding)
        const x = padding + idx * (barWidth + spacing) + 20
        const y = height - padding - barHeight

        return (
          <g key={idx}>
            {/* Bar */}
            <rect
              x={x}
              y={y}
              width={barWidth}
              height={barHeight}
              fill={item.color}
              rx="6"
              opacity="0.85"
              className="transition-opacity hover:opacity-100"
            />

            {/* Value label on top of bar */}
            <text
              x={x + barWidth / 2}
              y={y - 8}
              textAnchor="middle"
              fontSize="13"
              fontWeight="600"
              fill="#374151"
            >
              {item.count}
            </text>

            {/* Range label below */}
            <text
              x={x + barWidth / 2}
              y={height - padding + 20}
              textAnchor="middle"
              fontSize="12"
              fill="#6B7280"
            >
              {item.range}
            </text>
          </g>
        )
      })}
    </svg>
  )
}

const DepartmentComparisonChart = () => {
  const departments = [
    { name: 'Engineering', score: 82, color: '#10B981' },
    { name: 'Sales', score: 75, color: '#3B82F6' },
    { name: 'Marketing', score: 68, color: '#8B5CF6' },
    { name: 'Operations', score: 79, color: '#F59E0B' },
    { name: 'HR', score: 71, color: '#EC4899' },
    { name: 'Finance', score: 85, color: '#06B6D4' },
  ]

  const maxScore = 100
  const barHeight = 35
  const spacing = 15
  const totalHeight = departments.length * (barHeight + spacing) + 60
  const leftMargin = 120
  const width = 600

  return (
    <svg viewBox={`0 0 ${width} ${totalHeight}`} className="w-full h-full">
      {/* Title */}
      <text x="10" y="25" fontSize="14" fontWeight="600" fill="#374151">
        Avg Engagement Score by Department
      </text>

      {/* Bars */}
      {departments.map((dept, idx) => {
        const barY = 50 + idx * (barHeight + spacing)
        const barWidth = (dept.score / maxScore) * 350

        return (
          <g key={idx}>
            {/* Department label */}
            <text
              x={10}
              y={barY + barHeight / 2 + 5}
              fontSize="13"
              fontWeight="500"
              fill="#374151"
            >
              {dept.name}
            </text>

            {/* Background bar */}
            <rect
              x={leftMargin}
              y={barY}
              width="350"
              height={barHeight}
              fill="#F3F4F6"
              rx="6"
            />

            {/* Gradient bar */}
            <defs>
              <linearGradient
                id={`grad-${idx}`}
                x1="0%"
                y1="0%"
                x2="100%"
                y2="0%"
              >
                <stop offset="0%" stopColor={dept.color} stopOpacity="0.9" />
                <stop offset="100%" stopColor={dept.color} stopOpacity="0.6" />
              </linearGradient>
            </defs>

            <rect
              x={leftMargin}
              y={barY}
              width={barWidth}
              height={barHeight}
              fill={`url(#grad-${idx})`}
              rx="6"
            />

            {/* Score label */}
            <text
              x={leftMargin + barWidth + 10}
              y={barY + barHeight / 2 + 5}
              fontSize="13"
              fontWeight="bold"
              fill={dept.color}
            >
              {dept.score}
            </text>
          </g>
        )
      })}
    </svg>
  )
}

const EngagementTrendChart = () => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const data = [65, 68, 72, 70, 75, 78, 82, 80, 85, 83, 86, 88]

  const width = 1000
  const height = 300
  const padding = 40
  const chartWidth = width - 2 * padding
  const chartHeight = height - 2 * padding
  const pointSpacing = chartWidth / (data.length - 1)

  const minScore = 60
  const maxScore = 100
  const scoreRange = maxScore - minScore

  const points = data.map((value, idx) => ({
    x: padding + idx * pointSpacing,
    y: height - padding - ((value - minScore) / scoreRange) * chartHeight,
    value,
  }))

  // Create path for area
  const pathData = [
    `M ${points[0].x} ${height - padding}`,
    ...points.map((p) => `L ${p.x} ${p.y}`),
    `L ${points[points.length - 1].x} ${height - padding}`,
    'Z',
  ].join(' ')

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full">
      {/* Gradient definition */}
      <defs>
        <linearGradient id="trendGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#10B981" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#10B981" stopOpacity="0.02" />
        </linearGradient>
      </defs>

      {/* Y-axis */}
      <line
        x1={padding}
        y1={padding}
        x2={padding}
        y2={height - padding}
        stroke="#E5E7EB"
        strokeWidth="1"
      />

      {/* X-axis */}
      <line
        x1={padding}
        y1={height - padding}
        x2={width - padding}
        y2={height - padding}
        stroke="#E5E7EB"
        strokeWidth="1"
      />

      {/* Grid lines and Y-axis labels */}
      {[60, 70, 80, 90, 100].map((score) => {
        const y = height - padding - ((score - minScore) / scoreRange) * chartHeight
        return (
          <g key={score}>
            <text x={padding - 10} y={y + 4} textAnchor="end" fontSize="12" fill="#9CA3AF">
              {score}
            </text>
            {score !== 100 && (
              <line
                x1={padding}
                y1={y}
                x2={width - padding}
                y2={y}
                stroke="#F3F4F6"
                strokeWidth="1"
                strokeDasharray="4,4"
              />
            )}
          </g>
        )
      })}

      {/* Filled area under curve */}
      <path d={pathData} fill="url(#trendGradient)" />

      {/* Line connecting points */}
      <polyline
        points={points.map((p) => `${p.x},${p.y}`).join(' ')}
        fill="none"
        stroke="#10B981"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />

      {/* Data points */}
      {points.map((p, idx) => (
        <g key={idx}>
          <circle cx={p.x} cy={p.y} r="5" fill="#10B981" />
          <circle cx={p.x} cy={p.y} r="2.5" fill="white" />
        </g>
      ))}

      {/* Month labels */}
      {months.map((month, idx) => {
        const x = padding + idx * pointSpacing
        return (
          <text
            key={idx}
            x={x}
            y={height - padding + 20}
            textAnchor="middle"
            fontSize="12"
            fill="#6B7280"
          >
            {month}
          </text>
        )
      })}
    </svg>
  )
}

export default function AnalyticsPage() {
  const [activeTab, setActiveTab] = React.useState('reporting')

  const statCards: StatCard[] = [
    {
      label: 'Total Monitored',
      value: 847,
      icon: <Users className="w-5 h-5 text-emerald-500" />,
    },
    {
      label: 'Flight Risk',
      value: 18,
      subtext: '2.1% of workforce',
      icon: <AlertTriangle className="w-5 h-5 text-amber-500" />,
    },
    {
      label: 'Burnout Trajectory',
      value: 7,
      subtext: 'At risk',
      icon: <Flame className="w-5 h-5 text-red-500" />,
    },
    {
      label: 'Avg Improvement',
      value: '+4.2%',
      subtext: 'vs last month',
      icon: <TrendingUp className="w-5 h-5 text-emerald-500" />,
    },
  ]

  const riskFactors: RiskFactor[] = [
    { name: 'Declining communication', percentage: 23 },
    { name: 'Meeting avoidance', percentage: 18 },
    { name: 'Camera off pattern', percentage: 15 },
    { name: 'Increased timezone shifts', percentage: 12 },
    { name: 'Reduced collaboration', percentage: 10 },
    { name: 'After-hours activity', percentage: 8 },
  ]

  const tabs = [
    { key: 'reporting', label: 'Reporting' },
    { key: 'predictive', label: 'Predictive' },
    { key: 'scenarios', label: 'Scenarios' },
  ]

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-1">Analytics</h1>
        <p className="text-gray-500">Deep dive into engagement trends and predictive insights</p>
      </div>

      {/* Tab Navigation */}
      <div className="mb-8">
        <div className="inline-flex bg-white rounded-lg border border-gray-200 p-1">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-5 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                activeTab === tab.key
                  ? 'bg-emerald-500 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Reporting Tab Content */}
      {activeTab === 'reporting' && (
        <>
          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {statCards.map((stat, idx) => (
              <div
                key={idx}
                className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="p-2 bg-gray-50 rounded-lg">{stat.icon}</div>
                  {stat.subtext && (
                    <span className="text-xs text-gray-400 font-medium">{stat.subtext}</span>
                  )}
                </div>
                <p className="text-sm text-gray-500 mb-1">{stat.label}</p>
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
              </div>
            ))}
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Score Distribution Chart */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Score Distribution</h3>
              <div className="h-80 overflow-hidden">
                <ScoreDistributionChart />
              </div>
            </div>

            {/* Department Comparison Chart */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Department Comparison</h3>
              <div className="h-80 overflow-hidden">
                <DepartmentComparisonChart />
              </div>
            </div>
          </div>

          {/* Engagement Trend Chart - Full Width */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Engagement Trend (12 Months)</h3>
            <div className="h-80 overflow-hidden">
              <EngagementTrendChart />
            </div>
          </div>

          {/* Risk Factors and Export Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Top Risk Factors */}
            <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Top Risk Factors</h3>
              <div className="space-y-5">
                {riskFactors.map((factor, idx) => (
                  <div key={idx}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">{factor.name}</span>
                      <span className="text-sm font-semibold text-emerald-600">-{factor.percentage}%</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-emerald-500 to-emerald-300 rounded-full transition-all duration-500"
                        style={{ width: `${factor.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Export Buttons */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Export Data</h3>
                <p className="text-sm text-gray-500 mb-6">
                  Download your analytics reports in various formats
                </p>
              </div>
              <div className="space-y-3">
                <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-emerald-500 text-white rounded-lg font-medium hover:bg-emerald-600 transition-all duration-200 shadow-sm">
                  <Download className="w-4 h-4" />
                  Export PDF
                </button>
                <button className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-50 hover:border-gray-300 transition-all duration-200">
                  <Download className="w-4 h-4" />
                  Export CSV
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Predictive Tab Content */}
      {activeTab === 'predictive' && (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <p className="text-gray-500 text-lg">Predictive analytics features coming soon</p>
        </div>
      )}

      {/* Scenarios Tab Content */}
      {activeTab === 'scenarios' && (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <p className="text-gray-500 text-lg">Scenario analysis features coming soon</p>
        </div>
      )}
    </div>
  )
}
