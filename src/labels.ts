export type Label = ComputeLabels<ReplaceBracketsWithWhitespace<typeof labels>>;
type RequiredLabels = ['instrumental voice'];
export const labels = `
instrumental voice rain repeatable meme serious stinger
ff[f] m adventure-time project-hail-mary
collective-soul[rock] fleetwood-mac[rock] crane-wives[folk] crane-wives[f] adele[2010s] lana-del-rey tame-impala[electronic]
taylor-swift[pop] stirling eilish joni-mitchell[folk] moby[electronic] lyn-lapid[pop]
guitar piano beyond-earth[civ] concerto[civ5[civ[vgm]]] rock pop disco 2010s
no-car bts[korean] japanese anime
enya below-zero[subnautica[vgm]] subnautica1 ff6[snes[vgm]] sschafi[ff6] ff6pr[ff6] strawberry-jam[celeste[vgm]] tf2[vgm]
edm[electronic] lofi[electronic] vocaloid[electronic]
minecraft[vgm] minecraft-alpha[minecraft] minecraft-beta[minecraft] minecraft-middle-ages[minecraft]
minecraft-18[minecraft] minecraft-19+[minecraft] mcc[minecraft] music-disk[minecraft] hermitcraft[minecraft]
starcraft[vgm] warcraft[vgm] sc1[starcraft] sc2[starcraft] wc3[warcraft] night-elf[wc3] jukebox[starcraft] nco[terran] zerg protoss
silksong[hollowknight[vgm]]
undertale[vgm]
`;
export const labelsSet = new Set(labels.split(/[\s\[\]]+/).filter(Boolean));

export type ComputeLabels<TLabel extends string> = Split<Split<Trim<TLabel>, '\n'>, ' '>;
export type WithIsLabelValid<TLabel extends string> = Show<And<
  MustIncludeRequired<TLabel>,
  MustOnlyIncludeKnown<Exclude<TLabel, Label>>
>>;
type Replace<T extends string, Char extends string> = T extends `${infer Begin}${Char}${infer End}` ? `${Begin} ${Replace<End, Char>}` : T;
type ReplaceBracketsWithWhitespace<T extends string> = Replace<Replace<T, '['>, ']'>;
type Whitespace = ' ' | '\n';
type ResolvedRequiredLabels = [ComputeLabels<RequiredLabels[0]>][0];
type Split<T extends string, TBy extends string> = T extends `${infer U}${TBy}${infer V}` ? U | Split<V, TBy> : T;
type TrimEdge<T extends string, TLeft extends string, TRight extends string> = T extends `${TLeft}${infer U}${TRight}` ? U : T;
type Trim<T extends string> = TrimEdge<TrimEdge<T, Whitespace, ''>, '', Whitespace>;
type MustOnlyIncludeKnown<T extends string> = [T] extends [never] ? true : `unknown label: [${T}]`;
type MustIncludeRequired<TLabel extends string> = (TLabel & ResolvedRequiredLabels) extends never ? `must have one of required label: ${ResolvedRequiredLabels}` : true;
type Show<T extends Error> = T extends true | never ? [] : [issue: T];
type And<T1 extends Error, T2 extends Error> = T1 extends string ? T1 : (T2 extends string ? T2 : true);
type Error = string | true;
