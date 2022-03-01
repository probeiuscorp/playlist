import { ID, NodeAny, Point } from '@client/types';
import { Dynalist } from '../dynalist';

interface SelectState {
    node: ID,
    id: string,
    origin: Point,
    current: Point,
    isParam: boolean
}

Dynalist.onCreate(instance => {
    let state: SelectState | null = null;
    let pageOffset: Point = {
        x: 0,
        y: 0
    }

    instance.events.when.nodes.joints.mouseup(null, ({ id, node, e, isParam }) => {
        const element = e.target as HTMLElement;
        
        if(state !== null) {
            const other = instance.nodes[state.node];
            const current = instance.nodes[node];

            if(other === current) return;
            if(state.isParam === isParam) return;

            let target: NodeAny;
            let idFrom: string;
            let jointTo: ID;

            if(isParam) {
                target = other;
                jointTo = instance.nodes[node].params[id];
                idFrom = state.id;
            } else {
                target = current;
                jointTo = instance.nodes[state.node].params[state.id];
                idFrom = id;
            }

            target.outputs[idFrom] = jointTo;

            state = null;
            instance.cursor = 'default';
            instance.previewPath = null;
            instance.markDirty();
        } else {
            const box = element.getBoundingClientRect();
            const wrapperBox = instance.events.element.getBoundingClientRect();
            pageOffset = wrapperBox;
            const origin: Point = {
                x: box.x - wrapperBox.x + box.width / 2 + instance.camera.x,
                y: box.y - wrapperBox.y + box.height / 2 + instance.camera.y
            }

            instance.pushState();

            state = {
                node,
                id,
                origin,
                current: origin,
                isParam
            }

            instance.cursor = 'crosshair';
        }
    });

    instance.events.when.move(null, ({ x, y }) => {
        if(state) {
            state.current = { x, y };
            instance.previewPath = {
                from: state.origin,
                to: state.current
            }
            instance.markDirty();
        }
    });

    instance.events.when.key({
        key: 'Escape'
    }, () => {
        state = null;
        instance.previewPath = null;
        instance.cursor = 'default';
        instance.markDirty();
    });
});