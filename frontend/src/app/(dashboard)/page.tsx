'use client'

import { BarChart3, TrendingUp, AlertCircle, Zap } from 'lucide-react'

export default function DashboardPage() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Company Dashboard
        </h1>
        <p className="text-gray-600">
          Monitor your workforce health and engagement metrics
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total Employees</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">847</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Zap className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">At Risk</p>
              <p className="text-2xl font-bold text-red-600 mt-2">42</p>
              <p className="text-xs text-gray-500 mt-1">5% of workforce</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Thriving</p>
              <p className="text-2xl font-bold text-emerald-600 mt-2">312</p>
              <p className="text-xs text-gray-500 mt-1">37% of workforce</p>
            </div>
            <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-emerald-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Avg Score</p>
              <p className="text-2xl font-bold text-blob-primary mt-2">76.4</p>
              <p className="text-xs text-gray-500 mt-1">↑ 2.1% from last week</p>
            </div>
            <div className="w-12 h-12 bg-blob-primary/10 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-blob-primary" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Scatter Plot Placeholder */}
        <div className="lg:col-span-2 bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Engagement vs Sentiment Analysis
          </h2>
          <div className="h-96 bg-gray-50 rounded-lg border border-gray-200 flex items-center justify-center">
            <div className="text-center">
              <BarChart3 className="w-12 h-12 text-gray-300 mx-auto mb-2" />
              <p className="text-gray-500">Scatter plot will render here</p>
            </div>
          </div>
        </div>

        {/* Timeline Placeholder */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Trend (30 Days)
          </h2>
          <div className="h-96 bg-gray-50 rounded-lg border border-gray-200 flex items-center justify-center">
            <div className="text-center">
              <TrendingUp className="w-12 h-12 text-gray-300 mx-auto mb-2" />
              <p className="text-gray-500">Timeline chart here</p>
            </div>
          </div>
        </div>
      </div>

      {/* Department Table Placeholder */}
      <div className="mt-6 bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Department Performance
        </h2>
        <div className="h-64 bg-gray-50 rounded-lg border border-gray-200 flex items-center justify-center">
          <p className="text-gray-500">Department table will render here</p>
        </div>
      </div>
    </div>
  )
}
