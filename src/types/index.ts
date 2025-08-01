export interface BoundingBox {
  x: number
  y: number
  width: number
  height: number
  confidence: number
  class: string
}

export interface OCRResult {
  text: string
  confidence: number
  isAuthorized: boolean
  boundingBox: BoundingBox
}

export interface DetectionResult {
  id: string
  imageUrl: string
  timestamp: string
  boundingBoxes: BoundingBox[]
  ocrResults: OCRResult[]
  overallStatus: 'authorized' | 'unauthorized' | 'pending'
  processingTime: number
}

export interface Alert {
  id: string
  type: 'violation' | 'warning' | 'info'
  title: string
  message: string
  timestamp: string
  imageUrl?: string
  ocrText?: string
  confidence?: number
  isRead: boolean
}

export interface UploadProgress {
  isUploading: boolean
  progress: number
  fileName?: string
}

export interface Theme {
  isDark: boolean
}