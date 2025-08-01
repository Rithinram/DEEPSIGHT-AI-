import { useCallback, useState } from 'react'
import { Upload, X, Image as ImageIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'
import { UploadProgress } from '@/types'

interface ImageUploadProps {
  onUpload: (file: File) => Promise<void>
  uploadProgress: UploadProgress
  className?: string
}

export function ImageUpload({ onUpload, uploadProgress, className }: ImageUploadProps) {
  const [dragActive, setDragActive] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }, [])

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file')
      return
    }

    // Create preview
    const reader = new FileReader()
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result as string)
    }
    reader.readAsDataURL(file)

    // Upload file
    onUpload(file)
  }, [onUpload])

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0])
    }
  }, [handleFile])

  const clearPreview = useCallback(() => {
    setPreviewUrl(null)
  }, [])

  return (
    <Card className={cn("relative overflow-hidden", className)}>
      <div className="p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Upload className="h-5 w-5 text-primary" />
          Upload Image for Analysis
        </h3>

        {/* Upload Area */}
        <div
          className={cn(
            "relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200",
            dragActive ? "border-primary bg-primary/5" : "border-border",
            uploadProgress.isUploading && "pointer-events-none opacity-50"
          )}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          {previewUrl && !uploadProgress.isUploading ? (
            <div className="relative">
              <img
                src={previewUrl}
                alt="Preview"
                className="max-w-full max-h-64 mx-auto rounded-lg shadow-medium"
              />
              <Button
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 h-8 w-8"
                onClick={clearPreview}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                <ImageIcon className="h-8 w-8 text-primary" />
              </div>
              <div>
                <p className="text-lg font-medium">
                  {uploadProgress.isUploading ? 'Processing...' : 'Drop your image here'}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  or click to browse files
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  Supports JPG, PNG, WebP up to 10MB
                </p>
              </div>
            </div>
          )}

          <input
            type="file"
            accept="image/*"
            onChange={handleInputChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            disabled={uploadProgress.isUploading}
          />
        </div>

        {/* Upload Progress */}
        {uploadProgress.isUploading && (
          <div className="mt-4 space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                {uploadProgress.fileName ? `Uploading ${uploadProgress.fileName}` : 'Processing image...'}
              </span>
              <span className="font-medium">{uploadProgress.progress}%</span>
            </div>
            <Progress value={uploadProgress.progress} className="h-2" />
          </div>
        )}
      </div>
    </Card>
  )
}