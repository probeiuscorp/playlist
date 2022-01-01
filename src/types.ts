export type ID = string & {};

export interface Point {
    readonly x: number,
    readonly y: number
}

export interface Camera extends Point {
    readonly zoom: number
}

export interface Path {
    readonly from: Point,
    readonly to: Point
}

export interface Sequence {
    type: 'file' | 'video',
    url: string
}

// ======== nodes ========

export interface NodeCommon {
    x: number,
    y: number,
    inputs: Record<string, number | ID>,
    output: ID,
    id: ID | null
}

interface NodeEndExclusive {
    type: 'end'
}

export type NodeEnd = NodeEndExclusive & NodeCommon;

interface NodeSequenceExclusive {
    type: 'sequences',
    source: string
}

export type NodeSequence = NodeSequenceExclusive & NodeCommon;

interface NodeMutatorExclusive {
    type: 'mutator',
    mutator: string
}

export type NodeMutator = NodeMutatorExclusive & NodeCommon;

export type NodeAny = (NodeEndExclusive | NodeSequenceExclusive | NodeMutatorExclusive) & NodeCommon;