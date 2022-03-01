import type { ID, Path } from '@client/types';
import React from 'react';

function modifiersMatch(e: { ctrlKey: boolean, shiftKey: boolean, altKey: boolean }, mods: ModifiersOptions | undefined) {
    return (
        (mods?.ctrl ?? false) === e.ctrlKey &&
        (mods?.shift ?? false) === e.shiftKey &&
        (mods?.alt ?? false) === e.altKey
    );
}

export interface StateOptions {
    readonly save?: boolean
}

export type ModifiersOptions = {
    readonly ctrl?: boolean,
    readonly shift?: boolean,
    readonly alt?: boolean
} | null

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
        id: string,
        isParam: boolean,
        node: ID,
        e: React.MouseEvent<HTMLElement>
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
            dy: number,
            x: number,
            y: number
        }
    },
    "node.mousedown": NodeClickPayload,
    "node.mouseup": NodeClickPayload,
    "node.joint.mousedown": JointClickPayload,
    "node.joint.mouseup": JointClickPayload,
    "body.mousedown": ClickPayload,
    "body.mouseup": ClickPayload
}

export type FilterCallback<K extends keyof EventPayloadMap> = (payload: EventPayloadMap[K]["payload"]) => boolean;

export type DynalistListener<K extends keyof EventPayloadMap> = {
    callback: (payload: EventPayloadMap[K]["payload"]) => void,
    filterer: FilterCallback<K>
}[];

export class MutatorsEventLayer {
    public previewPaths: Path[];

    private listeners: {
        [K in keyof EventPayloadMap]?: DynalistListener<K>
    } = {};

    private createEventListener<K extends keyof EventPayloadMap>(id: K, filterMatches?: (filter: EventPayloadMap[K]["filter"]) => FilterCallback<K>): (filter: EventPayloadMap[K]["filter"], cb: (payload: EventPayloadMap[K]["payload"]) => void) => void {
        return (filter, cb) => {
            let v = this.listeners[id];
            const obj = {
                callback: cb,
                filterer: filterMatches ? filterMatches(filter) : () => true
            } as any;
            
            if(v) {
                v.push(obj);
            } else {
                this.listeners[id] = [obj];
            }
        }
    }

    constructor() {
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

        for(const { callback, filterer } of (listeners as DynalistListener<K>)) {
            if(filterer(payload as any)) {
                callback(payload as any);
            }
        }
    }

    public element: HTMLElement;
    public setElement(element: HTMLElement) {
        this.element = element;
        for(const { e, handler, passive } of this.eventListeners) {
            element.addEventListener(e, handler, { passive });
        }
    }

    private eventListeners: {e: string, handler: (e: Event) => void, passive: boolean}[] = [];
    public on<K extends keyof WindowEventMap>(e: K, handler: (e: WindowEventMap[K]) => void, passive?: boolean) {
        this.eventListeners.push({
            e,
            handler,
            passive: passive ?? false
        });
    }

    public readonly when = {
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
    };
}