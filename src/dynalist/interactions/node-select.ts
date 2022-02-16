import { ID } from '@client/types';
import { Dynalist } from '../dynalist';
import { MutatorsEventLayer } from '../mutators-event-layer';

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
        instance.selected[target] = !instance.selected.nodes[target];
        instance.markDirty();
    });

    instance.events.when.nodes.joints.mousedown(null, ({ node: nodeId, target }) => {
        const node = instance.nodes[nodeId];
        if(state) {
            const { selected, node: targettedNodeId, type } = state;
            const targettedNode = instance.nodes[targettedNodeId!];
            state = null;
            if(selected !== target && targettedNode !== node) {
                const currentType: JointType = Object.entries(node.outputs).some(([ , value ]) => target === value) ? 'output' : 'param';
                if(currentType === type) {
                    return; // Deselect everything when the user clicks the node twice
                } else {
                    const {
                        output,
                        input,
                        from
                    } = type === 'output' ? ({
                        output: selected,
                        input: target,
                        from: targettedNode
                    }) : ({
                        output: target,
                        input: selected,
                        from: node
                    });
                    const [ key ] = Object.entries(from.outputs).find(([, value]) => value === output)!;
                    from.outputs[key] = input;
                    instance.pushState();
                }
            }
        } else {
            state = {
                selected: target,
                node: nodeId,
                type: Object.entries(node.outputs).some(([ , value ]) => target === value) ? 'output' : 'param'
            }
        }
        instance.selected[target] = true;
        instance.markDirty();
    });

    instance.events.when.nodes.joints.mouseup({ shift: true }, ({ target }) => {
        instance.selected = {};
        instance.markDirty();
    });

    instance.events.when.mouseup(null, () => {
        stopDragging();
        instance.selected = {};
        instance.markDirty();
    })

    instance.events.when.key({
        key: 'Escape'
    }, () => {
        state = null;
    })
});