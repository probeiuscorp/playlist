import { Dynalist } from '../dynalist';
import { generateID } from '@client/module/uid';
import { ID, NodeAny } from '@client/types';

Dynalist.onCreate(instance => {
    let clipboard: NodeAny[];
    
    instance.events.when.key({
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

    instance.events.when.key({
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
            const { id: _, outputs, params, x, y, classes, ...rest } = node;
            instance.nodes[id] = {
                id,
                x: x + 50,
                y: y + 50,
                outputs: {},
                params: {},
                classes: {},
                ...rest
            };
        }

        instance.selected = {};
        for(const id of ids) instance.selected.nodes[id] = true;

        instance.markDirty();
    });
});