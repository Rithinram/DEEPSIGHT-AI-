import { useState, useEffect } from 'react'
import { Activity, AlertTriangle, CheckCircle, Clock, TrendingUp } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ImageUpload } from '@/components/features/ImageUpload'
import { DetectionDisplay } from '@/components/features/DetectionDisplay'
import { AlertPanel } from '@/components/features/AlertPanel'
import { ResultsTable } from '@/components/features/ResultsTable'
import { DetectionResult, Alert, UploadProgress } from '@/types'
import { mockDetectionResults, mockAlerts, generateMockDetection } from '@/utils/mockData'

export function Dashboard() {
  const [results, setResults] = useState<DetectionResult[]>(mockDetectionResults)
  const [alerts, setAlerts] = useState<Alert[]>(mockAlerts)
  const [currentResult, setCurrentResult] = useState<DetectionResult | null>(null)
  const [uploadProgress, setUploadProgress] = useState<UploadProgress>({
    isUploading: false,
    progress: 0
  })

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Randomly add new detections
      if (Math.random() < 0.1) { // 10% chance every 5 seconds
        const newDetection = generateMockDetection()
        setResults(prev => [newDetection, ...prev.slice(0, 9)]) // Keep only 10 latest
        
        // Add alert if unauthorized
        if (newDetection.overallStatus === 'unauthorized') {
          const newAlert: Alert = {
            id: `alert-${Date.now()}`,
            type: 'violation',
            title: 'New Violation Detected',
            message: `Unauthorized advertisement: "${newDetection.ocrResults[0]?.text || 'Unknown'}"`,
            timestamp: new Date().toISOString(),
            imageUrl: newDetection.imageUrl,
            ocrText: newDetection.ocrResults[0]?.text,
            confidence: newDetection.ocrResults[0]?.confidence,
            isRead: false
          }
          setAlerts(prev => [newAlert, ...prev.slice(0, 19)]) // Keep only 20 latest
        }
      }
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const handleUpload = async (file: File) => {
    setUploadProgress({
      isUploading: true,
      progress: 0,
      fileName: file.name
    })

    // Simulate upload progress
    for (let i = 0; i <= 100; i += 10) {
      setUploadProgress(prev => ({ ...prev, progress: i }))
      await new Promise(resolve => setTimeout(resolve, 200))
    }

    // Simulate processing
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Generate mock result
    const newResult = generateMockDetection()
    setResults(prev => [newResult, ...prev])
    setCurrentResult(newResult)

    setUploadProgress({
      isUploading: false,
      progress: 0
    })
  }

  const handleMarkAsRead = (alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, isRead: true } : alert
    ))
  }

  const handleDismissAlert = (alertId: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== alertId))
  }

  const handleViewDetails = (result: DetectionResult) => {
    setCurrentResult(result)
  }

  // Calculate stats
  const totalDetections = results.length
  const violationsCount = results.filter(r => r.overallStatus === 'unauthorized').length
  const authorizedCount = results.filter(r => r.overallStatus === 'authorized').length
  const avgProcessingTime = results.reduce((sum, r) => sum + r.processingTime, 0) / results.length

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold gradient-text mb-2">Dashboard</h1>
        <p className="text-muted-foreground">
          Monitor unauthorized advertisements in real-time with AI-powered detection
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 glass-effect">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Activity className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Detections</p>
              <p className="text-2xl font-bold">{totalDetections}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 glass-effect">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-destructive/10 flex items-center justify-center">
              <AlertTriangle className="h-5 w-5 text-destructive" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Violations</p>
              <p className="text-2xl font-bold text-destructive">{violationsCount}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 glass-effect">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-success/10 flex items-center justify-center">
              <CheckCircle className="h-5 w-5 text-success" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Authorized</p>
              <p className="text-2xl font-bold text-success">{authorizedCount}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 glass-effect">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-warning/10 flex items-center justify-center">
              <Clock className="h-5 w-5 text-warning" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Avg. Processing</p>
              <p className="text-2xl font-bold">{avgProcessingTime.toFixed(1)}s</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left Column - Upload and Detection */}
        <div className="xl:col-span-2 space-y-6">
          <ImageUpload
            onUpload={handleUpload}
            uploadProgress={uploadProgress}
          />
          
          <DetectionDisplay result={currentResult} />
        </div>

        {/* Right Column - Alerts */}
        <div>
          <AlertPanel
            alerts={alerts}
            onMarkAsRead={handleMarkAsRead}
            onDismiss={handleDismissAlert}
            className="h-[600px]"
          />
        </div>
      </div>

      {/* Results Table */}
      <ResultsTable
        results={results}
        onViewDetails={handleViewDetails}
      />
    </div>
  )
}