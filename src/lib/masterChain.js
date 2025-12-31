export const masterAudio = async (audioBuffer) => {
  try {
    const offlineContext = new OfflineAudioContext(
      audioBuffer.numberOfChannels,
      audioBuffer.length,
      audioBuffer.sampleRate
    )
    
    const source = offlineContext.createBufferSource()
    source.buffer = audioBuffer
    
    // Create mastering chain
    const compressor = offlineContext.createDynamicsCompressor()
    const lowShelf = offlineContext.createBiquadFilter()
    const highShelf = offlineContext.createBiquadFilter()
    const limiter = offlineContext.createDynamicsCompressor()
    
    // Configure mastering chain
    compressor.threshold.setValueAtTime(-18, offlineContext.currentTime)
    compressor.knee.setValueAtTime(30, offlineContext.currentTime)
    compressor.ratio.setValueAtTime(3, offlineContext.currentTime)
    compressor.attack.setValueAtTime(0.003, offlineContext.currentTime)
    compressor.release.setValueAtTime(0.25, offlineContext.currentTime)
    
    lowShelf.type = 'lowshelf'
    lowShelf.frequency.setValueAtTime(320, offlineContext.currentTime)
    lowShelf.gain.setValueAtTime(2, offlineContext.currentTime)
    
    highShelf.type = 'highshelf'
    highShelf.frequency.setValueAtTime(3200, offlineContext.currentTime)
    highShelf.gain.setValueAtTime(1, offlineContext.currentTime)
    
    // Waves L3 style multi-band limiter (simplified)
    limiter.threshold.setValueAtTime(-6, offlineContext.currentTime)
    limiter.knee.setValueAtTime(0, offlineContext.currentTime)
    limiter.ratio.setValueAtTime(20, offlineContext.currentTime)
    limiter.attack.setValueAtTime(0.001, offlineContext.currentTime)
    limiter.release.setValueAtTime(0.1, offlineContext.currentTime)
    
    // Connect chain
    source
      .connect(compressor)
      .connect(lowShelf)
      .connect(highShelf)
      .connect(limiter)
      .connect(offlineContext.destination)
    
    source.start()
    
    // Render mastered audio
    const masteredBuffer = await offlineContext.startRendering()
    return masteredBuffer
    
  } catch (error) {
    console.error('Mastering error:', error)
    return audioBuffer // Return original on error
  }
}
