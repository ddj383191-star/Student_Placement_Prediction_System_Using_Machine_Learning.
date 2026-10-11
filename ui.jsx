import { createContext, useCallback, useContext, useState } from 'react'

const ToastCtx = createContext(null)
export const useToast = () => useContext(ToastCtx)

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])
  const push = useCallback((msg, type = 'info') => {
    const id = Date.now() + Math.random()
    setToasts((t) => [...t, { id, msg, type }])
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 4000)
  }, [])
  const err = useCallback((e, fallback = 'Something went wrong') => {
    const msg = e?.response?.data?.detail || e?.message || fallback
    push(typeof msg === 'string' ? msg : fallback, 'error')
  }, [push])

  return (
    <ToastCtx.Provider value={{ push, err }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
        {toasts.map((t) => (
          <div key={t.id} className={`rounded-lg px-4 py-2 text-sm text-white shadow-lg ${
            t.type === 'error' ? 'bg-red-600' : t.type === 'success' ? 'bg-green-600' : 'bg-slate-800'}`}>
            {t.msg}
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  )
}

export function Card({ children, className = '' }) {
  return <div className={`rounded-xl border bg-white p-5 shadow-sm ${className}`}>{children}</div>
}

export function Stat({ label, value, sub }) {
  return (
    <Card>
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-1 text-3xl font-bold text-slate-900">{value}</p>
      {sub && <p className="mt-1 text-sm text-slate-500">{sub}</p>}
    </Card>
  )
}

export function Badge({ children, tone = 'slate' }) {
  const tones = {
    green: 'bg-green-100 text-green-800',
    red: 'bg-red-100 text-red-800',
    amber: 'bg-amber-100 text-amber-800',
    indigo: 'bg-indigo-100 text-indigo-800',
    slate: 'bg-slate-100 text-slate-700',
  }
  return <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${tones[tone]}`}>{children}</span>
}

export function Spinner() {
  return <div className="py-10 text-center text-slate-500">Loading…</div>
}

export function Empty({ msg }) {
  return <div className="rounded-lg border border-dashed p-8 text-center text-sm text-slate-500">{msg}</div>
}

export function List({ title, items, tone }) {
  if (!items?.length) return <Empty msg={`No ${title.toLowerCase()} found.`} />
  return (
    <ul className="space-y-2">
      {items.map((x, i) => (
        <li key={i} className="flex items-start gap-2 rounded-lg bg-slate-50 px-3 py-2 text-sm">
          <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${tone === 'good' ? 'bg-green-500' : tone === 'bad' ? 'bg-red-400' : 'bg-indigo-500'}`} />
          {x}
        </li>
      ))}
    </ul>
  )
}

export function errMsg(e, fallback = 'Request failed') {
  const d = e?.response?.data?.detail
  if (typeof d === 'string') return d
  if (Array.isArray(d)) return d.map((x) => x.msg).join('; ')
  return e?.message || fallback
}
