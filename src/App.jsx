import React, { useState } from 'react'
import Upload from './components/Upload'
import Player from './components/Player'
import FxPanel from './components/FxPanel'
import ExportPanel from './components/ExportPanel'

function App() {
  const [audioFile, setAudioFile] = useState(null)
  const [processedAudio, setProcessedAudio] = useState(null)

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <h1 className="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
        GarciaMixer AI
      </h1>
      
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Upload onFileUpload={setAudioFile} />
          <Player audioFile={audioFile} onProcess={setProcessedAudio} />
        </div>
        
        <div className="space-y-6">
          <FxPanel />
          <ExportPanel processedAudio={processedAudio} />
        </div>
      </div>
    </div>
  )
}

export default Appp
