export type Label = 'meme' | 'serious';
export interface Source {
    is(label: Label): boolean;
}
export interface Context {
    proposed: Source;
    lastPlayed: Source[];
}
export function createRule(
    executor: (context: Context) => boolean | void,
) {

}

export const ruleNoMemesAfterSerious = createRule((d) => {
    if(d.proposed.is('serious') && d.lastPlayed.slice(0, 2).every((source) => !source.is('meme'))) {
        return false;
    }
});