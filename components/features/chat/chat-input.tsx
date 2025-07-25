'use client'

import { useState, KeyboardEvent } from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface ChatInputProps {
  onSendMessage: (message: string) => void
  onClearChat?: () => void
  isLoading?: boolean
  className?: string
}

export function ChatInput({ onSendMessage, onClearChat, isLoading, className }: ChatInputProps) {
  const [input, setInput] = useState('')

  const handleSubmit = () => {
    if (!input.trim() || isLoading) return
    
    onSendMessage(input.trim())
    setInput('')
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  return (
    <div className={cn('border-t bg-background p-4', className)}>
      <div className="flex gap-2">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="输入消息... (按 Enter 发送，Shift + Enter 换行)"
          className={cn(
            'flex-1 min-h-[60px] max-h-[120px] resize-none rounded-md border border-input bg-background px-3 py-2 text-sm',
            'placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
            'disabled:cursor-not-allowed disabled:opacity-50'
          )}
          disabled={isLoading}
        />
        
        <div className="flex flex-col gap-2">
          {onClearChat && (
            <Button
              onClick={onClearChat}
              variant="outline"
              size="sm"
              disabled={isLoading}
              className="whitespace-nowrap"
            >
              清空对话
            </Button>
          )}
          <Button
            onClick={handleSubmit}
            disabled={!input.trim() || isLoading}
            size="lg"
            className="whitespace-nowrap"
          >
            {isLoading ? '发送中...' : '发送'}
          </Button>
        </div>
      </div>
    </div>
  )
}