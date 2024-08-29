import { videos, sources } from './sources';
import { runSources } from './create-source';
import * as Mood from './mood';

const thirteen = 'VZA4luIhcu8';
const dancingMad = 'DMDcL0reo5Y';

const noOneLivesForever = 't55nKXBAMPo?start=62&end=64';
const readyForDustOff = 'avN7vICX208?start=0&end=2';
const allVideos: song[] = Object.values({ ...videos, noOneLivesForever, readyForDustOff });
Playlist.yield('mood', runSources(Object.values(sources), {
    replayUnplayable: 30,
    replayHalfway: 42,
    soulPower: 2,
    soulInitial: Mood.Soul.MUCH,
    soulAccumulate: 30,
    gravityInitial: Mood.Gravity.STANDARD,
    gravityAcceptableDifference: 28,
    intensityPeriod: 18,
    intensityDeltaDeviation: 14,
    intensityTargetMinimum: 0,
    intensityTargetMaximum: 60,
    intensityCosPhaseRadians: Math.random() * 2 * Math.PI,
}));

Playlist.yield('Kara Comparetto', function*() {
    while(true) {
        yield ff6piano;
        yield silence(60 * 5);
    }
});
const time = (m: number, s: number) => m * 60 + s;
const ff6piano = 'J5mOs7O1dvg';
const relm = `${ff6piano}?start=${time(60, 18)}&end=${time(61, 27)}`;
const darkWorld = `${ff6piano}?start=${time(65, 41)}&end=${time(67, 31)}`;
const fromThatDayOn = `${ff6piano}?start=${time(67, 32)}&end=${time(68, 48)}`;
const epitaph = `${ff6piano}?start=${time(68, 48)}&end=${time(70, 0)}`;
const searchingForFriends = `${ff6piano}?start=${time(70, 0)}&end=${time(71, 15)}`;

const themeTerraRetro = 'SrDiiVn1VCk';
const legendary = (chance: number) => Date.now() % (chance + 1) === 0;
function* randomized(): Generator<song> {
    while(true) {
        if(legendary(10e3)) yield dancingMad;
        if(legendary(6e3)) yield themeTerraRetro;
        if(legendary(2e3)) yield thirteen;

        yield allVideos.pick()!;
        yield silence(Math.random(1, 8) + Math.random(4, 10));
    }
};

Playlist.yield('randomized', randomized);

Playlist.yield('dancing mad', function*() {
    yield dancingMad;
    yield* randomized();
});

Playlist.yield('patrick', function*() {
    while(true) {
        yield videos.flyMeToTheMoon;
        if(chance(1 / 8)) {
            yield allVideos.pick()!;
        }
    }
});

// also calming: terran4 sunandmoon lilypads studyinparhelionred
const minecraftSongs: [song, number][] = [
    [videos.hauntMuskie, 12], [videos.pianoHauntMuskie, 10],
    [videos.dreiton, 12], [videos.pianoDreiton, 10],
    [videos.blindSpots, 12], [videos.pianoBlindSpots, 10],
    [videos.ariaMath, 10], [videos.pianoAriaMath, 8],
    [videos.taswell, 10], [videos.pianoTaswell, 8],
    [videos.chris, 8], [videos.clark, 12], [videos.wethands, 10], [videos.livingMice, 12], [videos.miceOnVenus, 8], [videos.equinoxe, 9],
];

Playlist.yield('minecraft', function*() {
    let previousSongs: song[] = [];
    while(true) {
        const song = minecraftSongs.filter(([song]) => !previousSongs.includes(song)).pick(([, weight]) => weight)![0];
        previousSongs.unshift(song);
        previousSongs = previousSongs.slice(0, 4);
        yield song;

        const waitMinutes = Math.random(2, 6) + Math.random(0, 10);
        yield silence(waitMinutes * 60);
    }
});

Object.entries(videos).mapsort(([name]) => name).map(([name, id]) => {
    Playlist.yield(name, function*() {
        yield id;
        const iterator = randomized();
        iterator.next();
        yield* iterator;
    });
});
