'use client'

import { Target, Users, TrendingUp } from 'lucide-react'

export default function ProgramsPage() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Wellness Programs
        </h1>
        <p className="text-gray-600">
          Create and manage employee engagement and development programs
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Active Programs</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">8</p>
            </div>
            <div className="w-12 h-12 bg-blob-primary/10 rounded-lg flex items-center justify-center">
              <Target className="w-6 h-6 text-blob-primary" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total Enrolled</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">562</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Avg Progress</p>
              <p className="text-3xl font-bold text-blob-primary mt-2">67%</p>
            </div>
            <div className="w-12 h-12 bg-blob-primary/10 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-blob-primary" />
            </div>
          </div>
        </div>
      </div>

      {/* Programs Grid Placeholder */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">All Programs</h2>
          <button className="px-4 py-2 bg-blob-primary text-white rounded-lg font-medium hover:bg-blob-primary/90 transition-colors">
            Create Program
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <h3 className="font-semibold text-gray-900 mb-2">
                Program {i}: Wellness Initiative
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Brief description of the program and its objectives.
              </p>
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-gray-600">
                    Progress
                  </span>
                  <span className="text-xs font-semibold text-gray-900">67%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blob-primary h-2 rounded-full"
                    style={{ width: '67%' }}
                  />
                </div>
              </div>
              <div className="flex items-center justify-between text-xs text-gray-600">
                <span>45 enrolled</span>
                <span className="text-blob-primary font-medium">View →</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
