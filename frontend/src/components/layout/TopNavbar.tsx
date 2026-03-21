'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Search,
  MessageSquare,
  Bell,
  User,
  LogOut,
  Settings,
  ChevronDown,
  ChevronLeft,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface TopNavbarProps {
  userName?: string
  userRole?: string
  messageCount?: number
  notificationCount?: number
  onCollapseClick?: () => void
}

export function TopNavbar({
  userName = 'Csongor',
  userRole = 'Human Resources Officer',
  messageCount = 0,
  notificationCount = 2,
  onCollapseClick,
}: TopNavbarProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 flex items-center px-6 gap-6 z-40">
      {/* Left: Collapse button and Greeting */}
      <div className="flex items-center gap-4 flex-1 min-w-0">
        <button
          onClick={onCollapseClick}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-600 hover:text-gray-900"
          title="Collapse sidebar"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div className="flex flex-col gap-0.5">
          <span className="text-sm font-medium text-gray-900">
            Hi, {userName}!
          </span>
          <span className="text-xs text-gray-500">
            Let's see what we can accomplish today
          </span>
        </div>
      </div>

      {/* Center: Search */}
      <div className="hidden lg:flex flex-1 max-w-md">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            className="w-full pl-10 pr-12 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blob-primary focus:border-transparent"
          />
          <kbd className="absolute right-3 top-1/2 -translate-y-1/2 hidden sm:inline-flex items-center gap-1 px-2 py-1 bg-gray-100 border border-gray-300 rounded text-xs text-gray-600 font-mono">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Right: Actions and User Menu */}
      <div className="flex items-center gap-2">
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
        <div className="relative ml-2">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <div className="flex flex-col items-end">
              <span className="text-sm font-medium text-gray-900">
                {userName}
              </span>
              <span className="text-xs text-gray-500">
                {userRole}
              </span>
            </div>
            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
              {userName.charAt(0).toUpperCase()}
            </div>
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </button>

          {isDropdownOpen && (
            <div className="absolute top-full right-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
              <div className="px-4 py-3 border-b border-gray-200">
                <p className="font-medium text-gray-900">{userName}</p>
                <p className="text-sm text-gray-600">{userRole}</p>
              </div>
              <Link
                href="/profile"
                className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <User className="w-4 h-4" />
                <span>Profile</span>
              </Link>
              <Link
                href="/settings"
                className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <Settings className="w-4 h-4" />
                <span>Settings</span>
              </Link>
              <button className="w-full flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors text-left border-t border-gray-200">
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}
