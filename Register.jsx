import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { errMsg } from '../components/ui'

export default function Register() {
  const { register, loading } = useAuth()
  const nav = useNavigate()
  const [form, setForm] = useState({ full_name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      await register(form.email, form.password, form.full_name)
      nav('/app')
    } catch (ex) { setError(errMsg(ex, 'Registration failed')) }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <form onSubmit={submit} className="w-full max-w-md rounded-xl border bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-bold">Create student account</h1>
        {error && <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
        <label className="mt-4 block text-sm font-medium">Full name
          <input className="mt-1 w-full rounded-lg border px-3 py-2" value={form.full_name}
            onChange={set('full_name')} required />
        </label>
        <label className="mt-3 block text-sm font-medium">Email
          <input className="mt-1 w-full rounded-lg border px-3 py-2" value={form.email}
            onChange={set('email')} required type="email" />
        </label>
        <label className="mt-3 block text-sm font-medium">Password (min 6 chars)
          <input className="mt-1 w-full rounded-lg border px-3 py-2" value={form.password}
            onChange={set('password')} required minLength={6} type="password" />
        </label>
        <button disabled={loading} className="mt-5 w-full rounded-lg bg-indigo-600 py-2.5 font-semibold text-white hover:bg-indigo-700 disabled:opacity-60">
          {loading ? 'Creating…' : 'Register'}
        </button>
        <p className="mt-4 text-center text-sm text-slate-600">
          Have an account? <Link to="/login" className="font-semibold text-indigo-600">Login</Link>
        </p>
      </form>
    </div>
  )
}
