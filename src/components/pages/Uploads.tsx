import { useState } from 'react'
import { Upload, FileImage, Clock, CheckCircle, XCircle } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ImageUpload } from '@/components/features/ImageUpload'
import { DetectionDisplay } from '@/components/features/DetectionDisplay'
import { DetectionResult, UploadProgress } from '@/types'
import { mockDetectionResults, generateMockDetection } from '@/utils/mockData'
import { formatDistanceToNow } from 'date-fns'

export function Uploads() {
  const [results, setResults] = useState<DetectionResult[]>(mockDetectionResults)
  const [selectedResult, setSelectedResult] = useState<DetectionResult | null>(null)
  const [uploadProgress, setUploadProgress] = useState<UploadProgress>({
    isUploading: false,
    progress: 0
  })

  const handleUpload = async (file: File) => {
    setUploadProgress({
      isUploading: true,
      progress: 0,
      fileName: file.name
    })

    // Simulate upload progress
    for (let i = 0; i <= 100; i += 5) {
      setUploadProgress(prev => ({ ...prev, progress: i }))
      await new Promise(resolve => setTimeout(resolve, 100))
    }

    // Simulate processing
    await new Promise(resolve => setTimeout(resolve, 2000))

    // Generate mock result
    const newResult = generateMockDetection()
    setResults(prev => [newResult, ...prev])
    setSelectedResult(newResult)

    setUploadProgress({
      isUploading: false,
      progress: 0
    })
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'authorized':
        return <CheckCircle className="h-4 w-4 text-success" />
      case 'unauthorized':
        return <XCircle className="h-4 w-4 text-destructive" />
      default:
        return <Clock className="h-4 w-4 text-warning" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'authorized':
        return 'bg-success text-success-foreground'
      case 'unauthorized':
        return 'bg-destructive text-destructive-foreground'
      default:
        return 'bg-warning text-warning-foreground'
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold gradient-text mb-2">Image Uploads</h1>
        <p className="text-muted-foreground">
          Upload images for AI-powered advertisement detection and analysis
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left Column - Upload and History */}
        <div className="space-y-6">
          <ImageUpload
            onUpload={handleUpload}
            uploadProgress={uploadProgress}
          />

          {/* Upload History */}
          <Card>
            <div className="p-4 border-b">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <FileImage className="h-5 w-5 text-primary" />
                Recent Uploads
              </h3>
            </div>
            <div className="p-4 space-y-3 max-h-96 overflow-y-auto">
              {results.slice(0, 10).map((result) => (
                <div
                  key={result.id}
                  className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-muted/50 cursor-pointer transition-colors"
                  onClick={() => setSelectedResult(result)}
                >
                  <img
                    src={result.imageUrl}
                    alt="Upload"
                    className="w-12 h-12 rounded-md object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(result.overallStatus)}
                      <Badge className={getStatusColor(result.overallStatus)}>
                        {result.overallStatus}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {formatDistanceToNow(new Date(result.timestamp), { addSuffix: true })}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {result.ocrResults.length} detection{result.ocrResults.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right Column - Detection Display */}
        <div className="xl:col-span-2">
          <DetectionDisplay result={selectedResult} />
          
          {selectedResult && (
            <Card className="mt-6">
              <div className="p-4 border-b">
                <h3 className="text-lg font-semibold">Detection Details</h3>
              </div>
              <div className="p-4 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Upload Time</p>
                    <p className="text-sm">
                      {new Date(selectedResult.timestamp).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Processing Time</p>
                    <p className="text-sm">{selectedResult.processingTime.toFixed(1)} seconds</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Detections</p>
                    <p className="text-sm">{selectedResult.boundingBoxes.length} advertisement(s)</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">OCR Results</p>
                    <p className="text-sm">{selectedResult.ocrResults.length} text extraction(s)</p>
                  </div>
                </div>

                {/* OCR Results */}
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Extracted Text</p>
                  <div className="space-y-2">
                    {selectedResult.ocrResults.map((ocr, index) => (
                      <div
                        key={index}
                        className="p-3 rounded-lg border border-border bg-muted/30"
                      >
                        <div className="flex items-start justify-between">
                          <p className="text-sm font-medium">{ocr.text}</p>
                          <Badge
                            variant={ocr.isAuthorized ? "default" : "destructive"}
                            className="ml-2"
                          >
                            {ocr.isAuthorized ? "Authorized" : "Unauthorized"}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          Confidence: {Math.round(ocr.confidence * 100)}%
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}