import type { Camera, ID, NodeAny, NodePrimitive, ParamSet, ParamValue, Point, Sequence } from '@client/types';
import { CSSProperties } from 'react';
import { MutatorsEventLayer } from './mutators-event-layer';

export interface DynalistConstructorOptions {
    
}

export type OnCreateCallback = (instance: Dynalist) => void;
export type SetElementCallback = (cb: (element: HTMLElement) => void) => void;
export type NewIterationCallback = (iteration: number) => void;

export interface PrimitiveInfo<T = any> {
    id: string,
    display: string,
    description: string,
    params: ParamSet,
    outputs: ParamSet,
    initialState?: T,
    getValue: (node: NodePrimitive, state: T) => Record<string, ParamValue>
}
export interface PrimitiveProps<T = any> {
    node: NodePrimitive,
    setState: (newState: T) => void,
    outputs: JSX.Element,
    params: JSX.Element
}
export type PrimitiveComponent<T = any> = React.ComponentType<PrimitiveProps<T>>;
export interface PrimitiveEntry {
    component: PrimitiveComponent,
    info: PrimitiveInfo
}

export interface DynalistItemCommon {
    id: ID,
    display: string,
    container: ID | null
};

export interface DynalistSequenceItemExclusive {
    type: 'sequence'
}
export type DynalistSequencesItem = DynalistSequenceItemExclusive & DynalistItemCommon;

export interface DynalistCollectionItemExclusive {
    type: 'collection',
    expanded: boolean,
    contents: ID[]
}
export type DynalistCollectionItem = DynalistCollectionItemExclusive & DynalistItemCommon;

export interface DynalistRoutineItemExclusive {
    type: 'routine'
}
export type DynalistRoutineItem = DynalistRoutineItemExclusive & DynalistItemCommon;

export type DynalistItem = (DynalistSequenceItemExclusive | DynalistCollectionItemExclusive | DynalistRoutineItemExclusive) & DynalistItemCommon
export interface DynalistFiles {
    items: IDMap<DynalistItem>,
    top: ID[]
}

export type DynalistUpdateCategory = 'mutators' | 'sequences' | 'files' | null;

interface State {
    nodes: IDMap<NodeAny>,
    selected: IDMap<boolean>,
    sequences: IDMap<Sequence>
}

interface IDMap<T> {
    [id: string]: T
}

export class Dynalist implements State {
    static readonly createCallbacks: OnCreateCallback[] = [];
    static onCreate(cb: OnCreateCallback) {
        Dynalist.createCallbacks.push(cb);
    };

    static readonly primitives: Record<string, PrimitiveEntry> = {};
    static registerPrimitive<T = any>(info: PrimitiveInfo<T>, component: PrimitiveComponent) {
        this.primitives[info.id] = {
            component,
            info
        }
    }

    private undoStack: State[] = [];
    private redoStack: State[] = [];
    private iterationListeners: NewIterationCallback[] = [];

    public readonly events: MutatorsEventLayer;
    public readonly files: DynalistFiles;
    public nodes: IDMap<NodeAny> = {};
    public selected: IDMap<boolean> = {};
    public sequences: IDMap<Sequence> = {};
    public directories: IDMap<number> = {};
    public camera: Camera;
    public iteration = 0;
    public cursor: CSSProperties["cursor"] = 'default';
    public lastUpdated: DynalistUpdateCategory = null;
    public previewPath: { to: Point, from: Point } | null = null;

    constructor(options: DynalistConstructorOptions) {
        this.events = new MutatorsEventLayer();
        for(const listener of Dynalist.createCallbacks) {
            listener(this);
        }

        this.files = {
            top: [],
            items: {}
        }
    }

    public onNewIteration = (cb: NewIterationCallback) => {
        this.iterationListeners.push(cb);
    }
    
    public addNode = (node: NodeAny) => {
        this.nodes[node.id] = node;
    }

    public undo = () => {
        const state = this.undoStack.pop();
        if(state) {
            const { nodes, selected, sequences } = state;
            this.nodes = nodes;
            this.selected = selected;
            this.sequences = sequences;
            this.redoStack.push(state);
        }
    }

    public redo = () => {
        const state = this.redoStack.pop();
        if(state) {
            const { nodes, selected, sequences } = state;
            this.nodes = nodes;
            this.selected = selected;
            this.sequences = sequences;
        }
    }

    public markDirty = () => {
        const iteration = this.iteration++;
        for(const listener of this.iterationListeners) listener(iteration);
    }

    public pushState = () => {
        this.undoStack.push({
            nodes: this.nodes,
            selected: this.selected,
            sequences: this.sequences
        });
    }
}

function importAll(r) {
    r.keys().forEach(r)
}

importAll((require as any).context('./interactions', true))
importAll((require as any).context('./primitives', true))