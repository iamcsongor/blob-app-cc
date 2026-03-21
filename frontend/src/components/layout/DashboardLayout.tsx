'use client'

import { useState, createContext, useContext } from 'react'
import { TopNavbar } from './TopNavbar'
import { LeftSidebar } from './LeftSidebar'
import { cn } from '@/lib/utils'

interface SidebarContextType {
  isCollapsed: boolean
  setIsCollapsed: (collapsed: boolean) => void
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined)

export function useSidebar() {
  const context = useContext(SidebarContext)
  if (!context) {
    throw new Error('useSidebar must be used within DashboardLayout')
  }
  return context
}

interface DashboardLayoutProps {
  children: React.ReactNode
  userName?: string
  userRole?: string
  messageCount?: number
  notificationCount?: number
}

export function DashboardLayout({
  children,
  userName = 'User',
  userRole = 'Admin',
  messageCount = 0,
  notificationCount = 3,
}: DashboardLayoutProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
    <SidebarContext.Provider value={{ isCollapsed, setIsCollapsed }}>
      <div className="min-h-screen bg-gray-50">
        <TopNavbar
          userName={userName}
          userRole={userRole}
          messageCount={messageCount}
          notificationCount={notificationCount}
        />
        <LeftSidebar onCollapsedChange={setIsCollapsed} />

        {/* Main Content Area */}
        <main
          className={cn(
            'transition-all duration-300',
            isCollapsed ? 'ml-20' : 'ml-64',
            'mt-16'
          )}
        >
          {children}
        </main>
      </div>
    </SidebarContext.Provider>
  )
}
