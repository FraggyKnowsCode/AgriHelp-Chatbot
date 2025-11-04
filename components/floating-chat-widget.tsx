"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ChatMessages } from "./chat-messages"
import { ApiKeyForm } from "./api-key-form"
import { Send, AlertCircle, Key, X, MessageCircle } from "lucide-react"

interface Message {
  role: "user" | "assistant"
  content: string
}

export function FloatingChatWidget() {
  const [apiKey, setApiKey] = useState("")
  const [isClient, setIsClient] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showApiKeyDialog, setShowApiKeyDialog] = useState(false)
  const [tempApiKey, setTempApiKey] = useState("")
  const [showKey, setShowKey] = useState(false)

  useEffect(() => {
    setIsClient(true)
    const savedApiKey = localStorage.getItem("openrouter_api_key")
    if (savedApiKey) {
      setApiKey(savedApiKey)
    }
  }, [])

  const handleApiKeySubmit = (key: string) => {
    localStorage.setItem("openrouter_api_key", key)
    setApiKey(key)
    setMessages([])
    setInput("")
    setError(null)
    setShowApiKeyDialog(false)
  }

  const handleChangeApiKey = () => {
    setTempApiKey(apiKey)
    setShowApiKeyDialog(true)
    setShowKey(false)
  }

  const handleUpdateApiKey = (e: React.FormEvent) => {
    e.preventDefault()
    if (tempApiKey.trim()) {
      handleApiKeySubmit(tempApiKey)
    }
  }

  const handleClearApiKey = () => {
    localStorage.removeItem("openrouter_api_key")
    setApiKey("")
    setMessages([])
    setInput("")
    setError(null)
    setShowApiKeyDialog(false)
    setIsOpen(false)
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || !apiKey || isLoading) return

    const userMessage = input
    setInput("")
    setError(null)
    const newMessages = [...messages, { role: "user", content: userMessage }]
    setMessages(newMessages)
    setIsLoading(true)

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          apiKey,
          messages: newMessages,
        }),
      })

      if (!response.ok) {
        let errorMsg = "Failed to send message"
        if (response.status === 429) {
          errorMsg = "Rate limited. Please try again shortly or upgrade your plan."
        } else if (response.status === 401) {
          errorMsg = "Invalid API key. Please check and try again."
        } else if (response.status === 500) {
          errorMsg = "Server error. Please try again later."
        }
        setError(errorMsg)
        throw new Error(errorMsg)
      }

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()

      if (!reader) throw new Error("No response stream")

      let assistantMessage = ""
      setMessages((prev) => [...prev, { role: "assistant", content: "" }])

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value)
        assistantMessage += chunk

        setMessages((prev) => {
          const updated = [...prev]
          const lastMessage = updated[updated.length - 1]
          if (lastMessage && lastMessage.role === "assistant") {
            lastMessage.content = assistantMessage
          }
          return updated
        })
      }
    } catch (error) {
      console.error("Error:", error)
      const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred"
      setError(errorMessage)
      setMessages((prev) => [...prev, { role: "assistant", content: `Error: ${errorMessage}` }])
    } finally {
      setIsLoading(false)
    }
  }

  if (!isClient) return null

  return (
    <>
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg hover:shadow-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-200"
        >
          <MessageCircle className="h-6 w-6" />
        </button>
      )}

      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 flex w-full max-w-sm flex-col rounded-2xl border border-green-200 bg-white shadow-2xl h-[600px] overflow-hidden">
          {/* Header */}
          <div className="border-b border-green-200 bg-gradient-to-r from-green-50 to-emerald-50 px-4 py-3 flex items-center justify-between">
            <div>
              <h1 className="text-lg font-bold text-green-800">Agri Help</h1>
              <p className="text-xs text-green-600">Powered by TeamBen4</p>
            </div>
            <div className="flex gap-2">
              {apiKey && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleChangeApiKey}
                  className="h-8 w-8 p-0 text-green-600 hover:text-green-700 hover:bg-green-100"
                >
                  <Key className="h-4 w-4" />
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="h-8 w-8 p-0 text-green-600 hover:text-green-700 hover:bg-green-100"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Error message */}
          {error && (
            <div className="border-b border-red-200 bg-red-50 px-4 py-2">
              <div className="flex gap-2 items-center text-red-700">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                <p className="text-xs">{error}</p>
              </div>
            </div>
          )}

          {/* Content */}
          {!apiKey ? (
            <div className="flex-1 overflow-auto p-4">
              <ApiKeyForm onSubmit={handleApiKeySubmit} />
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-auto">
                <ChatMessages messages={messages} isLoading={isLoading} />
              </div>

              {/* Input */}
              <form
                onSubmit={handleSendMessage}
                className="border-t border-green-200 bg-white/80 px-4 py-3 backdrop-blur"
              >
                <div className="flex gap-2">
                  <Input
                    placeholder="Ask Agri Help..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    disabled={isLoading}
                    className="flex-1 h-9 text-sm border-green-200 bg-green-50 text-green-900 placeholder:text-green-400"
                  />
                  <Button
                    type="submit"
                    disabled={isLoading || !input.trim()}
                    size="sm"
                    className="gap-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
                  >
                    <Send className="h-3 w-3" />
                  </Button>
                </div>
              </form>
            </>
          )}

          {/* API Key Dialog */}
          {showApiKeyDialog && (
            <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm p-4 rounded-2xl">
              <div className="w-full space-y-4 rounded-lg border border-green-200 bg-white p-6 shadow-lg">
                <div className="space-y-1">
                  <h2 className="text-lg font-bold text-green-800">Update API Key</h2>
                  <p className="text-xs text-green-600">Change your OpenRouter API key</p>
                </div>

                <form onSubmit={handleUpdateApiKey} className="space-y-3">
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-green-700">API Key</label>
                    <div className="flex gap-2">
                      <Input
                        type={showKey ? "text" : "password"}
                        placeholder="sk-..."
                        value={tempApiKey}
                        onChange={(e) => setTempApiKey(e.target.value)}
                        className="h-9 text-sm border-green-200 bg-green-50 text-green-900 placeholder:text-green-400"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowKey(!showKey)}
                        className="text-xs text-green-600 hover:text-green-700"
                      >
                        {showKey ? "Hide" : "Show"}
                      </Button>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      type="submit"
                      disabled={!tempApiKey.trim()}
                      size="sm"
                      className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white text-sm"
                    >
                      Update
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setShowApiKeyDialog(false)}
                      className="border-green-200 text-green-600 hover:bg-green-50"
                    >
                      Cancel
                    </Button>
                  </div>

                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleClearApiKey}
                    className="w-full text-xs text-red-600 hover:bg-red-50 hover:text-red-700"
                  >
                    Clear & Logout
                  </Button>
                </form>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  )
}
