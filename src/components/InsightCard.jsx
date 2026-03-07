export default function InsightCard({ icon, text }) {
  return (
    <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-4 flex gap-3 items-start backdrop-blur-sm">
      <span className="text-2xl">{icon}</span>
      <p className="text-sm text-slate-300 leading-relaxed">{text}</p>
    </div>
  )
}
