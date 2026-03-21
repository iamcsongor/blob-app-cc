'use client'

import { Camera } from 'lucide-react'

export default function ProfilePage() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Profile</h1>
        <p className="text-gray-600">Manage your account information and preferences</p>
      </div>

      <div className="max-w-2xl">
        <div className="bg-white rounded-lg border border-gray-200 p-8 shadow-sm">
          {/* Profile Picture */}
          <div className="mb-8 flex items-center gap-6">
            <div className="relative">
              <div className="w-20 h-20 bg-blob-primary rounded-full flex items-center justify-center text-white text-2xl font-semibold">
                AJ
              </div>
              <button className="absolute bottom-0 right-0 p-2 bg-white border border-gray-200 rounded-full shadow-sm hover:bg-gray-50">
                <Camera className="w-4 h-4 text-gray-700" />
              </button>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Profile Picture</h3>
              <p className="text-sm text-gray-600">JPG, PNG or GIF. Max 5MB.</p>
            </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  First Name
                </label>
                <input
                  type="text"
                  defaultValue="Alice"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blob-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name
                </label>
                <input
                  type="text"
                  defaultValue="Johnson"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blob-primary"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                defaultValue="alice@acme.com"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blob-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Role
              </label>
              <select className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blob-primary">
                <option>Organization Admin</option>
                <option>Department Manager</option>
                <option>Team Lead</option>
                <option>Executive Viewer</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Department
              </label>
              <input
                type="text"
                defaultValue="Leadership"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blob-primary"
              />
            </div>

            <div className="pt-4 border-t border-gray-200">
              <button className="px-6 py-2 bg-blob-primary text-white rounded-lg font-medium hover:bg-blob-primary/90 transition-colors">
                Save Changes
              </button>
            </div>
          </div>

          {/* Password Section */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-4">Change Password</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Password
                </label>
                <input
                  type="password"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blob-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blob-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password
                </label>
                <input
                  type="password"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blob-primary"
                />
              </div>
              <button className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors">
                Update Password
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
