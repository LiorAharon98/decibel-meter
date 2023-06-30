import { frequencyAction, decibelAction } from "../store/reduxStore";
let volumeCallback = null;
let volumeInterval = null;
const createAudioPermissionAndRecord = async (loop, dispatch, lastMin) => {
  try {
    const audioStream = await navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: true,
      },
    });
    const audioContext = new AudioContext();
    const audioSource = audioContext.createMediaStreamSource(audioStream);
    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 256;
    analyser.minDecibels = -127;
    analyser.maxDecibels = 0;
    analyser.smoothingTimeConstant = 0.4;
    audioSource.connect(analyser);
    const volumes = new Uint8Array(analyser.frequencyBinCount);

    volumeCallback = () => {
      dispatch(frequencyAction.getFrequency(Array.from(volumes)));
      analyser.getByteFrequencyData(volumes);
      let volumeSum = 0;
      for (const volume of volumes) volumeSum += volume;
      const averageVolume = volumeSum / volumes.length;
      // Value range: 127 = analyser.maxDecibels - analyser.minDecibels;
      let decibelNumNumber = ((averageVolume * 100) / 127).toFixed(0);

      lastMin.current.push(decibelNumNumber);

      dispatch(decibelAction.getDecibel(decibelNumNumber));

      // GENERATE CURRENT STATE AVG \\
      lastMin.sum += Number(lastMin.current[lastMin.current.length - 1]);
      lastMin.avg = Math.floor(Number(lastMin.sum / lastMin.current.length));
      lastMin.min = Math.min(lastMin.min, Number(lastMin.current[lastMin.current.length - 1]));
      lastMin.max = Math.max(lastMin.max, Number(lastMin.current[lastMin.current.length - 1]));
      if (lastMin.current.length > 240) {
        lastMin.min = 999;
        lastMin.sum = 0;
        lastMin.max = 0;
        lastMin.current = [];
      }
    };
  } catch (e) {
    console.error("Failed to initialize volume visualizer, simulating instead...", e);
    let lastVolume = 0;
    volumeCallback = () => {
      const volume = Math.min(Math.max(Math.random() * 100, 0.8 * lastVolume), 1.2 * lastVolume);
      lastVolume = volume;
    };
  }
};
const stop = () => {
  if (volumeInterval !== null) {
    clearInterval(volumeInterval);
    volumeInterval = null;
    return false;
  }
};
const start = () => {
  if (volumeCallback !== null && volumeInterval === null) volumeInterval = setInterval(volumeCallback, 250);
  return true;
};
export const audioFunc = { start, stop };
export default createAudioPermissionAndRecord;
