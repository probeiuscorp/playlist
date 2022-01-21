import { Dynalist } from './dynalist/dynalist';
import { mutators } from './mutators';
import { NodeAny, ParamSet } from './types';

export function conditional(names: Record<string, boolean>): string {
    let resolved: string[] = [];
    for(const className in names) {
        if(names[className]) {
            resolved.push(className);
        }
    }
    return resolved.join(' ');
}

export function paramsOutputsOf(node: NodeAny): { params: ParamSet, outputs: ParamSet } {
    if(node.type === 'mutator') {
        const { params, outputs } = mutators[node.mutator];
        return { params, outputs }
    } else {
        const { params, outputs } = Dynalist.primitives[node.primitive].info;
        return { params, outputs };
    }
}

export function map<V, N>(object: Record<string, V>, mapper: (old: V) => N): Record<string, N> {
    let output = {};
    Object.keys(object).map(key => {
        output[key] = mapper(object[key]);
    });
    return output;
}

export function debounce<Args extends any[]>(f: (...args: Args) => void, ms: number): (...args: Args) => void {
    let last: number = 0;
    let timeout: any;
    return (...args) => {
        clearTimeout(timeout);
        if(Date.now() >= last + ms) {
            last = Date.now();
            f(...args);
        } else {
            timeout = setTimeout(f, ms, ...args);
        }
    }
}

export function shuffle<T>(array: T[]): T[] {
    let currentIndex = array.length,  randomIndex: number;

    // While there remain elements to shuffle...
    while (currentIndex != 0) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }

    return array;
}