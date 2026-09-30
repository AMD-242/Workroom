import { useEffect, useState } from 'react'
import api from '../api/client'
import { Workspace } from '@workroom/shared'

export default function Dashboard() {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([])
  const [showCreate, setShowCreate] = useState(false)
  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    api.get('/workspaces').then((res) => setWorkspaces(res.data))
  }, [])

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await api.post('/workspaces', { name, slug })
      setWorkspaces([...workspaces, res.data])
      setShowCreate(false)
      setName('')
      setSlug('')
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to create workspace')
    }
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">Workroom Dashboard</h1>
        <button
          onClick={() => setShowCreate(true)}
          className="px-4 py-2 bg-primary hover:bg-primary/80 text-white rounded-lg"
        >
          New Workspace
        </button>
      </div>

      {showCreate && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center">
          <div className="bg-dark-card p-6 rounded-xl border border-gray-700 w-96">
            <h2 className="text-xl font-bold text-white mb-4">Create Workspace</h2>
            {error && <p className="text-red-400 mb-2">{error}</p>}
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-300 mb-1">Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-1">Slug</label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white"
                  placeholder="my-workspace"
                  required
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="submit"
                  className="flex-1 py-2 bg-primary text-white rounded-lg"
                >
                  Create
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreate(false)}
                  className="flex-1 py-2 bg-gray-700 text-gray-300 rounded-lg"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {workspaces.map((ws) => (
          <WorkspaceCard key={ws.id} workspace={ws} />
        ))}
        {workspaces.length === 0 && (
          <p className="text-gray-500 col-span-full">No workspaces yet. Create one to get started.</p>
        )}
      </div>
    </div>
  )
}

function WorkspaceCard({ workspace }: { workspace: Workspace }) {
  return (
    <div className="bg-dark-card border border-gray-700 rounded-xl p-6 hover:border-primary transition-colors">
      <h3 className="text-xl font-bold text-white">{workspace.name}</h3>
      <p className="text-gray-400">/{workspace.slug}</p>
      <p className="text-gray-500 text-sm mt-2">ID: {workspace.id}</p>
    </div>
  )
}
