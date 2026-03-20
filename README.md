# AI Chatbox

A minimal Next.js 16 chat interface that connects to the Anthropic API.
Built as Week 2 of a 12-month roadmap transitioning from Laravel/PHP to AI engineering.

## What it does

- Accepts a question via an auto-resizing textarea
- Calls the Anthropic API using a Server Action
- Renders the response with full markdown formatting
- Displays token usage and model metadata for each interaction

## Tech stack

- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS v4
- Anthropic SDK (`@anthropic-ai/sdk`)
- react-markdown
- @tailwindcss/typography

## Model

Currently using `claude-haiku-4-5-20251001` — configurable in `app/_actions/chat.ts`

## Setup

1. Clone the repository
2. Install dependencies
```bash
npm install
```

3. Create a `.env.local` file in the root folder
```bash
ANTHROPIC_API_KEY=your_api_key_here
```

4. Run the development server
```bash
npm run dev
```

5. Open `http://localhost:3000`

## Project structure
```
app/
├── layout.tsx              Root layout with fonts and metadata
├── page.tsx                Home page
├── globals.css             Global styles and Tailwind configuration
├── _actions/
│   └── chat.ts             Server Action — calls Anthropic API
└── _components/
    └── ChatBox.tsx         Client Component — handles UI and interaction
.env.example                Environment variables template
```

## Context

Built as Week 2 of a 12-month roadmap transitioning from Laravel/PHP
to AI engineering — covering TypeScript, Next.js, RAG systems, and
AI agents for the international market.