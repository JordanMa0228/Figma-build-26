import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { GitCompare, Loader2 } from 'lucide-react'
import { fetchSessions } from '../api/sessions'
import FlowTimeline from '../components/FlowTimeline'
import STRChart from '../components/STRChart'
import SummaryCard from '../components/SummaryCard'

export default function Compare() {
  const navigate = useNavigate()
  const [sessions, setSessions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [sessionAId, setSessionAId] = useState(null)
  const [sessionBId, setSessionBId] = useState(null)

  useEffect(() => {
    let cancelled = false
    async function loadSessions() {
      try {
        const data = await fetchSessions()
        if (!cancelled) {
          setSessions(data)
          if (data.length >= 1) setSessionAId(data[0].id)
          if (data.length >= 2) setSessionBId(data[1].id)
        }
      } catch (err) {
        if (!cancelled) {
          if (err.status === 401 || err.status === 403) {
            navigate('/login')
          } else {
            setError('Failed to load sessions. Please try again.')
          }
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    loadSessions()
    return () => { cancelled = true }
  }, [navigate])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 size={32} className="text-purple-400 animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <p className="text-slate-400">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 text-purple-400 hover:text-purple-300 text-sm"
        >
          Retry
        </button>
      </div>
    )
  }

  if (sessions.length < 2) {
    return (
      <div className="text-center py-20">
        <p className="text-slate-400">You need at least 2 sessions to compare.</p>
        <button
          onClick={() => navigate('/')}
          className="mt-4 text-purple-400 hover:text-purple-300 text-sm"
        >
          Start a Session
        </button>
      </div>
    )
  }

  const sessionA = sessions.find(s => s.id === sessionAId)
  const sessionB = sessions.find(s => s.id === sessionBId)

  const SelectSession = ({ value, onChange, exclude }) => (
    <select
      value={value || ''}
      onChange={e => onChange(e.target.value)}
      className="w-full bg-slate-700 border border-slate-600 text-slate-200 text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-purple-500"
    >
      {sessions.filter(s => s.id !== exclude).map(s => (
        <option key={s.id} value={s.id}>
          {s.taskIcon} {s.taskLabel} — {s.date} ({s.durationMin} min)
        </option>
      ))}
    </select>
  )

  const CompareSection = ({ session }) => (
    <div className="flex-1 space-y-4 min-w-0">
      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-4">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-2xl">{session.taskIcon}</span>
          <div>
            <p className="font-semibold text-white">{session.taskLabel}</p>
            <p className="text-xs text-slate-500">{session.date} · {session.durationMin} min</p>
          </div>
        </div>
      </div>

      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-4">
        <p className="text-xs text-slate-400 mb-3">Flow Timeline</p>
        <FlowTimeline timeline={session.flowTimeline} durationMin={session.durationMin} />
      </div>

      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-4">
        <p className="text-xs text-slate-400 mb-3">STR Curve</p>
        <STRChart timeseries={session.strTimeseries} />
      </div>

      <div className="grid grid-cols-2 gap-2">
        <SummaryCard label="Flow %" value={`${session.flowPercent}%`} accent="purple" />
        <SummaryCard label="Avg STR" value={session.avgSTR.toFixed(2)} accent={session.avgSTR < 1 ? 'teal' : 'amber'} />
        <SummaryCard label="Peak STR" value={session.peakSTR.toFixed(2)} accent="purple" />
        <SummaryCard label="Streak" value={`${session.longestFlowStreakMin}m`} accent="slate" />
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Compare Sessions</h1>
        <p className="text-sm text-slate-400 mt-1">Side-by-side session analysis</p>
      </div>

      {/* Session Selectors */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs text-slate-400 mb-1.5">Session A</label>
          <SelectSession value={sessionAId} onChange={setSessionAId} exclude={sessionBId} />
        </div>
        <div>
          <label className="block text-xs text-slate-400 mb-1.5">Session B</label>
          <SelectSession value={sessionBId} onChange={setSessionBId} exclude={sessionAId} />
        </div>
      </div>

      {/* Side by Side Comparison */}
      {sessionA && sessionB && (
        <div className="flex gap-4">
          <CompareSection session={sessionA} />
          <div className="flex items-start pt-16">
            <div className="w-px bg-slate-700 self-stretch" />
            <GitCompare size={16} className="text-slate-600 -ml-2 mt-2 bg-slate-900 rounded-full" />
          </div>
          <CompareSection session={sessionB} />
        </div>
      )}
    </div>
  )
}
