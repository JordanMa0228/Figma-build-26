import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ReferenceLine, ResponsiveContainer
} from 'recharts'

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const str = payload[0].value
    return (
      <div className="bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs shadow-xl">
        <p className="text-slate-400">t = {label} min</p>
        <p className="font-bold" style={{ color: str < 1 ? '#8b5cf6' : '#f59e0b' }}>
          STR: {str.toFixed(2)}
        </p>
        <p className="text-slate-500">{str < 1 ? 'Time feels faster' : 'Time feels slower'}</p>
      </div>
    )
  }
  return null
}

export default function STRChart({ timeseries }) {
  return (
    <ResponsiveContainer width="100%" height={180}>
      <LineChart data={timeseries} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
        <XAxis
          dataKey="t"
          tick={{ fill: '#94a3b8', fontSize: 11 }}
          tickLine={false}
          axisLine={{ stroke: '#334155' }}
          label={{ value: 'min', position: 'insideBottomRight', offset: 0, fill: '#64748b', fontSize: 10 }}
        />
        <YAxis
          domain={[0.3, 1.6]}
          tick={{ fill: '#94a3b8', fontSize: 11 }}
          tickLine={false}
          axisLine={{ stroke: '#334155' }}
        />
        <Tooltip content={<CustomTooltip />} />
        <ReferenceLine y={1.0} stroke="#64748b" strokeDasharray="4 4" label={{ value: 'STR=1.0', position: 'right', fill: '#64748b', fontSize: 10 }} />
        <Line
          type="monotone"
          dataKey="str"
          stroke="#8b5cf6"
          strokeWidth={2}
          dot={{ fill: '#8b5cf6', r: 3 }}
          activeDot={{ r: 5 }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
