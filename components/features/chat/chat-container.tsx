'use client'

import { ReactNode } from 'react'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface ChatContainerProps {
  children: ReactNode
  className?: string
}

export function ChatContainer({ children, className }: ChatContainerProps) {
  return (
    <div className={cn('flex h-full max-h-[80vh] flex-col', className)}>
      <Card className="flex flex-1 flex-col overflow-hidden">
        {children}
      </Card>
    </div>
  )
}