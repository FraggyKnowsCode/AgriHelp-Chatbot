"use client"

import { useEffect, useRef } from "react"
import { Card } from "@/components/ui/card"
import type { JSX } from "react/jsx-runtime"

interface Message {
  role: "user" | "assistant"
  content: string
}

interface ChatMessagesProps {
  messages: Message[]
  isLoading: boolean
}

function renderMarkdown(text: string) {
  // Parse markdown and convert to JSX elements
  const lines = text.split("\n")
  const elements: JSX.Element[] = []

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]

    // Handle headings (##)
    if (line.startsWith("## ")) {
      elements.push(
        <h3 key={`heading-${i}`} className="font-bold text-lg text-green-900 mt-2 mb-1">
          {line.slice(3)}
        </h3>,
      )
    }
    // Handle bold text and bullet points
    else if (line.startsWith("- ")) {
      const content = line.slice(2)
      // Replace **text** with bold spans
      const parts = content.split(/\*\*(.*?)\*\*/g)
      elements.push(
        <li key={`bullet-${i}`} className="ml-4 text-green-900">
          {parts.map((part, idx) => (idx % 2 === 1 ? <strong key={idx}>{part}</strong> : part))}
        </li>,
      )
    } else if (line.trim()) {
      // Handle regular text with bold formatting
      const parts = line.split(/\*\*(.*?)\*\*/g)
      elements.push(
        <p key={`text-${i}`} className="text-green-900 mb-1">
          {parts.map((part, idx) => (idx % 2 === 1 ? <strong key={idx}>{part}</strong> : part))}
        </p>,
      )
    } else {
      // Empty line for spacing
      elements.push(<div key={`space-${i}`} className="h-1" />)
    }
  }

  return <div className="space-y-1">{elements}</div>
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
              {message.role === "assistant" ? renderMarkdown(message.content) : message.content}
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
