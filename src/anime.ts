import { v, createSource, A_BIT, A_LOT, Weight, Intensity, Soul, Gravity } from './create-source';

export const vivaLaMiku = createSource({
    play: v.vivaLaMiku,
    labels: 'voice japanese',
    weight: Weight.COMMON,
}, {
    intensity: 18,
    soul: 50,
    gravity: Gravity.MEME,
});

export const neverGonnaGiveYouUpJapanese = createSource({
    play: v.neverGonnaGiveYouUpJapanese,
    labels: 'voice japanese',
}, {
    intensity: 26,
    soul: 38,
    gravity: 10,
});

export const bohemikuRhapsody = createSource({
    play: v.bohemikuRhapsody,
    labels: 'voice japanese',
}, {
    intensity: 28,
    soul: 38,
    gravity: Gravity.MEME,
});
