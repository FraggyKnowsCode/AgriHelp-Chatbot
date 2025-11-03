"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"

interface ApiKeyFormProps {
  onSubmit: (apiKey: string) => void
}

export function ApiKeyForm({ onSubmit }: ApiKeyFormProps) {
  const [apiKey, setApiKey] = useState("")
  const [showKey, setShowKey] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (apiKey.trim()) {
      onSubmit(apiKey)
    }
  }

  return (
    <div className="flex h-screen items-center justify-center px-4 bg-gradient-to-br from-green-50 via-emerald-50 to-green-100">
      <Card className="w-full max-w-md border-green-200 bg-white/90 backdrop-blur shadow-lg">
        <div className="space-y-6 p-8">
          {/* Header */}
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold text-green-800">Agri Help</h1>
            <p className="text-green-600">Powered by TeamBen4</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-green-700">API Key</label>
              <div className="flex gap-2">
                <Input
                  type={showKey ? "text" : "password"}
                  placeholder="sk-..."
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="border-green-200 bg-green-50 text-green-900 placeholder:text-green-400"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowKey(!showKey)}
                  className="text-green-600 hover:text-green-700"
                >
                  {showKey ? "Hide" : "Show"}
                </Button>
              </div>
              <p className="text-xs text-green-600">
                Get your API key from{" "}
                <a
                  href="https://openrouter.ai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-700 hover:text-green-800 underline"
                >
                  openrouter.ai
                </a>
              </p>
            </div>

            <Button
              type="submit"
              disabled={!apiKey.trim()}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white disabled:opacity-50"
            >
              Start Chatting
            </Button>
          </form>

          {/* Info */}
          <div className="space-y-3 rounded-lg bg-green-50 p-4 border border-green-200">
            <p className="text-sm text-green-700">
              <strong>Note:</strong> Your API key is stored only in your browser and is never saved permanently.
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
}
