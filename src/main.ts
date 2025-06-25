import { runSources, s, Source } from './create-source';
import * as videos from './urls';
import * as Mood from './mood';

const thirteen = 'VZA4luIhcu8';
const dancingMad = 'DMDcL0reo5Y';

const noOneLivesForever = 't55nKXBAMPo?start=62&end=64';
const readyForDustOff = 'avN7vICX208?start=0&end=2';
const sourceByName = Object.fromEntries(Object.entries({ ...videos, noOneLivesForever, readyForDustOff }).map(([key, entry]) => {
  const source = typeof entry === 'string'
    ? s(entry)
    : entry;
  return [key, source];
}));
const allSources = Object.values(sourceByName);
Playlist.yield('mood', runSources(allSources, {
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
export type SimpleWeigher = (source: Source) => number;
export type StatefulWeigher = {
  onStart: () => {
    weigh?: (source: Source) => number;
    notifyChosen?: (source: Source) => number | undefined;
  };
};
type Weigher = SimpleWeigher | StatefulWeigher;
function beginWeigher(weigher: Weigher): ReturnType<StatefulWeigher['onStart']> {
  if(typeof weigher === 'function') {
    return {
      weigh: weigher,
    };
  } else {
    return weigher.onStart();
  }
}
function product(weights: (number | undefined)[]): number {
  return weights.reduce<number>((a, b) => a * (b ?? 1), 1);
}

function* randomized(unnormalizedWeighers: Weigher[] = []): Generator<song> {
  const weighers = unnormalizedWeighers.map(beginWeigher);
  while(true) {
    let silenceWeight = 1;
    if(legendary(10e3)) yield dancingMad;
    else if(legendary(6e3)) yield themeTerraRetro;
    else if(legendary(3e3)) yield 'SCD2tB1qILc';
    else if(legendary(2e3)) yield thirteen;
    else {
      const chosenSong = allSources.pick(source => {
        return product(weighers.map(({ weigh }) => weigh?.(source))) * source.weight;
      })!;
      silenceWeight = product(weighers.map(({ notifyChosen }) => notifyChosen?.(chosenSong)));
      yield chosenSong.play();
    };

    yield silence((Math.random(1, 8) + Math.random(4, 10) * silenceWeight));
  }
};

const standardWeighers: Weigher[] = [({ labels }) => labels.has('f') ? 1.2 : labels.has('m') ? 0.75 : 1];
Playlist.yield('randomized', () => randomized(standardWeighers));
function* skipFirst<T>(gen: Generator<T>) {
  gen.next();
  yield* gen;
}
Playlist.yield('work', function*() {
  yield videos.featherfall.play();
  yield* skipFirst(randomized(standardWeighers.concat([
    ({ labels }) => labels.has('edm') ? 1.25 : 1,
    ({ mood }) => mood.intensity <= 0 ? 1.25 : 1,
  ])));
});

Playlist.yield('dancing mad', function*() {
  yield dancingMad;
  yield* randomized();
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

Playlist.yield('instrumental', () => randomized([({ labels }) => (labels.has('voice') && !labels.has('edm')) ? 0.05 : 1]));

Object.entries(sourceByName).mapsort(([name]) => name).map(([name, id]) => {
  Playlist.yield(name, function*() {
    yield id.play();
    yield* skipFirst(randomized(standardWeighers));
  });
});
