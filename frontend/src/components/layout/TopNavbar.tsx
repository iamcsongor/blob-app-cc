'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Search,
  MessageSquare,
  Bell,
  User,
  LogOut,
  Settings,
  ChevronDown,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface TopNavbarProps {
  userName?: string
  userRole?: string
  messageCount?: number
  notificationCount?: number
}

export function TopNavbar({
  userName = 'User',
  userRole = 'Admin',
  messageCount = 0,
  notificationCount = 3,
}: TopNavbarProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 flex items-center px-6 gap-8 z-40">
      {/* Left: Logo and Greeting */}
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-blob-primary flex-shrink-0" />
          <span className="font-bold text-lg text-gray-900">BLOB</span>
        </div>
        <div className="hidden md:block text-sm text-gray-600">
          Hi, <span className="font-medium">{userName}</span>!
        </div>
      </div>

      {/* Center: Search */}
      <div className="hidden lg:flex flex-1 max-w-md">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search employees, departments..."
            className="w-full pl-10 pr-12 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blob-primary focus:border-transparent"
          />
          <kbd className="absolute right-3 top-1/2 -translate-y-1/2 hidden sm:inline-flex items-center gap-1 px-2 py-1 bg-gray-100 border border-gray-300 rounded text-xs text-gray-600 font-mono">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-4">
        {/* Messages */}
        <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors group">
          <MessageSquare className="w-5 h-5 text-gray-600 group-hover:text-gray-900" />
          {messageCount > 0 && (
            <span className="absolute top-1 right-1 w-5 h-5 bg-blob-primary text-white text-xs rounded-full flex items-center justify-center font-medium">
              {messageCount}
            </span>
          )}
        </button>

        {/* Notifications */}
        <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors group">
          <Bell className="w-5 h-5 text-gray-600 group-hover:text-gray-900" />
          {notificationCount > 0 && (
            <span className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
              {notificationCount > 9 ? '9+' : notificationCount}
            </span>
          )}
        </button>

        {/* User Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <div className="w-8 h-8 bg-blob-primary rounded-full flex items-center justify-center text-white text-sm font-semibold">
              {userName.charAt(0).toUpperCase()}
            </div>
            <ChevronDown className="w-4 h-4 text-gray-600" />
          </button>

          {isDropdownOpen && (
            <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-50">
              <div className="px-4 py-3 border-b border-gray-200">
                <p className="font-medium text-gray-900">{userName}</p>
                <p className="text-sm text-gray-600">{userRole}</p>
              </div>
              <Link
                href="/profile"
                className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <User className="w-4 h-4" />
                Profile
              </Link>
              <Link
                href="/settings"
                className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <Settings className="w-4 h-4" />
                Settings
              </Link>
              <button className="w-full flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors text-left">
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}
