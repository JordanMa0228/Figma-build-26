import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Brain, Plus, Clock, Zap, Activity, X, Loader2 } from 'lucide-react'
import { format } from 'date-fns'
import { fetchSessions, fetchSessionSummary, createSession } from '../api/sessions'
import SessionCard from '../components/SessionCard'
import SummaryCard from '../components/SummaryCard'

const TASK_TYPES = ['Coding', 'Poker', 'Class', 'Music', 'Email']
const TASK_ICONS = { Coding: '💻', Poker: '🃏', Class: '📚', Music: '🎵', Email: '📧' }

// Sample flow data used when creating a new session via the modal.
// This is placeholder data until real sensor integration is implemented.
const NEW_SESSION_TEMPLATE = {
  date: new Date().toISOString().split('T')[0],
  startTime: '21:00',
  endTime: '21:23',
  durationMin: 23,
  avgStr: 0.62,
  flowRatio: 0.68,
  peakStr: 0.48,
  longestFlowStreakMin: 11,
  flowIntervals: [
    { startMin: 0, endMin: 2, state: 'Neutral', avgSTR: 0.95 },
    { startMin: 2, endMin: 8, state: 'Focused', avgSTR: 0.75 },
    { startMin: 8, endMin: 19, state: 'Flow', avgSTR: 0.51 },
    { startMin: 19, endMin: 21, state: 'Focused', avgSTR: 0.72 },
    { startMin: 21, endMin: 23, state: 'Neutral', avgSTR: 0.98 },
  ],
  strTimeseries: [
    { t: 0, str: 1.02 }, { t: 1, str: 0.95 }, { t: 2, str: 0.88 },
    { t: 3, str: 0.80 }, { t: 4, str: 0.75 }, { t: 5, str: 0.72 },
    { t: 6, str: 0.70 }, { t: 7, str: 0.68 }, { t: 8, str: 0.60 },
    { t: 9, str: 0.55 }, { t: 10, str: 0.51 }, { t: 11, str: 0.49 },
    { t: 12, str: 0.48 }, { t: 13, str: 0.50 }, { t: 14, str: 0.52 },
    { t: 15, str: 0.53 }, { t: 16, str: 0.55 }, { t: 17, str: 0.58 },
    { t: 18, str: 0.62 }, { t: 19, str: 0.70 }, { t: 20, str: 0.75 },
    { t: 21, str: 0.90 }, { t: 22, str: 0.98 },
  ],
  quality: { eye: 98, eeg: 91, hr: 100 },
}

export default function Home() {
  const navigate = useNavigate()
  const [showModal, setShowModal] = useState(false)
  const [taskName, setTaskName] = useState('Coding')
  const [loading, setLoading] = useState(false)

  const [sessions, setSessions] = useState([])
  const [summary, setSummary] = useState(null)
  const [dataLoading, setDataLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    async function loadData() {
      try {
        const [sessionsData, summaryData] = await Promise.all([
          fetchSessions(),
          fetchSessionSummary(),
        ])
        if (!cancelled) {
          setSessions(sessionsData)
          setSummary(summaryData)
        }
      } catch (err) {
        if (!cancelled) {
          if (err.status === 401 || err.status === 403) {
            navigate('/login')
          } else {
            setError('Failed to load data. Please try again.')
          }
        }
      } finally {
        if (!cancelled) setDataLoading(false)
      }
    }
    loadData()
    return () => { cancelled = true }
  }, [navigate])

  const recentSessions = sessions.slice(0, 4)

  const handleStart = async () => {
    setLoading(true)
    try {
      const newSession = await createSession({
        ...NEW_SESSION_TEMPLATE,
        taskLabel: taskName,
      })
      const [sessionsData, summaryData] = await Promise.all([
        fetchSessions(),
        fetchSessionSummary(),
      ])
      setSessions(sessionsData)
      setSummary(summaryData)
      setLoading(false)
      setShowModal(false)
      navigate(`/sessions/${newSession.id}`)
    } catch (err) {
      setLoading(false)
      if (err.status === 401 || err.status === 403) {
        navigate('/login')
      }
    }
  }

  if (dataLoading) {
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-600 flex items-center justify-center md:hidden">
            <Brain size={22} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">FlowSense</h1>
            <p className="text-sm text-slate-400">Understand how you experience time</p>
          </div>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors"
        >
          <Plus size={16} />
          New Session
        </button>
      </div>

      {/* Today's Summary Card */}
      <div className="bg-gradient-to-br from-purple-900/40 to-slate-800 border border-purple-500/30 rounded-2xl p-5">
        <p className="text-xs text-purple-400 uppercase tracking-wider mb-3">Today's Summary</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-xs text-slate-500">Last Session</p>
            <p className="text-sm font-semibold text-slate-200 mt-0.5">
              {summary?.lastSessionDate
                ? format(new Date(summary.lastSessionDate), 'MMM d')
                : '—'}
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Flow Time</p>
            <p className="text-sm font-semibold text-purple-400 mt-0.5">
              {summary?.todayFlowTimeMin ?? 0} min
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Avg STR</p>
            <p className="text-sm font-semibold text-teal-400 mt-0.5">
              {summary?.todayAvgSTR?.toFixed(2) ?? '—'}
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Longest Streak</p>
            <p className="text-sm font-semibold text-amber-400 mt-0.5">
              {summary?.todayLongestStreakMin ?? 0} min
            </p>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-3">
        <SummaryCard
          label="Total Sessions"
          value={summary?.totalSessions ?? 0}
          sub="all time"
          accent="slate"
        />
        <SummaryCard
          label="Weekly Flow"
          value={`${summary?.weeklyFlowTimeMin ?? 0}m`}
          sub="this week"
          accent="purple"
        />
        <SummaryCard
          label="Avg STR"
          value={summary?.avgSTRThisWeek?.toFixed(2) ?? '—'}
          sub="this week"
          accent="teal"
        />
      </div>

      {/* Recent Sessions */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-slate-100">Recent Sessions</h2>
          <button
            onClick={() => navigate('/sessions')}
            className="text-sm text-purple-400 hover:text-purple-300 transition-colors"
          >
            View all
          </button>
        </div>
        {recentSessions.length === 0 ? (
          <p className="text-slate-500 text-sm py-8 text-center">No sessions yet. Start your first session!</p>
        ) : (
          <div className="space-y-3">
            {recentSessions.map(session => (
              <SessionCard key={session.id} session={session} />
            ))}
          </div>
        )}
      </div>

      {/* New Session Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-white">Start New Session</h2>
              <button
                onClick={() => { setShowModal(false); setLoading(false) }}
                className="text-slate-400 hover:text-slate-200"
              >
                <X size={20} />
              </button>
            </div>

            {loading ? (
              <div className="py-10 flex flex-col items-center gap-4">
                <Loader2 size={40} className="text-purple-400 animate-spin" />
                <p className="text-slate-300 font-medium">Recording session...</p>
                <p className="text-sm text-slate-500">Analyzing flow state data</p>
              </div>
            ) : (
              <>
                <div className="mb-5">
                  <label className="block text-sm text-slate-400 mb-2">Task Type</label>
                  <div className="grid grid-cols-3 gap-2">
                    {TASK_TYPES.map(type => (
                      <button
                        key={type}
                        onClick={() => setTaskName(type)}
                        className={`flex flex-col items-center gap-1 p-3 rounded-xl border text-sm transition-colors ${
                          taskName === type
                            ? 'border-purple-500 bg-purple-600/20 text-purple-400'
                            : 'border-slate-700 text-slate-400 hover:border-slate-600'
                        }`}
                      >
                        <span className="text-xl">{TASK_ICONS[type]}</span>
                        {type}
                      </button>
                    ))}
                  </div>
                </div>
                <button
                  onClick={handleStart}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <Zap size={18} />
                  Start Session
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

