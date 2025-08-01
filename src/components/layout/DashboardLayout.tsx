import { useState, useEffect } from 'react'
import { Header } from './Header'
import { Sidebar } from './Sidebar'
import { useTheme } from '@/hooks/useTheme'
import { Alert } from '@/types'
import { mockAlerts } from '@/utils/mockData'

interface DashboardLayoutProps {
  children: React.ReactNode
  activeTab: string
  onTabChange: (tab: string) => void
}

export function DashboardLayout({ children, activeTab, onTabChange }: DashboardLayoutProps) {
  const { isDark, toggleTheme } = useTheme()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [alerts, setAlerts] = useState<Alert[]>(mockAlerts)

  const unreadAlertCount = alerts.filter(alert => !alert.isRead).length

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  // Close sidebar on route change (mobile)
  useEffect(() => {
    setSidebarOpen(false)
  }, [activeTab])

  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      {/* Header */}
      <Header
        isDark={isDark}
        onToggleTheme={toggleTheme}
        onToggleSidebar={toggleSidebar}
        alertCount={unreadAlertCount}
      />

      <div className="flex h-[calc(100vh-4rem)]">
        {/* Sidebar */}
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          activeTab={activeTab}
          onTabChange={onTabChange}
          alertCount={unreadAlertCount}
        />

        {/* Main content */}
        <main className="flex-1 overflow-auto bg-background">
          <div className="container mx-auto p-4 lg:p-6 max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}