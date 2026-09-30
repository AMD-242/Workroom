import { useEffect, useState } from 'react'
import api from '../api/client'
import { Email } from '@workroom/shared'

export default function EmailPage() {
  const [emails, setEmails] = useState<Email[]>([])
  const [showCompose, setShowCompose] = useState(false)
  const [subject, setSubject] = useState('')
  const [to, setTo] = useState('')
  const [body, setBody] = useState('')
  const [loading, setLoading] = useState(false)
  const workspaceId = 'default'

  useEffect(() => {
    api.get(`/email/workspaces/${workspaceId}`).then((res) => setEmails(res.data))
  }, [workspaceId])

  const sendEmail = async () => {
    setLoading(true)
    try {
      await api.post('/email/send', {
        subject,
        body,
        fromEmail: 'me@workroom.app',
        toEmails: to.split(',').map((e) => e.trim()),
        workspaceId,
      })
      setSubject('')
      setTo('')
      setBody('')
      setShowCompose(false)
    } catch (err: any) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Email</h1>
        <button
          onClick={() => setShowCompose(true)}
          className="px-4 py-2 bg-primary hover:bg-primary/80 text-white rounded-lg"
        >
          Compose
        </button>
      </div>

      {showCompose && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-dark-card border border-gray-700 rounded-xl w-2/3 max-w-3xl p-6">
            <h2 className="text-xl font-bold text-white mb-4">Compose Email</h2>
            <div className="space-y-4">
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Subject"
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white"
              />
              <input
                type="email"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                placeholder="To (comma separated)"
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white"
              />
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Message..."
                rows={8}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white resize-none"
              />
            </div>
            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setShowCompose(false)}
                className="px-4 py-2 text-gray-300 hover:bg-gray-800 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={sendEmail}
                disabled={loading}
                className="px-4 py-2 bg-primary hover:bg-primary/80 text-white rounded-lg"
              >
                {loading ? 'Sending...' : 'Send'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {emails.map((email) => (
          <div key={email.id} className="bg-dark-card border border-gray-700 rounded-lg p-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-white font-medium">{email.subject}</h3>
                <p className="text-sm text-gray-400">From: {email.fromEmail}</p>
                <p className="text-sm text-gray-400">To: {email.toEmails.join(', ')}</p>
              </div>
              <span className="text-xs text-gray-500">
                {new Date(email.sentAt).toLocaleDateString()}
              </span>
            </div>
            <p className="text-gray-300 mt-2 line-clamp-3">{email.body}</p>
          </div>
        ))}
        {emails.length === 0 && <p className="text-gray-500">No emails yet.</p>}
      </div>
    </div>
  )
}
