import { useEffect, useState } from 'react'
import api from '../../services/api'
import { Badge, Card, Spinner, errMsg } from '../../components/ui'
import { useToast } from '../../components/ui'
import { WHATIF_FIELDS } from './fields'

export default function WhatIf() {
  const toast = useToast()
  const [current, setCurrent] = useState(null)
  const [overrides, setOverrides] = useState({})
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(true)
  const [running, setRunning] = useState(false)

  useEffect(() => {
    api.get('/student/profile').then((r) => setCurrent(r.data)).catch((e) => toast.err(e))
      .finally(() => setLoading(false))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const run = async () => {
    setRunning(true)
    try {
      const ov = {}
      for (const [k, v] of Object.entries(overrides)) if (v !== '' && v !== undefined) ov[k] = Number(v)
      const { data } = await api.post('/what-if', { overrides: ov })
      setResult(data)
    } catch (e) { toast.err(e, errMsg(e)) } finally { setRunning(false) }
  }

  if (loading) return <Spinner />

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">What-If placement simulator</h1>
      <Card>
        <p className="text-sm text-slate-600">Adjust values below to simulate. Current saved values shown. Simulation only — not a real-world guarantee.</p>
        <div className="mt-3 grid gap-3 md:grid-cols-3">
          {WHATIF_FIELDS.map((k) => (
            <label key={k} className="block text-sm font-medium">{k}
              <span className="ml-1 font-normal text-slate-400">(now: {current?.[k] ?? '—'})</span>
              <input type="number" value={overrides[k] ?? ''} placeholder={String(current?.[k] ?? '')}
                onChange={(e) => setOverrides({ ...overrides, [k]: e.target.value })}
                className="mt-1 w-full rounded-lg border px-3 py-2" />
            </label>
          ))}
        </div>
        <button onClick={run} disabled={running}
          className="mt-4 rounded-lg bg-indigo-600 px-6 py-2.5 font-semibold text-white hover:bg-indigo-700 disabled:opacity-60">
          {running ? 'Simulating…' : 'Simulate'}
        </button>
      </Card>

      {result && (
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="text-center">
            <p className="text-sm text-slate-500">Current prediction</p>
            <p className="mt-1 text-3xl font-extrabold">{result.current_probability}%</p>
            <div className="mt-1"><Badge>{result.current_prediction}</Badge></div>
          </Card>
          <Card className="text-center">
            <p className="text-sm text-slate-500">What-If prediction</p>
            <p className="mt-1 text-3xl font-extrabold text-indigo-600">{result.whatif_probability}%</p>
            <div className="mt-1"><Badge tone="indigo">{result.whatif_prediction}</Badge></div>
          </Card>
          <Card className="text-center">
            <p className="text-sm text-slate-500">Difference</p>
            <p className={`mt-1 text-3xl font-extrabold ${result.difference_pp >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {result.difference_pp >= 0 ? '+' : ''}{result.difference_pp} pp
            </p>
            <p className="mt-2 text-xs text-slate-500">{result.disclaimer}</p>
          </Card>
        </div>
      )}
    </div>
  )
}
