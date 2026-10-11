import { useEffect, useState } from 'react'
import api from '../../services/api'
import { Badge, Card, List, Spinner } from '../../components/ui'
import { useToast } from '../../components/ui'

export default function SkillGap() {
  const toast = useToast()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/skill-gap').then((r) => setData(r.data)).catch((e) => toast.err(e))
      .finally(() => setLoading(false))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (loading) return <Spinner />
  if (!data) return <Card>Could not load skill-gap analysis.</Card>

  const levelTone = (lvl) => lvl === 'Excellent' ? 'green' : lvl === 'Good' ? 'indigo' : lvl === 'Intermediate' ? 'amber' : 'red'

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Skill-gap analysis</h1>
      <Card>
        <h3 className="mb-3 font-semibold">Current skills</h3>
        <div className="grid gap-3 md:grid-cols-2">
          {data.current_skills.map((s) => (
            <div key={s.skill} className="flex items-center justify-between rounded-lg bg-slate-50 px-4 py-2.5 text-sm">
              <span className="font-medium">{s.skill} <span className="text-slate-400">· {s.value ?? '—'}</span></span>
              <Badge tone={levelTone(s.level)}>{s.level}</Badge>
            </div>
          ))}
        </div>
      </Card>
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <h3 className="mb-2 font-semibold text-red-700">Gaps to close</h3>
          {data.gaps?.length ? <div className="flex flex-wrap gap-2">{data.gaps.map((g) => <Badge key={g} tone="red">{g}</Badge>)}</div>
            : <p className="text-sm text-slate-500">No major gaps — keep improving.</p>}
          <h3 className="mb-2 mt-4 font-semibold">Weaknesses</h3>
          <List title="Weaknesses" items={data.weaknesses} tone="bad" />
        </Card>
        <Card><h3 className="mb-2 font-semibold">Personalized recommendations</h3><List title="Recommendations" items={data.recommendations} /></Card>
      </div>
    </div>
  )
}
