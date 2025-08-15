
'use client'

import { useChat } from '@ai-sdk/react'
import { ChatContainer } from '@/components/features/chat/chat-container'
import { MessageList } from '@/components/features/chat/message-list'
import { ChatInput } from '@/components/features/chat/chat-input'

export default function ChatPage() {
  const { messages, isLoading, append, setMessages, error } = useChat({
    api: '/api/chat',
    onError: (error) => {
      console.error('Chat error:', error)
    },
  })

  const handleSendMessage = (message: string) => {
    append({
      role: 'user',
      content: message,
    })
  }

  const handleClearChat = () => {
    setMessages([])
  }

  return (
    <main className="container mx-auto max-w-4xl px-4 py-8 h-screen">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">AI 对话</h1>
        <p className="text-muted-foreground">与AI进行自然对话</p>
        {error && (
          <div className="mt-2 p-2 bg-destructive/10 border border-destructive/20 rounded-md">
            <p className="text-sm text-destructive">
              连接错误: {error.message}
            </p>
          </div>
        )}
      </div>
      
      <ChatContainer className="h-[calc(100vh-200px)]">
        <MessageList 
          messages={messages} 
          isLoading={isLoading}
          className="flex-1"
        />
        <ChatInput 
          onSendMessage={handleSendMessage}
          onClearChat={handleClearChat}
          isLoading={isLoading}
        />
      </ChatContainer>
    </main>
  )
}
