import { useEffect, useState } from 'react'
import api from '../../services/api'
import { Badge, Card, Empty, Spinner } from '../../components/ui'
import { useToast } from '../../components/ui'
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

export default function History() {
  const toast = useToast()
  const [rows, setRows] = useState(null)

  useEffect(() => {
    api.get('/predictions').then((r) => setRows(r.data)).catch((e) => toast.err(e))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (!rows) return <Spinner />

  const trend = [...rows].reverse().map((r, i) => ({
    n: `#${rows.length - i}`, prob: r.probability,
    date: new Date(r.created_at).toLocaleDateString(),
  }))

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Prediction history</h1>
      {rows.length > 1 && (
        <Card>
          <h3 className="mb-2 font-semibold">Probability trend</h3>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={trend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="n" /><YAxis domain={[0, 100]} />
              <Tooltip />
              <Area type="monotone" dataKey="prob" fill="#4f46e5" fillOpacity={0.25} stroke="#4f46e5" />
            </AreaChart>
          </ResponsiveContainer>
        </Card>
      )}
      <Card>
        {!rows.length ? <Empty msg="No predictions yet. Run your first prediction." /> : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="text-left text-slate-500">
                <th className="py-2">Date</th><th>Status</th><th>Probability</th><th>Model</th>
              </tr></thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.id} className="border-t">
                    <td className="py-2">{new Date(r.created_at).toLocaleString()}</td>
                    <td><Badge tone={r.prediction === 'Likely Placed' ? 'green' : 'amber'}>{r.prediction}</Badge></td>
                    <td className="font-semibold">{r.probability}%</td>
                    <td className="text-slate-500">{r.model_version}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  )
}
