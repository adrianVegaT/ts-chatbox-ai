'use client'
import { useState, useRef } from 'react'
import ReactMarkdown from 'react-markdown'
import { callAI } from '../_actions/chat'
import { TOKEN_LIMIT } from '@/lib/config'

interface Message {
    id: string
    question: string
    response: string
    input_tokens: number
    output_tokens: number
    model: string
    created_at: string
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

interface ChatBoxProps {
    history: Message[]
    userId: string
    initialTokensUsed: number
}

export default function ChatBox({ history, userId, initialTokensUsed }: ChatBoxProps) {
    const [messages, setMessages] = useState<Message[]>(history)
    const [question, setQuestion] = useState('')
    const [loading, setLoading] = useState(false)
    const [tokensUsed, setTokensUsed] = useState(initialTokensUsed)
    const [error, setError] = useState('')
    const textareaRef = useRef<HTMLTextAreaElement>(null)

    const tokensRemaining = Math.max(0, TOKEN_LIMIT - tokensUsed)
    const limitReached = tokensRemaining <= 0
    const usagePercent = Math.min(100, (tokensUsed / TOKEN_LIMIT) * 100)

    function handleInput(e: React.ChangeEvent<HTMLTextAreaElement>) {
        setQuestion(e.target.value)
        const textarea = textareaRef.current
        if (textarea) {
            textarea.style.height = 'auto'
            textarea.style.height = textarea.scrollHeight + 'px'
        }
    }

    async function handleSubmit() {
        if (!question.trim() || limitReached) return
        setLoading(true)
        setError('')

        try {
            const resultado: AIResponse = await callAI(question)

            const newMessage: Message = {
                id: crypto.randomUUID(),
                question,
                response: resultado.text,
                input_tokens: resultado.inputTokens,
                output_tokens: resultado.outputTokens,
                model: resultado.model,
                created_at: new Date().toISOString()
            }

            setMessages(prev => [...prev, newMessage])
            setTokensUsed(resultado.tokensUsed)
            setQuestion('')

            if (textareaRef.current) {
                textareaRef.current.style.height = 'auto'
            }
        } catch (e: unknown) {
            if (e instanceof Error && e.message === 'Token limit reached') {
                setError('You have reached the token limit for this demo account.')
            } else {
                setError('Something went wrong. Please try again.')
            }
        }

        setLoading(false)
    }

    return (
        <div className="space-y-4">
            {messages.length > 0 && (
                <div className="space-y-4">
                    {messages.map(msg => (
                        <div key={msg.id} className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm space-y-3">
                            <p className="text-sm font-medium text-gray-800">{msg.question}</p>
                            <div className="prose prose-sm max-w-none text-gray-800">
                                <ReactMarkdown>{msg.response}</ReactMarkdown>
                            </div>
                            <div className="flex gap-4 text-xs text-gray-400">
                                <span>Model: <span className="text-gray-500">{msg.model}</span></span>
                                <span>Input: <span className="text-gray-500">{msg.input_tokens}</span></span>
                                <span>Output: <span className="text-gray-500">{msg.output_tokens}</span></span>
                                <span>Total: <span className="text-gray-500">{msg.input_tokens + msg.output_tokens}</span></span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-sm text-blue-700">
                <p className="font-medium mb-1">Demo account</p>
                <p>
                    This is a demo with a limit of{' '}
                    <span className="font-medium">{TOKEN_LIMIT} tokens</span>{' '}
                    per account. You have{' '}
                    <span className="font-medium">{tokensRemaining} tokens remaining</span>.
                </p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm space-y-3">
                <div className="flex justify-between text-xs text-gray-400 mb-1">
                    <span>Token usage</span>
                    <span>{tokensUsed} / {TOKEN_LIMIT}</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-1.5">
                    <div
                        className={`h-1.5 rounded-full transition-all ${usagePercent >= 90 ? 'bg-red-400' : usagePercent >= 70 ? 'bg-amber-400' : 'bg-gray-800'}`}
                        style={{ width: `${usagePercent}%` }}
                    />
                </div>

                {limitReached ? (
                    <p className="text-sm text-center text-gray-500 py-2">
                        You have used all your tokens for this demo account.
                    </p>
                ) : (
                    <>
                        <div className="flex gap-2 items-center">
                            <textarea
                                ref={textareaRef}
                                name="question"
                                value={question}
                                onChange={handleInput}
                                placeholder="Ask something..."
                                rows={1}
                                className="flex-1 px-4 py-2 rounded-lg border border-gray-200 text-sm text-gray-800 outline-none focus:border-gray-400 transition-colors resize-none overflow-hidden"
                            />
                            <button
                                onClick={handleSubmit}
                                disabled={loading}
                                className="px-4 py-2 bg-gray-800 text-white text-sm rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shrink-0"
                            >
                                {loading ? 'Thinking...' : 'Submit'}
                            </button>
                        </div>
                        {error && <p className="text-sm text-red-500">{error}</p>}
                    </>
                )}
            </div>
        </div>
    )
}
