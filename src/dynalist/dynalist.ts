import type { Camera, NodeAny, NodePrimitive, ParamSet, ParamValue, Sequence } from '@client/types';
import type { CSSProperties } from 'react';
import { MutatorsEventLayer } from './mutators-event-layer';

export interface DynalistConstructorOptions {
    onNewIteration: (iteration: number) => void
}

export type OnCreateCallback = (instance: Dynalist) => void;
export type SetElementCallback = (cb: (element: HTMLElement) => void) => void;

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

interface State {
    nodes: IDMap<NodeAny>,
    selected: IDMap<boolean>,
    sequences: IDMap<Sequence>
}

interface IDMap<T> {
    [id: string]: T
}

class Dynalist implements State {
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

    private undoStack: State[];
    private redoStack: State[];
    private onNewIteration: (iteration: number) => void

    public readonly events: MutatorsEventLayer;
    public nodes: IDMap<NodeAny> = {};
    public selected: IDMap<boolean> = {};
    public sequences: IDMap<Sequence> = {};
    public camera: Camera;
    public iteration = 0;
    public cursor: CSSProperties["cursor"] = 'default';

    constructor(options: DynalistConstructorOptions) {
        this.events = new MutatorsEventLayer();
        this.onNewIteration = options.onNewIteration;
    }

    public addNode(node: NodeAny) {
        this.nodes[node.id] = node;
    }

    public undo() {
        const state = this.undoStack.pop();
        if(state) {
            const { nodes, selected, sequences } = state;
            this.nodes = nodes;
            this.selected = selected;
            this.sequences = sequences;
            this.redoStack.push(state);
        }
    }

    public redo() {
        const state = this.redoStack.pop();
        if(state) {
            const { nodes, selected, sequences } = state;
            this.nodes = nodes;
            this.selected = selected;
            this.sequences = sequences;
        }
    }

    public markDirty() {
        this.onNewIteration(this.iteration++);
    }

    public pushState() {
        this.undoStack.push({
            nodes: this.nodes,
            selected: this.selected,
            sequences: this.sequences
        });
    }
}

export { Dynalist };

function importAll(r) {
    r.keys().forEach(r)
}

importAll((require as any).context('./interactions', true))
importAll((require as any).context('./primitives', true))