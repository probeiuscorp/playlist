import { EventPayloadMap } from '@client/dynalist/mutators-event-layer';
import { Camera, ID, NodeAny, Path, Point } from '@client/types';
import React from 'react';
import Node, { PositionReport, UpdateParamsPosition } from './Node';

export type NodesAny = Record<string, NodeAny>;
export type UpdatePaths = (paths: Path[]) => void;
export type OnNodesEvent = <K extends keyof EventPayloadMap>(type: K, data: EventPayloadMap[K]["payload"]) => void;
export interface NodesProps {
    camera: Camera,
    nodes: NodesAny,
    updatePaths: UpdatePaths,
    onEvent: OnNodesEvent,
    iteration: number,
    selected: Record<string, boolean>
}

function subtract(p1: Point, p2: Point): Point {
    return {
        x: p1.x - p2.x,
        y: p1.y - p2.y
    }
}

function untransform(p: Point, camera: Camera): Point {
    return {
        x: (p.x - camera.x*camera.zoom),
        y: (p.y - camera.y*camera.zoom)
    }
}

export default class Nodes extends React.Component<NodesProps> {
    private returned: number = 0;
    private positions: Record<string, { params: PositionReport, outputs: PositionReport }> = {};
    private container: React.RefObject<HTMLDivElement>;
    private hasMounted: boolean = false;

    constructor(props) {
        super(props);

        this.container = React.createRef();
    }

    updateAll = () => {
        const paths: Path[] = [];
        const positions = this.positions;
        const nodes = this.props.nodes;
        const map: Record<ID, Point> = {};
        const boundary: Point = this.container.current!.getBoundingClientRect();

        // Steps
        //  - flatten all params into a dictionary of ID => Point
        //  - find all outputs and if they connect push them and their input into a Path.

        const nodeKeys = Object.keys(positions);
        for(const nodeId of nodeKeys) {
            const p = positions[nodeId];
            const node = nodes[nodeId];
            for(const name in node.params) {
                const id = node.params[name];
                map[id] = p.params[name];
            }
        }

        for(const nodeId of nodeKeys) {
            const node = nodes[nodeId];
            for(const key in node.outputs) {
                const v = node.outputs[key];
                if(v !== null) {
                    paths.push({
                        from: untransform(subtract(positions[nodeId].outputs[key], boundary), this.props.camera),
                        to: untransform(subtract(map[v], boundary), this.props.camera)
                    })
                }
            }
        }

        this.props.updatePaths(paths);
        this.returned = 0;
        this.positions = {};
    }

    componentDidMount(): void {
        console.log('uh oh trouble:', this.container);
    }

    updateParamPositions: UpdateParamsPosition = (params, outputs, id) => {
        const nodes = this.props.nodes;
        this.positions[id] = {
            params,
            outputs
        }

        if(++this.returned === Object.keys(nodes).length) {
            if(this.hasMounted) {
                this.updateAll();
            } else {
                this.componentDidMount = () => {
                    this.hasMounted = true;
                    this.updateAll();
                }
            }
        }
    }

    shouldComponentUpdate(nextProps: Readonly<NodesProps>, nextState: Readonly<{}>, nextContext: any): boolean {
        return this.props.iteration !== nextProps.iteration;
    }

    handleMouseMove = (e: React.MouseEvent) => {
        this.props.onEvent('mousemove', { dx: e.movementX, dy: e.movementY })
    };

    render() {
        return (
            <div
                className="nodes"
                ref={this.container}
                onMouseMove={this.handleMouseMove}
                style={{
                    transform: `translate(${0-this.props.camera.x}px, ${0-this.props.camera.y}px) scale(${this.props.camera.zoom})`
                }}
            >
                {
                    Object.keys(this.props.nodes).map(key => {
                        const node = this.props.nodes[key];
                        return (
                            <Node
                                node={node}
                                selected={!!this.props.selected[key]}
                                key={node.id}
                                updateParamPositions={this.updateParamPositions}
                                onEvent={this.props.onEvent}
                                id={key}
                            />
                        )
                    })
                }
            </div>
        );
    }
}