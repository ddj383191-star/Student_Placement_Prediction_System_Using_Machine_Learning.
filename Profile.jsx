import { useEffect, useState } from 'react'
import api from '../../services/api'
import { Card, Spinner, errMsg } from '../../components/ui'
import { useToast } from '../../components/ui'
import { SECTIONS } from './fields'

export default function Profile() {
  const toast = useToast()
  const [form, setForm] = useState({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    api.get('/student/profile').then((r) => setForm(r.data)).catch((e) => toast.err(e))
      .finally(() => setLoading(false))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const set = (k, v) => setForm({ ...form, [k]: v === '' ? null : v })

  const save = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const payload = {}
      for (const s of SECTIONS) for (const [k] of s.fields) {
        const v = form[k]
        payload[k] = v === '' || v === undefined ? null : v
      }
      await api.put('/student/profile', payload)
      toast.push('Profile saved', 'success')
    } catch (ex) { toast.err(ex, errMsg(ex)) } finally { setSaving(false) }
  }

  if (loading) return <Spinner />

  return (
    <form onSubmit={save} className="space-y-4">
      <h1 className="text-2xl font-bold">Student profile</h1>
      {SECTIONS.map((s) => (
        <Card key={s.title}>
          <h2 className="mb-3 font-semibold">{s.title}</h2>
          <div className="grid gap-3 md:grid-cols-3">
            {s.fields.map(([k, label, type, opts]) => (
              <label key={k} className="block text-sm font-medium">{label}
                {type === 'select' ? (
                  <select value={form[k] ?? ''} onChange={(e) => set(k, e.target.value)}
                    className="mt-1 w-full rounded-lg border px-3 py-2">
                    {opts.options.map((o) => <option key={o} value={o}>{o || '—'}</option>)}
                  </select>
                ) : (
                  <input type="number" value={form[k] ?? ''} onChange={(e) => set(k, e.target.value === '' ? '' : Number(e.target.value))}
                    className="mt-1 w-full rounded-lg border px-3 py-2" {...opts} />
                )}
              </label>
            ))}
          </div>
        </Card>
      ))}
      <button disabled={saving} className="rounded-lg bg-indigo-600 px-6 py-2.5 font-semibold text-white hover:bg-indigo-700 disabled:opacity-60">
        {saving ? 'Saving…' : 'Save profile'}
      </button>
    </form>
  )
}
