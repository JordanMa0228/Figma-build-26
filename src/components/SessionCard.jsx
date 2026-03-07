import { useNavigate } from 'react-router-dom'
import { format } from 'date-fns'

const stateColors = {
  Flow: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  Focused: 'bg-teal-500/20 text-teal-400 border-teal-500/30',
  Neutral: 'bg-slate-500/20 text-slate-400 border-slate-500/30',
  Distracted: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
}

const strColor = (str) => {
  if (str <= 0.7) return 'text-purple-400'
  if (str <= 0.9) return 'text-teal-400'
  if (str <= 1.1) return 'text-slate-300'
  return 'text-amber-400'
}

export default function SessionCard({ session }) {
  const navigate = useNavigate()

  return (
    <div
      onClick={() => navigate(`/sessions/${session.id}`)}
      className="bg-slate-800 border border-slate-700 rounded-xl p-4 cursor-pointer hover:border-slate-600 hover:bg-slate-750 transition-all group"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{session.taskIcon}</span>
          <div>
            <h3 className="font-semibold text-slate-100 group-hover:text-white transition-colors">
              {session.taskLabel}
            </h3>
            <p className="text-sm text-slate-400">
              {format(new Date(session.date), 'MMM d, yyyy')} · {session.startTime}–{session.endTime}
            </p>
          </div>
        </div>
        <div className="text-right">
          <span className={`text-sm font-bold ${strColor(session.avgSTR)}`}>
            STR {session.avgSTR.toFixed(2)}
          </span>
          <p className="text-xs text-slate-500 mt-0.5">{session.durationMin} min</p>
        </div>
      </div>
      <div className="mt-3 flex items-center gap-2 flex-wrap">
        <span className={`text-xs px-2 py-0.5 rounded-full border ${session.flowPercent >= 50 ? stateColors.Flow : stateColors.Neutral}`}>
          {session.flowPercent}% Flow
        </span>
        <span className="text-xs text-slate-500">
          Peak STR: <span className={strColor(session.peakSTR)}>{session.peakSTR.toFixed(2)}</span>
        </span>
        <span className="text-xs text-slate-500">
          Streak: {session.longestFlowStreakMin} min
        </span>
      </div>
    </div>
  )
}
