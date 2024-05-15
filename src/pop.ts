import { v, createSource, A_BIT, A_LOT, Weight, Intensity, Soul, Gravity } from './create-source';

export const usAgainstTheWorld = createSource({
    play: v.usAgainstTheWorld,
    labels: 'voice',
}, {
    intensity: 72,
    soul: 58,
    gravity: 48,
});