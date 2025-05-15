import { Card, CardHeader, CardContent, CardFooter } from '../ui/card'
import { Badge } from '../ui/badge'
import { AlertTriangle, Shield, Clock } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

interface ThreatCardProps {
  title: string
  description: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  timestamp: Date
  riskScore: number
  category: string
  className?: string
}

export function ThreatCard({
  title,
  description,
  severity,
  timestamp,
  riskScore,
  category,
  className,
}: ThreatCardProps) {
  const getSeverityIcon = () => {
    switch (severity) {
      case 'critical':
        return <AlertTriangle className="h-4 w-4 text-purple-600" />
      case 'high':
        return <AlertTriangle className="h-4 w-4 text-red-600" />
      case 'medium':
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />
      default:
        return <Shield className="h-4 w-4 text-green-600" />
    }
  }

  return (
    <Card className="animate-fade-in overflow-hidden transition-all hover:shadow-lg">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {getSeverityIcon()}
            <h3 className="font-semibold">{title}</h3>
          </div>
          <Badge severity={severity} className="capitalize">
            {severity}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Badge variant="secondary">Risk Score: {riskScore}%</Badge>
          <Badge variant="outline">{category}</Badge>
        </div>
      </CardContent>
      <CardFooter>
        <div className="flex items-center text-sm text-gray-500">
          <Clock className="mr-1 h-4 w-4" />
          {formatDistanceToNow(timestamp, { addSuffix: true })}
        </div>
      </CardFooter>
    </Card>
  )
} 