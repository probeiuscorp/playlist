import { readFileSync } from 'fs';

export function getSongNameById() {
  const source = readFileSync('src/urls.ts', 'utf8');
  const lines = source.split('\n');
  const assocs = lines.flatMap((line) => {
    const parts = line.split('=');
    if (parts.length === 2) {
      const [containsName, containsId] = parts;
      const name = containsName.trim().split(' ').at(-1);
      const id = containsId.match(/'[A-Za-z0-9_-]{11}['?]/)?.[0]?.slice(1, -1);
      if (typeof name === 'string' && typeof id === 'string') {
        return [[id, name] as const];
      } else {
        console.log('failed to parse:', line);
      }
    }
    return [];
  });

  const lookup = new Map(assocs);
  return (givenId: string) => {
    const id = givenId.slice(0, 11);
    return lookup.get(id) ?? id;
  };
}
