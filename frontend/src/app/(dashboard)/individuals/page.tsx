'use client'

import { AlertCircle, Zap, TrendingUp, Users } from 'lucide-react'

export default function IndividualsPage() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Employee Directory
        </h1>
        <p className="text-gray-600">
          View and manage employee engagement and performance
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <p className="text-gray-600 text-sm font-medium">Total Employees</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">847</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <p className="text-gray-600 text-sm font-medium">At Risk</p>
          <p className="text-3xl font-bold text-red-600 mt-2">42</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <p className="text-gray-600 text-sm font-medium">Thriving</p>
          <p className="text-3xl font-bold text-emerald-600 mt-2">312</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <p className="text-gray-600 text-sm font-medium">Average Score</p>
          <p className="text-3xl font-bold text-blob-primary mt-2">76.4</p>
        </div>
      </div>

      {/* Employee Cards Grid Placeholder */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">All Employees</h2>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Search employees..."
              className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blob-primary"
            />
            <select className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blob-primary">
              <option>All Departments</option>
              <option>Engineering</option>
              <option>Sales</option>
              <option>Marketing</option>
              <option>Operations</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blob-primary rounded-full flex items-center justify-center text-white font-semibold">
                    {String.fromCharCode(64 + i)}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Employee Name</p>
                    <p className="text-sm text-gray-600">Department</p>
                  </div>
                </div>
                <span className="text-lg font-bold text-blob-primary">85</span>
              </div>
              <div className="h-20 bg-gray-50 rounded-lg border border-gray-200 mb-4" />
              <p className="text-xs text-gray-500 text-center">Card placeholder</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
