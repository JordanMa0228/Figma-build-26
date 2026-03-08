import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Filter, Loader2 } from 'lucide-react'
import { fetchSessions } from '../api/sessions'
import SessionCard from '../components/SessionCard'

const TASK_TYPES = ['All', 'Coding', 'Poker', 'Class', 'Music', 'Email']

export default function Sessions() {
  const navigate = useNavigate()
  const [filterTask, setFilterTask] = useState('All')
  const [sessions, setSessions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    async function loadSessions() {
      try {
        const data = await fetchSessions()
        if (!cancelled) setSessions(data)
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

  const filtered = filterTask === 'All'
    ? sessions
    : sessions.filter(s => s.taskLabel === filterTask)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Sessions</h1>
        <p className="text-sm text-slate-400 mt-1">All recorded focus sessions</p>
      </div>

      {/* Filter Bar */}
      <div className="flex items-center gap-2 flex-wrap">
        <Filter size={14} className="text-slate-500" />
        {TASK_TYPES.map(type => (
          <button
            key={type}
            onClick={() => setFilterTask(type)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              filterTask === type
                ? 'bg-purple-600 text-white'
                : 'bg-slate-800 border border-slate-700 text-slate-400 hover:border-slate-600'
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Sessions List */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 size={28} className="text-purple-400 animate-spin" />
        </div>
      ) : error ? (
        <p className="text-slate-400 text-sm py-8 text-center">{error}</p>
      ) : (
        <div className="space-y-3">
          {filtered.length === 0 ? (
            <p className="text-slate-500 text-sm py-8 text-center">No sessions found.</p>
          ) : (
            filtered.map(session => (
              <SessionCard key={session.id} session={session} />
            ))
          )}
        </div>
      )}

      {!loading && !error && (
        <p className="text-xs text-slate-600 text-center">
          {filtered.length} session{filtered.length !== 1 ? 's' : ''}
        </p>
      )}
    </div>
  )
}
