import { NodesAny } from '@client/components/create/mutators/Nodes';
import { Camera, ID, NodePrimitive, ParamSet, ParamValue, Path, Point, ValueType } from '@client/types';
import React from 'react';

function modifiersMatch(e: { ctrlKey: boolean, shiftKey: boolean, altKey: boolean }, mods: ModifiersOptions) {
    return (
        (mods?.ctrl ?? false) === e.ctrlKey &&
        (mods?.shift ?? false) === e.shiftKey &&
        (mods?.alt ?? false) === e.altKey
    );
}

export interface StateOptions {
    readonly save?: boolean
}

export interface ModifiersOptions {
    readonly ctrl?: boolean,
    readonly shift?: boolean,
    readonly alt?: boolean
}

export interface ConstructorOptions {
    element: HTMLElement,
    onIterationChange: (iteration: number) => void
}

export interface ClickPayload {
    filter: ModifiersOptions,
    payload: React.MouseEvent
}

export interface NodeClickPayload {
    filter: ModifiersOptions,
    payload: {
        target: ID,
        e: React.MouseEvent
    }
};

export interface JointClickPayload {
    filter: ModifiersOptions,
    payload: {
        target: ID,
        node: ID,
        e: React.MouseEvent
    }
}

export interface EventPayloadMap {
    "key": {
        filter: {
            key: string,
            modifiers?: ModifiersOptions
        },
        payload: KeyboardEvent
    },
    "keydown": {
        filter: {
            key: string,
            modifiers?: ModifiersOptions
        },
        payload: KeyboardEvent
    },
    "mousemove": {
        filter: ModifiersOptions,
        payload: {
            dx: number,
            dy: number
        }
    },
    "node.mousedown": NodeClickPayload,
    "node.mouseup": NodeClickPayload,
    "node.joint.mousedown": JointClickPayload,
    "node.joint.mouseup": JointClickPayload,
    "body.mousedown": ClickPayload,
    "body.mouseup": ClickPayload
}

export type OnCreateCallback = (instance: Dynalist["public"]) => void;
export type FilterCallback<K extends keyof EventPayloadMap> = (payload: EventPayloadMap[K]["payload"]) => boolean;

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

export class Dynalist {
    private static onCreateListeners: OnCreateCallback[] = [];
    public static readonly primitives: Record<string, PrimitiveEntry> = {};

    public static onCreate(cb: OnCreateCallback) {
        this.onCreateListeners.push(cb);
    }

    public static registerPrimitive<T = any>(info: PrimitiveInfo<T>, component: PrimitiveComponent) {
        this.primitives[info.id] = {
            component,
            info
        }
    }

    // ===

    public previewPaths: Path[];

    private listeners: {
        [K in keyof EventPayloadMap]?: {
            callback: (payload: EventPayloadMap[K]["payload"]) => void,
            filterer: FilterCallback<K>
        }[]
    } = {};

    private createEventListener<K extends keyof EventPayloadMap>(id: K, filterMatches?: (filter: EventPayloadMap[K]["filter"]) => FilterCallback<K>): (filter: EventPayloadMap[K]["filter"], cb: (payload: EventPayloadMap[K]["payload"]) => void) => void {
        return (filter, cb) => {
            let v = this.listeners[id];
            const obj = {
                callback: cb,
                filterer: filterMatches ? filterMatches(filter) : () => true
            } as any;
            
            if(v) {
                this.listeners[id].push(obj);
            } else {
                this.listeners[id] = [obj];
            }
        }
    }

    public readonly public = {
        camera: { x: 0, y: 0, zoom: 1 } as Camera,
        cursor: 'default' as React.CSSProperties["cursor"],
        selected: {
            nodes: {} as Record<string, boolean>,
            joints: {} as Record<string, boolean>
        },
        nodes: {} as NodesAny,
        when: {
            key: this.createEventListener('key', filter => payload => filter.key === payload.key && modifiersMatch(payload, filter.modifiers)),
            keydown: this.createEventListener('keydown', filter => payload => filter.key === payload.key && modifiersMatch(payload, filter.modifiers)),
            move: this.createEventListener('mousemove'),
            mousedown: this.createEventListener('body.mousedown', filter => payload => modifiersMatch(payload, filter)),
            mouseup: this.createEventListener('body.mouseup', filter => payload => modifiersMatch(payload, filter)),
            nodes: {
                mousedown: this.createEventListener('node.mousedown', filter => payload => modifiersMatch(payload.e, filter)),
                mouseup: this.createEventListener('node.mouseup', filter => payload => modifiersMatch(payload.e, filter)),
                joints: {
                    mousedown: this.createEventListener('node.joint.mousedown', filter => payload => modifiersMatch(payload.e, filter)),
                    mouseup: this.createEventListener('node.joint.mousedown', filter => payload => modifiersMatch(payload.e, filter))
                }
            }
        } as const,
        createPreviewPath: (path: Path) => {
            return 5;
        },
        destroyPreviewPath: (id: number) => {

        },
        updatePreviewPath: (id: number, path: Path) => {

        },
        on: <K extends keyof WindowEventMap>(e: K, handler: (e: WindowEventMap[K]) => void, passive?: boolean) => {
            this.el.addEventListener(e, handler, { passive });
        },
        markDirty: () => {
            this.onIterationChange(this.iteration++);
        },
        pushState: () => {

        }
    }

    private el: HTMLElement;
    private iteration: number = 0;
    private onIterationChange: (iteration: number) => void;
    private stack: [] = [];
    constructor(options: ConstructorOptions) {
        this.el = options.element;
        this.onIterationChange = options.onIterationChange;
        for(const listener of Dynalist.onCreateListeners) {
            listener(this.public);
        }

        document.addEventListener('keyup', e => {
            this.dispatch('key', e);
        });
        document.addEventListener('keydown', e => {
            this.dispatch('keydown', e);
        })
    }

    public dispatch<K extends keyof EventPayloadMap>(event: K, payload: EventPayloadMap[K]["payload"]) {
        const listeners = this.listeners[event];
        if(!listeners) return;

        for(const { callback, filterer } of listeners) {
            if(filterer(payload as any)) {
                callback(payload as any);
            }
        }
    }
}

function importAll(r) {
    r.keys().forEach(r)
}

importAll((require as any).context('./interactions', true))
importAll((require as any).context('./primitives', true))