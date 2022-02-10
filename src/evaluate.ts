// import { MutatorEvaluatedParameters, registry, SequenceFiles, SequenceFileSequence, SequenceID, SequencesState, Source, Sources } from './store';

// export type SequencesMap = Record<SequenceID, Sources>;
// export type MainEntries = Record<SequenceID, Sources>;

// function evaluateParams(mutator: Source, sequences: SequencesMap): Sources {
//     if('primitive' in mutator) {
//         return [mutator];
//     } else if('link' in mutator) {
//         return sequences[mutator.link];
//     } else {
//         const state = mutator.state;
//         let evaluatedParams: MutatorEvaluatedParameters<any> = {};
//         Object.keys(state).map(key => {
//             const item = state[key];
//             if(mutator.parameters[key].type === 'number') {
//                 evaluatedParams[key] = item as number;
//             } else {
//                 evaluatedParams[key] = [...evaluateParams(item as Source, sequences)];
//             }
//         });
//         return registry[mutator.type].transformer(evaluatedParams);
//     }
// }

// export function evaluate(sequences: SequencesMap, entries: SequenceID[]): MainEntries {
//     let entryPoints: MainEntries = {};

//     for(const main of entries) {
//         const entry = sequences[main];
//         if(entry) {
//             const evaluated: Sources = [];

//             for(const item of entry) {
//                 evaluated.push(...evaluateParams(item, sequences));
//             }

//             entryPoints[main] = evaluated;
//         }
//     }

//     return entryPoints;
// }

// export function reduce(files: SequenceFiles, sequences: SequencesState): SequencesMap {
//     let map: SequencesMap = {};
//     Object.keys(files).map(id => {
//         const item = files[id];
//         if(item.type === 'sequence') {
//             map[id] = sequences[id].sources;
//         } else {
//             const reduced = reduce(item.contents, sequences);
//             Object.keys(reduced).forEach(key => {
//                 map[key] = reduced[key];
//             });
//         }
//     });
//     return map;
// }