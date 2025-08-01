import { useState } from 'react'
import { AlertTriangle, Clock, CheckCircle2, X, Eye, EyeOff } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Alert } from '@/types'
import { cn } from '@/lib/utils'
import { formatDistanceToNow } from 'date-fns'

interface AlertPanelProps {
  alerts: Alert[]
  onMarkAsRead: (alertId: string) => void
  onDismiss: (alertId: string) => void
  className?: string
}

export function AlertPanel({ alerts, onMarkAsRead, onDismiss, className }: AlertPanelProps) {
  const [showRead, setShowRead] = useState(false)

  const filteredAlerts = showRead ? alerts : alerts.filter(alert => !alert.isRead)
  const unreadCount = alerts.filter(alert => !alert.isRead).length

  const getAlertIcon = (type: Alert['type']) => {
    switch (type) {
      case 'violation':
        return <AlertTriangle className="h-4 w-4 text-destructive" />
      case 'warning':
        return <Clock className="h-4 w-4 text-warning" />
      default:
        return <CheckCircle2 className="h-4 w-4 text-primary" />
    }
  }

  const getAlertColor = (type: Alert['type']) => {
    switch (type) {
      case 'violation':
        return 'border-l-destructive bg-destructive/5'
      case 'warning':
        return 'border-l-warning bg-warning/5'
      default:
        return 'border-l-primary bg-primary/5'
    }
  }

  return (
    <Card className={cn("flex flex-col h-full", className)}>
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold">Real-time Alerts</h3>
            {unreadCount > 0 && (
              <Badge variant="destructive" className="text-xs">
                {unreadCount} new
              </Badge>
            )}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowRead(!showRead)}
            className="gap-2"
          >
            {showRead ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            {showRead ? 'Hide Read' : 'Show All'}
          </Button>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-3">
          {filteredAlerts.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <AlertTriangle className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>{showRead ? 'No alerts found' : 'No new alerts'}</p>
            </div>
          ) : (
            filteredAlerts.map((alert) => (
              <div
                key={alert.id}
                className={cn(
                  "relative border-l-4 rounded-lg p-4 transition-all duration-200 hover:shadow-medium",
                  getAlertColor(alert.type),
                  !alert.isRead && "ring-1 ring-primary/20"
                )}
              >
                <div className="flex items-start gap-3">
                  {alert.imageUrl && (
                    <img
                      src={alert.imageUrl}
                      alt="Alert preview"
                      className="w-12 h-12 rounded-md object-cover flex-shrink-0"
                    />
                  )}
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        {getAlertIcon(alert.type)}
                        <h4 className="font-medium text-sm leading-tight">
                          {alert.title}
                        </h4>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 flex-shrink-0"
                        onClick={() => onDismiss(alert.id)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                      {alert.message}
                    </p>
                    
                    {alert.ocrText && (
                      <div className="mt-2 p-2 bg-muted/50 rounded text-xs font-mono">
                        "{alert.ocrText}"
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span>{formatDistanceToNow(new Date(alert.timestamp), { addSuffix: true })}</span>
                        {alert.confidence && (
                          <span className="font-medium">
                            {Math.round(alert.confidence * 100)}% confidence
                          </span>
                        )}
                      </div>
                      
                      {!alert.isRead && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onMarkAsRead(alert.id)}
                          className="h-7 text-xs"
                        >
                          Mark as Read
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </Card>
  )
}