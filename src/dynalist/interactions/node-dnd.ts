import { ID } from '@client/types';
import { Dynalist } from '../dynalist';

type JointType = 'param' | 'output';

interface NodesSelected {
    node: ID | null,
    selected: ID | null,
    type: JointType
}

interface DraggingState {
    target: ID,
    startedSelecting: number,
    selecting: boolean,
    oldX: number,
    oldY: number
}

Dynalist.onCreate(instance => {
    let state: NodesSelected | null = null;
    let draggingState: DraggingState | null = null;

    instance.events.when.nodes.mousedown(null, ({ target }) => {
        const node = instance.nodes[target];
        draggingState = {
            target,
            oldX: node.x,
            oldY: node.y,
            startedSelecting: Date.now(),
            selecting: true
        }
        instance.markDirty();
    });

    instance.events.when.move(null, ({ dx, dy }) => {
        if(draggingState) {
            const { startedSelecting, target } = draggingState;
            if(Date.now() - startedSelecting > 100) {
                const node = instance.nodes[target];
                node.classes['dragging'] = true;
                draggingState.selecting = false;
                node.x += dx;
                node.y += dy;
                instance.cursor = 'grabbing';
                instance.markDirty();
            }
        }
    });

    const stopDragging = () => {
        if(draggingState) {
            const { selecting, target } = draggingState;
            if(selecting) {
                instance.selected = {
                    [target]: true
                };
            }
            delete instance.nodes[target].classes['dragging'];
            instance.cursor = 'default';
            draggingState = null;
        }
    };

    instance.events.when.nodes.mouseup(null, () => {
        stopDragging()
        instance.markDirty();
    });

    instance.events.when.key({
        key: 'Escape'
    }, () => {
        if(draggingState) {
            const { target, oldX, oldY } = draggingState;
            const node = instance.nodes[target];
            node.x = oldX;
            node.y = oldY;
            stopDragging();
        }
    })
    
    instance.events.when.nodes.mousedown({ shift: true }, ({ target }) => {
        instance.selected[target] = !instance.selected[target];
        instance.markDirty();
    });

    instance.events.when.mouseup(null, () => {
        stopDragging();
        instance.selected = {};
        instance.markDirty();
    })
});