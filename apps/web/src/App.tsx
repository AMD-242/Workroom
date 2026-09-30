import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Layout from './components/Layout'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Drive from './pages/Drive'
import Chat from './pages/Chat'
import EmailPage from './pages/Email'
import AiAssistant from './pages/AiAssistant'
import Workspaces from './pages/Workspaces'

function App() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-dark">
        <div className="text-white text-xl">Loading Workroom...</div>
      </div>
    )
  }

  if (!user) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    )
  }

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/workspaces" element={<Workspaces />} />
        <Route path="/drive" element={<Drive />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/email" element={<EmailPage />} />
        <Route path="/ai" element={<AiAssistant />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  )
}

export default App
