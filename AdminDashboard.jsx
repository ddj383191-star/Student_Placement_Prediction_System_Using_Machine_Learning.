import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../../services/api'
import { Card, Spinner, Stat } from '../../components/ui'
import { useToast } from '../../components/ui'
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'

export default function AdminDashboard() {
  const toast = useToast()
  const [s, setS] = useState(null)

  useEffect(() => {
    api.get('/admin/statistics').then((r) => setS(r.data)).catch((e) => toast.err(e))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (!s) return <Spinner />

  const pie = [
    { name: 'Placed', value: s.predicted_placed },
    { name: 'Not placed', value: s.predicted_not_placed },
  ]

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Admin dashboard</h1>
      <div className="grid gap-4 md:grid-cols-5">
        <Stat label="Total students" value={s.total_students} />
        <Stat label="Predicted placed" value={s.predicted_placed} />
        <Stat label="Not placed" value={s.predicted_not_placed} />
        <Stat label="Avg CGPA" value={s.average_cgpa} />
        <Stat label="Avg probability" value={`${s.average_probability}%`} />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <h3 className="mb-2 font-semibold">Placement prediction split ({s.students_with_predictions} with predictions)</h3>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={pie} dataKey="value" nameKey="name" outerRadius={90} label>
                <Cell fill="#16a34a" /><Cell fill="#f59e0b" />
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>
        <Card>
          <h3 className="mb-2 font-semibold">Specializations</h3>
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
          <div className="mt-4 flex gap-2 text-sm">
            <Link to="/admin/students" className="rounded-lg bg-slate-900 px-4 py-2 text-white">Students</Link>
            <Link to="/admin/analytics" className="rounded-lg border px-4 py-2">Analytics</Link>
            <Link to="/admin/model" className="rounded-lg border px-4 py-2">Model</Link>
          </div>
        </Card>
      </div>
    </div>
  )
}
