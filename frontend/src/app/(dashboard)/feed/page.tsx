'use client'

import {
  AlertCircle,
  CheckCircle,
  TrendingUp,
  Zap,
  Brain,
  Settings,
  Network,
  Award,
  ArrowDown,
} from 'lucide-react'

type EventSeverity = 'critical' | 'warning' | 'positive' | 'info' | 'ai' | 'system'
type EventCategory =
  | 'score_drop'
  | 'milestone'
  | 'trophy'
  | 'trend'
  | 'ai_insight'
  | 'system'
  | 'burnout'
  | 'recommendation'

interface FeedEvent {
  id: number
  title: string
  description: string
  category: EventCategory
  severity: EventSeverity
  timestamp: string
  tags: Array<{ label: string; color: string }>
  entityType: 'employee' | 'department' | 'system'
  entityName: string
}

const events: FeedEvent[] = [
  {
    id: 1,
    title: "John Smith's Engagement Score Dropped",
    description: "Engagement dropped 15 points this week. Recent activity shows declining meeting participation.",
    category: 'score_drop',
    severity: 'critical',
    timestamp: '2 hours ago',
    tags: [
      { label: 'Score Drop', color: 'bg-red-100 text-red-700' },
      { label: 'High Priority', color: 'bg-red-50 text-red-600' },
    ],
    entityType: 'employee',
    entityName: 'John Smith',
  },
  {
    id: 2,
    title: 'Sarah Completed Re-engagement Sprint Milestone 2',
    description:
      "Sarah has successfully completed the second milestone of the Re-engagement Sprint program with 95% completion rate.",
    category: 'milestone',
    severity: 'positive',
    timestamp: '4 hours ago',
    tags: [
      { label: 'Achievement', color: 'bg-green-100 text-green-700' },
      { label: 'Program', color: 'bg-blue-100 text-blue-700' },
    ],
    entityType: 'employee',
    entityName: 'Sarah Johnson',
  },
  {
    id: 3,
    title: "Mike Earned 'The Flash' Trophy",
    description:
      "Mike has been recognized for exceptional responsiveness and quick turnarounds on critical deliverables.",
    category: 'trophy',
    severity: 'positive',
    timestamp: '6 hours ago',
    tags: [
      { label: 'Award', color: 'bg-yellow-100 text-yellow-700' },
      { label: 'Recognition', color: 'bg-purple-100 text-purple-700' },
    ],
    entityType: 'employee',
    entityName: 'Mike Chen',
  },
  {
    id: 4,
    title: 'Engineering Team Engagement Trending Up',
    description:
      'Engineering department has shown a consistent 8% engagement increase over the past 2 weeks with improved cross-team collaboration.',
    category: 'trend',
    severity: 'info',
    timestamp: '1 day ago',
    tags: [
      { label: 'Positive Trend', color: 'bg-blue-100 text-blue-700' },
      { label: 'Department', color: 'bg-indigo-100 text-indigo-700' },
    ],
    entityType: 'department',
    entityName: 'Engineering',
  },
  {
    id: 5,
    title: 'Unusual Sentiment Decline Detected',
    description:
      'BlobGPT has detected an unusual 12% sentiment decline across the Marketing team. This may indicate stress or workload concerns.',
    category: 'ai_insight',
    severity: 'warning',
    timestamp: '1 day ago',
    tags: [
      { label: 'AI Insight', color: 'bg-purple-100 text-purple-700' },
      { label: 'Warning', color: 'bg-orange-100 text-orange-700' },
    ],
    entityType: 'department',
    entityName: 'Marketing',
  },
  {
    id: 6,
    title: 'Slack Integration Synced Successfully',
    description: 'All workspace data has been synchronized. 847 users and 156 channels are being monitored.',
    category: 'system',
    severity: 'system',
    timestamp: '2 days ago',
    tags: [
      { label: 'System', color: 'bg-gray-100 text-gray-700' },
      { label: 'Integration', color: 'bg-slate-100 text-slate-700' },
    ],
    entityType: 'system',
    entityName: 'Blob System',
  },
  {
    id: 7,
    title: 'Alex Is Showing Overwork Patterns',
    description:
      'Alex has logged 12+ hour days for 2 consecutive weeks. Recommend immediate intervention and workload redistribution.',
    category: 'burnout',
    severity: 'warning',
    timestamp: '2 days ago',
    tags: [
      { label: 'Burnout Risk', color: 'bg-orange-100 text-orange-700' },
      { label: 'Urgent', color: 'bg-red-100 text-red-700' },
    ],
    entityType: 'employee',
    entityName: 'Alex Rodriguez',
  },
  {
    id: 8,
    title: 'BlobGPT Recommends Burnout Recovery Program',
    description:
      'Based on David\'s engagement patterns and recent behavior changes, the Burnout Recovery program is recommended to support his wellbeing.',
    category: 'recommendation',
    severity: 'positive',
    timestamp: '3 days ago',
    tags: [
      { label: 'Recommendation', color: 'bg-green-100 text-green-700' },
      { label: 'Program', color: 'bg-blue-100 text-blue-700' },
    ],
    entityType: 'employee',
    entityName: 'David Park',
  },
]

function getIconForEvent(category: EventCategory) {
  const iconClass = 'w-5 h-5'
  switch (category) {
    case 'score_drop':
      return <ArrowDown className={`${iconClass} text-red-500`} />
    case 'milestone':
      return <CheckCircle className={`${iconClass} text-green-500`} />
    case 'trophy':
      return <Award className={`${iconClass} text-yellow-500`} />
    case 'trend':
      return <TrendingUp className={`${iconClass} text-blue-500`} />
    case 'ai_insight':
      return <Brain className={`${iconClass} text-purple-500`} />
    case 'system':
      return <Settings className={`${iconClass} text-gray-500`} />
    case 'burnout':
      return <AlertCircle className={`${iconClass} text-orange-500`} />
    case 'recommendation':
      return <Zap className={`${iconClass} text-green-500`} />
    default:
      return <Network className={`${iconClass} text-gray-500`} />
  }
}

export default function FeedPage() {
  const [activeFilter, setActiveFilter] = React.useState<string>('all')
  const [activeScope, setActiveScope] = React.useState<string>('all')

  return (
    <div className="p-8 bg-blob-darker min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">Blob Feed</h1>
        <p className="text-blob-border">
          Real-time updates on team engagement and wellbeing
        </p>
      </div>

      {/* Filter Chips - Event Types */}
      <div className="mb-6">
        <p className="text-sm font-medium text-blob-border mb-3">Event Types</p>
        <div className="flex flex-wrap gap-2">
          {[
            { id: 'all', label: 'All Events' },
            { id: 'positive', label: 'Positive' },
            { id: 'burnout', label: 'Burnout' },
            { id: 'trending', label: 'Trending' },
            { id: 'engagement', label: 'Engagement' },
            { id: 'system', label: 'System' },
            { id: 'network', label: 'Network' },
          ].map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                activeFilter === filter.id
                  ? 'bg-blob-primary text-white shadow-lg shadow-blob-primary/30'
                  : 'bg-blob-surface text-blob-border hover:bg-blob-surface/80 border border-blob-border/30'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* Filter Chips - Scope */}
      <div className="mb-8">
        <p className="text-sm font-medium text-blob-border mb-3">Scope</p>
        <div className="flex flex-wrap gap-2">
          {[
            { id: 'all', label: 'All' },
            { id: 'individual', label: 'Individual' },
            { id: 'team', label: 'Team' },
            { id: 'organisation', label: 'Organisation' },
          ].map((scope) => (
            <button
              key={scope.id}
              onClick={() => setActiveScope(scope.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeScope === scope.id
                  ? 'bg-blob-primary text-white'
                  : 'bg-blob-surface text-blob-border hover:bg-blob-surface/80 border border-blob-border/30'
              }`}
            >
              {scope.label}
            </button>
          ))}
        </div>
      </div>

      {/* Feed Timeline */}
      <div className="space-y-4 max-w-4xl">
        {events.map((event) => (
          <div
            key={event.id}
            className="bg-blob-surface border border-blob-border/20 rounded-lg p-6 hover:border-blob-border/50 transition-all duration-200 hover:shadow-lg hover:shadow-blob-primary/10"
          >
            <div className="flex gap-4">
              {/* Left Icon */}
              <div className="flex-shrink-0 mt-1">{getIconForEvent(event.category)}</div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                {/* Title */}
                <h3 className="text-lg font-bold text-white mb-2">{event.title}</h3>

                {/* Description */}
                <p className="text-sm text-blob-border mb-3">{event.description}</p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-3">
                  {event.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${tag.color}`}
                    >
                      {tag.label}
                    </span>
                  ))}
                </div>

                {/* Timestamp */}
                <p className="text-xs text-blob-border/60">{event.timestamp}</p>
              </div>

              {/* Right Action Link */}
              <div className="flex-shrink-0 flex items-start">
                <button className="text-blob-primary hover:text-blob-primary/80 font-medium text-sm whitespace-nowrap ml-4 pt-1">
                  {event.entityType === 'employee'
                    ? 'View Employee →'
                    : event.entityType === 'department'
                      ? 'View Department →'
                      : 'View More →'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Load More Button */}
      <div className="mt-8 flex justify-center">
        <button className="px-8 py-3 border border-blob-border/50 text-blob-primary rounded-lg font-medium hover:bg-blob-surface/50 hover:border-blob-primary/50 transition-all duration-200">
          Load More Events
        </button>
      </div>
    </div>
  )
}

// Add React import for useState
import React from 'react'
