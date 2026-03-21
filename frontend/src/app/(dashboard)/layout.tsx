'use client'

import { DashboardLayout } from '@/components/layout/DashboardLayout'

export default function DashboardRootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <DashboardLayout
      userName="Alice Johnson"
      userRole="Organization Admin"
      messageCount={0}
      notificationCount={3}
    >
      {children}
    </DashboardLayout>
  )
}
