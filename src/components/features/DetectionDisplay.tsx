import { useState } from 'react'
import { Eye, ZoomIn, ZoomOut, RotateCcw, Download } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { DetectionResult } from '@/types'
import { cn } from '@/lib/utils'

interface DetectionDisplayProps {
  result: DetectionResult | null
  className?: string
}

export function DetectionDisplay({ result, className }: DetectionDisplayProps) {
  const [zoom, setZoom] = useState(1)
  const [showBoxes, setShowBoxes] = useState(true)

  if (!result) {
    return (
      <Card className={cn("h-96 flex items-center justify-center", className)}>
        <div className="text-center text-muted-foreground">
          <Eye className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>Upload an image to see detection results</p>
        </div>
      </Card>
    )
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

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-success'
    if (confidence >= 0.6) return 'text-warning'
    return 'text-destructive'
  }

  return (
    <Card className={cn("overflow-hidden", className)}>
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h3 className="text-lg font-semibold">Detection Results</h3>
            <Badge className={getStatusColor(result.overallStatus)}>
              {result.overallStatus.toUpperCase()}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowBoxes(!showBoxes)}
            >
              <Eye className="h-4 w-4 mr-2" />
              {showBoxes ? 'Hide' : 'Show'} Boxes
            </Button>
            <Button variant="outline" size="sm" onClick={() => setZoom(Math.max(0.5, zoom - 0.2))}>
              <ZoomOut className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={() => setZoom(Math.min(2, zoom + 0.2))}>
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={() => setZoom(1)}>
              <RotateCcw className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="relative bg-muted/30 overflow-auto max-h-[600px]">
        <div className="relative inline-block min-w-full">
          <img
            src={result.imageUrl}
            alt="Detection result"
            className="block w-full h-auto"
            style={{ transform: `scale(${zoom})`, transformOrigin: 'top left' }}
          />
          
          {/* Bounding boxes overlay */}
          {showBoxes && (
            <TooltipProvider>
              {result.ocrResults.map((ocr, index) => (
                <Tooltip key={index}>
                  <TooltipTrigger asChild>
                    <div
                      className={cn(
                        "absolute border-2 cursor-pointer transition-all duration-200 hover:shadow-lg",
                        ocr.isAuthorized ? "detection-box authorized" : "detection-box unauthorized"
                      )}
                      style={{
                        left: `${(ocr.boundingBox.x / 800) * 100}%`,
                        top: `${(ocr.boundingBox.y / 600) * 100}%`,
                        width: `${(ocr.boundingBox.width / 800) * 100}%`,
                        height: `${(ocr.boundingBox.height / 600) * 100}%`,
                        transform: `scale(${zoom})`,
                        transformOrigin: 'top left'
                      }}
                    >
                      {/* Confidence badge */}
                      <Badge
                        className={cn(
                          "absolute -top-6 left-0 text-xs",
                          ocr.isAuthorized ? "bg-success" : "bg-destructive"
                        )}
                      >
                        {Math.round(ocr.confidence * 100)}%
                      </Badge>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="max-w-xs">
                    <div className="space-y-2">
                      <p className="font-medium">OCR Text:</p>
                      <p className="text-sm">{ocr.text}</p>
                      <div className="flex items-center justify-between text-xs">
                        <span className={getConfidenceColor(ocr.confidence)}>
                          Confidence: {Math.round(ocr.confidence * 100)}%
                        </span>
                        <Badge
                          variant={ocr.isAuthorized ? "default" : "destructive"}
                          className="text-xs"
                        >
                          {ocr.isAuthorized ? "Authorized" : "Unauthorized"}
                        </Badge>
                      </div>
                    </div>
                  </TooltipContent>
                </Tooltip>
              ))}
            </TooltipProvider>
          )}
        </div>
      </div>

      {/* Results summary */}
      <div className="p-4 border-t bg-muted/30">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Processing Time</p>
            <p className="font-semibold">{result.processingTime.toFixed(1)}s</p>
          </div>
          <div>
            <p className="text-muted-foreground">Detections</p>
            <p className="font-semibold">{result.boundingBoxes.length}</p>
          </div>
          <div>
            <p className="text-muted-foreground">OCR Results</p>
            <p className="font-semibold">{result.ocrResults.length}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Violations</p>
            <p className="font-semibold text-destructive">
              {result.ocrResults.filter(ocr => !ocr.isAuthorized).length}
            </p>
          </div>
        </div>
      </div>
    </Card>
  )
}