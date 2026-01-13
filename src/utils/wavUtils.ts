export function bufferToWave(abuffer: number[]): Blob {
  const numOfChan = 1;
  const sampleRate = 44100;
  const length = abuffer.length * numOfChan * 2 + 44;
  const buffer = new ArrayBuffer(length);
  const view = new DataView(buffer);
  let pos = 0;

  const setUint32 = (data: number) => { view.setUint32(pos, data, true); pos += 4; };
  const setUint16 = (data: number) => { view.setUint16(pos, data, true); pos += 2; };

  setUint32(0x46464952); // "RIFF"
  setUint32(length - 8);
  setUint32(0x45564157); // "WAVE"
  setUint32(0x20746d66); // "fmt "
  setUint32(16); setUint16(1); setUint16(numOfChan);
  setUint32(sampleRate);
  setUint32(sampleRate * 2); setUint16(2); setUint16(16);
  setUint32(0x61746164); // "data"
  setUint32(length - pos - 4);

  for (let i = 0; i < abuffer.length; i++) {
    let s = Math.max(-1, Math.min(1, abuffer[i]));
    view.setInt16(pos, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
    pos += 2;
  }

  return new Blob([buffer], { type: 'audio/wav' });
}