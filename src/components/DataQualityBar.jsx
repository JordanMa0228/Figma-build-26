const sensors = [
  { label: 'Eye Tracker', key: 'eye', color: 'bg-purple-500' },
  { label: 'EEG', key: 'eeg', color: 'bg-teal-500' },
  { label: 'Heart Rate', key: 'hr', color: 'bg-rose-500' },
]

export default function DataQualityBar({ quality }) {
  return (
    <div className="space-y-2">
      {sensors.map(({ label, key, color }) => (
        <div key={key} className="flex items-center gap-3">
          <span className="text-xs text-slate-400 w-24 shrink-0">{label}</span>
          <div className="flex-1 bg-slate-700 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all ${color}`}
              style={{ width: `${quality[key]}%` }}
            />
          </div>
          <span className="text-xs text-slate-400 w-8 text-right">{quality[key]}%</span>
        </div>
      ))}
    </div>
  )
}
