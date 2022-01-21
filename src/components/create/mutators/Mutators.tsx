import { Dynalist, EventPayloadMap } from '@client/dynalist/dynalist';
import { Path } from '@client/types';
import React from 'react';
import ModalMutator, { ModalMutatorProps } from './ModalMutator';
import Nodes, { UpdatePaths } from './Nodes';
import Paths from './Paths';
import './Mutators.scss';

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
            x: -100,
            y: -100,
            zoom: 1
        };

        this.instance.public.nodes = {
            asd: {
                id: 'asd',
                type: 'mutator',
                mutator: 'shuffle',
                x: 0,
                y: 50,
                params: {
                    shuffle: 'c'
                },
                outputs: {
                    shuffled: 'a'
                },
                classes: {}
            },
            qwe: {
                id: 'qwe',
                type: 'mutator',
                mutator: 'shuffle',
                x: 285,
                y: 125,
                params: {
                    shuffle: 'a'
                },
                outputs: {
                    shuffled: 'e'
                },
                classes: {}
            },
            zxc: {
                id: 'zxc',
                type: 'mutator',
                mutator: 'shuffle',
                x: 600,
                y: 200,
                params: {
                    shuffle: 'e'
                },
                outputs: {
                    shuffled: null
                },
                classes: {}
            },
            rty: {
                id: 'rty',
                type: 'primitive',
                primitive: 'sequence',
                x: 300,
                y: 500,
                params: {},
                outputs: {},
                classes: {},
                state: {}
            }
        };
        this.forceUpdate();
    }

    updatePaths: UpdatePaths = (paths) => {
        this.setState({ paths });
    }
    
    onNodeEvent = <K extends keyof EventPayloadMap>(type: K, data: EventPayloadMap[K]["payload"]) => {
        this.instance.dispatch(type, data);
    }

    handleNodeCreate: ModalMutatorProps["onCreate"] = (node) => {
        this.instance.public.nodes[node.id] = node;
        this.instance.public.markDirty();
    }

    render() {
        return (
            <div
                ref={this.container}
                className="mutators"
                style={{
                    cursor: this.instance?.public?.cursor ?? 'default'
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
                        <ModalMutator
                            show={this.state.showMutatorModal}
                            onClose={() => void this.setState({ showMutatorModal: false })}
                            onCreate={this.handleNodeCreate}
                        />
                        <i className="bi bi-plus-circle-fill add-mutators" onClick={() => void this.setState({ showMutatorModal: true })}/>
                        </>
                    )
                }
            </div>
        );
    }
}