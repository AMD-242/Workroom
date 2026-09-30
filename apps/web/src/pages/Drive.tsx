import { useEffect, useState } from 'react'
import api from '../api/client'
import { DriveFile } from '@workroom/shared'

export default function Drive() {
  const [files, setFiles] = useState<DriveFile[]>([])
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)

  const workspaceId = 'default'

  useEffect(() => {
    api.get(`/drive/${workspaceId}`).then((res) => setFiles(res.data))
  }, [workspaceId])

  const handleUpload = async () => {
    if (!selectedFile) return
    setUploading(true)
    const formData = new FormData()
    formData.append('file', selectedFile)
    formData.append('workspaceId', workspaceId)

    try {
      const res = await api.post('/drive/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      setFiles([res.data, ...files])
      setSelectedFile(null)
    } catch (err: any) {
      console.error(err)
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async (id: string) => {
    await api.delete(`/drive/${id}`)
    setFiles(files.filter((f) => f.id !== id))
  }

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Drive</h1>
        <div className="flex items-center gap-3">
          <input
            type="file"
            onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
            className="text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:bg-primary file:text-white hover:file:bg-primary/80"
          />
          {selectedFile && (
            <button
              onClick={handleUpload}
              disabled={uploading}
              className="px-4 py-2 bg-primary text-white rounded-lg disabled:opacity-50"
            >
              {uploading ? 'Uploading...' : 'Upload'}
            </button>
          )}
        </div>
      </div>

      <div className="space-y-2">
        {files.map((file) => (
          <div key={file.id} className="bg-dark-card border border-gray-700 rounded-lg p-4 flex justify-between items-center">
            <div>
              <h3 className="text-white font-medium">{file.name}</h3>
              <p className="text-sm text-gray-400">{file.mimeType} · {formatSize(file.size)}</p>
              <p className="text-xs text-gray-500">Uploaded {new Date(file.createdAt).toLocaleDateString()}</p>
            </div>
            <button
              onClick={() => handleDelete(file.id)}
              className="text-red-400 hover:text-red-300"
            >
              Delete
            </button>
          </div>
        ))}
        {files.length === 0 && (
          <p className="text-gray-500">No files yet. Upload one to get started.</p>
        )}
      </div>
    </div>
  )
}
