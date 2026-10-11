import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../../services/api'
import { Badge, Card, List, Spinner, Stat } from '../../components/ui'
import { useToast } from '../../components/ui'
import {
  PolarAngleAxis, PolarGrid, Radar, RadarChart, ResponsiveContainer,
  Bar, BarChart, CartesianGrid, Tooltip, XAxis, YAxis,
} from 'recharts'

export default function Dashboard() {
  const toast = useToast()
  const [profile, setProfile] = useState(null)
  const [latest, setLatest] = useState(null)
  const [gap, setGap] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      api.get('/student/profile').then((r) => r.data).catch(() => null),
      api.get('/predictions').then((r) => r.data[0] || null).catch(() => null),
      api.get('/skill-gap').then((r) => r.data).catch(() => null),
    ]).then(([p, l, g]) => { setProfile(p); setLatest(l); setGap(g) })
      .catch((e) => toast.err(e)).finally(() => setLoading(false))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (loading) return <Spinner />
  if (!profile) return <Card>Could not load profile.</Card>

  const radar = (gap?.current_skills || [])
    .filter((s) => typeof s.value === 'number')
    .map((s) => ({ skill: s.skill, level: s.skill === 'Communication' ? Math.round(s.value / 10) : s.value }))

  const academics = [
    { name: '10th', score: profile.tenth_pct || 0 },
    { name: '12th', score: profile.twelfth_pct || 0 },
    { name: 'Grad', score: profile.grad_pct || 0 },
    { name: 'Aptitude', score: profile.aptitude_score || 0 },
    { name: 'Coding', score: profile.coding_score || 0 },
    { name: 'Comm.', score: profile.communication_score || 0 },
  ]

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Student dashboard</h1>
        <Link to="/app/predict" className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700">Run prediction</Link>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Stat label="Placement probability" value={latest ? `${latest.probability}%` : '—'} sub={latest?.prediction || 'No prediction yet'} />
        <Stat label="MCA CGPA" value={profile.mca_cgpa ?? '—'} />
        <Stat label="Internships / Projects" value={`${profile.internships_count ?? 0} / ${profile.projects_count ?? 0}`} />
        <Stat label="Coding / Comm." value={`${profile.coding_score ?? '—'} / ${profile.communication_score ?? '—'}`} />
      </div>

      {latest && (
        <Card>
          <div className="flex items-center gap-3">
            <Badge tone={latest.prediction === 'Likely Placed' ? 'green' : 'amber'}>{latest.prediction}</Badge>
            <span className="text-sm text-slate-500">Latest: {latest.probability}% · {new Date(latest.created_at).toLocaleString()} · {latest.model_version}</span>
          </div>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <h3 className="mb-2 font-semibold">Skills radar</h3>
          {radar.length ? (
            <ResponsiveContainer width="100%" height={260}>
              <RadarChart data={radar} outerRadius="75%">
                <PolarGrid /><PolarAngleAxis dataKey="skill" tick={{ fontSize: 11 }} />
                <Radar dataKey="level" fill="#4f46e5" fillOpacity={0.4} stroke="#4f46e5" />
              </RadarChart>
            </ResponsiveContainer>
          ) : <p className="text-sm text-slate-500">Fill skills in <Link className="text-indigo-600" to="/app/profile">Profile</Link>.</p>}
        </Card>
        <Card>
          <h3 className="mb-2 font-semibold">Academic & assessment scores</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={academics}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Bar dataKey="score" fill="#4f46e5" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card><h3 className="mb-2 font-semibold">Skill gaps</h3>
          {gap?.gaps?.length ? <div className="flex flex-wrap gap-2">{gap.gaps.map((g) => <Badge key={g} tone="red">{g}</Badge>)}</div>
            : <p className="text-sm text-slate-500">No major gaps detected.</p>}
        </Card>
        <Card><h3 className="mb-2 font-semibold">Top recommendations</h3><List title="Recommendations" items={(gap?.recommendations || []).slice(0, 4)} /></Card>
      </div>
    </div>
  )
}
