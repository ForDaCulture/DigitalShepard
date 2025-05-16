import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

interface LevelProgressProps {
  level: number
  currentXP: number
  requiredXP: number
  className?: string
}

export function LevelProgress({
  level,
  currentXP,
  requiredXP,
  className,
}: LevelProgressProps) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const percentage = (currentXP / requiredXP) * 100
    setProgress(percentage)
  }, [currentXP, requiredXP])

  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex justify-between text-sm">
        <div className="font-medium">Level {level}</div>
        <div className="text-gray-500">
          {currentXP} / {requiredXP} XP
        </div>
      </div>
      <div className="relative h-2 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
        <div
          className="absolute h-full bg-gradient-to-r from-brand-500 to-brand-400 transition-all duration-500 ease-out"
          style={{ width: `${Math.min(100, progress)}%` }}
        />
      </div>
      {progress >= 100 && (
        <div className="animate-fade-in text-sm font-medium text-brand-500">
          Level Up Available!
        </div>
      )}
    </div>
  )
} 