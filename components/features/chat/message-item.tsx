import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'
import { Message } from 'ai'

interface MessageItemProps {
  message: Message
  className?: string
}

export function MessageItem({ message, className }: MessageItemProps) {
  const isUser = message.role === 'user'
  const isAssistant = message.role === 'assistant'

  return (
    <div
      className={cn(
        'flex gap-3 p-4',
        isUser && 'flex-row-reverse bg-muted/30',
        className
      )}
    >
      <Avatar className="size-8 shrink-0">
        <AvatarFallback className={cn(
          isUser && 'bg-primary text-primary-foreground',
          isAssistant && 'bg-secondary text-secondary-foreground'
        )}>
          {isUser ? '你' : 'AI'}
        </AvatarFallback>
      </Avatar>
      
      <div className={cn(
        'flex-1 space-y-1',
        isUser && 'text-right'
      )}>
        <div className={cn(
          'inline-block max-w-[80%] rounded-lg px-3 py-2 text-sm',
          isUser 
            ? 'bg-primary text-primary-foreground ml-auto' 
            : 'bg-muted text-muted-foreground'
        )}>
          <div className="whitespace-pre-wrap break-words">
            {message.content}
          </div>
        </div>
        
        <div className={cn(
          'text-xs text-muted-foreground',
          isUser && 'text-right'
        )}>
          {new Date(message.createdAt || Date.now()).toLocaleTimeString('zh-CN', {
            hour: '2-digit',
            minute: '2-digit'
          })}
        </div>
      </div>
    </div>
  )
}