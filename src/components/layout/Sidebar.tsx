import { useState } from "react"
import { AlertTriangle, Home, Settings, Upload, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
  activeTab: string
  onTabChange: (tab: string) => void
  alertCount: number
}

const navigationItems = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: Home,
    badge: null
  },
  {
    id: 'uploads',
    label: 'Uploads',
    icon: Upload,
    badge: null
  },
  {
    id: 'alerts',
    label: 'Alerts',
    icon: AlertTriangle,
    badge: 'alertCount'
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: Settings,
    badge: null
  }
]

export function Sidebar({ isOpen, onClose, activeTab, onTabChange, alertCount }: SidebarProps) {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-50 h-full w-64 transform border-r bg-card transition-all duration-300 lg:relative lg:z-auto lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full lg:w-16"
        )}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex h-16 items-center justify-between border-b px-4">
            <div className={cn("flex items-center gap-3", !isOpen && "lg:justify-center")}>
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center shadow-glow">
                <div className="h-4 w-4 rounded bg-primary-foreground" />
              </div>
              {(isOpen || window.innerWidth < 1024) && (
                <div>
                  <h2 className="text-lg font-bold gradient-text">DeepSight</h2>
                  <p className="text-xs text-muted-foreground">AI Monitoring</p>
                </div>
              )}
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={onClose}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-2 p-4">
            {navigationItems.map((item) => {
              const Icon = item.icon
              const badgeCount = item.badge === 'alertCount' ? alertCount : 0
              
              return (
                <Button
                  key={item.id}
                  variant={activeTab === item.id ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start gap-3 h-12 transition-all duration-200",
                    !isOpen && "lg:justify-center lg:px-0",
                    activeTab === item.id && "bg-primary/10 text-primary border-primary/20"
                  )}
                  onClick={() => onTabChange(item.id)}
                >
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  {(isOpen || window.innerWidth < 1024) && (
                    <>
                      <span className="flex-1 text-left">{item.label}</span>
                      {badgeCount > 0 && (
                        <Badge variant="destructive" className="ml-auto">
                          {badgeCount > 9 ? "9+" : badgeCount}
                        </Badge>
                      )}
                    </>
                  )}
                </Button>
              )
            })}
          </nav>

          {/* Footer */}
          <div className="border-t p-4">
            <div className={cn(
              "text-center text-sm text-muted-foreground",
              !isOpen && "lg:text-xs"
            )}>
              {(isOpen || window.innerWidth < 1024) ? (
                <>
                  <p className="font-medium">DeepSight v1.0</p>
                  <p>AI-Powered Monitoring</p>
                </>
              ) : (
                <p>v1.0</p>
              )}
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}