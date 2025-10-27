export function downsample(array: number[], factor: number): number[] {
  const result: number[] = [];
  for (let i = 0; i < array.length; i += factor) {
    result.push(array[i]);
  }
  return result;
}

export function removeDCOffset(data: number[]): number[] {
  const mean = data.reduce((sum, val) => sum + val, 0) / data.length;
  return data.map((val) => val - mean);
}

export function applyHanningWindow(data: number[], windowSize = 1000): number[] {
  const windowed = [...data];
  const halfWindow = Math.floor(windowSize / 2);

  for (let i = 0; i < Math.min(halfWindow, windowed.length); i++) {
    const windowVal = 0.5 * (1 - Math.cos((2 * Math.PI * i) / windowSize));
    windowed[i] *= windowVal;
  }

  for (
    let i = Math.max(0, windowed.length - halfWindow);
    i < windowed.length;
    i++
  ) {
    const windowVal =
      0.5 *
      (1 - Math.cos((2 * Math.PI * (windowed.length - 1 - i)) / windowSize));
    windowed[i] *= windowVal;
  }

  return windowed;
}

export function highOrderBandpassFilter(
  data: number[],
  lowCutoff: number,
  highCutoff: number,
  sampleRate: number,
  order = 4
): number[] {
  let filteredData = [...data];

  for (let i = 0; i < order; i++) {
    filteredData = highPassFilterStage(filteredData, lowCutoff, sampleRate);
    filteredData = lowPassFilterStage(filteredData, highCutoff, sampleRate);
  }

  return filteredData;
}

function highPassFilterStage(
  data: number[],
  cutoffHz: number,
  sampleRate: number
): number[] {
  const nyquist = sampleRate / 2;
  const normalizedCutoff = cutoffHz / nyquist;

  const omega = Math.tan((Math.PI * normalizedCutoff) / 2);
  const k = 1 / (1 + Math.sqrt(2) * omega + omega * omega);

  const a0 = k;
  const a1 = -2 * k;
  const a2 = k;
  const b1 = 2 * k * (omega * omega - 1);
  const b2 = k * (1 - Math.sqrt(2) * omega + omega * omega);

  const filtered = new Array(data.length);

  const initialValue =
    data.slice(0, 10).reduce((sum, val) => sum + val, 0) / 10;
  filtered[0] = initialValue;
  filtered[1] = data[1];

  for (let i = 2; i < data.length; i++) {
    filtered[i] =
      a0 * data[i] +
      a1 * data[i - 1] +
      a2 * data[i - 2] -
      b1 * filtered[i - 1] -
      b2 * filtered[i - 2];
  }

  return filtered;
}

function lowPassFilterStage(
  data: number[],
  cutoffHz: number,
  sampleRate: number
): number[] {
  const nyquist = sampleRate / 2;
  const normalizedCutoff = cutoffHz / nyquist;

  const omega = Math.tan((Math.PI * normalizedCutoff) / 2);
  const k = 1 / (1 + Math.sqrt(2) * omega + omega * omega);

  const a0 = k * omega * omega;
  const a1 = 2 * a0;
  const a2 = a0;
  const b1 = 2 * k * (omega * omega - 1);
  const b2 = k * (1 - Math.sqrt(2) * omega + omega * omega);

  const filtered = new Array(data.length);

  const initialValue =
    data.slice(0, 10).reduce((sum, val) => sum + val, 0) / 10;
  filtered[0] = initialValue;
  filtered[1] = data[1];

  for (let i = 2; i < data.length; i++) {
    filtered[i] =
      a0 * data[i] +
      a1 * data[i - 1] +
      a2 * data[i - 2] -
      b1 * filtered[i - 1] -
      b2 * filtered[i - 2];
  }

  return filtered;
}

export function zeroPhaseFilter(
  data: number[],
  lowCutoff: number,
  highCutoff: number,
  sampleRate: number
): number[] {
  const forward = highOrderBandpassFilter(
    data,
    lowCutoff,
    highCutoff,
    sampleRate,
    3
  );
  const reversed = forward.slice().reverse();
  const backward = highOrderBandpassFilter(
    reversed,
    lowCutoff,
    highCutoff,
    sampleRate,
    3
  );
  const result = backward.slice().reverse();

  return result;
}

export function processHeartSoundData(
  data: number[],
  sampleRate: number
): number[] {
  let processed = removeDCOffset(data);
  processed = zeroPhaseFilter(processed, 10, 100, sampleRate);
  processed = applyHanningWindow(processed, 2000);

  const transientSamples = Math.floor(0.5 * sampleRate);
  if (processed.length > 2 * transientSamples) {
    processed = processed.slice(transientSamples, -transientSamples);
  }

  return processed;
}

export function extractAndProcessMiddleSegment(
  data: number[],
  sampleRate: number
): number[] {
  const startSample = Math.floor(25 * sampleRate);
  const endSample = Math.floor(45 * sampleRate);
  const extendedData = data.slice(startSample, endSample);

  const processedData = processHeartSoundData(extendedData, sampleRate);

  const processedStartSample = Math.floor(2.5 * sampleRate);
  const processedEndSample = Math.floor(12.5 * sampleRate);

  if (processedData.length > processedEndSample) {
    return processedData.slice(processedStartSample, processedEndSample);
  } else {
    return processedData;
  }
}

