import { ComputeLabels, WithIsLabelValid, Label, labels } from './labels';
import { Mood, Gravity, Weight, Intensity, Soul } from './mood';
export * from './mood';
export * as v from './urls';

export type SetOptional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export function getLabelsImpliedByLabel(labels: string) {
  const allLabels = labels.split(/\s+/).filter(Boolean);
  const impliedByLabel = new Map<string, Set<string>>();
  const getBy = (key: string) => {
    if(impliedByLabel.has(key)) return impliedByLabel.get(key)!;
    const set = new Set<string>();
    impliedByLabel.set(key, set);
    return set;
  };
  // dreadful
  for(const label of allLabels) {
    const breadcrumbs = [];
    let subject = '';
    for(const c of label) {
      if(c === '[') {
        breadcrumbs.push(subject);
        subject = '';
      } else if(c === ']') {
        const target = breadcrumbs.pop()!;
        getBy(target).add(subject);
        subject = target;
      } else {
        subject += c;
      }
    }
  }
  return impliedByLabel;
}
// Because TDZ
s.labelsImpliedByLabel = undefined as undefined | ReturnType<typeof getLabelsImpliedByLabel>;

export function s<TLabel extends string = 'voice'>(
  play: song | (() => song),
  ...[mood = {}, isValid]: [mood?: Partial<{
    w: number,
    s: number,
    i: number,
    g: number,
    m: number,
    l: TLabel,
  }>, ...WithIsLabelValid<ComputeLabels<TLabel>>]
): Source {
  const rawLabels = (mood.l ?? '').split(' ').filter(Boolean);
  const labelSet = new Set<Label>();
  function addImplied(label: string) {
    labelSet.add(label as Label);
    const implied = (s.labelsImpliedByLabel ??= getLabelsImpliedByLabel(labels)).get(label);
    implied?.forEach(addImplied);
  }
  rawLabels.forEach(addImplied);

  return {
    play: play instanceof Function ? play : () => play,
    labels: labelSet,
    weight: mood.w ?? Weight.STANDARD,
    mood: {
      soul: mood.s ?? 0,
      intensity: mood.i ?? 0,
      gravity: mood.g ?? 0,
      sentimental: mood.m ?? 0,
    },
  }
}

function makeGaussian(standardDeviation: number) {
  const denominator = (2 * standardDeviation ** 2);
  return (x: number) => Math.pow(Math.E, -x * x / denominator);
}
const makeSigmoid = (spread: number) =>
  (x: number) => 1 / (1 + Math.exp(-spread * x));
const sampleSigmoid = makeSigmoid(1);

// If intensityDeltaDeviation is equal to or greater than intensityDeltaIdeal, then there is no inclined motion
interface RunSetup {
  soulInitial: number;
  soulAccumulate: number;
  soulPower: number;
  // intensityInitial: number;
  // intensityDeltaIdeal: number;
  // intensityDeltaDeviation: number;
  intensityPeriod: number;
  intensityTargetMinimum: number;
  intensityTargetMaximum: number;
  intensityDeltaDeviation: number;
  intensityCosPhaseRadians: number;
  gravityInitial: number;
  gravityAcceptableDifference: number;
  replayHalfway: number;
  replayUnplayable: number;
}
export interface Source {
  play: () => song;
  mood: Mood;
  labels: Set<Label>;
  weight: number;
}
export function* runSources(sources: Source[], setup: RunSetup): Generator<song> {
  let soulBudget = setup.soulInitial;
  // let currentIntensity = setup.intensityInitial;
  let currentGravity = setup.gravityInitial;
  // const sampleGaussian = makeGaussian(setup.intensityDeltaDeviation);
  // const sampleIntensity = ((deltaIdeal) => (x: number) => sampleGaussian(x - deltaIdeal) + sampleGaussian(x + deltaIdeal))(setup.intensityDeltaIdeal);
  const sampleIntensity = makeGaussian(setup.intensityDeltaDeviation);
  const intensityAmplitude = setup.intensityTargetMaximum - setup.intensityTargetMinimum;
  const intensityOffset = intensityAmplitude / 2 + setup.intensityTargetMinimum;
  const replayRadius = setup.replayHalfway - setup.replayUnplayable;
  const replayMemory = Math.ceil(setup.replayHalfway + replayRadius);
  const history = new Array<Source>(replayMemory);
  const sampleReplayWeight = (x: number) => {
    if(x === -1 || x > replayMemory) return 1;
    if(x < setup.replayUnplayable) return 0;
    // consider to be unplayable when |δ| ≥ 5 if σ(δ)
    return sampleSigmoid((x - setup.replayHalfway) / replayRadius * 5);
  }

  let x=0;
  let lastIntensity: number | undefined;
  while(true) {
    const targetIntensity = Math.cos(x / (2 * Math.PI * setup.intensityPeriod) + setup.intensityCosPhaseRadians) + intensityOffset;
    const replayWeights = new Map<Source, object>();
    const source = sources.pick((source) => {
      const { mood: { intensity, soul, gravity }} = source;
      if(soul > soulBudget) return 0;
      if(Math.abs(gravity - currentGravity) > setup.gravityAcceptableDifference) return 0;
      const soulWeight = (soul / soulBudget) ** setup.soulPower;
      const intensityWeight = sampleIntensity(intensity - targetIntensity);
      const replayOffset = history.indexOf(source);
      const replayWeight = sampleReplayWeight(replayOffset);
      const weight = soulWeight * intensityWeight * replayWeight * source.weight;
      const data = { setup: { targetIntensity, replayOffset, soulBudget, currentGravity }, soulWeight, intensityWeight, replayWeight, sourceWeight: source.weight, weight };
      replayWeights.set(source, data);
      return weight;
    }) ?? (yield silence(10), sources.pick());
    if(source === undefined) return; // `sources` was empty. Just end the playlist then.
    const { mood } = source;
    // currentIntensity = mood.intensity;
    currentGravity = mood.gravity;
    soulBudget -= mood.soul;
    soulBudget += setup.soulAccumulate;
    const thisIntensity = mood.intensity;
    if(lastIntensity) {
      const duration = 8 * (1 - Math.pow(thisIntensity / 76, 0.8));
      yield silence(duration * Math.random(0.85, 1.15));
    }
    lastIntensity = thisIntensity;
    yield source.play();

    history.unshift(source);
    history.length = replayMemory;
    x = (x + 1) % setup.intensityPeriod;
  }
}
