import { useEffect, useState } from 'react'
import api from '../../services/api'
import { Badge, Card, Empty, Spinner } from '../../components/ui'
import { useToast } from '../../components/ui'

export default function Students() {
  const toast = useToast()
  const [q, setQ] = useState('')
  const [rows, setRows] = useState(null)

  const load = (query = '') => {
    api.get('/admin/students', { params: { q: query } }).then((r) => setRows(r.data)).catch((e) => toast.err(e))
  }

  useEffect(() => { load() }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Students</h1>
      <Card>
        <div className="flex gap-2">
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search name or email…"
            className="w-full rounded-lg border px-3 py-2" />
          <button onClick={() => load(q)} className="rounded-lg bg-slate-900 px-5 py-2 text-white">Search</button>
        </div>
      </Card>
      {!rows ? <Spinner /> : !rows.length ? <Empty msg="No students found." /> : (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="text-left text-slate-500">
                <th className="py-2">Name</th><th>Email</th><th>CGPA</th><th>Internships</th><th>Latest prediction</th>
              </tr></thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.id} className="border-t">
                    <td className="py-2 font-medium">{r.full_name}</td>
                    <td className="text-slate-500">{r.email}</td>
                    <td>{r.profile.mca_cgpa ?? '—'}</td>
                    <td>{r.profile.internships_count ?? 0}</td>
                    <td>{r.latest_prediction
                      ? <><Badge tone={r.latest_prediction.prediction === 'Likely Placed' ? 'green' : 'amber'}>{r.latest_prediction.prediction}</Badge>
                        <span className="ml-2 font-semibold">{r.latest_prediction.probability}%</span></>
                      : <span className="text-slate-400">—</span>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  )
}
