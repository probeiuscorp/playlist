import { SequenceFiles, SequenceFileSequence, SequenceID, Sources } from './store';

export type SequencesMap = Record<SequenceID, Sources>;
export type MainEntries = Record<SequenceID, Sources>;

export default function evaluate(sequences: SequencesMap, entries: SequenceID[]): MainEntries {
    let entryPoints: MainEntries = {};

    for(const entry of entries) {
        // entryPoints[entry] = sequences[entry].map(source => {
        //     if('type' in source) {
        //         return {

        //         };
        //     } else {
        //         // source.
        //     }
        // });
    }

    return entryPoints;
}