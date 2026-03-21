'use client'

import { DashboardLayout } from '@/components/layout/DashboardLayout'

export default function DashboardRootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <DashboardLayout
      userName="Csongor"
      userRole="Human Resources Officer"
      messageCount={4}
      notificationCount={1}
    >
      {children}
    </DashboardLayout>
  )
}
