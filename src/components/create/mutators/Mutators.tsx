import { Dynalist, EventPayloadMap } from '@client/dynalist/dynalist';
import { Path } from '@client/types';
import React from 'react';
import ModalMutator, { MutatorModal } from '../../modals/ModalMutator';
import Nodes, { UpdatePaths } from './Nodes';
import Paths from './Paths';
import NiceModal from '@ebay/nice-modal-react';
import './Mutators.scss';
import { generateID } from '@client/module/uid';
import { Modals } from '@client/module/modal';

export interface MutatorsProps {

}

interface MutatorsState {
    paths: Path[],
    iteration: number,
    showMutatorModal: boolean
}

export default class Mutators extends React.Component<MutatorsProps, MutatorsState> {
    private instance: Dynalist;
    private container: React.RefObject<HTMLDivElement>;

    constructor(props: MutatorsProps) {
        super(props);
        
        this.container = React.createRef();

        this.state = {
            paths: [],
            iteration: 0,
            showMutatorModal: false
        }
    }

    componentDidMount(): void {
        this.instance = new Dynalist({
            element: this.container.current,
            onIterationChange: iteration => {
                this.setState({ iteration })
            }
        });

        this.instance.public.camera = {
            x: -(innerWidth / 2 - 250),
            y: -(innerHeight / 2 - 50),
            zoom: 1
        };

        const Sequence = generateID();
        const Connection = generateID();
        const Yield = generateID();

        this.instance.public.nodes = {
            [Sequence]: {
                id: Sequence,
                x: -200,
                y: -15,
                type: 'primitive',
                primitive: 'sequence',
                params: {},
                outputs: {
                    sequence: Connection
                },
                classes: {},
                state: 'Main'
            },
            [Yield]: {
                id: Yield,
                x: 35,
                y: -40,
                type: 'primitive',
                primitive: 'yield',
                params: {
                    input: Connection
                },
                outputs: {},
                classes: {},
                state: 'Main'
            }
        };
        this.forceUpdate();

        this.instance.public.when.keydown({
            key: 'Enter'
        }, this.createNode);
    }

    updatePaths: UpdatePaths = (paths) => {
        this.setState({ paths });
    }
    
    onNodeEvent = <K extends keyof EventPayloadMap>(type: K, data: EventPayloadMap[K]["payload"]) => {
        this.instance.dispatch(type, data);
    }

    createNode = async () => {
        const node = await Modals.open('mutator/new', {});
        if(node) {
            const pub = this.instance.public;
            node.x = pub.camera.x + innerWidth / 2 - 250;
            node.y = pub.camera.y + innerHeight / 2 - 100;
            pub.nodes[node.id] = node;
            pub.markDirty();
        }
    }

    render() {
        return (
            <div
                ref={this.container}
                className="mutators"
                style={{
                    cursor: this.instance?.public?.cursor ?? 'default',
                    backgroundPosition: `${(40-this.instance?.public?.camera?.x??0)%40}px ${(40-this.instance?.public?.camera?.y??0)%40}px`
                }}
                onMouseUp={e => void this.instance.dispatch('body.mouseup', e)}
                onMouseDown={e => void this.instance.dispatch('body.mousedown', e)}
            >
                {
                    this.instance && (
                        <>
                        <Paths paths={this.state.paths}/>
                        <Nodes
                            camera={this.instance.public.camera}
                            nodes={this.instance.public.nodes}
                            selected={this.instance.public.selected.nodes}
                            updatePaths={this.updatePaths}
                            onEvent={this.onNodeEvent}
                            iteration={this.state.iteration}
                        />
                        <i className="bi bi-plus-circle-fill add-mutators" onClick={this.createNode}/>
                        </>
                    )
                }
            </div>
        );
    }
}