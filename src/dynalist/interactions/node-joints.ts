import { ID, NodeAny, Point } from '@client/types';
import { Dynalist } from '../dynalist';

interface SelectState {
    node: ID,
    joint: string,
    origin: Point,
    current: Point
}

Dynalist.onCreate(instance => {
    let state: SelectState | null = null;
    let pageOffset: Point = {
        x: 0,
        y: 0
    }

    instance.events.when.nodes.joints.mouseup(null, ({ target: joint, node, e }) => {
        const element = e.target as HTMLElement;
        
        if(state !== null) {
            const other = instance.nodes[state.node];
            const current = instance.nodes[node];

            if(other === current) return;

            let idfrom: ID;
            let from: NodeAny;
            let jidfrom: ID;
            let idto: ID;
            let to: NodeAny;
            let jidto: ID;

            if(joint in current.outputs) {
                // must be in outputs, so its a target current -> other
                idfrom = node;
                idto = state.node;
                from = current;
                to = other;
                jidfrom = joint;
                jidto = state.joint;
            } else {
                // must be in inputs, so its a target other -> current
                idfrom = state.node;
                idto = node;
                from = other;
                to = current;
                jidfrom = state.joint;
                jidto = joint;
            }

            // const [ jFrom ] = Object.entries(from.outputs).find(([ , value ]) => value === jidfrom)!;
            // from.outputs[jFrom] = idto;
            for(const [ connection, to ] of Object.entries(from.outputs)) {
                if(to === jidfrom) {
                    from.outputs[connection] = jidto;
                }
            }

            state = null;
            instance.cursor = 'default';
            instance.previewPath = null;
            instance.markDirty();
        } else {
            const wrapperBox = instance.events.element.getBoundingClientRect();
            pageOffset = wrapperBox;
            const origin: Point = {
                x: e.pageX - wrapperBox.x - instance.camera.x,
                y: e.pageY - wrapperBox.y - instance.camera.y
            }

            console.log(origin);

            instance.pushState();

            state = {
                node,
                joint,
                origin,
                current: origin
            }

            instance.cursor = 'crosshair';
        }
    });

    instance.events.when.move(null, ({ x, y }) => {
        if(state) {
            state.current = {
                x: x - pageOffset.x - instance.camera.x,
                y: y - pageOffset.y - instance.camera.y
            }
            instance.previewPath = {
                from: state.origin,
                to: state.current
            }
            instance.markDirty();
        }
    });
});