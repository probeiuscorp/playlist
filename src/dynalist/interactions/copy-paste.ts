import { generateID } from '@client/module/uid';
import { ID, NodeAny } from '@client/types';
import { Dynalist } from '../dynalist';

Dynalist.onCreate(instance => {
    let clipboard: NodeAny[];
    
    instance.when.key({
        key: 'c',
        modifiers: {
            ctrl: true
        }
    }, () => {
        clipboard = Object
            .entries(instance.selected.nodes)
            .filter(([, selected ]) => selected)
            .map(([ id ]) => instance.nodes[id]);
    });

    instance.when.key({
        key: 'v',
        modifiers: {
            ctrl: true
        }
    }, () => {
        if(!clipboard) return;

        let ids: ID[] = [];
        for(const node of clipboard) {
            const id = generateID();
            ids.push(id);
            const { id: _, outputs, params, x, y, ...rest } = node;
            instance.nodes[id] = {
                id,
                x: x + 50,
                y: y + 50,
                outputs: {},
                params: {},
                ...rest
            };
        }

        instance.selected.nodes = {};
        for(const id of ids) instance.selected.nodes[id] = true;

        instance.markDirty();
    });
});