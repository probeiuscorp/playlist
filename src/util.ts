import React from 'react';
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

export function cancel(e: React.BaseSyntheticEvent) {
    e.stopPropagation();
}

export const textboxCancels = {
    onMouseUp: cancel,
    onMouseDown: cancel,
    onKeyUp: cancel,
    onKeyDown: cancel
};

/**
 * Takes the first parameter and returns it as is if its magnitude is greater than 
 */
export function magmin(v: number, min: number): number {
    if(Math.abs(v) > min) {
        return min * Math.sign(v);
    } else {
        return v;
    }
}

export function split<T>(arr: T[], index: number): [T[], T[]] {
    return [
        arr.slice(0, index),
        arr.slice(index)
    ];
}

export function setImmediateInterval(cb: () => void, ms: number): number {
    cb();
    return window.setInterval(cb, ms);
}

export type ModalProps = Record<string, unknown>;