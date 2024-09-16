import { v, createSource, A_BIT, A_LOT, Weight, Intensity, Soul, Gravity } from './create-source';

export const heavensDevils = createSource({
    play: v.heavensDevils,
    labels: 'instrumental sc2 terran',
}, {
    soul: Soul.MORE + A_LOT,
    intensity: Intensity.INTENSE + A_LOT,
});

export const sc2terran1 = createSource({
    play: v.sc2terran1,
    labels: 'instrumental sc2 terran',
}, {
    soul: Soul.MORE + A_LOT,
    intensity: Intensity.INTENSE + A_LOT,
});

export const sc2terran1guitar = createSource({
    play: v.sc2terran1guitar,
    labels: 'instrumental sc2 terran',
}, {
    soul: 28,
    intensity: 20,
});

export const sc2terran2 = createSource({
    play: v.sc2terran2,
    labels: 'instrumental sc2 terran',
    weight: Weight.EVERYWHERE,
}, {
    soul: Soul.MUCH,
    intensity: Intensity.STANDARD,
});

export const sc2terran2guitar = createSource({
    play: v.sc2terran2guitar,
    labels: 'instrumental sc2 terran',
}, {
    soul: 32,
    intensity: 18,
});

export const sc2terran3 = createSource({
    play: v.sc2terran3,
    labels: 'instrumental sc2 terran',
    weight: Weight.EVERYWHERE,
}, {
    soul: Soul.MORE,
    intensity: Intensity.STANDARD,
});

export const sc2terran3guitar = createSource({
    play: v.sc2terran3guitar,
    labels: 'instrumental sc2 terran',
}, {
    soul: 38,
    intensity: 20,
});

export const sc2terran4 = createSource({
    play: v.sc2terran4,
    labels: 'instrumental sc2 terran',
    weight: Weight.EVERYWHERE,
}, {
    soul: Soul.STANDARD,
    intensity: Intensity.SOOTHING - A_BIT,
});

export const sc2terran4guitar = createSource({
    play: v.sc2terran4guitar,
    labels: 'instrumental sc2 terran',
}, {
    soul: 28,
    intensity: 8,
});

export const sc2terran5 = createSource({
    play: v.sc2terran5,
    labels: 'instrumental sc2 terran',
    weight: Weight.EVERYWHERE,
}, {
    soul: Soul.MORE,
    intensity: Intensity.SOOTHING,
});

export const sc2terran5guitar = createSource({
    play: v.sc2terran5guitar,
    labels: 'instrumental sc2 terran',
}, {
    soul: 32,
    intensity: 14,
});

export const rhythmicTension = createSource({
    play: v.rhythmicTension,
    labels: 'instrumental sc2 terran',
    weight: Weight.COMMON,
}, {
    soul: Soul.LITTLE,
    intensity: Intensity.SOOTHING,
});

export const suspiciousMinds = createSource({
    play: v.suspiciousMinds,
    labels: 'voice starcraft-jukebox terran',
    weight: Weight.COMMON - A_LOT,
}, {
    intensity: Intensity.STANDARD + A_LOT,
    soul: Soul.LITTLE + A_BIT,
    gravity: Gravity.LIGHT,
});

export const nightElf = createSource({
    play: v.nightElf,
    labels: 'instrumental',
}, {
    intensity: Intensity.STANDARD + A_LOT * 2,
    soul: Soul.MORE,
});

export const nightElfArrival = createSource({
    play: v.nightElfArrival,
    labels: 'instrumental',
}, {
    intensity: Intensity.STANDARD + A_LOT,
    soul: 44,
});
