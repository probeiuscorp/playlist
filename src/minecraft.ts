import { v, createSource, A_BIT, A_LOT, Weight, Intensity, Soul, Gravity } from './create-source';

export const miceOnVenus = createSource({
    play: v.miceOnVenus,
    labels: 'instrumental minecraft-alpha',
}, {
    intensity: Intensity.PEACE,
    soul: Soul.MORE,
    gravity: Gravity.GRAVE,
});

export const sweden = createSource({
    play: v.sweden,
    labels: 'instrumental minecraft-alpha',
}, {
    intensity: Intensity.PEACE,
    soul: Soul.LITTLE,
    gravity: Gravity.SERIOUS,
});

export const livingMice = createSource({
    play: v.livingMice,
    labels: 'instrumental minecraft-alpha',
    weight: Weight.STANDARD + A_LOT,
}, {
    intensity: 0,
    soul: Soul.MORE,
    gravity: Gravity.LIGHT,
});

export const hauntMuskie = createSource({
    play: () => chance(3 / 5) ? v.hauntMuskie : v.pianoHauntMuskie,
    labels: 'instrumental minecraft-beta',
    weight: Weight.STANDARD * (8 / 5),
}, {
    intensity: Intensity.SOOTHING,
    soul: Soul.MORE + A_LOT + A_BIT,
    gravity: Gravity.STANDARD + A_LOT,
});

export const dreiton = createSource({
    play: () => chance(3 / 5) ? v.dreiton : v.pianoDreiton,
    labels: 'instrumental minecraft-beta',
    weight: Weight.STANDARD * (8 / 5),
}, {
    intensity: Intensity.SOOTHING,
    soul: Soul.MUCH - A_LOT - A_LOT,
    gravity: Gravity.HEAVY - A_LOT - A_LOT,
});

export const blindSpots = createSource({
    play: () => chance(3 / 5) ? v.blindSpots : v.pianoBlindSpots,
    labels: 'instrumental minecraft-beta',
    weight: Weight.STANDARD * (8 / 5),
}, {
    intensity: Intensity.SOOTHING - A_BIT,
    soul: Soul.MORE,
    gravity: Gravity.LIGHT,
});

export const ariaMath = createSource({
    play: () => chance(3 / 5) ? v.ariaMath : v.pianoAriaMath,
    labels: 'instrumental minecraft-beta',
    weight: Weight.STANDARD * (8 / 5),
}, {
    intensity: Intensity.STANDARD,
    soul: Soul.MUCH - A_LOT,
    gravity: Gravity.HEAVY,
});

export const taswell = createSource({
    play: () => chance(3 / 5) ? v.taswell : v.pianoTaswell,
    labels: 'instrumental minecraft-beta',
    weight: Weight.STANDARD * (8 / 5),
}, {
    intensity: Intensity.SOOTHING + A_LOT,
    soul: Soul.MUCH,
    gravity: Gravity.GRAVE,
});

export const aerie = createSource({
    play: v.aerie,
    labels: 'instrumental minecraft-new',
}, {
    intensity: Intensity.PEACE,
    soul: Soul.LITTLE - A_BIT,
    gravity: Gravity.HEAVY - A_LOT,
});

export const firebugs = createSource({
    play: v.firebugs,
    labels: 'instrumental minecraft-new',
}, {
    intensity: Intensity.PEACE,
    soul: Soul.LITTLE + A_BIT,
    gravity: Gravity.STANDARD + A_LOT + A_BIT,
});

export const labyrinthine = createSource({
    play: v.labyrinthine,
    labels: 'instrumental minecraft-new',
}, {
    intensity: Intensity.PEACE,
    soul: Soul.LITTLE,
    gravity: Gravity.STANDARD - A_LOT,
});

export const alpha = createSource({
    play: v.alpha,
    labels: 'instrumental minecraft-beta',
}, {
    intensity: Intensity.INTENSE,
    soul: Soul.MOST + A_LOT,
    gravity: Gravity.SERIOUS,
});