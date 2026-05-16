import 'playlistjs-types/shim';
import { simpleRandomized } from '../src/main';
import { getSongNameById } from './name-by-id';

export function sampleDistribution(playlist: Iterable<song>, nSamples = 10e3) {
  const distribution = new Map<string, number>();

  let i = 0;
  for (const song of playlist) {
    if (i >= nSamples) break;
    const id = typeof song === 'string' ? song : song.id;
    // happens in silences
    if (id === undefined) continue;

    distribution.set(id, 1 + (distribution.get(id) ?? 0));
    i++;
  }

  return distribution;
}

void async function main() {
  const getName = getSongNameById();
  const distribution = sampleDistribution(simpleRandomized, 100e3);
  const sortedByCount = Array.from(distribution).mapsort(([, count]) => count);
  sortedByCount.forEach(([id, count]) => {
    console.log(`${count.toString().padStart(3, ' ')} ${getName(id)}`);
  });
}();
