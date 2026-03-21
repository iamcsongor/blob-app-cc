'use client'

import { BarChart3, LineChart, PieChart } from 'lucide-react'

export default function AnalyticsPage() {
  const tabs = ['Reporting', 'Predictive', 'Scenarios']

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Analytics
        </h1>
        <p className="text-gray-600">
          Deep dive into engagement trends and predictive insights
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-1 mb-8 border-b border-gray-200">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`px-6 py-4 font-medium transition-colors ${
              tab === 'Reporting'
                ? 'text-blob-primary border-b-2 border-blob-primary'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content Placeholders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-4">Score Distribution</h3>
          <div className="h-64 bg-gray-50 rounded-lg border border-gray-200 flex items-center justify-center">
            <div className="text-center">
              <BarChart3 className="w-12 h-12 text-gray-300 mx-auto mb-2" />
              <p className="text-gray-500">Chart will render here</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-4">Department Breakdown</h3>
          <div className="h-64 bg-gray-50 rounded-lg border border-gray-200 flex items-center justify-center">
            <div className="text-center">
              <PieChart className="w-12 h-12 text-gray-300 mx-auto mb-2" />
              <p className="text-gray-500">Chart will render here</p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-4">Engagement Trend (12 Months)</h3>
          <div className="h-80 bg-gray-50 rounded-lg border border-gray-200 flex items-center justify-center">
            <div className="text-center">
              <LineChart className="w-12 h-12 text-gray-300 mx-auto mb-2" />
              <p className="text-gray-500">Trend chart will render here</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
