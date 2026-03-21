'use client'

import { Trophy, Star } from 'lucide-react'

export default function TrophiesPage() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Trophy Cabinet
        </h1>
        <p className="text-gray-600">
          Celebrate team achievements and milestones
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Trophy Catalog */}
        <div className="lg:col-span-2">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">
            Available Trophies
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
              <div
                key={i}
                className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-all hover:scale-105 cursor-pointer"
              >
                <div className="flex items-center justify-center h-32 bg-gradient-to-br from-yellow-100 to-yellow-50 rounded-lg mb-4">
                  <Trophy className="w-12 h-12 text-yellow-600" />
                </div>
                <h3 className="font-semibold text-gray-900 text-center mb-1">
                  Trophy {i}
                </h3>
                <p className="text-xs text-gray-600 text-center">
                  {Math.floor(Math.random() * 50)} awarded
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Leaderboard Sidebar */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm h-fit">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Top Winners
          </h2>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-gray-900 w-6">
                    {i}
                  </span>
                  <div className="w-8 h-8 bg-blob-primary rounded-full" />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      Employee {i}
                    </p>
                    <p className="text-xs text-gray-600">Team Lead</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  <span className="text-sm font-semibold text-gray-900">
                    {15 - i}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
