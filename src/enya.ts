import { v, createSource, A_BIT, A_LOT, Weight, Intensity, Soul, Gravity } from './create-source';

export const anywhereIs = createSource({
    play: v.anywhereIs,
    labels: 'voice enya',
    weight: Weight.ABUNDANT,
}, {
    soul: Soul.MORE + A_LOT * 2,
    intensity: Intensity.PEACE,
    gravity: Gravity.LIGHT - A_BIT,
});

export const bookOfDays = createSource({
    play: v.bookOfDays,
    labels: 'voice enya',
    weight: Weight.COMMON,
}, {
    intensity: 10,
    soul: 18,
    gravity: Gravity.LIGHT,
});

export const echoesInRain = createSource({
    play: v.echoesInRain,
    labels: 'voice enya',
}, {
    intensity: Intensity.STANDARD + A_LOT,
    soul: Soul.MOST - A_LOT,
    gravity: Gravity.STANDARD,
});

export const soICouldFindMyWay = createSource({
    play: v.soICouldFindMyWay,
    labels: 'voice enya',
}, {
    intensity: Intensity.PEACE + A_LOT,
    soul: Soul.MOST + A_LOT,
    gravity: Gravity.SERIOUS,
});

export const athairArNeamh = createSource({
    play: v.athairArNeamh,
    labels: 'voice enya',
}, {
    intensity: 0,
    soul: Soul.STANDARD,
    gravity: Gravity.LIGHT - A_LOT,
});

export const oneByOne = createSource({
    play: v.oneByOne,
    labels: 'voice enya',
}, {
    intensity: Intensity.PEACE,
    soul: Soul.LEAST,
    gravity: Gravity.LIGHT - A_LOT,
});

export const exile = createSource({
    play: v.exile,
    labels: 'voice enya',
}, {
    intensity: Intensity.STANDARD + A_BIT,
    soul: Soul.MUCH + A_LOT,
    gravity: Gravity.HEAVY + A_LOT,
});

export const paleGrassBlue = createSource({
    play: v.paleGrassBlue,
    labels: 'voice enya',
}, {
    intensity: Intensity.SOOTHING,
    soul: 0,
});

export const lothlorien = createSource({
    play: v.lothlorien,
    labels: 'voice enya',
}, {
    intensity: Intensity.SOOTHING - A_BIT,
    soul: 0,
});

export const theForgeOfTheAngels = createSource({
    play: v.theForgeOfTheAngels,
    labels: 'voice enya',
}, {
    intensity: Intensity.INTENSE + A_LOT,
    soul: Soul.LEAST,
    gravity: Gravity.STANDARD + A_BIT,
});

export const fallenEmbers = createSource({
    play: v.fallenEmbers,
    labels: 'voice enya',
}, {
    intensity: Intensity.SOOTHING - A_LOT,
    soul: Soul.LEAST,
    gravity: Gravity.GRAVE - A_LOT,
});
