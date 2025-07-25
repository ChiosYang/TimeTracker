'use client'

import { useEffect, useRef } from 'react'
import { Message } from 'ai'
import { MessageItem } from './message-item'
import { cn } from '@/lib/utils'

interface MessageListProps {
  messages: Message[]
  isLoading?: boolean
  className?: string
}

export function MessageList({ messages, isLoading, className }: MessageListProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  // 自动滚动到底部
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, isLoading])

  if (messages.length === 0) {
    return (
      <div className={cn(
        'flex flex-1 items-center justify-center text-muted-foreground',
        className
      )}>
        <div className="text-center">
          <p className="text-lg font-medium">开始新对话</p>
          <p className="text-sm">输入消息开始与AI对话</p>
        </div>
      </div>
    )
  }

  return (
    <div
      ref={scrollRef}
      className={cn(
        'flex-1 space-y-2 overflow-y-auto scroll-smooth',
        className
      )}
    >
      {messages.map((message) => (
        <MessageItem key={message.id} message={message} />
      ))}
      
      {isLoading && (
        <div className="flex gap-3 p-4">
          <div className="size-8 shrink-0 rounded-full bg-secondary animate-pulse" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-muted rounded animate-pulse" />
            <div className="h-4 bg-muted rounded w-2/3 animate-pulse" />
          </div>
        </div>
      )}
    </div>
  )
}