'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import {
  LayoutDashboard,
  Users,
  Target,
  Trophy,
  Rss,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface NavItem {
  label: string
  href: string
  icon: React.ReactNode
  badge?: number
}

const navItems: NavItem[] = [
  {
    label: 'Dashboard',
    href: '/',
    icon: <LayoutDashboard className="w-5 h-5" />,
  },
  {
    label: 'Individuals',
    href: '/individuals',
    icon: <Users className="w-5 h-5" />,
  },
  {
    label: 'Programs',
    href: '/programs',
    icon: <Target className="w-5 h-5" />,
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
  {
    label: 'Settings',
    href: '/settings',
    icon: <Settings className="w-5 h-5" />,
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
        'fixed left-0 top-16 bottom-0 bg-blob-dark text-white transition-all duration-300 ease-out z-30',
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

      {/* Navigation Items */}
      <nav className="pt-6 px-3 space-y-2">
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
            <span className={cn('flex-shrink-0', isCollapsed ? '' : '')}>
              {item.icon}
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

      {/* Watchlist Section */}
      {!isCollapsed && (
        <>
          <div className="mt-8 px-3">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
              Watchlist
            </h3>
            <div className="space-y-2 min-h-20">
              {/* Empty watchlist placeholder */}
              <p className="text-xs text-gray-500 italic">
                No employees on watchlist yet
              </p>
            </div>
          </div>

          {/* Blob GPT Card */}
          <div className="mt-8 mx-3 p-4 bg-blob-surface border border-blob-border rounded-lg">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-blob-primary" />
              <span className="text-sm font-medium">Blob GPT</span>
            </div>
            <p className="text-xs text-gray-400 mb-3">
              Ask me anything about your team...
            </p>
            <input
              type="text"
              placeholder="Ask a question..."
              className="w-full px-3 py-2 bg-blob-dark border border-blob-border rounded-lg text-xs text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blob-primary"
            />
          </div>
        </>
      )}

      {/* Sign Out Button */}
      {!isCollapsed && (
        <div className="absolute bottom-6 left-3 right-3">
          <button className="w-full px-3 py-2 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-lg font-medium text-sm transition-colors">
            Sign Out
          </button>
        </div>
      )}
    </aside>
  )
}
