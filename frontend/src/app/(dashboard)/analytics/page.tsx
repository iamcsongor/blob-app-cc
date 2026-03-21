'use client'

import { Download } from 'lucide-react'
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
        stroke="#475569"
        strokeWidth="2"
      />

      {/* X-axis line */}
      <line
        x1={padding}
        y1={height - padding}
        x2={totalWidth - 20}
        y2={height - padding}
        stroke="#475569"
        strokeWidth="2"
      />

      {/* Grid lines and labels */}
      {[0, 50, 100, 150, 200, 250, 300].map((value) => {
        const y = height - padding - (value / maxCount) * (height - 2 * padding)
        return (
          <g key={value}>
            <line
              x1={padding - 5}
              y1={y}
              x2={padding}
              y2={y}
              stroke="#475569"
              strokeWidth="1"
            />
            <text
              x={padding - 10}
              y={y + 4}
              textAnchor="end"
              fontSize="12"
              fill="#94A3B8"
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
              rx="4"
              className="transition-opacity hover:opacity-80"
            />

            {/* Value label on top of bar */}
            <text
              x={x + barWidth / 2}
              y={y - 8}
              textAnchor="middle"
              fontSize="13"
              fontWeight="bold"
              fill="#E2E8F0"
            >
              {item.count}
            </text>

            {/* Range label below */}
            <text
              x={x + barWidth / 2}
              y={height - padding + 20}
              textAnchor="middle"
              fontSize="12"
              fill="#94A3B8"
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
      <text x="10" y="25" fontSize="14" fontWeight="bold" fill="#E2E8F0">
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
              fill="#E2E8F0"
            >
              {dept.name}
            </text>

            {/* Background bar */}
            <rect
              x={leftMargin}
              y={barY}
              width="350"
              height={barHeight}
              fill="#1E293B"
              rx="4"
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
                <stop offset="0%" stopColor={dept.color} stopOpacity="1" />
                <stop offset="100%" stopColor={dept.color} stopOpacity="0.6" />
              </linearGradient>
            </defs>

            <rect
              x={leftMargin}
              y={barY}
              width={barWidth}
              height={barHeight}
              fill={`url(#grad-${idx})`}
              rx="4"
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
          <stop offset="0%" stopColor="#10B981" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#10B981" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Y-axis */}
      <line
        x1={padding}
        y1={padding}
        x2={padding}
        y2={height - padding}
        stroke="#475569"
        strokeWidth="2"
      />

      {/* X-axis */}
      <line
        x1={padding}
        y1={height - padding}
        x2={width - padding}
        y2={height - padding}
        stroke="#475569"
        strokeWidth="2"
      />

      {/* Grid lines and Y-axis labels */}
      {[60, 70, 80, 90, 100].map((score) => {
        const y = height - padding - ((score - minScore) / scoreRange) * chartHeight
        return (
          <g key={score}>
            <line
              x1={padding - 5}
              y1={y}
              x2={padding}
              y2={y}
              stroke="#475569"
              strokeWidth="1"
            />
            <text x={padding - 10} y={y + 4} textAnchor="end" fontSize="12" fill="#94A3B8">
              {score}
            </text>
            {score !== 100 && (
              <line
                x1={padding}
                y1={y}
                x2={width - padding}
                y2={y}
                stroke="#334155"
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
        strokeWidth="3"
      />

      {/* Data points */}
      {points.map((p, idx) => (
        <g key={idx}>
          <circle cx={p.x} cy={p.y} r="5" fill="#10B981" />
          <circle cx={p.x} cy={p.y} r="3" fill="#0F172A" />
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
            fill="#94A3B8"
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
      icon: '👥',
    },
    {
      label: 'Flight Risk',
      value: 18,
      subtext: '2.1% of workforce',
      icon: '⚠️',
    },
    {
      label: 'Burnout Trajectory',
      value: 7,
      subtext: 'At risk',
      icon: '🔥',
    },
    {
      label: 'Avg Improvement',
      value: '+4.2%',
      subtext: 'vs last month',
      icon: '📈',
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

  return (
    <div className="p-8 bg-blob-darker min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">Analytics</h1>
        <p className="text-blob-border">Deep dive into engagement trends and predictive insights</p>
      </div>

      {/* Tab Navigation */}
      <div className="mb-8 border-b border-blob-border/20">
        <div className="flex gap-0">
          {['reporting', 'predictive', 'scenarios'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-4 font-medium text-sm transition-all duration-200 relative ${
                activeTab === tab
                  ? 'text-blob-primary'
                  : 'text-blob-border hover:text-white'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
              {activeTab === tab && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-blob-primary rounded-t"></div>
              )}
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
                className="bg-blob-surface border border-blob-border/20 rounded-lg p-6 hover:border-blob-border/50 transition-all duration-200"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="text-2xl">{stat.icon}</div>
                  <div className="text-xs text-blob-border/60">{stat.subtext}</div>
                </div>
                <p className="text-blob-border text-sm mb-2">{stat.label}</p>
                <p className="text-3xl font-bold text-white">{stat.value}</p>
              </div>
            ))}
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Score Distribution Chart */}
            <div className="bg-blob-surface border border-blob-border/20 rounded-lg p-6">
              <h3 className="text-lg font-bold text-white mb-4">Score Distribution</h3>
              <div className="h-80 overflow-hidden">
                <ScoreDistributionChart />
              </div>
            </div>

            {/* Department Comparison Chart */}
            <div className="bg-blob-surface border border-blob-border/20 rounded-lg p-6">
              <h3 className="text-lg font-bold text-white mb-4">Department Comparison</h3>
              <div className="h-80 overflow-hidden">
                <DepartmentComparisonChart />
              </div>
            </div>
          </div>

          {/* Engagement Trend Chart - Full Width */}
          <div className="bg-blob-surface border border-blob-border/20 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-bold text-white mb-4">Engagement Trend (12 Months)</h3>
            <div className="h-80 overflow-hidden">
              <EngagementTrendChart />
            </div>
          </div>

          {/* Risk Factors and Export Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Top Risk Factors */}
            <div className="lg:col-span-2 bg-blob-surface border border-blob-border/20 rounded-lg p-6">
              <h3 className="text-lg font-bold text-white mb-6">Top Risk Factors</h3>
              <div className="space-y-4">
                {riskFactors.map((factor, idx) => (
                  <div key={idx}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-white">{factor.name}</span>
                      <span className="text-sm font-bold text-blob-primary">-{factor.percentage}%</span>
                    </div>
                    <div className="h-2 bg-blob-darker rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blob-primary to-blue-500 rounded-full transition-all duration-500"
                        style={{ width: `${factor.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Export Buttons */}
            <div className="bg-blob-surface border border-blob-border/20 rounded-lg p-6 flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-bold text-white mb-4">Export Data</h3>
                <p className="text-sm text-blob-border mb-6">
                  Download your analytics reports in various formats
                </p>
              </div>
              <div className="space-y-3">
                <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blob-primary text-white rounded-lg font-medium hover:bg-blob-primary/90 transition-all duration-200">
                  <Download className="w-4 h-4" />
                  Export PDF
                </button>
                <button className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-blob-border/30 text-blob-primary rounded-lg font-medium hover:bg-blob-surface/50 hover:border-blob-primary/50 transition-all duration-200">
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
        <div className="bg-blob-surface border border-blob-border/20 rounded-lg p-12 text-center">
          <p className="text-blob-border text-lg">Predictive analytics features coming soon</p>
        </div>
      )}

      {/* Scenarios Tab Content */}
      {activeTab === 'scenarios' && (
        <div className="bg-blob-surface border border-blob-border/20 rounded-lg p-12 text-center">
          <p className="text-blob-border text-lg">Scenario analysis features coming soon</p>
        </div>
      )}
    </div>
  )
}
