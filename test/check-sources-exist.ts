import { readFile } from 'fs/promises';


void async function main() {
  const apiKey = await readFile('test/api-key');
  const source = await readFile('src/urls.ts', 'utf8');
  const ids = source.match(/'[A-Za-z0-9_-]{11}['?]/g)?.map((s) => s.slice(1, -1)) || [];

  const groups: string[][] = [];
  const groupSize = 50;
  let i = 0;
  while(true) {
    const iNext = i + groupSize;
    const group = ids.slice(i, iNext);
    groups.push(group);
    i = iNext;
    if(group.length !== groupSize) break;
  }

  let problems: unknown[] = [];
  const missingIds = new Set(ids);
  for(const group of groups) {
    const id = group.join(',');
    const res = await fetch(`https://www.googleapis.com/youtube/v3/videos?id=${id}&part=status&key=${apiKey}`);
    const json = await res.json();
    if(!res.ok) problems.push(json);
    for(const item of json.items) {
      missingIds.delete(item.id);
    }
  }
  console.log(missingIds);
  if(problems.length) {
    console.error('also had an error making the request:');
    console.error(problems);
  }
}();
