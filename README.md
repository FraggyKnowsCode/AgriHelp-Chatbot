# Agri Help - Agricultural Chatbot

A floating chatbot widget powered by Agri Help that provides agricultural assistance. This is a Next.js application that can be integrated into your existing website.

## 🌾 Features

- **Floating Widget**: Unobtrusive chat button in the bottom-right corner that doesn't interrupt your website
- **Agriculture-Focused**: Only responds to agriculture-related questions
- **Persistent Storage**: API key is saved locally for a seamless experience
- **Beautiful UI**: Green and off-white agricultural theme
- **Real-time Streaming**: Responses stream in real-time for better UX
- **Formatted Responses**: Bot responses include bullet points, bold text, and headlines for readability

## 📋 Prerequisites

- **Node.js** version 18 or higher
- **npm** or **yarn** package manager
- **OpenRouter API Key** (get your free key at https://openrouter.ai)

## 🚀 Installation & Setup

### Step 1: Clone or Download the Repository

\`\`\`bash
git clone <repository-url>
cd agri-help-chatbot
\`\`\`

Or download as ZIP and extract.

### Step 2: Install Dependencies

\`\`\`bash
npm install
\`\`\`

### Use this if npm install fails, then try npm install
\`\`\`bash
npm install vaul@latest
\`\`\`

### Step 3: Run the Development Server

\`\`\`bash
npm run dev
\`\`\`

Navigate to `http://localhost:3000`

### Step 4: Get Your OpenRouter API Key

1. Visit https://openrouter.ai
2. Sign up for a free account
3. Copy your API key from the dashboard
4. Enter it in the chatbot when prompted

## 📁 Project Structure

\`\`\`
agri-help-chatbot/
├── app/
│   ├── page.tsx                 # Welcome page
│   ├── layout.tsx               # Root layout
│   ├── globals.css              # Global styles
│   └── api/
│       └── chat/
│           └── route.ts         # Chat API endpoint
├── components/
│   ├── floating-chat-widget.tsx # Main floating widget
│   ├── chat-bot.tsx             # Chat logic
│   ├── chat-messages.tsx        # Message display
│   ├── api-key-form.tsx         # API key form
│   └── ui/                      # shadcn UI components
└── README.md
\`\`\`

## 🔧 Integrating into Your Website

### Add to Your Next.js Project

1. Copy `components/floating-chat-widget.tsx` to your project
2. Copy `app/api/chat/route.ts` to your API routes
3. Import and use in any page:

\`\`\`tsx
import { FloatingChatWidget } from '@/components/floating-chat-widget'

export default function YourPage() {
  return (
    <>
      <main>{/* Your content */}</main>
      <FloatingChatWidget />
    </>
  )
}
\`\`\`

## 🔑 API Key Management

- **First Time**: Enter your OpenRouter API key in the chat form
- **Stored Locally**: Key is saved in browser's localStorage
- **Change Anytime**: Click the key icon in the chat header to update
- **Security**: Key is only used locally for API calls

## 🎨 Customization

### Change Colors

Edit `/app/globals.css` to adjust the green color palette.

### Modify Bot Behavior

Edit the system prompt in `/app/api/chat/route.ts`

### Customize Widget

Edit `/components/floating-chat-widget.tsx` to change button position, colors, or chat window size.

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| "Failed to load" | Verify your OpenRouter API key is valid |
| Chat not responding | Check API key and internet connection |
| Rate limit error | Wait a moment and try again |
|npm install fails with ERESOLVE error| This project uses React 19. A dependency (like vaul) may be on a version that doesn't support it. Try running npm install <package-name>@latest (e.g., npm install vaul@latest) and then run npm install again.|

## 🚀 Deployment

### Deploy to Vercel

\`\`\`bash
npm i -g vercel
vercel
\`\`\`

Or connect your GitHub repo to Vercel for automatic deployments.

## 📦 Build for Production

\`\`\`bash
npm run build
npm start
\`\`\`


**Happy farming!** 🌾

Agri Help - Making agriculture smarter, one chat at a time.
Powered by TeamBen4
