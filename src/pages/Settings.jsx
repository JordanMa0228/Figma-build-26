import { useState } from 'react'
import { Eye, Brain, Heart, Download, Cloud, HardDrive, CheckCircle2 } from 'lucide-react'

export default function Settings() {
  const [sensors, setSensors] = useState({ eye: true, eeg: true, hr: true })
  const [qualityThreshold, setQualityThreshold] = useState(80)
  const [flowSensitivity, setFlowSensitivity] = useState('Balanced')
  const [cloudSync, setCloudSync] = useState(false)
  const [exported, setExported] = useState(false)

  const handleExport = () => {
    setExported(true)
    setTimeout(() => setExported(false), 3000)
  }

  const Toggle = ({ checked, onChange }) => (
    <button
      onClick={() => onChange(!checked)}
      className={`relative w-11 h-6 rounded-full transition-colors ${checked ? 'bg-purple-600' : 'bg-slate-600'}`}
    >
      <span className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${checked ? 'translate-x-5' : 'translate-x-0'}`} />
    </button>
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="text-sm text-slate-400 mt-1">Configure your FlowSense experience</p>
      </div>

      {/* Sensor Permissions */}
      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-5">
        <h2 className="text-sm font-semibold text-slate-300 mb-4">Sensor Permissions</h2>
        <div className="space-y-4">
          {[
            { key: 'eye', label: 'Eye Tracker', icon: Eye, desc: 'Pupil dilation and gaze tracking' },
            { key: 'eeg', label: 'EEG', icon: Brain, desc: 'Brainwave monitoring' },
            { key: 'hr', label: 'Heart Rate / PPG', icon: Heart, desc: 'Cardiovascular monitoring' },
          ].map(({ key, label, icon: Icon, desc }) => (
            <div key={key} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-slate-700 flex items-center justify-center">
                  <Icon size={16} className="text-slate-400" />
                </div>
                <div>
                  <p className="text-sm text-slate-200">{label}</p>
                  <p className="text-xs text-slate-500">{desc}</p>
                </div>
              </div>
              <Toggle checked={sensors[key]} onChange={v => setSensors(prev => ({ ...prev, [key]: v }))} />
            </div>
          ))}
        </div>
      </div>

      {/* Data Quality Threshold */}
      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-5">
        <h2 className="text-sm font-semibold text-slate-300 mb-1">Data Quality Threshold</h2>
        <p className="text-xs text-slate-500 mb-4">Minimum quality % required for session recording</p>
        <div className="flex items-center gap-4">
          <input
            type="range"
            min={50}
            max={100}
            value={qualityThreshold}
            onChange={e => setQualityThreshold(Number(e.target.value))}
            className="flex-1 accent-purple-500"
          />
          <span className="text-sm font-bold text-purple-400 w-12 text-right">{qualityThreshold}%</span>
        </div>
      </div>

      {/* Flow Detection Sensitivity */}
      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-5">
        <h2 className="text-sm font-semibold text-slate-300 mb-4">Flow Detection Sensitivity</h2>
        <div className="flex gap-2">
          {['Conservative', 'Balanced', 'Aggressive'].map(mode => (
            <button
              key={mode}
              onClick={() => setFlowSensitivity(mode)}
              className={`flex-1 py-2 rounded-xl text-sm font-medium border transition-colors ${
                flowSensitivity === mode
                  ? 'border-purple-500 bg-purple-600/20 text-purple-400'
                  : 'border-slate-700 text-slate-400 hover:border-slate-600'
              }`}
            >
              {mode}
            </button>
          ))}
        </div>
        <p className="text-xs text-slate-600 mt-2">
          {flowSensitivity === 'Conservative' && 'Stricter thresholds — fewer but more confident Flow detections'}
          {flowSensitivity === 'Balanced' && 'Standard thresholds — balanced detection accuracy'}
          {flowSensitivity === 'Aggressive' && 'Looser thresholds — more Flow detections, higher false positive rate'}
        </p>
      </div>

      {/* Export */}
      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-5">
        <h2 className="text-sm font-semibold text-slate-300 mb-1">Export Data</h2>
        <p className="text-xs text-slate-500 mb-4">Download all session data as JSON</p>
        <button
          onClick={handleExport}
          className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-slate-200 px-4 py-2 rounded-xl text-sm font-medium transition-colors"
        >
          {exported ? <CheckCircle2 size={16} className="text-teal-400" /> : <Download size={16} />}
          {exported ? 'Exported!' : 'Export Session Data'}
        </button>
      </div>

      {/* Privacy */}
      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-5">
        <h2 className="text-sm font-semibold text-slate-300 mb-4">Privacy & Storage</h2>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-slate-700 flex items-center justify-center">
              {cloudSync ? <Cloud size={16} className="text-purple-400" /> : <HardDrive size={16} className="text-slate-400" />}
            </div>
            <div>
              <p className="text-sm text-slate-200">{cloudSync ? 'Cloud Sync' : 'Local Storage'}</p>
              <p className="text-xs text-slate-500">{cloudSync ? 'Syncing to FlowSense cloud' : 'Data stored on device only'}</p>
            </div>
          </div>
          <Toggle checked={cloudSync} onChange={setCloudSync} />
        </div>
      </div>
    </div>
  )
}
