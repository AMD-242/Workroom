import { useState } from 'react'
import api from '../api/client'

export default function AiAssistant() {
  const [prompt, setPrompt] = useState('')
  const [response, setResponse] = useState('')
  const [loading, setLoading] = useState(false)
  const [history, setHistory] = useState<Array<{ prompt: string; response: string }>>([])

  const workspaceId = 'default'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!prompt.trim()) return

    setLoading(true)
    try {
      const res = await api.post('/ai/chat', { workspaceId, prompt })
      setResponse(res.data.response)
      setHistory([{ prompt, response: res.data.response }, ...history])
    } catch (err: any) {
      setResponse('Error connecting to AI. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-white mb-6">AI Assistant</h1>

      <div className="bg-dark-card border border-gray-700 rounded-xl p-6">
        <form onSubmit={handleSubmit} className="mb-4">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Ask me anything..."
            rows={4}
            className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white resize-none focus:outline-none focus:border-primary"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="mt-2 px-6 py-2 bg-primary hover:bg-primary/80 text-white rounded-lg disabled:opacity-50"
          >
            {loading ? 'Thinking...' : 'Send to AI'}
          </button>
        </form>

        {response && (
          <div className="mt-4">
            <h3 className="text-sm font-medium text-gray-400 mb-2">Response</h3>
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
              <p className="text-gray-200 whitespace-pre-wrap">{response}</p>
            </div>
          </div>
        )}
      </div>

      {history.length > 1 && (
        <div className="mt-8">
          <h2 className="text-lg font-medium text-white mb-4">History</h2>
          <div className="space-y-4">
            {history.slice(1).map((item, i) => (
              <div key={i} className="border border-gray-700 rounded-lg p-4">
                <p className="text-gray-400 text-sm mb-2">Q: {item.prompt}</p>
                <p className="text-gray-300">A: {item.response}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
