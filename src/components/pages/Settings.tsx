import { useState } from 'react'
import { Settings as SettingsIcon, Bell, Camera, Database, Shield, Cpu } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Slider } from '@/components/ui/slider'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'

export function Settings() {
  const [settings, setSettings] = useState({
    notifications: {
      realTimeAlerts: true,
      emailNotifications: false,
      soundAlerts: true,
      alertThreshold: [0.8],
    },
    detection: {
      confidenceThreshold: [0.7],
      maxDetections: 10,
      autoUpload: false,
      processingMode: 'balanced',
    },
    api: {
      endpoint: 'https://api.deepsight.local',
      timeout: 30,
      retryAttempts: 3,
    },
    ui: {
      darkMode: true,
      animations: true,
      compactView: false,
    }
  })

  const updateSetting = (category: string, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [key]: value
      }
    }))
  }

  const resetToDefaults = () => {
    setSettings({
      notifications: {
        realTimeAlerts: true,
        emailNotifications: false,
        soundAlerts: true,
        alertThreshold: [0.8],
      },
      detection: {
        confidenceThreshold: [0.7],
        maxDetections: 10,
        autoUpload: false,
        processingMode: 'balanced',
      },
      api: {
        endpoint: 'https://api.deepsight.local',
        timeout: 30,
        retryAttempts: 3,
      },
      ui: {
        darkMode: true,
        animations: true,
        compactView: false,
      }
    })
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold gradient-text mb-2">Settings</h1>
          <p className="text-muted-foreground">
            Configure your DeepSight AI monitoring preferences and system behavior
          </p>
        </div>
        <Button variant="outline" onClick={resetToDefaults}>
          Reset to Defaults
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Notifications Settings */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Bell className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold">Notifications</h2>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="realtime-alerts">Real-time Alerts</Label>
                <p className="text-sm text-muted-foreground">
                  Receive instant notifications for violations
                </p>
              </div>
              <Switch
                id="realtime-alerts"
                checked={settings.notifications.realTimeAlerts}
                onCheckedChange={(value) => updateSetting('notifications', 'realTimeAlerts', value)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="email-notifications">Email Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Send alerts to your email address
                </p>
              </div>
              <Switch
                id="email-notifications"
                checked={settings.notifications.emailNotifications}
                onCheckedChange={(value) => updateSetting('notifications', 'emailNotifications', value)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="sound-alerts">Sound Alerts</Label>
                <p className="text-sm text-muted-foreground">
                  Play sound when violations are detected
                </p>
              </div>
              <Switch
                id="sound-alerts"
                checked={settings.notifications.soundAlerts}
                onCheckedChange={(value) => updateSetting('notifications', 'soundAlerts', value)}
              />
            </div>

            <Separator />

            <div>
              <Label>Alert Threshold</Label>
              <p className="text-sm text-muted-foreground mb-2">
                Minimum confidence score to trigger alerts: {Math.round(settings.notifications.alertThreshold[0] * 100)}%
              </p>
              <Slider
                value={settings.notifications.alertThreshold}
                onValueChange={(value) => updateSetting('notifications', 'alertThreshold', value)}
                max={1}
                min={0.1}
                step={0.1}
                className="w-full"
              />
            </div>
          </div>
        </Card>

        {/* Detection Settings */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Camera className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold">Detection</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <Label>Confidence Threshold</Label>
              <p className="text-sm text-muted-foreground mb-2">
                Minimum confidence for valid detections: {Math.round(settings.detection.confidenceThreshold[0] * 100)}%
              </p>
              <Slider
                value={settings.detection.confidenceThreshold}
                onValueChange={(value) => updateSetting('detection', 'confidenceThreshold', value)}
                max={1}
                min={0.1}
                step={0.05}
                className="w-full"
              />
            </div>

            <div>
              <Label htmlFor="max-detections">Max Detections per Image</Label>
              <Input
                id="max-detections"
                type="number"
                value={settings.detection.maxDetections}
                onChange={(e) => updateSetting('detection', 'maxDetections', parseInt(e.target.value))}
                min={1}
                max={50}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="processing-mode">Processing Mode</Label>
              <Select
                value={settings.detection.processingMode}
                onValueChange={(value) => updateSetting('detection', 'processingMode', value)}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fast">Fast - Lower accuracy, faster processing</SelectItem>
                  <SelectItem value="balanced">Balanced - Good accuracy and speed</SelectItem>
                  <SelectItem value="accurate">Accurate - Higher accuracy, slower processing</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="auto-upload">Auto Upload</Label>
                <p className="text-sm text-muted-foreground">
                  Automatically process uploaded images
                </p>
              </div>
              <Switch
                id="auto-upload"
                checked={settings.detection.autoUpload}
                onCheckedChange={(value) => updateSetting('detection', 'autoUpload', value)}
              />
            </div>
          </div>
        </Card>

        {/* API Settings */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Database className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold">API Configuration</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="api-endpoint">API Endpoint</Label>
              <Input
                id="api-endpoint"
                value={settings.api.endpoint}
                onChange={(e) => updateSetting('api', 'endpoint', e.target.value)}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="api-timeout">Request Timeout (seconds)</Label>
              <Input
                id="api-timeout"
                type="number"
                value={settings.api.timeout}
                onChange={(e) => updateSetting('api', 'timeout', parseInt(e.target.value))}
                min={5}
                max={300}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="retry-attempts">Retry Attempts</Label>
              <Input
                id="retry-attempts"
                type="number"
                value={settings.api.retryAttempts}
                onChange={(e) => updateSetting('api', 'retryAttempts', parseInt(e.target.value))}
                min={0}
                max={10}
                className="mt-1"
              />
            </div>

            <div className="p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-success animate-pulse"></div>
                <span className="text-sm font-medium">API Status: Connected</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Last checked: 2 minutes ago
              </p>
            </div>
          </div>
        </Card>

        {/* UI Settings */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <SettingsIcon className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold">User Interface</h2>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="animations">Animations</Label>
                <p className="text-sm text-muted-foreground">
                  Enable smooth transitions and animations
                </p>
              </div>
              <Switch
                id="animations"
                checked={settings.ui.animations}
                onCheckedChange={(value) => updateSetting('ui', 'animations', value)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="compact-view">Compact View</Label>
                <p className="text-sm text-muted-foreground">
                  Use smaller spacing and condensed layout
                </p>
              </div>
              <Switch
                id="compact-view"
                checked={settings.ui.compactView}
                onCheckedChange={(value) => updateSetting('ui', 'compactView', value)}
              />
            </div>

            <Separator />

            <div className="space-y-2">
              <Label>Performance</Label>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Memory Usage:</span>
                  <Badge variant="outline">42 MB</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">CPU Usage:</span>
                  <Badge variant="outline">12%</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Cache Size:</span>
                  <Badge variant="outline">156 MB</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Uptime:</span>
                  <Badge variant="outline">2h 34m</Badge>
                </div>
              </div>
              <Button variant="outline" size="sm" className="w-full mt-2">
                Clear Cache
              </Button>
            </div>
          </div>
        </Card>
      </div>

      {/* Save Settings */}
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold">Save Settings</h3>
            <p className="text-sm text-muted-foreground">
              Settings are automatically saved when changed
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">Export Config</Button>
            <Button>Save All Changes</Button>
          </div>
        </div>
      </Card>
    </div>
  )
}