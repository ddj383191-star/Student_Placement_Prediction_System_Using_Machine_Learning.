import { useEffect, useState } from 'react'
import api from '../../services/api'
import { Card, Spinner } from '../../components/ui'
import { useToast } from '../../components/ui'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

const bucket = (vals, edges) => edges.slice(0, -1).map((lo, i) => ({
  range: `${lo}–${edges[i + 1]}`,
  count: vals.filter((v) => v >= lo && (i === edges.length - 2 || v < edges[i + 1])).length,
}))

export default function Analytics() {
  const toast = useToast()
  const [s, setS] = useState(null)

  useEffect(() => {
    api.get('/admin/statistics').then((r) => setS(r.data)).catch((e) => toast.err(e))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (!s) return <Spinner />

  const cgpa = bucket(s.cgpa_distribution, [0, 6, 7, 8, 9, 11])
  const intern = (() => {
    const m = {}
    s.internship_distribution.forEach((v) => { m[v] = (m[v] || 0) + 1 })
    return Object.entries(m).map(([k, count]) => ({ range: `${k}`, count }))
  })()

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Analytics</h1>
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <h3 className="mb-2 font-semibold">CGPA distribution</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={cgpa}>
              <CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="range" /><YAxis allowDecimals={false} /><Tooltip />
              <Bar dataKey="count" fill="#4f46e5" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
        <Card>
          <h3 className="mb-2 font-semibold">Internships per student</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={intern}>
              <CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="range" /><YAxis allowDecimals={false} /><Tooltip />
              <Bar dataKey="count" fill="#16a34a" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>
      <Card>
        <h3 className="mb-2 font-semibold">Department / specialization split</h3>
        {s.specialization_distribution.map((d) => (
          <div key={d.name} className="mb-2 flex items-center gap-3 text-sm">
            <span className="w-32">{d.name}</span>
            <div className="h-3 flex-1 rounded bg-slate-100">
              <div className="h-3 rounded bg-indigo-500"
                style={{ width: `${s.total_students ? (d.count / s.total_students) * 100 : 0}%` }} />
            </div>
            <span className="w-8 text-right font-semibold">{d.count}</span>
          </div>
        ))}
      </Card>
    </div>
  )
}
