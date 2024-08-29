import { v, createSource, A_BIT, A_LOT, Weight, Intensity, Soul, Gravity } from './create-source';

export const lilyPads = createSource({
    play: v.lilyPads,
    labels: 'instrumental below-zero',
}, {
    intensity: Intensity.PEACE,
    soul: Soul.MORE,
    gravity: Gravity.SERIOUS,
});

export const parhelionRed = createSource({
    play: v.parhelionRed,
    labels: 'instrumental below-zero',
}, {
    intensity: Intensity.PEACE,
    soul: Soul.LITTLE + A_LOT,
    gravity: Gravity.HEAVY,
});

export const crashSite = createSource({
    play: v.crashSite,
    labels: 'instrumental subnautica',
}, {
    intensity: Intensity.MOST,
    soul: Soul.LITTLE - A_BIT,
});

export const sunAndMoon = createSource({
    play: v.sunAndMoon,
    labels: 'instrumental subnautica',
}, {
    intensity: Intensity.PEACE,
    soul: Soul.LITTLE + A_BIT,
});

export const amidTheKelp = createSource({
    play: v.amidTheKelp,
    labels: 'instrumental subnautica',
}, {
    intensity: 0,
    soul: Soul.LITTLE,
});

export const tropicalEden = createSource({
    play: v.tropicalEden,
    labels: 'instrumental subnautica',
}, {
    intensity: 0,
    soul: Soul.LITTLE + A_LOT,
    gravity: Gravity.STANDARD + A_LOT,
});
