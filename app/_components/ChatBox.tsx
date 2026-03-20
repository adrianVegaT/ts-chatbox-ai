'use client'
import { useState, useRef } from 'react'
import ReactMarkdown from 'react-markdown'
import { callAI } from '../_actions/chat'

interface AIResponse {
    text: string
    inputTokens: number
    outputTokens: number
    model: string
    stopReason: string
}

export default function ChatBox() {
    const [question, setQuestion] = useState('')
    const [response, setResponse] = useState<AIResponse | null>(null)
    const [loading, setLoading] = useState(false)
    const textareaRef = useRef<HTMLTextAreaElement>(null)

    function handleInput(e: React.ChangeEvent<HTMLTextAreaElement>) {
        setQuestion(e.target.value)

        const textarea = textareaRef.current
        if (textarea) {
            textarea.style.height = 'auto'
            textarea.style.height = textarea.scrollHeight + 'px'
        }
    }

    async function handleSubmit() {
        if (!question.trim()) return
        setLoading(true)
        const result = await callAI(question)
        setResponse(result)
        setLoading(false)
    }

    return (
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
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

            {response && (
                <div className="mt-4 space-y-3">
                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                        <div className="prose prose-sm max-w-none text-gray-800">
                            <ReactMarkdown>{response.text}</ReactMarkdown>
                        </div>
                    </div>

                    <div className="flex gap-4 px-1 text-xs text-gray-400">
                        <span>Model: <span className="text-gray-500">{response.model}</span></span>
                        <span>Input tokens: <span className="text-gray-500">{response.inputTokens}</span></span>
                        <span>Output tokens: <span className="text-gray-500">{response.outputTokens}</span></span>
                        <span>Total tokens: <span className="text-gray-500">{response.inputTokens + response.outputTokens}</span></span>
                        <span>Stop reason: <span className="text-gray-500">{response.stopReason}</span></span>
                    </div>
                </div>
            )}
        </div>
    )
}