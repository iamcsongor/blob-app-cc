'use client'

import { AlertCircle, CheckCircle, Info, TrendingUp } from 'lucide-react'

export default function FeedPage() {
  const events = [
    {
      id: 1,
      type: 'alert',
      title: 'John Smith - Score Drop Alert',
      description: 'John\'s engagement score dropped 15 points this week.',
      severity: 'critical',
      time: '2 hours ago',
    },
    {
      id: 2,
      type: 'achievement',
      title: 'Sarah Johnson - Milestone Reached',
      description: 'Sarah achieved a 90+ engagement score for the month.',
      severity: 'info',
      time: '4 hours ago',
    },
    {
      id: 3,
      type: 'trend',
      title: 'Department Update - Engineering',
      description: 'Engineering team engagement is trending up by 8%.',
      severity: 'info',
      time: '1 day ago',
    },
    {
      id: 4,
      type: 'alert',
      title: 'Mike Chen - At Risk',
      description: 'Mike has been identified as at-risk based on recent patterns.',
      severity: 'warning',
      time: '2 days ago',
    },
  ]

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Blob Feed
        </h1>
        <p className="text-gray-600">
          Real-time updates on team engagement and wellbeing
        </p>
      </div>

      {/* Filter Chips */}
      <div className="mb-6 flex flex-wrap gap-2">
        <button className="px-4 py-2 bg-blob-primary text-white rounded-full text-sm font-medium hover:bg-blob-primary/90 transition-colors">
          All Events
        </button>
        <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-full text-sm font-medium hover:bg-gray-300 transition-colors">
          Alerts
        </button>
        <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-full text-sm font-medium hover:bg-gray-300 transition-colors">
          Achievements
        </button>
        <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-full text-sm font-medium hover:bg-gray-300 transition-colors">
          Trends
        </button>
      </div>

      {/* Timeline */}
      <div className="space-y-4">
        {events.map((event) => (
          <div
            key={event.id}
            className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 mt-1">
                {event.severity === 'critical' && (
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                )}
                {event.severity === 'warning' && (
                  <div className="w-3 h-3 rounded-full bg-orange-500" />
                )}
                {event.severity === 'info' && (
                  <div className="w-3 h-3 rounded-full bg-blob-primary" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900">{event.title}</h3>
                <p className="text-sm text-gray-600 mt-1">
                  {event.description}
                </p>
                <p className="text-xs text-gray-500 mt-2">{event.time}</p>
              </div>
              <button className="flex-shrink-0 text-blob-primary hover:text-blob-primary/80 font-medium text-sm">
                View
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Load More */}
      <div className="mt-8 flex justify-center">
        <button className="px-6 py-2 border border-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors">
          Load More Events
        </button>
      </div>
    </div>
  )
}
