'use server'
import Anthropic from "@anthropic-ai/sdk";

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
}

const config: ConfigAnthropic = {
    name: "My assistant",
    model: "claude-haiku-4-5-20251001"
}

export async function callAI(question: string): Promise<AIResponse> {

    const msg = await anthropic.messages.create({
        model: config.model,
        max_tokens: 1024,
        messages: [{ role: "user", content: question }]
    })

    const bloque = msg.content[0]

    return {
        text: bloque?.type === 'text' ? bloque.text : '',
        inputTokens: msg.usage.input_tokens,
        outputTokens: msg.usage.output_tokens,
        model: msg.model,
        stopReason: msg.stop_reason ?? 'unknown'
    }

}
