const STATE_CONFIG = {
  Flow: { color: '#8b5cf6', label: 'Flow' },
  Focused: { color: '#14b8a6', label: 'Focused' },
  Neutral: { color: '#64748b', label: 'Neutral' },
  Distracted: { color: '#f59e0b', label: 'Distracted' },
}

export default function FlowTimeline({ timeline, durationMin }) {
  return (
    <div className="w-full">
      <div className="relative h-12 flex rounded-lg overflow-hidden">
        {timeline.map((segment, i) => {
          const width = ((segment.endMin - segment.startMin) / durationMin) * 100
          const config = STATE_CONFIG[segment.state]
          return (
            <div
              key={i}
              className="relative group h-full flex items-center justify-center cursor-pointer"
              style={{ width: `${width}%`, backgroundColor: config.color }}
            >
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-10 bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs whitespace-nowrap shadow-xl">
                <p className="font-semibold" style={{ color: config.color }}>{config.label}</p>
                <p className="text-slate-300">{segment.startMin}–{segment.endMin} min</p>
                <p className="text-slate-400">Avg STR: {segment.avgSTR.toFixed(2)}</p>
              </div>
            </div>
          )
        })}
      </div>
      <div className="flex justify-between mt-1">
        <span className="text-xs text-slate-500">0 min</span>
        <span className="text-xs text-slate-500">{durationMin} min</span>
      </div>
      <div className="flex flex-wrap gap-3 mt-3">
        {Object.entries(STATE_CONFIG).map(([state, config]) => (
          <div key={state} className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: config.color }} />
            <span className="text-xs text-slate-400">{config.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
