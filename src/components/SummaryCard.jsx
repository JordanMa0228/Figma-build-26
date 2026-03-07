export default function SummaryCard({ label, value, sub, accent }) {
  const accentClass = {
    purple: 'text-purple-400',
    teal: 'text-teal-400',
    amber: 'text-amber-400',
    slate: 'text-slate-300',
  }[accent] || 'text-slate-100'

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl p-4">
      <p className="text-xs text-slate-500 uppercase tracking-wider">{label}</p>
      <p className={`text-2xl font-bold mt-1 ${accentClass}`}>{value}</p>
      {sub && <p className="text-xs text-slate-500 mt-0.5">{sub}</p>}
    </div>
  )
}
