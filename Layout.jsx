import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const studentLinks = [
  ['/app', 'Dashboard'],
  ['/app/profile', 'Profile'],
  ['/app/predict', 'Prediction'],
  ['/app/skill-gap', 'Skill Gap'],
  ['/app/what-if', 'What-If Simulator'],
  ['/app/history', 'History'],
]
const adminLinks = [
  ['/admin', 'Dashboard'],
  ['/admin/students', 'Students'],
  ['/admin/analytics', 'Analytics'],
  ['/admin/model', 'Model Performance'],
]

export default function Layout({ mode }) {
  const { user, logout } = useAuth()
  const nav = useNavigate()
  const links = mode === 'admin' ? adminLinks : studentLinks

  return (
    <div className="flex min-h-screen bg-slate-100">
      <aside className="hidden w-60 shrink-0 flex-col bg-slate-900 p-4 text-white md:flex">
        <Link to="/" className="px-2 py-4 text-lg font-bold">Placement<span className="text-indigo-400">AI</span></Link>
        <nav className="flex flex-col gap-1">
          {links.map(([to, label]) => (
            <NavLink key={to} to={to} end={to === '/app' || to === '/admin'}
              className={({ isActive }) => `rounded-lg px-3 py-2 text-sm ${isActive ? 'bg-indigo-600' : 'hover:bg-slate-800'}`}>
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="mt-auto px-2 py-4 text-xs text-slate-400">
          <p>{user?.full_name} ({user?.role})</p>
          <button className="mt-2 rounded bg-slate-800 px-3 py-1.5 hover:bg-slate-700"
            onClick={() => { logout(); nav('/login') }}>Logout</button>
        </div>
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center gap-2 bg-white px-4 py-3 shadow-sm md:hidden">
          <Link to="/" className="font-bold">PlacementAI</Link>
          <div className="ml-auto flex gap-2">
            {links.map(([to, label]) => (
              <NavLink key={to} to={to} end className={({ isActive }) =>
                `rounded px-2 py-1 text-xs ${isActive ? 'bg-indigo-600 text-white' : 'bg-slate-100'}`}>{label}</NavLink>
            ))}
          </div>
        </header>
        <main className="mx-auto w-full max-w-6xl flex-1 p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

