import { useState } from 'react'
import { ChevronDown, ChevronUp, Filter, MoreHorizontal, Download, Eye } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { DetectionResult } from '@/types'
import { cn } from '@/lib/utils'
import { formatDistanceToNow } from 'date-fns'

interface ResultsTableProps {
  results: DetectionResult[]
  onViewDetails: (result: DetectionResult) => void
  className?: string
}

type SortField = 'timestamp' | 'confidence' | 'status'
type SortDirection = 'asc' | 'desc'

export function ResultsTable({ results, onViewDetails, className }: ResultsTableProps) {
  const [sortField, setSortField] = useState<SortField>('timestamp')
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('desc')
    }
  }

  const filteredAndSortedResults = results
    .filter(result => {
      if (filterStatus !== 'all' && result.overallStatus !== filterStatus) return false
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase()
        return result.ocrResults.some(ocr => 
          ocr.text.toLowerCase().includes(searchLower)
        )
      }
      return true
    })
    .sort((a, b) => {
      let comparison = 0
      
      switch (sortField) {
        case 'timestamp':
          comparison = new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
          break
        case 'confidence':
          const avgConfidenceA = a.ocrResults.reduce((sum, ocr) => sum + ocr.confidence, 0) / a.ocrResults.length
          const avgConfidenceB = b.ocrResults.reduce((sum, ocr) => sum + ocr.confidence, 0) / b.ocrResults.length
          comparison = avgConfidenceA - avgConfidenceB
          break
        case 'status':
          comparison = a.overallStatus.localeCompare(b.overallStatus)
          break
      }
      
      return sortDirection === 'asc' ? comparison : -comparison
    })

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

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return null
    return sortDirection === 'asc' ? 
      <ChevronUp className="h-4 w-4" /> : 
      <ChevronDown className="h-4 w-4" />
  }

  return (
    <Card className={cn("flex flex-col", className)}>
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Detection History</h3>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="flex items-center gap-4">
          <div className="flex-1 max-w-md">
            <Input
              placeholder="Search OCR text..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <Filter className="h-4 w-4" />
                Status: {filterStatus === 'all' ? 'All' : filterStatus}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setFilterStatus('all')}>
                All Statuses
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterStatus('authorized')}>
                Authorized
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterStatus('unauthorized')}>
                Unauthorized
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterStatus('pending')}>
                Pending
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-20">Image</TableHead>
              <TableHead>OCR Text</TableHead>
              <TableHead 
                className="cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => handleSort('confidence')}
              >
                <div className="flex items-center gap-2">
                  Confidence
                  <SortIcon field="confidence" />
                </div>
              </TableHead>
              <TableHead 
                className="cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => handleSort('status')}
              >
                <div className="flex items-center gap-2">
                  Status
                  <SortIcon field="status" />
                </div>
              </TableHead>
              <TableHead 
                className="cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => handleSort('timestamp')}
              >
                <div className="flex items-center gap-2">
                  Timestamp
                  <SortIcon field="timestamp" />
                </div>
              </TableHead>
              <TableHead className="w-16">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAndSortedResults.map((result) => {
              const avgConfidence = result.ocrResults.reduce((sum, ocr) => sum + ocr.confidence, 0) / result.ocrResults.length
              const mainText = result.ocrResults[0]?.text || 'No text detected'
              
              return (
                <TableRow key={result.id} className="hover:bg-muted/30 transition-colors">
                  <TableCell>
                    <img
                      src={result.imageUrl}
                      alt="Detection"
                      className="w-12 h-12 rounded-md object-cover"
                    />
                  </TableCell>
                  <TableCell>
                    <div className="max-w-xs">
                      <p className="truncate font-medium">{mainText}</p>
                      {result.ocrResults.length > 1 && (
                        <p className="text-sm text-muted-foreground">
                          +{result.ocrResults.length - 1} more
                        </p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <span className={cn(
                        "font-medium",
                        avgConfidence >= 0.8 ? "text-success" :
                        avgConfidence >= 0.6 ? "text-warning" : "text-destructive"
                      )}>
                        {Math.round(avgConfidence * 100)}%
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(result.overallStatus)}>
                      {result.overallStatus}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-muted-foreground">
                      {formatDistanceToNow(new Date(result.timestamp), { addSuffix: true })}
                    </div>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => onViewDetails(result)}>
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>

        {filteredAndSortedResults.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Eye className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No detection results found</p>
          </div>
        )}
      </div>
    </Card>
  )
}