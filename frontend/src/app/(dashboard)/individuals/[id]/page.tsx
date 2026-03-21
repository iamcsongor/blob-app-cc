'use client'

import { ArrowLeft, BarChart3, TrendingUp } from 'lucide-react'
import Link from 'next/link'

export default function EmployeeProfilePage({
  params,
}: {
  params: { id: string }
}) {
  return (
    <div className="p-8">
      <Link
        href="/individuals"
        className="inline-flex items-center gap-2 text-blob-primary hover:text-blob-primary/80 mb-6 font-medium"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Directory
      </Link>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Employee Profile
        </h1>
        <p className="text-gray-600">
          Detailed engagement and performance analytics
        </p>
      </div>

      {/* Header Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-8 shadow-sm mb-6">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-blob-primary rounded-full flex items-center justify-center text-white text-2xl font-semibold">
              A
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Employee Name
              </h2>
              <p className="text-gray-600">Department · Team Lead</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Overall Score</p>
            <p className="text-4xl font-bold text-blob-primary">84</p>
            <p className="text-xs text-green-600 font-medium">↑ Grade A</p>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart Area */}
        <div className="lg:col-span-2 bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Score Trend (90 Days)
          </h3>
          <div className="h-80 bg-gray-50 rounded-lg border border-gray-200 flex items-center justify-center">
            <div className="text-center">
              <BarChart3 className="w-12 h-12 text-gray-300 mx-auto mb-2" />
              <p className="text-gray-500">Trend chart will render here</p>
            </div>
          </div>
        </div>

        {/* Metrics Sidebar */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Key Metrics
          </h3>
          <div className="space-y-4">
            <div className="pb-4 border-b border-gray-200">
              <p className="text-sm text-gray-600 mb-1">Engagement Volume</p>
              <p className="text-2xl font-bold text-gray-900">78</p>
            </div>
            <div className="pb-4 border-b border-gray-200">
              <p className="text-sm text-gray-600 mb-1">Reaction Time</p>
              <p className="text-2xl font-bold text-gray-900">85</p>
            </div>
            <div className="pb-4 border-b border-gray-200">
              <p className="text-sm text-gray-600 mb-1">Participation</p>
              <p className="text-2xl font-bold text-gray-900">92</p>
            </div>
            <div className="pb-4 border-b border-gray-200">
              <p className="text-sm text-gray-600 mb-1">Presence</p>
              <p className="text-2xl font-bold text-gray-900">88</p>
            </div>
            <div className="pb-4 border-b border-gray-200">
              <p className="text-sm text-gray-600 mb-1">Sentiment</p>
              <p className="text-2xl font-bold text-gray-900">81</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Social Brand Rep</p>
              <p className="text-2xl font-bold text-gray-900">76</p>
            </div>
          </div>
        </div>
      </div>

      {/* Activity Placeholder */}
      <div className="mt-6 bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Recent Activity
        </h3>
        <div className="h-48 bg-gray-50 rounded-lg border border-gray-200 flex items-center justify-center">
          <p className="text-gray-500">Activity timeline will render here</p>
        </div>
      </div>
    </div>
  )
}
