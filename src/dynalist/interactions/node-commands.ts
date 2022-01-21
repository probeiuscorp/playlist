import { ID } from '@client/types';
import { Dynalist } from '../dynalist';

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
                if(problemIds.indexOf(to) !== -1) {
                    node.outputs[id] = null;
                }
            }
        }

        instance.markDirty();
    });

    const arrows = [
        ['ArrowUp', 0, -1],
        ['ArrowDown', 0, 1],
        ['ArrowLeft', -1, 0],
        ['ArrowRight', 1, 0]
    ] as const;

    for(const [ key, dx, dy ] of arrows) {
        instance.when.key({
            key,
            modifiers: {
                ctrl: true
            }
        }, () => {
            for(const key in instance.selected.nodes) {
                const node = instance.nodes[key];
                node.x += dx * 50;
                node.y += dy * 50;
            }

            instance.markDirty();
        });

        instance.when.key({
            key
        }, () => {
            for(const key in instance.selected.nodes) {
                const node = instance.nodes[key];
                node.x += dx * 10;
                node.y += dy * 10;
            }

            instance.markDirty();
        });

        instance.when.key({
            key,
            modifiers: {
                shift: true
            }
        }, () => {
            for(const key in instance.selected.nodes) {
                const node = instance.nodes[key];
                node.x += dx;
                node.y += dy;
            }

            instance.markDirty();
        });
    }
});