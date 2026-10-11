import { useEffect, useState } from 'react'
import api from '../../services/api'
import { Badge, Card, List, Spinner } from '../../components/ui'
import { useToast } from '../../components/ui'
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

export default function ModelPerformance() {
  const toast = useToast()
  const [m, setM] = useState(null)

  useEffect(() => {
    api.get('/admin/model-performance').then((r) => setM(r.data)).catch((e) => toast.err(e))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (!m) return <Spinner />

  const chart = Object.entries(m.metrics).map(([name, r]) => ({ name, ...r }))
  const feats = (m.top_features || []).slice(0, 10).map((t) => ({ name: t.feature, importance: t.importance }))

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Model performance</h1>
      <Card>
        <div className="flex flex-wrap items-center gap-3 text-sm">
          <span>Selected model:</span><Badge tone="indigo">{m.selected_model}</Badge>
          <span className="text-slate-500">version {m.model_version} · {m.dataset.rows} rows (synthetic)</span>
        </div>
        <p className="mt-2 text-xs text-slate-500">Metrics describe fit on synthetic demo data — not real-world accuracy.</p>
      </Card>
      <Card>
        <h3 className="mb-2 font-semibold">Model comparison (test set)</h3>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={chart}>
            <CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" tick={{ fontSize: 11 }} /><YAxis domain={[0, 1]} />
            <Tooltip /><Legend />
            <Bar dataKey="accuracy" fill="#4f46e5" /><Bar dataKey="f1" fill="#16a34a" /><Bar dataKey="roc_auc" fill="#f59e0b" />
          </BarChart>
        </ResponsiveContainer>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="text-left text-slate-500">
              <th className="py-1">Model</th><th>Acc</th><th>Prec</th><th>Rec</th><th>F1</th><th>AUC</th><th>CV-F1</th>
            </tr></thead>
            <tbody>
              {chart.map((r) => (
                <tr key={r.name} className={`border-t ${r.name === m.selected_model ? 'bg-indigo-50 font-semibold' : ''}`}>
                  <td className="py-1">{r.name}</td><td>{r.accuracy}</td><td>{r.precision}</td>
                  <td>{r.recall}</td><td>{r.f1}</td><td>{r.roc_auc}</td><td>{r.cv_f1_mean}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
      <Card>
        <h3 className="mb-2 font-semibold">Top global features</h3>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={feats} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" /><XAxis type="number" /><YAxis type="category" dataKey="name" width={130} tick={{ fontSize: 11 }} />
            <Tooltip /><Bar dataKey="importance" fill="#4f46e5" radius={4} />
          </BarChart>
        </ResponsiveContainer>
        <p className="mt-2 text-xs text-slate-500">Global importance shows association, not causation.</p>
        <div className="mt-2"><List title="Top features" items={(m.top_features || []).map((t) => `${t.feature} (${t.importance})`)} /></div>
      </Card>
    </div>
  )
}
