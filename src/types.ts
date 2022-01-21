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

export interface Source {
    type: 'file' | 'video',
    url: string
}
export type Sequence = Source[];

// ======== nodes ========

export interface NodeCommon {
    x: number,
    y: number,
    /**
     * A record of param name to param id.
     */
    params: Record<string, ID>,
    /**
     * A record of output name to the param id of the node it connects to.
     */
    outputs: Record<string, ID | null>,
    classes: Record<string, boolean>,
    id: ID | null
}

interface NodePrimitiveExclusive {
    type: 'primitive',
    primitive: string,
    state: any
}

export type NodePrimitive = NodePrimitiveExclusive & NodeCommon;

interface NodeMutatorExclusive {
    type: 'mutator',
    mutator: string
}

export type NodeMutator = NodeMutatorExclusive & NodeCommon;

export type NodeAny = (NodePrimitiveExclusive | NodeMutatorExclusive) & NodeCommon;

// ======== mutators ========

export type ValueType = 'sequence' | 'number' | 'boolean' | 'any';
export type ParamValue = boolean | number | Sequence;
export interface NodeParam {
    label: string,
    id: string,
    type: ValueType
};

export type ParamSet = NodeParam[];
export type ValueSet = Record<string, ParamValue>;

export interface MutatorInfo {
    display: string,
    description: string,
    handler: (params: ValueSet) => ValueSet,
    params: ParamSet,
    outputs: ParamSet
}

export const minZoom = 0.25;
export const maxZoom = 2;
export const decreaseZoom = (zoom: number) => Math.max(zoom - 0.1, minZoom);
export const increaseZoom = (zoom: number) => Math.min(zoom + 0.1, maxZoom);