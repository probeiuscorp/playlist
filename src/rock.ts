import { v, createSource, A_BIT, A_LOT, Weight, Intensity, Soul, Gravity } from './create-source';

export const allINeed = createSource({
    play: v.allINeed,
    labels: 'voice rock',
}, {
    intensity: Intensity.INTENSE + A_BIT,
    soul: Soul.MOST,
    gravity: Gravity.GRAVE,
});

export const nothingLeftToLose = createSource({
    play: v.allINeed,
    labels: 'voice rock',
}, {
    intensity: Intensity.INTENSE - A_LOT,
    soul: Soul.MORE - A_LOT,
    gravity: Gravity.HEAVY,
});

export const losingMyReligion = createSource({
    play: v.losingMyReligion,
    labels: 'voice rock',
}, {
    intensity: Intensity.INTENSE + A_LOT,
    soul: Soul.MUCH - A_LOT,
    gravity: Gravity.HEAVY,
});

export const lightningCrashes = createSource({
    play: v.lightningCrashes,
    labels: 'voice rock',
}, {
    intensity: 64,
    soul: 68,
    gravity: 62,
});

export const theWorldIKnow = createSource({
    play: v.theWorldIKnow,
    labels: 'voice rock',
}, {
    intensity: 30,
    soul: 50,
    gravity: 72,
});