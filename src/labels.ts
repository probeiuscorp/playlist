export type Label = ComputeLabels<ReplaceBracketsWithWhitespace<typeof labels>>;
type RequiredLabels = ['instrumental voice'];
export const labels = `
instrumental voice rain repeatable
guitar piano beyond-earth[civ] civ5[civ] rock pop
no-car japanese
enya below-zero[subnautica] ff6
edm[electronic]
minecraft minecraft-alpha[minecraft] minecraft-beta[minecraft] minecraft-new[minecraft]
starcraft warcraft sc1[starcraft] sc2[starcraft] wc3[warcraft] starcraft-jukebox[starcraft] terran zerg protoss
`;

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
