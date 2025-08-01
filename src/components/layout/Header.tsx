import { Bell, Menu, Search, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { Badge } from "@/components/ui/badge"

interface HeaderProps {
  isDark: boolean
  onToggleTheme: () => void
  onToggleSidebar: () => void
  alertCount: number
}

export function Header({ isDark, onToggleTheme, onToggleSidebar, alertCount }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center gap-4 px-4 lg:px-6">
        {/* Mobile menu button */}
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={onToggleSidebar}
        >
          <Menu className="h-5 w-5" />
        </Button>

        {/* Logo and title */}
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center shadow-glow">
            <div className="h-4 w-4 rounded bg-primary-foreground" />
          </div>
          <div className="hidden sm:block">
            <h1 className="text-xl font-bold gradient-text">DeepSight</h1>
            <p className="text-xs text-muted-foreground">AI Advertisement Monitoring</p>
          </div>
        </div>

        {/* Search bar */}
        <div className="flex-1 max-w-md mx-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search detections, alerts..."
              className="pl-10 bg-muted/50 border-border/50 focus:bg-background"
            />
          </div>
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-2">
          {/* Notifications */}
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            {alertCount > 0 && (
              <Badge
                variant="destructive"
                className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs"
              >
                {alertCount > 9 ? "9+" : alertCount}
              </Badge>
            )}
          </Button>

          {/* Theme toggle */}
          <ThemeToggle isDark={isDark} onToggle={onToggleTheme} />

          {/* User profile */}
          <Button variant="ghost" size="icon">
            <User className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  )
}