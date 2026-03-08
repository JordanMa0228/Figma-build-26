import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Tag, Loader2 } from 'lucide-react'
import { format } from 'date-fns'
import { fetchSessionById } from '../api/sessions'
import FlowTimeline from '../components/FlowTimeline'
import STRChart from '../components/STRChart'
import SummaryCard from '../components/SummaryCard'
import DataQualityBar from '../components/DataQualityBar'

const ANNOTATIONS = ['Very focused', 'Distracted', 'Flow zone', 'Tired', 'Energized']
const TASK_TYPES = ['Coding', 'Poker', 'Class', 'Music', 'Email']
const TASK_ICONS = { Coding: '💻', Poker: '🃏', Class: '📚', Music: '🎵', Email: '📧' }

export default function SessionDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeAnnotations, setActiveAnnotations] = useState([])
  const [taskLabel, setTaskLabel] = useState('Coding')

  useEffect(() => {
    let cancelled = false
    async function loadSession() {
      try {
        const data = await fetchSessionById(id)
        if (!cancelled) {
          setSession(data)
          setTaskLabel(data.taskLabel || 'Coding')
        }
      } catch (err) {
        if (!cancelled) {
          if (err.status === 401 || err.status === 403) {
            navigate('/login')
          } else if (err.status === 404) {
            setError('not-found')
          } else {
            setError('error')
          }
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    loadSession()
    return () => { cancelled = true }
  }, [id, navigate])

  const toggleAnnotation = (tag) => {
    setActiveAnnotations(prev =>
      prev.includes(tag) ? prev.filter(a => a !== tag) : [...prev, tag]
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 size={32} className="text-purple-400 animate-spin" />
      </div>
    )
  }

  if (error === 'not-found' || !session) {
    return (
      <div className="text-center py-20">
        <p className="text-slate-400">Session not found.</p>
        <button onClick={() => navigate('/sessions')} className="mt-4 text-purple-400 hover:text-purple-300 text-sm">
          ← Back to Sessions
        </button>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <p className="text-slate-400">Failed to load session.</p>
        <button onClick={() => navigate('/sessions')} className="mt-4 text-purple-400 hover:text-purple-300 text-sm">
          ← Back to Sessions
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <button
          onClick={() => navigate('/sessions')}
          className="flex items-center gap-1 text-slate-400 hover:text-slate-200 text-sm mb-3 transition-colors"
        >
          <ArrowLeft size={14} /> Back to Sessions
        </button>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{TASK_ICONS[taskLabel]}</span>
            <div>
              <h1 className="text-2xl font-bold text-white">{taskLabel}</h1>
              <p className="text-sm text-slate-400">
                {format(new Date(session.date), 'EEEE, MMMM d, yyyy')}
                {session.startTime && session.endTime ? ` · ${session.startTime}–${session.endTime}` : ''}
              </p>
              <p className="text-xs text-slate-500 mt-0.5">{session.durationMin} minutes total</p>
            </div>
          </div>
          {/* Task Label Edit */}
          <div className="flex flex-wrap gap-1 mt-1">
            {TASK_TYPES.map(type => (
              <button
                key={type}
                onClick={() => setTaskLabel(type)}
                className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${
                  taskLabel === type
                    ? 'border-purple-500 bg-purple-600/20 text-purple-400'
                    : 'border-slate-700 text-slate-500 hover:border-slate-600'
                }`}
              >
                {TASK_ICONS[type]} {type}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Flow Timeline Chart */}
      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-5">
        <h2 className="text-sm font-semibold text-slate-300 mb-4">Flow State Timeline</h2>
        <FlowTimeline timeline={session.flowTimeline} durationMin={session.durationMin} />
      </div>

      {/* STR Curve */}
      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-5">
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-sm font-semibold text-slate-300">Subjective Time Rate (STR)</h2>
        </div>
        <p className="text-xs text-slate-500 mb-4">
          Below 1.0 = time feels faster (Flow) · Above 1.0 = time feels slower
        </p>
        <STRChart timeseries={session.strTimeseries} />
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <SummaryCard
          label="Flow Time"
          value={`${Math.round(session.durationMin * session.flowRatio)} min`}
          sub={`${session.flowPercent}% of session`}
          accent="purple"
        />
        <SummaryCard
          label="Longest Streak"
          value={`${session.longestFlowStreakMin} min`}
          sub="continuous flow"
          accent="teal"
        />
        <SummaryCard
          label="Avg STR"
          value={session.avgSTR.toFixed(2)}
          sub={session.avgSTR < 1 ? 'time felt faster' : 'time felt slower'}
          accent={session.avgSTR < 1 ? 'purple' : 'amber'}
        />
        <SummaryCard
          label="Peak STR"
          value={session.peakSTR.toFixed(2)}
          sub="lowest value (fastest)"
          accent="purple"
        />
      </div>

      {/* Data Quality */}
      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-5">
        <h2 className="text-sm font-semibold text-slate-300 mb-4">Sensor Data Quality</h2>
        <DataQualityBar quality={session.dataQuality} />
        <p className="text-xs text-slate-600 mt-3">
          Quality score: {Math.round((session.dataQuality.eye + session.dataQuality.eeg + session.dataQuality.hr) / 3)}%
        </p>
      </div>

      {/* User Annotations */}
      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <Tag size={14} className="text-slate-400" />
          <h2 className="text-sm font-semibold text-slate-300">Annotations</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          {ANNOTATIONS.map(tag => (
            <button
              key={tag}
              onClick={() => toggleAnnotation(tag)}
              className={`text-sm px-3 py-1.5 rounded-full border transition-colors ${
                activeAnnotations.includes(tag)
                  ? 'border-purple-500 bg-purple-600/20 text-purple-400'
                  : 'border-slate-700 text-slate-400 hover:border-slate-600'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
        {activeAnnotations.length > 0 && (
          <p className="text-xs text-slate-500 mt-3">
            Tagged: {activeAnnotations.join(', ')}
          </p>
        )}
      </div>
    </div>
  )
}
