"use client"

import { useEffect, useRef } from "react"
import { Card } from "@/components/ui/card"

interface Message {
  role: "user" | "assistant"
  content: string
}

interface ChatMessagesProps {
  messages: Message[]
  isLoading: boolean
}

export function ChatMessages({ messages, isLoading }: ChatMessagesProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  return (
    <div className="flex-1 overflow-y-auto px-6 py-4">
      <div className="mx-auto max-w-2xl space-y-4">
        {messages.length === 0 && !isLoading ? (
          <div className="flex h-full items-center justify-center">
            <div className="space-y-4 text-center">
              <div className="mx-auto h-12 w-12 rounded-full bg-gradient-to-r from-green-600 to-emerald-600" />
              <div>
                <h2 className="text-xl font-semibold text-green-800">Start a conversation</h2>
                <p className="text-green-600">Ask me anything about agriculture and I'll help you out</p>
              </div>
            </div>
          </div>
        ) : null}

        {messages.map((message, index) => (
          <div key={index} className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}>
            <Card
              className={`max-w-lg border-0 px-4 py-3 ${
                message.role === "user"
                  ? "bg-gradient-to-r from-green-600 to-emerald-600 text-white"
                  : "bg-green-50 text-green-900 border border-green-200"
              }`}
            >
              {message.content}
            </Card>
          </div>
        ))}

        {isLoading ? (
          <div className="flex gap-3">
            <Card className="border-0 bg-green-50 px-4 py-3 border border-green-200">
              <div className="flex gap-1">
                <div className="h-2 w-2 rounded-full bg-green-600 animate-bounce" />
                <div className="h-2 w-2 rounded-full bg-green-600 animate-bounce" style={{ animationDelay: "0.1s" }} />
                <div className="h-2 w-2 rounded-full bg-green-600 animate-bounce" style={{ animationDelay: "0.2s" }} />
              </div>
            </Card>
          </div>
        ) : null}

        <div ref={messagesEndRef} />
      </div>
    </div>
  )
}
