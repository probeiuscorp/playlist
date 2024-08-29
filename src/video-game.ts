import { v, createSource, A_BIT, A_LOT, Weight, Intensity, Soul, Gravity } from './create-source';

export const fromThatDayOnGuitar = createSource({
    play: v.fromThatDayOnGuitar,
    labels: 'instrumental ff6',
    weight: Weight.STANDARD + A_LOT,
}, {
    intensity: Intensity.STANDARD - A_BIT,
    soul: Soul.MORE + A_LOT,
    gravity: Gravity.SERIOUS,
});

export const cyansThemeGuitar = createSource({
    play: v.cyansThemeGuitar,
    labels: 'instrumental guitar ff6',
    weight: Weight.STANDARD + A_BIT,
}, {
    intensity: Intensity.INTENSE - A_LOT,
    soul: Soul.MUCH - A_BIT,
    gravity: Gravity.SERIOUS + A_LOT * 2,
});

export const themeTerraSynth = createSource({
    play: v.themeTerra,
    labels: 'instrumental ff6',
}, {
    intensity: Intensity.INTENSE + A_BIT,
    soul: Soul.MUCH,
    gravity: Gravity.GRAVE,
});

export const ff6SlamShuffle = createSource({
    play: v.ff6SlamShuffle,
    labels: 'instrumental ff6',
    weight: Weight.ABUNDANT,
}, {
    intensity: 26,
    soul: 18,
    gravity: 28,
});

export const ourNewHome = createSource({
    play: v.ourNewHome,
    labels: 'instrumental beyond-earth',
}, {
    intensity: Intensity.INTENSE + A_LOT * 3,
    soul: Soul.MORE + A_LOT,
    gravity: Gravity.HEAVY,
});

export const earthsAmbassadors = createSource({
    play: v.earthsAmbassadors,
    labels: 'instrumental beyond-earth',
}, {
    intensity: Intensity.INTENSE + A_LOT,
    soul: Soul.MORE + A_LOT,
    gravity: Gravity.HEAVY,
});

export const destroyer = createSource({
    play: v.destroyer,
    labels: 'instrumental beyond-earth',
}, {
    intensity: Intensity.MOST - A_BIT,
    soul: Soul.MOST - A_BIT,
    gravity: Gravity.GRAVE + A_LOT,
});

export const promethean = createSource({
    play: v.promethean,
    labels: 'instrumental beyond-earth',
}, {
    intensity: Intensity.MUCH,
    soul: Soul.MOST - A_BIT,
    gravity: Gravity.SERIOUS - A_LOT,
});

export const theSeeding = createSource({
    play: () => chance(0.5) ? v.theFutureOfMankind :'86t6SoZmXIg',
    labels: 'instrumental beyond-earth',
    weight: Weight.RARE,
}, {
    intensity: Intensity.MUCH,
    soul: Soul.MOST + A_LOT,
    gravity: Gravity.SERIOUS + A_LOT,
});

export const englandPeace = createSource({
    play: v.englandPeace,
    labels: 'instrumental civ5',
}, {
    intensity: Intensity.SOOTHING,
    soul: Soul.MOST - A_LOT,
    gravity: Gravity.HEAVY,
});

export const englandWar = createSource({
    play: v.englandWar,
    labels: 'instrumental civ5',
}, {
    intensity: Intensity.MUCH,
    soul: Soul.MORE + A_LOT * 4,
    gravity: Gravity.HEAVY,
});

export const ottomansWar = createSource({
    play: v.ceddinDeden,
    labels: 'instrumental civ5',
}, {
    intensity: Intensity.MUCH - A_LOT,
    soul: Soul.MORE,
    gravity: Gravity.STANDARD + A_LOT,
});
