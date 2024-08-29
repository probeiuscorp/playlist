import { ComputeLabels, WithIsLabelValid, Label } from './labels';
import { Mood, Gravity, Weight } from './mood';
export * from './mood';
export * as v from './urls';

export type SetOptional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export function createSource<TLabel extends string>(descriptor: {
    play: song | (() => song);
    labels: TLabel;
    weight?: number;
}, mood: SetOptional<Mood, 'gravity'>, ...isValid: WithIsLabelValid<ComputeLabels<TLabel>>): Source {
    const rawLabels = descriptor.labels.split(' ').filter(Boolean);
    // @eslint-disable-no-type-assertion: createSource validates that its inputs are Label
    const labels = rawLabels as Label[];

    return {
        play: ((play) => play instanceof Function ? play : () => play)(descriptor.play),
        labels: new Set(labels),
        weight: descriptor.weight ?? Weight.STANDARD,
        mood: {
            gravity: Gravity.STANDARD,
            ...mood,
        },
    }
}

function makeGaussian(standardDeviation: number) {
    const denominator = (2 * standardDeviation ** 2);
    return (x: number) => Math.pow(Math.E, -x * x / denominator);
}
const makeSigmoid = (spread: number) =>
    (x: number) => 1 / (1 + Math.exp(-spread * x));

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
interface Source {
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
    const sampleReplayWeight = ((sampleSigmoid) => (x: number) => sampleSigmoid(x - setup.replayHalfway))(makeSigmoid(-Math.log(1 / 0.001) / (setup.replayUnplayable + replayRadius)));

    let x=0;
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
            const replayWeight = replayOffset === -1 ? 1 : sampleReplayWeight(replayOffset);
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
        yield source.play();

        history.unshift(source);
        history.length = replayMemory;
        x = (x + 1) % setup.intensityPeriod;
    }
}
