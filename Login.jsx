import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { errMsg } from '../components/ui'

export default function Login() {
  const { login, loading } = useAuth()
  const nav = useNavigate()
  const [email, setEmail] = useState('student@college.edu')
  const [password, setPassword] = useState('Student123!')
  const [error, setError] = useState('')

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      const data = await login(email, password)
      nav(data.role === 'admin' ? '/admin' : '/app')
    } catch (ex) { setError(errMsg(ex, 'Login failed')) }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <form onSubmit={submit} className="w-full max-w-md rounded-xl border bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-bold">Login</h1>
        <p className="mt-1 text-sm text-slate-500">Placement prediction & readiness system</p>
        {error && <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
        <label className="mt-4 block text-sm font-medium">Email
          <input className="mt-1 w-full rounded-lg border px-3 py-2" value={email}
            onChange={(e) => setEmail(e.target.value)} required type="email" />
        </label>
        <label className="mt-3 block text-sm font-medium">Password
          <input className="mt-1 w-full rounded-lg border px-3 py-2" value={password}
            onChange={(e) => setPassword(e.target.value)} required type="password" />
        </label>
        <button disabled={loading} className="mt-5 w-full rounded-lg bg-indigo-600 py-2.5 font-semibold text-white hover:bg-indigo-700 disabled:opacity-60">
          {loading ? 'Signing in…' : 'Login'}
        </button>
        <p className="mt-4 text-center text-sm text-slate-600">
          No account? <Link to="/register" className="font-semibold text-indigo-600">Register</Link>
        </p>
      </form>
    </div>
  )
}
