import { useState } from 'react'
import { AlertTriangle, TrendingUp, Activity, Filter } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { AlertPanel } from '@/components/features/AlertPanel'
import { Alert } from '@/types'
import { mockAlerts } from '@/utils/mockData'

export function Alerts() {
  const [alerts, setAlerts] = useState<Alert[]>(mockAlerts)
  const [filterType, setFilterType] = useState<string>('all')

  const handleMarkAsRead = (alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, isRead: true } : alert
    ))
  }

  const handleDismissAlert = (alertId: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== alertId))
  }

  const handleMarkAllAsRead = () => {
    setAlerts(prev => prev.map(alert => ({ ...alert, isRead: true })))
  }

  const filteredAlerts = filterType === 'all' 
    ? alerts 
    : alerts.filter(alert => alert.type === filterType)

  const unreadCount = alerts.filter(alert => !alert.isRead).length
  const violationCount = alerts.filter(alert => alert.type === 'violation').length
  const warningCount = alerts.filter(alert => alert.type === 'warning').length

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold gradient-text mb-2">Alert Center</h1>
          <p className="text-muted-foreground">
            Monitor and manage real-time alerts from advertisement violations
          </p>
        </div>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Filter className="h-4 w-4" />
                Filter: {filterType === 'all' ? 'All' : filterType}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setFilterType('all')}>
                All Alerts
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterType('violation')}>
                Violations Only
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterType('warning')}>
                Warnings Only
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterType('info')}>
                Info Only
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          {unreadCount > 0 && (
            <Button onClick={handleMarkAllAsRead}>
              Mark All as Read ({unreadCount})
            </Button>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 glass-effect">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-destructive/10 flex items-center justify-center">
              <AlertTriangle className="h-5 w-5 text-destructive" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Alerts</p>
              <p className="text-2xl font-bold">{alerts.length}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 glass-effect">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-warning/10 flex items-center justify-center">
              <Activity className="h-5 w-5 text-warning" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Unread</p>
              <p className="text-2xl font-bold text-warning">{unreadCount}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 glass-effect">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-destructive/10 flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-destructive" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Violations</p>
              <p className="text-2xl font-bold text-destructive">{violationCount}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Alert Types Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-destructive">Violations</h3>
              <p className="text-2xl font-bold text-destructive">{violationCount}</p>
            </div>
            <Badge variant="destructive">{violationCount}</Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            Unauthorized advertisements detected
          </p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-warning">Warnings</h3>
              <p className="text-2xl font-bold text-warning">{warningCount}</p>
            </div>
            <Badge className="bg-warning text-warning-foreground">{warningCount}</Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            Low confidence or suspicious detections
          </p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-primary">Info</h3>
              <p className="text-2xl font-bold text-primary">
                {alerts.filter(a => a.type === 'info').length}
              </p>
            </div>
            <Badge variant="secondary">
              {alerts.filter(a => a.type === 'info').length}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            System notifications and updates
          </p>
        </Card>
      </div>

      {/* Alert Panel */}
      <AlertPanel
        alerts={filteredAlerts}
        onMarkAsRead={handleMarkAsRead}
        onDismiss={handleDismissAlert}
        className="min-h-[600px]"
      />
    </div>
  )
}