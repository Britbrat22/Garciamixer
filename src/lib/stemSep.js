import * as ort from 'onnxruntime-web'

let demucsSession = null

export const loadDemucsModel = async () => {
  if (!demucsSession) {
    demucsSession = await ort.InferenceSession.create('/models/demucs.onnx')
  }
  return demucsSession
}

export const separateStems = async (audioBuffer) => {
  await loadDemucsModel()
  // TODO: implement real stem separation
  return audioBuffer
}
