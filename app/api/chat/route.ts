import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { apiKey, messages } = await request.json()

    if (!apiKey) {
      return NextResponse.json({ error: "API key is required" }, { status: 400 })
    }

    const systemMessage = {
      role: "system",
      content: `You are Agri Help, an agricultural assistant powered by TeamBen4. Your purpose is to provide helpful advice and information ONLY about agriculture-related topics, including but not limited to: crop cultivation, farming techniques, pest management, soil health, irrigation, fertilizers, livestock management, farm equipment, agricultural best practices, crop diseases, and farming sustainability.

If a user asks a question that is NOT related to agriculture, you MUST respond with: "Sorry, I can only help you with Agricultural problems"

Always stay focused on agriculture. Do not answer general knowledge questions, technical support, or any non-agricultural topics.

IMPORTANT: Format your responses in a clear, structured way using:
- Use markdown formatting with **bold text** for important points
- Use bullet points (- ) for lists
- Use ## for section headings when appropriate
- Keep responses organized and easy to read
- Use line breaks between sections for better readability`,
    }

    const messagesWithSystem = [systemMessage, ...messages]

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
        "X-Title": "AI Chatbot",
      },
      body: JSON.stringify({
        model: "meta-llama/llama-3.1-70b-instruct",
        messages: messagesWithSystem,
        temperature: 0.7,
        max_tokens: 2048,
        stream: true,
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      console.error("OpenRouter API error:", error)

      try {
        const errorData = JSON.parse(error)
        if (errorData.error?.code === 429) {
          return NextResponse.json(
            { error: "Rate limited. Please try again shortly or check your OpenRouter plan." },
            { status: 429 },
          )
        }
      } catch {
        // Continue with generic error message
      }

      return NextResponse.json(
        { error: `API error (${response.status}): Failed to get response from AI service` },
        { status: response.status },
      )
    }

    const encoder = new TextEncoder()
    const readable = response.body

    if (!readable) {
      return NextResponse.json({ error: "No response stream" }, { status: 500 })
    }

    const transformStream = new TransformStream({
      async transform(chunk, controller) {
        const text = new TextDecoder().decode(chunk)
        const lines = text.split("\n")

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6)

            if (data === "[DONE]") {
              controller.terminate()
              return
            }

            try {
              const json = JSON.parse(data)
              const content = json.choices[0]?.delta?.content || ""
              if (content) {
                controller.enqueue(encoder.encode(content))
              }
            } catch {
              // Skip invalid JSON lines
            }
          }
        }
      },
    })

    return new NextResponse(readable.pipeThrough(transformStream), {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    })
  } catch (error) {
    console.error("Chat API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
