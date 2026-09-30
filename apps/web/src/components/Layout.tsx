import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import type { ReactNode } from 'react'

const navItems = [
  { to: '/', label: 'Dashboard', icon: '🏠' },
  { to: '/workspaces', label: 'Workspaces', icon: '✨' },
  { to: '/drive', label: 'Drive', icon: '📁' },
  { to: '/chat', label: 'Chat', icon: '💬' },
  { to: '/email', label: 'Email', icon: '📧' },
  { to: '/ai', label: 'AI Assistant', icon: '🤖' },
]

export default function Layout({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  return (
    <div className="flex h-screen bg-dark text-gray-100">
      <aside className="w-64 bg-dark-card border-r border-gray-700 overflow-y-auto">
        <div className="p-4 border-b border-gray-700">
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-white">Wkrm</span>
            <span className="text-sm text-gray-400">Workroom</span>
          </div>
        </div>
        <nav className="mt-4">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-4 py-3 rounded-lg mx-2 my-1 transition-colors ${
                  isActive
                    ? 'bg-primary text-white'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`
              }
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="absolute bottom-0 w-64 p-4 border-t border-gray-700">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              {user?.name?.[0] || user?.email?.[0] || '?'}
            </div>
            <div>
              <div className="font-medium">{user?.name || user?.email}</div>
              <div className="text-sm text-gray-400">{user?.email}</div>
            </div>
          </div>
          <button
            onClick={logout}
            className="w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 rounded-lg"
          >
            Logout
          </button>
        </div>
      </aside>
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  )
}
