import { ID } from '@client/types';
import { Dynalist } from '../dynalist';

type JointType = 'param' | 'output';

interface NodesSelected {
    node: ID | null,
    selected: ID | null,
    type: JointType
}

Dynalist.onCreate(instance => {
    let state: NodesSelected = null;
    let dragging: ID = null;
    let startedSelecting: number = null;
    let selecting: boolean = null;
    let oldX: number = null;
    let oldY: number = null;

    instance.when.nodes.mousedown(null, ({ target }) => {
        dragging = target;
        const node = instance.nodes[target];
        oldX = node.x;
        oldY = node.y;
        startedSelecting = Date.now();
        selecting = true;
        instance.markDirty();
    });

    instance.when.move(null, ({ dx, dy }) => {
        if(dragging) {
            if(Date.now() - startedSelecting > 100) {
                const node = instance.nodes[dragging];
                node.classes['dragging'] = true;
                selecting = false;
                node.x += dx;
                node.y += dy;
                instance.cursor = 'grabbing';
                instance.markDirty();
            }
        }
    });

    const stopDragging = () => {
        if(dragging) {
            if(selecting) {
                instance.selected = {
                    nodes: {
                        [dragging]: true
                    },
                    joints: {}
                };
            }
            delete instance.nodes[dragging].classes['dragging'];
            instance.cursor = 'default';
            dragging = null;
            startedSelecting = null;
            oldX = null;
            oldY = null;
        }
    };
    instance.when.nodes.mouseup(null, () => {
        stopDragging()
        instance.markDirty();
    });

    instance.when.key({
        key: 'Escape'
    }, () => {
        if(dragging) {
            const node = instance.nodes[dragging];
            node.x = oldX;
            node.y = oldY;
            stopDragging();
        }
    })
    
    instance.when.nodes.mousedown({ shift: true }, ({ target }) => {
        instance.selected.joints = {};
        instance.selected.nodes[target] = !instance.selected.nodes[target];
        instance.markDirty();
    });

    instance.when.nodes.joints.mousedown(null, ({ node: nodeId, target }) => {
        const node = instance.nodes[nodeId];
        if(state) {
            instance.selected.joints = {};
            const { selected, node: targettedNodeId, type } = state;
            const targettedNode = instance.nodes[targettedNodeId];
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
                    const key = Object.entries(from.outputs).find(([, value]) => value === output)[0];
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
    })

    instance.when.nodes.joints.mouseup({ shift: true }, ({ target }) => {
        instance.selected = {
            joints: {
                [target]: true
            },
            nodes: {}
        };
        instance.markDirty();
    });

    instance.when.mouseup(null, () => {
        stopDragging();
        instance.selected = {
            joints: {},
            nodes: {}
        }
        instance.markDirty();
    })

    instance.when.key({
        key: 'Escape'
    }, () => {
        state = null;
    })
});