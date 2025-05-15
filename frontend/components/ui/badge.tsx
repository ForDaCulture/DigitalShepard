'use client';

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "bg-brand-100 text-brand-800 hover:bg-brand-200",
        secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200",
        success: "bg-green-100 text-green-800 hover:bg-green-200",
        destructive: "bg-red-100 text-red-800 hover:bg-red-200",
        warning: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
        info: "bg-blue-100 text-blue-800 hover:bg-blue-200",
        outline: "border border-current",
      },
      severity: {
        low: "bg-green-100 text-green-800 hover:bg-green-200",
        medium: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
        high: "bg-red-100 text-red-800 hover:bg-red-200",
        critical: "bg-purple-100 text-purple-800 hover:bg-purple-200",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  icon?: React.ReactNode
}

function Badge({ className, variant, severity, icon, children, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant, severity }), className)} {...props}>
      {icon && <span className="mr-1 -ml-0.5 h-3.5 w-3.5">{icon}</span>}
      {children}
    </div>
  )
}

export { Badge, badgeVariants } 