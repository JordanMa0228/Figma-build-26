import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { weeklyFlowData, avgSTRByTask, focusTimeOfDay, insights } from '../data/mockData'
import InsightCard from '../components/InsightCard'

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs shadow-xl">
        <p className="text-slate-400">{label}</p>
        <p className="font-bold text-purple-400">{payload[0].value} {payload[0].name === 'flowMin' ? 'min' : ''}</p>
      </div>
    )
  }
  return null
}

export default function Trends() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Trends</h1>
        <p className="text-sm text-slate-400 mt-1">Patterns across your sessions</p>
      </div>

      {/* Weekly Flow Time */}
      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-5">
        <h2 className="text-sm font-semibold text-slate-300 mb-4">Weekly Flow Time</h2>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={weeklyFlowData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis dataKey="day" tick={{ fill: '#94a3b8', fontSize: 11 }} tickLine={false} axisLine={{ stroke: '#334155' }} />
            <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} tickLine={false} axisLine={{ stroke: '#334155' }} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="flowMin" radius={[4, 4, 0, 0]}>
              {weeklyFlowData.map((entry, index) => (
                <Cell key={index} fill={entry.flowMin >= 50 ? '#8b5cf6' : '#6d28d9'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Avg STR by Task Type */}
      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-5">
        <h2 className="text-sm font-semibold text-slate-300 mb-1">Average STR by Task Type</h2>
        <p className="text-xs text-slate-500 mb-4">Lower STR = time flies (deep focus)</p>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={avgSTRByTask} layout="vertical" margin={{ top: 5, right: 30, left: 10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis type="number" domain={[0, 1.5]} tick={{ fill: '#94a3b8', fontSize: 11 }} tickLine={false} axisLine={{ stroke: '#334155' }} />
            <YAxis dataKey="task" type="category" tick={{ fill: '#94a3b8', fontSize: 11 }} tickLine={false} axisLine={{ stroke: '#334155' }} width={55} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="avgSTR" radius={[0, 4, 4, 0]}>
              {avgSTRByTask.map((entry, index) => (
                <Cell key={index} fill={entry.avgSTR < 1 ? '#8b5cf6' : '#f59e0b'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Focus Time of Day */}
      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-5">
        <h2 className="text-sm font-semibold text-slate-300 mb-1">Best Focus Time of Day</h2>
        <p className="text-xs text-slate-500 mb-4">Avg flow % by time of day</p>
        <ResponsiveContainer width="100%" height={160}>
          <BarChart data={focusTimeOfDay} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis dataKey="period" tick={{ fill: '#94a3b8', fontSize: 10 }} tickLine={false} axisLine={{ stroke: '#334155' }} />
            <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} tickLine={false} axisLine={{ stroke: '#334155' }} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="avgFlow" radius={[4, 4, 0, 0]}>
              {focusTimeOfDay.map((entry, index) => (
                <Cell key={index} fill={entry.avgFlow >= 60 ? '#14b8a6' : '#0d9488'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Insights */}
      <div>
        <h2 className="text-sm font-semibold text-slate-300 mb-3">Auto-generated Insights</h2>
        <div className="grid gap-3">
          {insights.map(insight => (
            <InsightCard key={insight.id} icon={insight.icon} text={insight.text} />
          ))}
        </div>
      </div>
    </div>
  )
}
