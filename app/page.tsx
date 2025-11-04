import { FloatingChatWidget } from "@/components/floating-chat-widget"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-green-100 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-green-800 mb-4">Hello</h1>
        <p className="text-2xl text-green-700">Welcome to Agri Help</p>
      </div>

      <FloatingChatWidget />
    </main>
  )
}
