import { useEffect, useState, useRef } from 'react'
import { io, Socket } from 'socket.io-client'
import api from '../api/client'
import { Message } from '@workroom/shared'

const socket: Socket = io('http://localhost:4000')

export default function Chat() {
  const [channels, setChannels] = useState<any[]>([])
  const [selectedChannel, setSelectedChannel] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const workspaceId = 'default'

  useEffect(() => {
    api.get(`/chat/workspaces/${workspaceId}/channels`).then((res) => {
      setChannels(res.data)
      if (res.data.length > 0) {
        setSelectedChannel(res.data[0].id)
      }
    })
  }, [workspaceId])

  useEffect(() => {
    if (selectedChannel) {
      socket.emit('joinChannel', selectedChannel)
      api.get(`/chat/channels/${selectedChannel}/messages`).then((res) => {
        setMessages(res.data)
      })
      return () => {
        socket.emit('leaveChannel', selectedChannel)
      }
    }
  }, [selectedChannel])

  useEffect(() => {
    socket.on('message', (message: Message) => {
      setMessages((prev) => [...prev, message])
    })
    return () => {
      socket.off('message')
    }
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = () => {
    if (!newMessage.trim() || !selectedChannel) return
    socket.emit('message', {
      channelId: selectedChannel,
      content: newMessage,
      senderId: 'user-id',
    })
    setNewMessage('')
  }

  return (
    <div className="flex h-screen bg-dark">
      <aside className="w-64 border-r border-gray-700 overflow-y-auto">
        <div className="p-4">
          <h2 className="text-lg font-bold text-white">Channels</h2>
        </div>
        {channels.map((ch) => (
          <div
            key={ch.id}
            onClick={() => setSelectedChannel(ch.id)}
            className={`p-3 cursor-pointer transition-colors ${
              selectedChannel === ch.id ? 'bg-primary text-white' : 'text-gray-300 hover:bg-gray-800'
            }`}
          >
            #{ch.name}
          </div>
        ))}
      </aside>

      <main className="flex-1 flex flex-col">
        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-2">
            {messages.map((msg) => (
              <div key={msg.id} className="max-w-max bg-dark-card border border-gray-700 rounded-lg p-3">
                <p className="text-white">{msg.content}</p>
                <p className="text-xs text-gray-500">
                  {msg.sender?.name || msg.sender?.email || 'Unknown'} · {new Date(msg.createdAt).toLocaleTimeString()}
                </p>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>

        <div className="p-4 border-t border-gray-700">
          <div className="flex gap-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              className="flex-1 px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none"
              placeholder="Type a message..."
            />
            <button
              onClick={sendMessage}
              className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/80"
            >
              Send
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}
