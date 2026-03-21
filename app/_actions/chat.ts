'use server'
import Anthropic from "@anthropic-ai/sdk";
import { createClient } from '@/lib/supabase/server'
import { TOKEN_LIMIT } from '@/lib/config'

const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY
})

interface ConfigAnthropic {
    name: string,
    model: string
}

interface AIResponse {
    text: string
    inputTokens: number
    outputTokens: number
    model: string
    stopReason: string
    tokensUsed: number
    tokensRemaining: number
}

const config: ConfigAnthropic = {
    name: "My assistant",
    model: "claude-haiku-4-5-20251001"
}

export async function getTokensUsed(): Promise<number> {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return 0

    const { data } = await supabase
        .from('messages')
        .select('input_tokens, output_tokens')
        .eq('user_id', user.id)

    if (!data) return 0

    return data.reduce((acc, msg) => acc + msg.input_tokens + msg.output_tokens, 0)
}

export async function callAI(question: string): Promise<AIResponse> {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        throw new Error('Unauthorized')
    }

    const tokensUsed = await getTokensUsed()

    if (tokensUsed >= TOKEN_LIMIT) {
        throw new Error('Token limit reached')
    }

    const msg = await anthropic.messages.create({
        model: config.model,
        max_tokens: 1024,
        messages: [{ role: "user", content: question }]
    })

    const bloque = msg.content[0]
    const text = bloque?.type === 'text' ? bloque.text : ''

    const newTokensUsed = tokensUsed + msg.usage.input_tokens + msg.usage.output_tokens

    await supabase.from('messages').insert({
        user_id: user.id,
        question: question,
        response: text,
        input_tokens: msg.usage.input_tokens,
        output_tokens: msg.usage.output_tokens,
        model: msg.model
    })

    return {
        text: text,
        inputTokens: msg.usage.input_tokens,
        outputTokens: msg.usage.output_tokens,
        model: msg.model,
        stopReason: msg.stop_reason ?? 'unknown',
        tokensUsed: newTokensUsed,
        tokensRemaining: Math.max(0, TOKEN_LIMIT - newTokensUsed)
    }

}
