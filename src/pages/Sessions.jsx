import { useState, useEffect } from 'react'
import { Filter, Loader2 } from 'lucide-react'
import { api } from '../api/client'
import { mapSession } from '../utils/mapSession'
import SessionCard from '../components/SessionCard'

const TASK_TYPES = ['All', 'Coding', 'Poker', 'Class', 'Music', 'Email']

export default function Sessions() {
  const [filterTask, setFilterTask] = useState('All')
  const [sessions, setSessions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    api.getSessions()
      .then(data => setSessions(data.map(mapSession)))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

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
        <div className="py-16 flex justify-center">
          <Loader2 size={32} className="text-purple-400 animate-spin" />
        </div>
      ) : error ? (
        <p className="text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg px-4 py-3">
          {error}
        </p>
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
        <p className="text-xs text-slate-600 text-center">{filtered.length} session{filtered.length !== 1 ? 's' : ''}</p>
      )}
    </div>
  )
}
