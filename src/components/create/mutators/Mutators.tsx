import { EventPayloadMap } from '@client/dynalist/mutators-event-layer';
import { Path } from '@client/types';
import React from 'react';
import Nodes, { UpdatePaths } from './Nodes';
import Paths from './Paths';
import { Modals } from '@client/module/modal';
import { Dynalist } from '@client/dynalist/dynalist';
import './Mutators.scss';

export interface MutatorsProps {
    instance: Dynalist
}

interface MutatorsState {
    paths: Path[],
    iteration: number
}

export default class Mutators extends React.Component<MutatorsProps, MutatorsState> {
    private lastContainer: HTMLElement | null = null;

    constructor(props: MutatorsProps) {
        super(props);

        this.state = {
            paths: [],
            iteration: 0
        };

        this.props.instance.events.when.keydown({
            key: 'Enter'
        }, this.createNode);
    }

    setContainer = (element: HTMLElement | null) => {
        if(element !== this.lastContainer) {
            this.lastContainer = element;
            this.props.instance.events.setElement(element!);
        }
    }

    updatePaths: UpdatePaths = (paths) => {
        this.setState({ paths });
    }
    
    onNodeEvent = <K extends keyof EventPayloadMap>(type: K, data: EventPayloadMap[K]["payload"]) => {
        this.props.instance.events.dispatch(type, data);
    }

    createNode = async () => {
        const node = await Modals.open('mutator/new', {});
        if(node) {
            const { camera, nodes, markDirty } = this.props.instance;
            node.x = camera.x + innerWidth / 2 - 250;
            node.y = camera.y + innerHeight / 2 - 100;
            nodes[node.id] = node;
            markDirty();
        }
    }

    render() {
        const { cursor, events, nodes, selected, camera } = this.props.instance;

        return (
            <div
                ref={this.setContainer}
                className="mutators"
                style={{
                    cursor,
                    backgroundPosition: `${(40 - camera.x) % 40}px ${(40 - camera.y) % 40}px`
                }}
                onMouseUp={e => void events.dispatch('body.mouseup', e)}
                onMouseDown={e => void events.dispatch('body.mousedown', e)}
            >
                <Paths paths={this.state.paths}/>
                <Nodes
                    camera={camera}
                    nodes={nodes}
                    selected={selected}
                    updatePaths={this.updatePaths}
                    onEvent={this.onNodeEvent}
                    iteration={this.state.iteration}
                />
                <i className="bi bi-plus-circle-fill add-mutators" onClick={this.createNode}/>
            </div>
        );
    }
}