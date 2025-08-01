import { useState } from 'react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Dashboard } from '@/components/pages/Dashboard'
import { Uploads } from '@/components/pages/Uploads'
import { Alerts } from '@/components/pages/Alerts'
import { Settings } from '@/components/pages/Settings'

const Index = () => {
  const [activeTab, setActiveTab] = useState('dashboard')

  const renderContent = () => {
    switch (activeTab) {
      case 'uploads':
        return <Uploads />
      case 'alerts':
        return <Alerts />
      case 'settings':
        return <Settings />
      default:
        return <Dashboard />
    }
  }

  return (
    <DashboardLayout 
      activeTab={activeTab} 
      onTabChange={setActiveTab}
    >
      {renderContent()}
    </DashboardLayout>
  )
}

export default Index;
