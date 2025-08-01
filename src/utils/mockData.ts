import { DetectionResult, Alert, BoundingBox, OCRResult } from '@/types'

// Mock detection results for demonstration
export const mockDetectionResults: DetectionResult[] = [
  {
    id: '1',
    imageUrl: 'https://images.unsplash.com/photo-1551808525-51a94da548ce?w=800&h=600&fit=crop',
    timestamp: new Date(Date.now() - 120000).toISOString(),
    overallStatus: 'unauthorized',
    processingTime: 2.3,
    boundingBoxes: [
      {
        x: 150,
        y: 100,
        width: 200,
        height: 150,
        confidence: 0.92,
        class: 'advertisement'
      },
      {
        x: 400,
        y: 200,
        width: 180,
        height: 120,
        confidence: 0.87,
        class: 'advertisement'
      }
    ],
    ocrResults: [
      {
        text: 'UNAUTHORIZED CRYPTO AD - Buy Bitcoin Now!',
        confidence: 0.94,
        isAuthorized: false,
        boundingBox: {
          x: 150,
          y: 100,
          width: 200,
          height: 150,
          confidence: 0.92,
          class: 'advertisement'
        }
      },
      {
        text: 'Nike - Just Do It',
        confidence: 0.89,
        isAuthorized: true,
        boundingBox: {
          x: 400,
          y: 200,
          width: 180,
          height: 120,
          confidence: 0.87,
          class: 'advertisement'
        }
      }
    ]
  },
  {
    id: '2',
    imageUrl: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&h=600&fit=crop',
    timestamp: new Date(Date.now() - 300000).toISOString(),
    overallStatus: 'authorized',
    processingTime: 1.8,
    boundingBoxes: [
      {
        x: 100,
        y: 50,
        width: 300,
        height: 200,
        confidence: 0.96,
        class: 'advertisement'
      }
    ],
    ocrResults: [
      {
        text: 'Coca-Cola - Taste the Feeling',
        confidence: 0.97,
        isAuthorized: true,
        boundingBox: {
          x: 100,
          y: 50,
          width: 300,
          height: 200,
          confidence: 0.96,
          class: 'advertisement'
        }
      }
    ]
  },
  {
    id: '3',
    imageUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=600&fit=crop',
    timestamp: new Date(Date.now() - 600000).toISOString(),
    overallStatus: 'unauthorized',
    processingTime: 3.1,
    boundingBoxes: [
      {
        x: 80,
        y: 120,
        width: 250,
        height: 180,
        confidence: 0.88,
        class: 'advertisement'
      }
    ],
    ocrResults: [
      {
        text: 'ILLEGAL GAMBLING SITE - WIN BIG NOW!!!',
        confidence: 0.91,
        isAuthorized: false,
        boundingBox: {
          x: 80,
          y: 120,
          width: 250,
          height: 180,
          confidence: 0.88,
          class: 'advertisement'
        }
      }
    ]
  }
]

export const mockAlerts: Alert[] = [
  {
    id: 'alert-1',
    type: 'violation',
    title: 'Unauthorized Advertisement Detected',
    message: 'Cryptocurrency advertisement found without proper licensing',
    timestamp: new Date(Date.now() - 30000).toISOString(),
    imageUrl: 'https://images.unsplash.com/photo-1551808525-51a94da548ce?w=100&h=100&fit=crop',
    ocrText: 'Buy Bitcoin Now!',
    confidence: 0.94,
    isRead: false
  },
  {
    id: 'alert-2',
    type: 'warning',
    title: 'Low Confidence Detection',
    message: 'Advertisement detected with low confidence score',
    timestamp: new Date(Date.now() - 180000).toISOString(),
    imageUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=100&h=100&fit=crop',
    ocrText: 'Unclear text detected',
    confidence: 0.62,
    isRead: false
  },
  {
    id: 'alert-3',
    type: 'violation',
    title: 'Gambling Advertisement',
    message: 'Illegal gambling content detected in urban area',
    timestamp: new Date(Date.now() - 420000).toISOString(),
    imageUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=100&h=100&fit=crop',
    ocrText: 'WIN BIG NOW!!!',
    confidence: 0.91,
    isRead: true
  }
]

export function generateMockDetection(): DetectionResult {
  const mockImages = [
    'https://images.unsplash.com/photo-1551808525-51a94da548ce?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=600&fit=crop'
  ]

  const mockTexts = [
    { text: 'McDonald\'s - I\'m Lovin\' It', authorized: true },
    { text: 'ILLEGAL CRYPTO EXCHANGE', authorized: false },
    { text: 'Starbucks Coffee', authorized: true },
    { text: 'UNAUTHORIZED GAMBLING SITE', authorized: false },
    { text: 'Apple - Think Different', authorized: true }
  ]

  const randomText = mockTexts[Math.floor(Math.random() * mockTexts.length)]
  const confidence = 0.7 + Math.random() * 0.3

  return {
    id: `detection-${Date.now()}`,
    imageUrl: mockImages[Math.floor(Math.random() * mockImages.length)],
    timestamp: new Date().toISOString(),
    overallStatus: randomText.authorized ? 'authorized' : 'unauthorized',
    processingTime: 1 + Math.random() * 3,
    boundingBoxes: [
      {
        x: 50 + Math.random() * 200,
        y: 50 + Math.random() * 150,
        width: 150 + Math.random() * 200,
        height: 100 + Math.random() * 150,
        confidence,
        class: 'advertisement'
      }
    ],
    ocrResults: [
      {
        text: randomText.text,
        confidence,
        isAuthorized: randomText.authorized,
        boundingBox: {
          x: 50 + Math.random() * 200,
          y: 50 + Math.random() * 150,
          width: 150 + Math.random() * 200,
          height: 100 + Math.random() * 150,
          confidence,
          class: 'advertisement'
        }
      }
    ]
  }
}