import { ID } from '@client/types';
import { Dynalist } from '../dynalist';
export const arrows: [string, number, number][] = [
    ['ArrowUp', 0, -1],
    ['ArrowDown', 0, 1],
    ['ArrowLeft', -1, 0],
    ['ArrowRight', 1, 0]
];

Dynalist.onCreate(instance => {
    instance.when.key({
        key: 'Backspace'
    }, () => {
        const problemIds: ID[] = [];
        for(const id in instance.selected.nodes) {
            const params = instance.nodes[id].params;
            for(const param in params) {
                problemIds.push(params[param]);
            }
            delete instance.nodes[id];
        }

        const nodes = Object.values(instance.nodes);
        for(const node of nodes) {
            const entries = Object.entries(node.outputs);
            for(const [ id, to ] of entries) {
                if(to) {
                    if(problemIds.indexOf(to) !== -1) {
                        node.outputs[id] = null;
                    }
                }
            }
        }

        instance.markDirty();
    });

    function createHandler(dx: number, dy: number): () => void {
        return () => {
            const keys = Object.keys(instance.selected.nodes);
            if(keys.length > 0) {
                for(const key of keys) {
                    const node = instance.nodes[key];
                    node.x += dx;
                    node.y += dy;
                }

                instance.markDirty();
            }
        }
    }

    for(const [ key, dx, dy ] of arrows) {
        instance.when.keydown({
            key,
            modifiers: {
                ctrl: true
            }
        }, createHandler(dx * 50, dy * 50));

        instance.when.keydown({
            key
        }, createHandler(dx * 10, dy * 10));

        instance.when.keydown({
            key,
            modifiers: {
                shift: true
            }
        }, createHandler(dx, dy));
    }
});