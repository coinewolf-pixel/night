import { useState } from 'react'
import { AlertTriangle } from 'lucide-react'

export default function AdminSettings() {
  const [settings, setSettings] = useState({
    maintenanceMode: false,
    registrationOpen: true,
    minAge: 21,
    maxStreakBonus: 500,
  })

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold mb-4">Settings</h2>

      <div className="glass-panel p-4 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="font-medium text-sm">Maintenance Mode</div>
            <div className="text-[10px] text-gray-400">Disable game access for all players</div>
          </div>
          <button 
            onClick={() => setSettings(s => ({...s, maintenanceMode: !s.maintenanceMode}))}
            className={`w-12 h-6 rounded-full transition-colors ${settings.maintenanceMode ? 'bg-nexo-pink' : 'bg-white/10'}`}
          >
            <div className={`w-5 h-5 rounded-full bg-white transition-transform ${settings.maintenanceMode ? 'translate-x-6' : 'translate-x-0.5'}`} />
          </button>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <div className="font-medium text-sm">Registration</div>
            <div className="text-[10px] text-gray-400">Allow new signups</div>
          </div>
          <button 
            onClick={() => setSettings(s => ({...s, registrationOpen: !s.registrationOpen}))}
            className={`w-12 h-6 rounded-full transition-colors ${settings.registrationOpen ? 'bg-nexo-success' : 'bg-white/10'}`}
          >
            <div className={`w-5 h-5 rounded-full bg-white transition-transform ${settings.registrationOpen ? 'translate-x-6' : 'translate-x-0.5'}`} />
          </button>
        </div>

        <div>
          <div className="font-medium text-sm mb-1">Minimum Age</div>
          <input 
            type="number" 
            value={settings.minAge} 
            onChange={e => setSettings(s => ({...s, minAge: parseInt(e.target.value)}))}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm"
          />
        </div>
      </div>

      <div className="glass-panel p-4 border-yellow-500/20">
        <div className="flex items-center gap-2 text-yellow-400 mb-2">
          <AlertTriangle size={16} />
          <span className="font-medium text-sm">Danger Zone</span>
        </div>
        <p className="text-xs text-gray-400 mb-3">These actions cannot be undone.</p>
        <button className="w-full py-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm hover:bg-red-500/20 transition-colors">
          Reset All Player Progress
        </button>
      </div>
    </div>
  )
}
