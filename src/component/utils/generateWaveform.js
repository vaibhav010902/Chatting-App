export const generateWaveform = async (audioBlob) => {
    const audioCtx = new AudioContext();
  
    const buffer = await audioBlob.arrayBuffer();
    const audioBuffer = await audioCtx.decodeAudioData(buffer);
  
    const rawData = audioBuffer.getChannelData(0);
    const samples = 50;
    const blockSize = Math.floor(rawData.length / samples);
    const waveform = [];
  
    for (let i = 0; i < samples; i++) {
      let sum = 0;
      for (let j = 0; j < blockSize; j++) {
        sum += Math.abs(rawData[i * blockSize + j]);
      }
      waveform.push(sum / blockSize);
    }
  
    audioCtx.close();
  
    // normalize
    const max = Math.max(...waveform);
    return waveform.map(v => v / max);
  };
  