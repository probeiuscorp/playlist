import { v, createSource, A_BIT, A_LOT, Weight, Intensity, Soul, Gravity } from './create-source';

export const usAgainstTheWorld = createSource({
    play: v.usAgainstTheWorld,
    labels: 'voice',
}, {
    intensity: 72,
    soul: 58,
    gravity: 48,
});

export const toTheTop = createSource({
    play: v.toTheTop,
    labels: 'voice',
}, {
    intensity: 70,
    soul: 40,
});

export const breakTheSilence = createSource({
    play: v.breakTheSilence,
    labels: 'voice',
}, {
    intensity: 52,
    soul: 36,
});

export const disappear = createSource({
    play: v.disappear,
    labels: 'voice',
}, {
    intensity: Intensity.SOOTHING,
    soul: 30,
    gravity: Gravity.LIGHT,
});

export const weWontBeAlone = createSource({
    play: v.weWontBeAlone,
    labels: 'voice',
}, {
    intensity: 72,
    soul: 60,
    gravity: 30,
});

export const laszloHome = createSource({
    play: v.laszloHome,
    labels: 'voice',
}, {
    intensity: 54,
    soul: 50,
});

export const thrillOfIt = createSource({
    play: v.thrillOfIt,
    labels: 'voice',
}, {
    intensity: Intensity.SOOTHING + A_BIT,
    soul: 16,
});

export const fighters = createSource({
    play: v.fighters,
    labels: 'voice',
}, {
    intensity: Intensity.INTENSE - A_LOT,
    soul: Soul.LITTLE + A_LOT,
});

export const youAndMe = createSource({
    play: v.youAndMe,
    labels: 'instrumental',
}, {
    intensity: Intensity.INTENSE,
    soul: 12,
});

export const anticipation = createSource({
    play: v.anticipation,
    labels: 'instrumental',
    weight: Weight.STANDARD + A_BIT,
}, {
    intensity: Intensity.SOOTHING - A_LOT,
    soul: 8,
});

export const someKindOfMagic = createSource({
    play: v.someKindOfMagic,
    labels: 'voice',
    weight: Weight.COMMON + A_BIT,
}, {
    intensity: 72,
    soul: Soul.MUCH,
});

export const imHere = createSource({
    play: v.imHere,
    labels: 'voice',
}, {
    intensity: Intensity.INTENSE,
    soul: Soul.STANDARD,
});
