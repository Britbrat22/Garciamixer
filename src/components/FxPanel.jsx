import React, { useState } from 'react'
import * as Tone from 'tone'

const FxPanel = () => {
  const [effects, setEffects] = useState({
    reverb: { amount: 0, active: false },
    delay: { time: 0, feedback: 0, active: false },
    distortion: { amount: 0, active: false },
    filter: { frequency: 20000, type: 'lowpass', active: false }
  })

  const handleEffectChange = (effect, param, value) => {
    setEffects(prev => ({
      ...prev,
      [effect]: { ...prev[effect], [param]: value }
    }))
  }

  const toggleEffect = (effect) => {
    setEffects(prev => ({
      ...prev,
      [effect]: { ...prev[effect], active: !prev[effect].active }
    }))
  }

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Effects</h2>
      
      <div className="space-y-4">
        {Object.entries(effects).map(([effectName, effect]) => (
          <div key={effectName} className="border border-gray-700 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium capitalize">{effectName}</h3>
              <button
                onClick={() => toggleEffect(effectName)}
                className={`w-12 h-6 rounded-full transition-colors ${effect.active 
                  ? 'bg-cyan-600' : 'bg-gray-600'}`}
              >
                <div className={`w-5 h-5 bg-white rounded-full transition-transform ${effect.active 
                  ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>
            
            {effectName === 'reverb' && (
              <div>
                <label className="block text-sm text-gray-400 mb-2">Room Size</label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={effect.amount}
                  onChange={(e) => handleEffectChange(effectName, 'amount', parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>
            )}
            
            {effectName === 'delay' && (
              <div className="space-y-3">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Time (ms)</label>
                  <input
                    type="range"
                    min="0"
                    max="500"
                    value={effect.time}
                    onChange={(e) => handleEffectChange(effectName, 'time', parseInt(e.target.value))}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Feedback</label>
                  <input
                    type="range"
                    min="0"
                    max="0.9"
                    step="0.1"
                    value={effect.feedback}
                    onChange={(e) => handleEffectChange(effectName, 'feedback', parseFloat(e.target.value))}
                    className="w-full"
                  />
                </div>
              </div>
            )}
            
            {effectName === 'distortion' && (
              <div>
                <label className="block text-sm text-gray-400 mb-2">Amount</label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={effect.amount}
                  onChange={(e) => handleEffectChange(effectName, 'amount', parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>
            )}
            
            {effectName === 'filter' && (
              <div className="space-y-3">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Frequency</label>
                  <input
                    type="range"
                    min="20"
                    max="20000"
                    log="true"
                    value={effect.frequency}
                    onChange={(e) => handleEffectChange(effectName, 'frequency', parseInt(e.target.value))}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Type</label>
                  <select
                    value={effect.type}
                    onChange={(e) => handleEffectChange(effectName, 'type', e.target.value)}
                    className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2"
                  >
                    <option value="lowpass">Low Pass</option>
                    <option value="highpass">High Pass</option>
                    <option value="bandpass">Band Pass</option>
                  </select>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default FxPanel
