'use client'

import { ChevronDown, Clock, MapPin, Zap, Award, TrendingUp, TrendingDown, MoreHorizontal } from 'lucide-react'
import Link from 'next/link'

// Demo Data
const EMPLOYEE_DATA = {
  name: 'Iron Man',
  role: 'Sr. Sales Director, APAC',
  blobScore: 65,
  riskLevel: 'Risk',
  status: 'Away (46m)',
  location: 'WFH',
  activity: 'Slack',
}

const PROGRESSION_DATA = [
  { title: 'Engagement Operator', progress: 57, xp: 1450, maxXp: 2000, status: null },
  { title: 'Responsiveness Specialist', progress: 82, xp: 1850, maxXp: 2000, status: 'ON TRACK' },
]

const METRICS = [
  { name: 'Engagement Volume', score: 54, change: -7, description: 'Total communication activity', type: 'negative' },
  { name: 'Reaction Time', score: 46, change: -7, description: 'Average response speed', type: 'negative' },
  { name: 'Participation', score: 44, change: -3, description: 'Meeting and discussion engagement', type: 'negative' },
  { name: 'Presence Analysis', score: 76, change: -7, description: 'Time spent on productive channels', type: 'negative' },
  { name: 'Sentiment Analysis', score: 88, change: 1, description: 'Emotional tone in communications', type: 'positive' },
  { name: 'Social Brand Rep', score: 23, change: 7, description: 'External reputation and visibility', type: 'positive' },
]

const ENGAGEMENT_DETAIL = {
  channels: { all: 350, emails: 120, slack: 230 },
  proReactive: { proActive: 15, trend: '+15%' },
  mentions: 69,
  platforms: [
    { name: 'Outlook', icon: '📧', usage: 85 },
    { name: 'Gmail', icon: '🔔', usage: 45 },
    { name: 'Salesforce', icon: '☁️', usage: 92 },
    { name: 'Slack', icon: '💬', usage: 78 },
  ],
}

const TROPHIES = [
  { name: 'Conversation starter', rarity: 'Unique', percentage: 1 },
  { name: 'The Flash', rarity: 'Rare', percentage: 12 },
  { name: 'The Delegator', rarity: 'Common', percentage: 67 },
  { name: 'The 24/7', rarity: 'Superior', percentage: 52 },
]

const WORKING_PATTERNS = {
  avgHours: '8 hrs 6 min',
  change: 'Up 23 mins from July',
  startTime: '08:24',
  endTime: '21:07',
  days: [
    { day: 'M', start: 520, end: 1265 },
    { day: 'T', start: 495, end: 1280 },
    { day: 'W', start: 510, end: 1270 },
    { day: 'T', start: 525, end: 1255 },
    { day: 'F', start: 505, end: 1260 },
    { day: 'S', start: 540, end: 1240 },
    { day: 'S', start: 555, end: 1230 },
    { day: 'M', start: 515, end: 1275 },
    { day: 'T', start: 500, end: 1285 },
    { day: 'W', start: 520, end: 1268 },
    { day: 'T', start: 510, end: 1270 },
    { day: 'F', start: 530, end: 1250 },
  ],
}

// Sparkline SVG Component
function Sparkline({ data, color }: { data: number[]; color: string }) {
  const width = 40
  const height = 20
  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min
  const pointWidth = width / (data.length - 1)

  const points = data.map((d, i) => ({
    x: i * pointWidth,
    y: height - ((d - min) / range) * height,
  }))

  const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="w-10 h-5">
      <path d={pathD} stroke={color} strokeWidth="1.5" fill="none" vectorEffect="non-scaling-stroke" />
    </svg>
  )
}

// Small Line Chart Component for engagement detail
function LineChart() {
  return (
    <svg width="100%" height="200" viewBox="0 0 400 200" preserveAspectRatio="xMidYMid meet" className="w-full">
      <defs>
        <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#10B981" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#10B981" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path
        d="M 20 140 Q 60 120 100 110 T 180 95 T 260 100 T 340 80 L 340 200 L 20 200 Z"
        fill="url(#chartGradient)"
      />
      <path
        d="M 20 140 Q 60 120 100 110 T 180 95 T 260 100 T 340 80"
        stroke="#10B981"
        strokeWidth="2"
        fill="none"
        vectorEffect="non-scaling-stroke"
      />
      <circle cx="100" cy="110" r="3" fill="#10B981" />
      <circle cx="180" cy="95" r="3" fill="#10B981" />
      <circle cx="260" cy="100" r="3" fill="#10B981" />
    </svg>
  )
}

// Main Blob Score Chart Component
function BlobScoreChart() {
  return (
    <svg width="100%" height="300" viewBox="0 0 600 300" preserveAspectRatio="xMidYMid meet" className="w-full">
      <defs>
        <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#10B981" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#10B981" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Grid lines */}
      <line x1="40" y1="250" x2="560" y2="250" stroke="#E5E7EB" strokeWidth="1" />
      <line x1="40" y1="190" x2="560" y2="190" stroke="#F3F4F6" strokeWidth="1" />
      <line x1="40" y1="130" x2="560" y2="130" stroke="#F3F4F6" strokeWidth="1" />
      <line x1="40" y1="70" x2="560" y2="70" stroke="#F3F4F6" strokeWidth="1" />

      {/* Y-axis labels */}
      <text x="20" y="255" fontSize="12" fill="#6B7280">
        0
      </text>
      <text x="20" y="195" fontSize="12" fill="#6B7280">
        25
      </text>
      <text x="20" y="135" fontSize="12" fill="#6B7280">
        50
      </text>
      <text x="20" y="75" fontSize="12" fill="#6B7280">
        75
      </text>
      <text x="15" y="30" fontSize="12" fill="#6B7280">
        100
      </text>

      {/* Main line and area */}
      <path
        d="M 40 180 L 100 160 L 160 170 L 220 140 L 280 130 L 340 145 L 400 125 L 460 115 L 520 140 L 560 130"
        fill="url(#scoreGradient)"
        stroke="none"
      />
      <path
        d="M 40 180 L 100 160 L 160 170 L 220 140 L 280 130 L 340 145 L 400 125 L 460 115 L 520 140 L 560 130"
        stroke="#10B981"
        strokeWidth="3"
        fill="none"
        vectorEffect="non-scaling-stroke"
      />

      {/* Event markers */}
      <circle cx="100" cy="160" r="5" fill="#10B981" stroke="white" strokeWidth="2" />
      <text x="95" y="125" fontSize="11" fill="#059669" fontWeight="bold">
        +3pts
      </text>
      <text x="80" y="145" fontSize="10" fill="#6B7280">
        Holiday
      </text>

      <circle cx="220" cy="140" r="5" fill="#10B981" stroke="white" strokeWidth="2" />
      <text x="210" y="100" fontSize="11" fill="#059669" fontWeight="bold">
        +5pts
      </text>
      <text x="200" y="125" fontSize="10" fill="#6B7280">
        Course Done
      </text>

      <circle cx="340" cy="145" r="5" fill="#10B981" stroke="white" strokeWidth="2" />
      <text x="330" y="110" fontSize="11" fill="#059669" fontWeight="bold">
        +2pts
      </text>
      <text x="310" y="125" fontSize="10" fill="#6B7280">
        Company Update
      </text>

      <circle cx="520" cy="140" r="5" fill="#10B981" stroke="white" strokeWidth="2" />
      <text x="510" y="105" fontSize="11" fill="#059669" fontWeight="bold">
        +4pts
      </text>
      <text x="505" y="125" fontSize="10" fill="#6B7280">
        Payday
      </text>

      {/* X-axis */}
      <line x1="40" y1="250" x2="560" y2="250" stroke="#9CA3AF" strokeWidth="1" />
    </svg>
  )
}

// Avatar with Score Ring
function AvatarWithScoreRing({ score }: { score: number }) {
  const radius = 45
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (score / 100) * circumference

  return (
    <div className="relative w-28 h-28">
      <svg width="112" height="112" viewBox="0 0 112 112" className="absolute inset-0">
        {/* Background circle */}
        <circle cx="56" cy="56" r={radius} fill="none" stroke="#E5E7EB" strokeWidth="3" />
        {/* Score ring */}
        <circle
          cx="56"
          cy="56"
          r={radius}
          fill="none"
          stroke="#10B981"
          strokeWidth="3"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform="rotate(-90 56 56)"
        />
      </svg>
      {/* Avatar content */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-20 h-20 bg-gradient-to-br from-blob-primary to-emerald-600 rounded-full flex items-center justify-center text-white text-3xl font-bold">
          IM
        </div>
      </div>
      {/* Score label */}
      <div className="absolute -bottom-1 -right-1 bg-white rounded-full w-10 h-10 flex items-center justify-center border-2 border-blob-primary shadow-lg">
        <span className="text-sm font-bold text-blob-primary">{score}</span>
      </div>
    </div>
  )
}

// Progression Card
function ProgressionCard({ title, progress, xp, maxXp, status }: (typeof PROGRESSION_DATA)[0]) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex items-start justify-between mb-2">
        <h4 className="font-semibold text-gray-900 text-sm">{title}</h4>
        {status && <span className="text-xs font-semibold text-green-700 bg-green-50 px-2 py-1 rounded">{status}</span>}
      </div>
      <p className="text-xs text-gray-600 mb-3">{progress}% progress</p>
      <div className="w-full bg-gray-200 rounded-full h-2 mb-2 overflow-hidden">
        <div className="bg-blob-primary h-full" style={{ width: `${progress}%` }} />
      </div>
      <p className="text-xs text-gray-600">
        {xp.toLocaleString()} / {maxXp.toLocaleString()} XP
      </p>
    </div>
  )
}

// Metric Card
function MetricCard({ name, score, change, description, type }: (typeof METRICS)[0]) {
  const isPositive = type === 'positive'
  const sparkData = isPositive ? [20, 25, 22, 28, 26, 30] : [30, 25, 28, 22, 24, 20]

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-5">
      <div className="flex items-start justify-between mb-3">
        <h4 className="font-bold text-gray-900">{name}</h4>
        <div className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold ${isPositive ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
          {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
          {Math.abs(change)}pts
        </div>
      </div>
      <div className="mb-3">
        <p className="text-3xl font-bold text-gray-900">{score}</p>
      </div>
      <p className="text-xs text-gray-600 mb-3">{description}</p>
      <Sparkline data={sparkData} color={isPositive ? '#10B981' : '#EF4444'} />
    </div>
  )
}

// Trophy Item
function TrophyItem({ name, rarity, percentage }: (typeof TROPHIES)[0]) {
  const rarityColors = {
    Unique: 'text-purple-600 bg-purple-50',
    Rare: 'text-blue-600 bg-blue-50',
    Common: 'text-gray-600 bg-gray-100',
    Superior: 'text-amber-600 bg-amber-50',
  }

  return (
    <div className="flex items-center justify-between py-2">
      <div>
        <p className="text-sm font-medium text-gray-900">{name}</p>
        <p className="text-xs text-gray-600">{percentage}% of team</p>
      </div>
      <span className={`text-xs font-semibold px-2 py-1 rounded ${rarityColors[rarity as keyof typeof rarityColors]}`}>{rarity}</span>
    </div>
  )
}

export default function EmployeeProfilePage({
  params,
}: {
  params: { id: string }
}) {
  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-8">
      {/* Back Link */}
      <Link
        href="/individuals"
        className="inline-flex items-center gap-2 text-blob-primary hover:text-blob-primary/80 mb-6 font-medium text-sm"
      >
        ← Back to Directory
      </Link>

      {/* ===== EMPLOYEE HEADER ===== */}
      <div className="bg-white rounded-lg border border-gray-200 p-8 mb-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left: Avatar + Name + Risk Badge */}
          <div className="flex flex-col items-center lg:items-start gap-4">
            <AvatarWithScoreRing score={EMPLOYEE_DATA.blobScore} />
            <div className="text-center lg:text-left">
              <h1 className="text-2xl font-bold text-gray-900">{EMPLOYEE_DATA.name}</h1>
              <p className="text-gray-600 text-sm mb-3">{EMPLOYEE_DATA.role}</p>
              <span className="inline-block bg-red-50 text-red-700 text-xs font-semibold px-3 py-1 rounded-full border border-red-200">
                {EMPLOYEE_DATA.riskLevel}
              </span>
            </div>
          </div>

          {/* Center: Progression Cards */}
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
            {PROGRESSION_DATA.map((prog, idx) => (
              <ProgressionCard key={idx} {...prog} />
            ))}
          </div>

          {/* Right: Status Info + Filters */}
          <div className="space-y-6 lg:min-w-[220px]">
            {/* Status Info */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Clock className="w-4 h-4 text-gray-500" />
                <span className="text-gray-700 font-medium">Status: {EMPLOYEE_DATA.status}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="w-4 h-4 text-gray-500" />
                <span className="text-gray-700 font-medium">Location: {EMPLOYEE_DATA.location}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Zap className="w-4 h-4 text-gray-500" />
                <span className="text-gray-700 font-medium">Activity: {EMPLOYEE_DATA.activity}</span>
              </div>
              <button className="text-sm text-blob-primary hover:text-blob-primary/80 font-medium flex items-center gap-1">
                Contact info <ChevronDown className="w-3 h-3" />
              </button>
            </div>

            {/* Filter Controls */}
            <div className="space-y-3 border-t border-gray-200 pt-4">
              <button className="w-full flex items-center justify-between px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm font-medium text-gray-700">
                All Company
                <ChevronDown className="w-4 h-4" />
              </button>
              <div className="flex flex-wrap gap-2">
                {['1W', '2W', '1M', '3M', '6M', '9M', '1Y', '2Y'].map((period) => (
                  <button
                    key={period}
                    className={`px-3 py-1 rounded text-xs font-semibold ${period === '1M' ? 'bg-blob-primary text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                  >
                    {period}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ===== MAIN CONTENT + RIGHT SIDEBAR ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main Content Column */}
        <div className="lg:col-span-3 space-y-8">
          {/* Blob Score Fluctuation Chart */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Blob Score Fluctuation</h3>
              <div className="flex items-center gap-3">
                <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm font-medium text-gray-700">
                  <span>+ Add Event</span>
                </button>
                <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm font-medium text-gray-700">
                  <span>Event Types (4)</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>
            </div>
            <BlobScoreChart />
          </div>

          {/* Metric Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {METRICS.map((metric, idx) => (
              <MetricCard key={idx} {...metric} />
            ))}
          </div>

          {/* Engagement Volume Expanded Detail */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blob-primary/10 rounded-lg flex items-center justify-center">
                  <Zap className="w-6 h-6 text-blob-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Engagement Volume</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Iron Man has shown decreased engagement across all channels over the past week.
                  </p>
                </div>
              </div>
              <button className="text-blob-primary hover:text-blob-primary/80 font-medium text-sm flex items-center gap-1">
                next ✦
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Message Volume */}
              <div className="border border-gray-200 rounded-lg p-5">
                <div className="flex items-center gap-2 mb-4 border-b border-gray-200 pb-3">
                  <button className={`text-sm font-semibold pb-2 px-1 border-b-2 border-blob-primary text-blob-primary`}>All channels</button>
                  <button className="text-sm font-semibold pb-2 px-1 text-gray-600 hover:text-gray-900">Emails</button>
                  <button className="text-sm font-semibold pb-2 px-1 text-gray-600 hover:text-gray-900">Slack</button>
                </div>
                <p className="text-4xl font-bold text-gray-900 mb-1">{ENGAGEMENT_DETAIL.channels.all}</p>
                <p className="text-sm text-gray-600 mb-4">messages in the last month</p>
                <LineChart />
              </div>

              {/* Pro-active vs Re-active */}
              <div className="space-y-4">
                <div className="border border-gray-200 rounded-lg p-5">
                  <p className="text-sm text-gray-600 mb-2">Pro- vs Re-active</p>
                  <p className="text-4xl font-bold text-gray-900 mb-2">{ENGAGEMENT_DETAIL.proReactive.proActive}%</p>
                  <p className="text-sm font-semibold text-green-700 flex items-center gap-1">
                    <TrendingUp className="w-4 h-4" />
                    {ENGAGEMENT_DETAIL.proReactive.trend}
                  </p>
                </div>

                {/* Mentions */}
                <div className="border border-gray-200 rounded-lg p-5">
                  <p className="text-sm text-gray-600 mb-2">@mentions</p>
                  <p className="text-4xl font-bold text-gray-900">{ENGAGEMENT_DETAIL.mentions}</p>
                </div>
              </div>
            </div>

            {/* Platform Usage Stats */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-sm font-semibold text-gray-900 mb-4">Platform Usage Stats</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {ENGAGEMENT_DETAIL.platforms.map((platform) => (
                  <div key={platform.name} className="flex flex-col items-center text-center">
                    <div className="text-3xl mb-2">{platform.icon}</div>
                    <p className="text-xs font-medium text-gray-900">{platform.name}</p>
                    <div className="w-8 h-1 bg-gray-200 rounded-full mt-2 overflow-hidden">
                      <div
                        className="h-full bg-blob-primary"
                        style={{
                          width: `${platform.usage}%`,
                        }}
                      />
                    </div>
                    <p className="text-xs text-gray-600 mt-1">{platform.usage}%</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Risk Category Card */}
          <div className="bg-blob-dark text-white rounded-lg p-5">
            <h3 className="font-semibold mb-3">Risk Status</h3>
            <p className="text-sm text-gray-300 mb-4">
              Iron Man is in the <span className="font-semibold text-white">&ldquo;Risks&rdquo;</span> category and has been for over <span className="font-semibold text-white">4 weeks</span>.
            </p>
            {/* Dot Matrix Visualization */}
            <svg width="100%" height="80" viewBox="0 0 200 80" preserveAspectRatio="xMidYMid meet" className="w-full">
              {[...Array(20)].map((_, i) => {
                const riskLevel = Math.random()
                return (
                  <circle
                    key={i}
                    cx={20 + (i % 5) * 40}
                    cy={20 + Math.floor(i / 5) * 25}
                    r={riskLevel > 0.7 ? 3 : 2}
                    fill={riskLevel > 0.7 ? '#EF4444' : '#10B981'}
                    opacity={0.7}
                  />
                )
              })}
            </svg>
          </div>

          {/* Trophies Card */}
          <div className="bg-blob-dark text-white rounded-lg p-5">
            <div className="flex items-center gap-2 mb-4">
              <Award className="w-5 h-5 text-blob-primary" />
              <h3 className="font-semibold">Trophies</h3>
            </div>
            <p className="text-sm text-gray-300 mb-4">4 Overall Trophies obtained in the past month</p>
            <div className="space-y-3 border-t border-blob-border pt-3">
              {TROPHIES.map((trophy, idx) => (
                <TrophyItem key={idx} {...trophy} />
              ))}
            </div>
          </div>

          {/* NLP Card */}
          <div className="bg-blob-dark text-white rounded-lg p-5">
            <h3 className="font-semibold mb-3">NLP Sentiment</h3>
            <p className="text-sm text-gray-300 mb-4">
              Trend reversal, negative keywords increased in frequency over the past 3 weeks.
            </p>
            {/* Positive/Negative Bar */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="text-gray-300">Sentiment Balance</span>
              </div>
              <div className="flex h-6 rounded-full overflow-hidden border border-blob-border">
                <div className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600" />
                <div className="flex-1 bg-gradient-to-r from-pink-500 to-rose-600" />
              </div>
              <div className="flex justify-between text-xs text-gray-400 mt-2">
                <span>Positive 48%</span>
                <span>Negative 52%</span>
              </div>
            </div>
          </div>

          {/* Working Patterns Card */}
          <div className="bg-blob-dark text-white rounded-lg p-5">
            <h3 className="font-semibold mb-3">Working Patterns</h3>
            <p className="text-sm text-gray-300 mb-4">
              Avg <span className="font-semibold">{WORKING_PATTERNS.avgHours}</span> per day. {WORKING_PATTERNS.change}.
            </p>

            {/* Daily Hours Visualization */}
            <svg width="100%" height="80" viewBox="0 0 200 80" preserveAspectRatio="xMidYMid meet" className="w-full mb-4">
              {WORKING_PATTERNS.days.map((day, idx) => {
                const barHeight = ((day.end - day.start) / 1440) * 60
                const yPos = 70 - barHeight
                return (
                  <g key={idx}>
                    <rect
                      x={10 + idx * 15}
                      y={yPos}
                      width="12"
                      height={barHeight}
                      fill="#10B981"
                      opacity="0.8"
                      rx="1"
                    />
                    <text
                      x={10 + idx * 15 + 6}
                      y="75"
                      fontSize="8"
                      fill="#9CA3AF"
                      textAnchor="middle"
                    >
                      {day.day}
                    </text>
                  </g>
                )
              })}
            </svg>

            <div className="flex justify-between text-xs text-gray-300">
              <span>Start: {WORKING_PATTERNS.startTime}</span>
              <span>End: {WORKING_PATTERNS.endTime}</span>
            </div>
          </div>

          {/* Sociogram Card */}
          <div className="bg-blob-dark text-white rounded-lg p-5">
            <h3 className="font-semibold mb-3">Sociogram</h3>
            <p className="text-sm text-gray-300 mb-4">Network and collaboration map</p>
            {/* Network Graph Preview */}
            <svg width="100%" height="150" viewBox="0 0 200 150" preserveAspectRatio="xMidYMid meet" className="w-full">
              {/* Connections */}
              <line x1="100" y1="75" x2="50" y2="40" stroke="#334155" strokeWidth="1" />
              <line x1="100" y1="75" x2="150" y2="40" stroke="#334155" strokeWidth="1" />
              <line x1="100" y1="75" x2="60" y2="120" stroke="#334155" strokeWidth="1" />
              <line x1="100" y1="75" x2="140" y2="120" stroke="#334155" strokeWidth="1" />

              {/* Central node */}
              <circle cx="100" cy="75" r="8" fill="#10B981" />
              {/* Connected nodes */}
              <circle cx="50" cy="40" r="5" fill="#334155" />
              <circle cx="150" cy="40" r="5" fill="#334155" />
              <circle cx="60" cy="120" r="5" fill="#334155" />
              <circle cx="140" cy="120" r="5" fill="#334155" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  )
}
