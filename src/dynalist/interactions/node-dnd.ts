import { ID } from '@client/types';
import { Dynalist } from '../dynalist';

interface DraggingState {
    target: ID,
    startedSelecting: number,
    selecting: boolean,
    oldX: number,
    oldY: number,
    offsetX: number,
    offsetY: number
}

Dynalist.onCreate(instance => {
    let draggingState: DraggingState | null = null;

    instance.events.when.nodes.mousedown(null, ({ target, e }) => {
        const element = (e.target as HTMLElement).closest('.node')!;
        console.log(element);
        const box = element.getBoundingClientRect();
        const node = instance.nodes[target];
        draggingState = {
            target,
            oldX: node.x,
            oldY: node.y,
            offsetX: box.width / 2,
            offsetY: box.height / 2,
            startedSelecting: Date.now(),
            selecting: true
        }
        instance.markDirty();
    });

    instance.events.when.move(null, ({ x, y }) => {
        if(draggingState) {
            const { startedSelecting, target, offsetX, offsetY } = draggingState;
            if(Date.now() - startedSelecting > 100) {
                const node = instance.nodes[target];
                node.classes['dragging'] = true;
                draggingState.selecting = false;
                node.x = x - offsetX;
                node.y = y - offsetY;
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