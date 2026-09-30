import { useEffect, useState } from 'react'
import api from '../api/client'
import { Workspace, DriveFile } from '@workroom/shared'

export default function Workspaces() {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([])

  useEffect(() => {
    api.get('/workspaces').then((res) => setWorkspaces(res.data))
  }, [])

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-white mb-6">Your Workspaces</h1>
      <div className="space-y-4">
        {workspaces.map((ws) => (
          <WorkspaceDetail key={ws.id} workspace={ws} />
        ))}
      </div>
    </div>
  )
}

function WorkspaceDetail({ workspace }: { workspace: Workspace }) {
  const [files, setFiles] = useState<DriveFile[]>([])
  const [channels, setChannels] = useState<any[]>([])
  const [newChannel, setNewChannel] = useState('')

  useEffect(() => {
    api.get(`/drive/${workspace.id}`).then((res) => setFiles(res.data))
    api.get(`/chat/workspaces/${workspace.id}/channels`).then((res) => setChannels(res.data))
  }, [workspace.id])

  const createChannel = async () => {
    if (!newChannel) return
    const res = await api.post(`/chat/workspaces/${workspace.id}/channels`, { name: newChannel })
    setChannels([...channels, res.data])
    setNewChannel('')
  }

  return (
    <div className="bg-dark-card border border-gray-700 rounded-xl p-6">
      <h2 className="text-xl font-bold text-white">{workspace.name}</h2>
      <p className="text-gray-400 text-sm mb-4">/{workspace.slug}</p>
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-sm font-medium text-gray-400 mb-2">Recent Files</h3>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {files.map((file) => (
              <div key={file.id} className="text-gray-300">
                {file.name} - {(file.size / 1024).toFixed(1)} KB
              </div>
            ))}
            {files.length === 0 && <p className="text-gray-500 text-sm">No files</p>}
          </div>
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-400 mb-2">Channels</h3>
          <div className="space-y-2">
            {channels.map((ch) => (
              <div key={ch.id} className="text-gray-300">
                #{ch.name}
              </div>
            ))}
            <div className="flex gap-2">
              <input
                type="text"
                value={newChannel}
                onChange={(e) => setNewChannel(e.target.value)}
                placeholder="New channel"
                className="flex-1 text-sm px-2 py-1 bg-gray-800 border border-gray-600 rounded text-white"
              />
              <button
                onClick={createChannel}
                className="px-2 py-1 bg-primary text-white rounded text-sm"
              >
                +
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
