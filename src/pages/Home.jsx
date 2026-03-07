import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Brain, Plus, Clock, Zap, Activity, X, Loader2 } from 'lucide-react'
import { format } from 'date-fns'
import { sessions, todaySummary, weeklyStats } from '../data/mockData'
import SessionCard from '../components/SessionCard'
import SummaryCard from '../components/SummaryCard'

const TASK_TYPES = ['Coding', 'Poker', 'Class', 'Music', 'Email']
const TASK_ICONS = { Coding: '💻', Poker: '🃏', Class: '📚', Music: '🎵', Email: '📧' }

export default function Home() {
  const navigate = useNavigate()
  const [showModal, setShowModal] = useState(false)
  const [taskName, setTaskName] = useState('Coding')
  const [loading, setLoading] = useState(false)
  const recentSessions = sessions.slice(0, 4)

  const handleStart = () => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setShowModal(false)
      navigate('/sessions/session-001')
    }, 3000)
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
              {format(new Date(todaySummary.lastSessionDate), 'MMM d')}
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Flow Time</p>
            <p className="text-sm font-semibold text-purple-400 mt-0.5">{todaySummary.totalFlowTimeMin} min</p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Avg STR</p>
            <p className="text-sm font-semibold text-teal-400 mt-0.5">{todaySummary.avgSTR.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Longest Streak</p>
            <p className="text-sm font-semibold text-amber-400 mt-0.5">{todaySummary.longestFlowStreakMin} min</p>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-3">
        <SummaryCard
          label="Total Sessions"
          value={weeklyStats.totalSessions}
          sub="all time"
          accent="slate"
        />
        <SummaryCard
          label="Weekly Flow"
          value={`${weeklyStats.weeklyFlowTimeMin}m`}
          sub="this week"
          accent="purple"
        />
        <SummaryCard
          label="Avg STR"
          value={weeklyStats.avgSTRThisWeek.toFixed(2)}
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
        <div className="space-y-3">
          {recentSessions.map(session => (
            <SessionCard key={session.id} session={session} />
          ))}
        </div>
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
