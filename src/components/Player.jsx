import React, { useState, useRef, useEffect } from 'react'
import WavesurferPlayer from '@wavesurfer/react'
import { separateStems } from '../lib/stemSep'
import { cleanVoice } from '../lib/voiceClean'
import { generateBeat } from '../lib/beatReplace'

const Player = ({ audioFile, onProcess }) => {
  const [wavesurfer, setWavesurfer] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [isProcessing, setIsProcessing] = useState(false)
  const [activeTab, setActiveTab] = useState('stems')

  const onReady = (ws) => {
    setWavesurfer(ws)
    setDuration(ws.getDuration())
  }

  const onPlayPause = () => {
    if (wavesurfer) {
      wavesurfer.playPause()
    }
  }

  const handleProcess = async () => {
    if (!audioFile || !wavesurfer) return
    
    setIsProcessing(true)
    try {
      let processedBuffer
      const audioBuffer = await wavesurfer.backend.buffer

      switch (activeTab) {
        case 'stems':
          processedBuffer = await separateStems(audioBuffer)
          break
        case 'voice':
          processedBuffer = await cleanVoice(audioBuffer)
          break
        case 'beat':
          processedBuffer = await generateBeat(audioBuffer)
          break
        default:
          processedBuffer = audioBuffer
      }

      onProcess(processedBuffer)
    } catch (error) {
      console.error('Processing error:', error)
    } finally {
      setIsProcessing(false)
    }
  }

  useEffect(() => {
    if (wavesurfer) {
      const timer = setInterval(() => {
        setCurrentTime(wavesurfer.getCurrentTime())
      }, 100)
      return () => clearInterval(timer)
    }
  }, [wavesurfer])

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Audio Player</h2>
      
      {audioFile ? (
        <>
          <WavesurferPlayer
            height={100}
            waveColor="#8B5CF6"
            progressColor="#06B6D4"
            url={audioFile.url}
            onReady={onReady}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
          />
          
          <div className="flex items-center justify-between mt-4">
            <button
              onClick={onPlayPause}
              className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg transition-colors"
            >
              {isPlaying ? 'Pause' : 'Play'}
            </button>
            
            <div className="text-sm text-gray-400">
              {Math.floor(currentTime)}s / {Math.floor(duration)}s
            </div>
          </div>

          <div className="mt-6">
            <div className="flex space-x-4 mb-4">
              {['stems', 'voice', 'beat'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-lg transition-colors ${activeTab === tab 
                    ? 'bg-cyan-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
                >
                  {tab === 'stems' ? 'Stem Separation' : 
                   tab === 'voice' ? 'Voice Clean' : 'Beat Replace'}
                </button>
              ))}
            </div>

            <button
              onClick={handleProcess}
              disabled={isProcessing}
              className="w-full bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 
                hover:to-cyan-700 disabled:opacity-50 px-4 py-3 rounded-lg font-semibold transition-all"
            >
              {isProcessing ? 'Processing...' : `Process ${activeTab}`}
            </button>
          </div>
        </>
      ) : (
        <div className="text-center py-12 text-gray-400">
          <div className="text-4xl mb-4">🎧</div>
          <p>Upload an audio file to get started</p>
        </div>
      )}
    </div>
  )
}

export default Player
