# AI Chatbox

A Next.js 16 chat interface connected to the Anthropic API with authentication
and persistent chat history. Built as part of a 12-month roadmap transitioning
from Laravel/PHP to AI engineering.

## What it does

- Requires authentication before accessing the chat
- Accepts a question via an auto-resizing textarea
- Calls the Anthropic API using a Server Action
- Renders the response with full markdown formatting
- Displays token usage and model metadata for each interaction
- Persists chat history across sessions using Supabase
- Enforces a configurable token limit per account
- Each user can only see their own messages (Row Level Security)

## Tech stack

- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS v4
- Supabase (PostgreSQL + Auth)
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

3. Create a Supabase project at `supabase.com` and run this SQL in the SQL Editor:
```sql
CREATE TABLE messages (
    id              uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id         uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    question        text NOT NULL,
    response        text NOT NULL,
    input_tokens    int NOT NULL DEFAULT 0,
    output_tokens   int NOT NULL DEFAULT 0,
    model           text NOT NULL,
    created_at      timestamptz DEFAULT now()
);

ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users see own messages"
ON messages FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);
```

4. Create a `.env.local` file in the root folder
```bash
ANTHROPIC_API_KEY=your_api_key_here
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
TOKEN_LIMIT=2000
```

5. Run the development server
```bash
npm run dev
```

6. Open `http://localhost:3000`

## Project structure
```
app/
├── auth/
│   ├── login/
│   │   └── page.tsx            Login page
│   ├── register/
│   │   └── page.tsx            Register page
│   └── logout/
│       └── route.ts            Logout route handler
├── _actions/
│   └── chat.ts                 Server Action — calls Anthropic API, saves to DB
├── _components/
│   ├── ChatBox.tsx             Client Component — chat UI and token tracking
│   ├── LoginForm.tsx           Client Component — login form
│   └── RegisterForm.tsx        Client Component — register form
├── globals.css                 Global styles and Tailwind configuration
├── layout.tsx                  Root layout with fonts and metadata
└── page.tsx                    Home page — protected, loads chat history
lib/
├── config.ts                   Shared configuration (TOKEN_LIMIT)
└── supabase/
    ├── client.ts               Supabase browser client
    └── server.ts               Supabase server client
proxy.ts                        Session refresh on every request
.env.example                    Environment variables template
```

## Context

Built across Weeks 2 and 3 of a 12-month roadmap transitioning from Laravel/PHP
to AI engineering — covering TypeScript, Next.js, RAG systems, and
AI agents for the international market.