import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { fetchSessionAnalytics } from '../api/sessions'
import InsightCard from '../components/InsightCard'

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs shadow-xl">
        <p className="text-slate-400">{label}</p>
        <p className="font-bold text-purple-400">{payload[0].value} {payload[0].name === 'flowMin' ? 'min' : ''}</p>
      </div>
    )
  }
  return null
}

function generateInsights(analytics) {
  const { analyticsOverview, focusTimeOfDay } = analytics
  const insights = []

  if (analyticsOverview.bestTaskType) {
    insights.push({
      id: 1,
      icon: '💡',
      text: `Your best task type for flow is ${analyticsOverview.bestTaskType} — time flies when you're in the zone!`,
    })
  }

  if (analyticsOverview.avgSTR > 0) {
    if (analyticsOverview.avgSTR < 1) {
      insights.push({
        id: 2,
        icon: '⚡',
        text: `Your average STR is ${analyticsOverview.avgSTR.toFixed(2)} — you're consistently entering flow states!`,
      })
    } else {
      insights.push({
        id: 2,
        icon: '📈',
        text: `Your average STR is ${analyticsOverview.avgSTR.toFixed(2)} — try shorter, more focused sessions to improve flow.`,
      })
    }
  }

  if (focusTimeOfDay.length > 0) {
    const bestPeriod = focusTimeOfDay.reduce(
      (best, p) => (p.avgFlow > best.avgFlow ? p : best),
      { period: '', avgFlow: -1 }
    )
    if (bestPeriod.period && bestPeriod.avgFlow > 0) {
      insights.push({
        id: 3,
        icon: '🕐',
        text: `${bestPeriod.period} is your peak focus time with an average of ${bestPeriod.avgFlow} min of flow per session.`,
      })
    }
  }

  return insights
}

export default function Trends() {
  const navigate = useNavigate()
  const [analytics, setAnalytics] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    async function loadAnalytics() {
      try {
        const data = await fetchSessionAnalytics()
        if (!cancelled) setAnalytics(data)
      } catch (err) {
        if (!cancelled) {
          if (err.status === 401 || err.status === 403) {
            navigate('/login')
          } else {
            setError('Failed to load analytics. Please try again.')
          }
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    loadAnalytics()
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

  const { weeklyFlowData, avgSTRByTask, focusTimeOfDay } = analytics
  const insights = generateInsights(analytics)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Trends</h1>
        <p className="text-sm text-slate-400 mt-1">Patterns across your sessions</p>
      </div>

      {/* Weekly Flow Time */}
      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-5">
        <h2 className="text-sm font-semibold text-slate-300 mb-4">Weekly Flow Time</h2>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={weeklyFlowData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis dataKey="day" tick={{ fill: '#94a3b8', fontSize: 11 }} tickLine={false} axisLine={{ stroke: '#334155' }} />
            <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} tickLine={false} axisLine={{ stroke: '#334155' }} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="flowMin" radius={[4, 4, 0, 0]}>
              {weeklyFlowData.map((entry, index) => (
                <Cell key={index} fill={entry.flowMin >= 50 ? '#8b5cf6' : '#6d28d9'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Avg STR by Task Type */}
      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-5">
        <h2 className="text-sm font-semibold text-slate-300 mb-1">Average STR by Task Type</h2>
        <p className="text-xs text-slate-500 mb-4">Lower STR = time flies (deep focus)</p>
        {avgSTRByTask.length === 0 ? (
          <p className="text-slate-500 text-sm py-4 text-center">No task data yet.</p>
        ) : (
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={avgSTRByTask} layout="vertical" margin={{ top: 5, right: 30, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis type="number" domain={[0, 1.5]} tick={{ fill: '#94a3b8', fontSize: 11 }} tickLine={false} axisLine={{ stroke: '#334155' }} />
              <YAxis dataKey="task" type="category" tick={{ fill: '#94a3b8', fontSize: 11 }} tickLine={false} axisLine={{ stroke: '#334155' }} width={55} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="avgSTR" radius={[0, 4, 4, 0]}>
                {avgSTRByTask.map((entry, index) => (
                  <Cell key={index} fill={entry.avgSTR < 1 ? '#8b5cf6' : '#f59e0b'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Focus Time of Day */}
      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-5">
        <h2 className="text-sm font-semibold text-slate-300 mb-1">Best Focus Time of Day</h2>
        <p className="text-xs text-slate-500 mb-4">Avg flow min by time of day</p>
        <ResponsiveContainer width="100%" height={160}>
          <BarChart data={focusTimeOfDay} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis dataKey="period" tick={{ fill: '#94a3b8', fontSize: 10 }} tickLine={false} axisLine={{ stroke: '#334155' }} />
            <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} tickLine={false} axisLine={{ stroke: '#334155' }} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="avgFlow" radius={[4, 4, 0, 0]}>
              {focusTimeOfDay.map((entry, index) => (
                <Cell key={index} fill={entry.avgFlow >= 60 ? '#14b8a6' : '#0d9488'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Insights */}
      {insights.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-slate-300 mb-3">Auto-generated Insights</h2>
          <div className="grid gap-3">
            {insights.map(insight => (
              <InsightCard key={insight.id} icon={insight.icon} text={insight.text} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
