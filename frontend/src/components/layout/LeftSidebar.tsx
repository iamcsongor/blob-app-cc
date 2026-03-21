'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import {
  LayoutDashboard,
  Users,
  Trophy,
  Rss,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Plus,
  LogIn,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface NavItem {
  label: string
  href: string
  icon: React.ReactNode
  badge?: number
  showSparkle?: boolean
}

const navItems: NavItem[] = [
  {
    label: 'Dashboard',
    href: '/',
    icon: <LayoutDashboard className="w-5 h-5" />,
    showSparkle: true,
  },
  {
    label: 'Individuals',
    href: '/individuals',
    icon: <Users className="w-5 h-5" />,
    showSparkle: true,
  },
  {
    label: 'Trophies',
    href: '/trophies',
    icon: <Trophy className="w-5 h-5" />,
  },
  {
    label: 'Feed',
    href: '/feed',
    icon: <Rss className="w-5 h-5" />,
    badge: 2,
  },
  {
    label: 'Analytics',
    href: '/analytics',
    icon: <BarChart3 className="w-5 h-5" />,
  },
]

interface LeftSidebarProps {
  onCollapsedChange?: (collapsed: boolean) => void
}

export function LeftSidebar({ onCollapsedChange }: LeftSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const pathname = usePathname()

  const handleCollapse = (collapsed: boolean) => {
    setIsCollapsed(collapsed)
    onCollapsedChange?.(collapsed)
  }

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/'
    }
    return pathname.startsWith(href)
  }

  return (
    <aside
      className={cn(
        'fixed left-0 top-16 bottom-0 bg-blob-dark text-white transition-all duration-300 ease-out z-30 flex flex-col',
        isCollapsed ? 'w-20' : 'w-64'
      )}
    >
      {/* Collapse Button */}
      <button
        onClick={() => handleCollapse(!isCollapsed)}
        className="absolute -right-3 top-4 bg-blob-dark border border-blob-border rounded-full p-1 hover:bg-blob-surface transition-colors z-10"
      >
        {isCollapsed ? (
          <ChevronRight className="w-4 h-4" />
        ) : (
          <ChevronLeft className="w-4 h-4" />
        )}
      </button>

      {/* Logo - Only visible when expanded */}
      {!isCollapsed && (
        <div className="px-6 py-6 border-b border-blob-border">
          <span className="text-xl font-bold text-white tracking-tight">BLOB</span>
        </div>
      )}

      {/* Navigation Items */}
      <nav className={cn('space-y-2', isCollapsed ? 'px-3 py-6' : 'px-3 py-6')}>
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 relative group',
              isActive(item.href)
                ? 'bg-blob-primary text-white'
                : 'text-gray-400 hover:text-white hover:bg-blob-surface'
            )}
            title={isCollapsed ? item.label : undefined}
          >
            <span className="flex-shrink-0 flex items-center gap-2">
              {item.icon}
              {item.showSparkle && !isCollapsed && (
                <span className="text-sm">✦</span>
              )}
            </span>
            {!isCollapsed && (
              <>
                <span className="flex-1 font-medium text-sm">{item.label}</span>
                {item.badge && (
                  <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-semibold bg-red-500 rounded-full">
                    {item.badge}
                  </span>
                )}
              </>
            )}

            {/* Collapsed Tooltip */}
            {isCollapsed && (
              <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                {item.label}
              </div>
            )}
          </Link>
        ))}
      </nav>

      {/* Scrollable Middle Section */}
      <div className="flex-1 overflow-y-auto">
        {/* Watchlist Section */}
        {!isCollapsed && (
          <div className="px-6 py-4 border-t border-blob-border">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
              Watchlist
            </h3>
            <div className="space-y-3">
              {/* Example watchlist items */}
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-blob-primary flex-shrink-0 flex items-center justify-center text-xs font-bold text-white">
                  JD
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">John Doe</p>
                  <p className="text-xs text-blob-primary">+36%</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-blob-surface flex-shrink-0 flex items-center justify-center text-xs font-bold text-white">
                  SM
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">Sarah Miller</p>
                  <p className="text-xs text-red-400">-12%</p>
                </div>
              </div>
            </div>
            {/* Add user button */}
            <button className="w-full mt-4 flex items-center justify-center gap-2 px-3 py-2 border border-blob-border rounded-lg text-gray-400 hover:text-white hover:bg-blob-surface transition-colors text-sm">
              <Plus className="w-4 h-4" />
              Add user
            </button>
          </div>
        )}
      </div>

      {/* Blob GPT Card and Sign Out - Fixed at bottom */}
      {!isCollapsed && (
        <div className="border-t border-blob-border px-3 py-4 space-y-4">
          {/* Blob GPT Card */}
          <div className="p-4 bg-gradient-to-br from-purple-900 to-purple-800 rounded-lg border border-purple-700">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-white" />
              <span className="text-sm font-medium text-white">Blob GPT</span>
            </div>
            <p className="text-xs text-gray-300 mb-3 leading-relaxed">
              Ask me anything...
            </p>
            <div className="relative">
              <input
                type="text"
                placeholder="Ask..."
                className="w-full px-3 py-2 bg-purple-950 border border-purple-700 rounded-lg text-xs text-white placeholder-purple-400 focus:outline-none focus:ring-2 focus:ring-blob-primary"
              />
              <button className="absolute right-1.5 top-1/2 -translate-y-1/2 px-2 py-1 bg-blob-primary text-white text-xs font-medium rounded hover:bg-blob-primary/90 transition-colors">
                Type here
              </button>
            </div>
          </div>

          {/* Sign Out Button */}
          <button className="w-full flex items-center justify-center gap-2 px-3 py-2 text-gray-400 hover:text-white transition-colors text-sm">
            <LogIn className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      )}
    </aside>
  )
}
