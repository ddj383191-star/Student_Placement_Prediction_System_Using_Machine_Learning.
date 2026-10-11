import { useState } from 'react'
import api from '../../services/api'
import { Badge, Card, List, errMsg } from '../../components/ui'
import { useToast } from '../../components/ui'
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

export default function Predict() {
  const toast = useToast()
  const [result, setResult] = useState(null)
  const [running, setRunning] = useState(false)

  const run = async () => {
    setRunning(true)
    try {
      const { data } = await api.post('/predict', {})
      setResult(data)
      toast.push('Prediction complete', 'success')
    } catch (e) { toast.err(e, errMsg(e)) } finally { setRunning(false) }
  }

  const chart = result ? [
    { name: 'Placed', value: result.probability },
    { name: 'Not placed', value: Math.round((100 - result.probability) * 10) / 10 },
  ] : []

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Placement prediction</h1>
      <Card>
        <p className="text-sm text-slate-600">Uses your saved profile with the trained model. Estimates only — not guarantees.</p>
        <button onClick={run} disabled={running}
          className="mt-3 rounded-lg bg-indigo-600 px-6 py-2.5 font-semibold text-white hover:bg-indigo-700 disabled:opacity-60">
          {running ? 'Predicting…' : 'Run prediction'}
        </button>
      </Card>

      {result && (
        <>
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="text-center">
              <p className="text-sm text-slate-500">Prediction</p>
              <p className="mt-1 text-2xl font-bold">{result.prediction}</p>
              <div className="mt-2"><Badge tone={result.prediction === 'Likely Placed' ? 'green' : 'amber'}>{result.confidence} confidence</Badge></div>
            </Card>
            <Card className="text-center">
              <p className="text-sm text-slate-500">Probability</p>
              <p className="mt-1 text-4xl font-extrabold text-indigo-600">{result.probability}%</p>
              <p className="mt-1 text-xs text-slate-500">model {result.model_version}</p>
            </Card>
            <Card>
              <p className="mb-2 text-sm font-semibold">Probability split</p>
              <ResponsiveContainer width="100%" height={120}>
                <BarChart data={chart} layout="vertical">
                  <XAxis type="number" domain={[0, 100]} hide />
                  <YAxis type="category" dataKey="name" width={80} tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="value" fill="#4f46e5" radius={4} />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card><h3 className="mb-2 font-semibold text-green-700">Strengths</h3><List title="Strengths" items={result.strengths} tone="good" /></Card>
            <Card><h3 className="mb-2 font-semibold text-red-700">Weaknesses</h3><List title="Weaknesses" items={result.weaknesses} tone="bad" /></Card>
          </div>
          <Card><h3 className="mb-2 font-semibold">Recommendations</h3><List title="Recommendations" items={result.recommendations} /></Card>
          {result.top_factors?.length > 0 && (
            <Card><h3 className="mb-2 font-semibold">Most influential model features</h3>
              <List title="Factors" items={result.top_factors} />
              <p className="mt-2 text-xs text-slate-500">Feature importance shows association, not causation.</p>
            </Card>
          )}
          <p className="text-xs text-slate-500">{result.disclaimer}</p>
        </>
      )}
    </div>
  )
}
