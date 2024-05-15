import { v, createSource, A_BIT, A_LOT, Weight, Intensity, Soul, Gravity } from './create-source';

export const fieldsOfGold = createSource({
    play: v.fieldsOfGold,
    labels: 'voice',
    weight: Weight.RARE + A_LOT,
}, {
    intensity: Intensity.SOOTHING - A_BIT,
    soul: Soul.MOST,
    gravity: Gravity.SERIOUS,
});

export const fallenKingdom = createSource({
    play: v.fallenKingdom,
    labels: 'voice',
}, {
    intensity: Intensity.STANDARD + A_BIT,
    soul: Soul.MORE,
    gravity: Gravity.MEME,
});

export const neverGonnaGiveYouUp = createSource({
    play: () => chance(3 / 4) ? v.neverGonnaGiveYouUp : v.neverGonnaGiveYouUpAnime,
    labels: 'voice',
}, {
    intensity: Intensity.STANDARD,
    soul: Soul.STANDARD + A_BIT,
    gravity: Gravity.MEME,
});

export const coins420 = createSource({
    play: v.coins420,
    labels: 'instrumental',
}, {
    intensity: Intensity.SOOTHING - A_LOT,
    soul: Soul.LITTLE,
    gravity: Gravity.LIGHT + A_LOT,
});