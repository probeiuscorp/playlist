import { Dynalist, PrimitiveEntry } from '@client/dynalist/dynalist';
import { MutatorsEventLayer } from '@client/dynalist/mutators-event-layer';
import { mutators } from '@client/mutators';
import { Camera, ID, NodeAny, NodeMutator, NodeParam, Point } from '@client/types';
import { conditional, map, paramsOutputsOf } from '@client/util';
import React from 'react';
import './Node.scss';
import { OnNodesEvent } from './Nodes';

export type PositionReport = Record<string, Point>;
export type UpdateParamsPosition = (params: PositionReport, outputs: PositionReport, id: string) => void;

export interface NodeProps {
    node: NodeAny,
    updateParamPositions: UpdateParamsPosition,
    onEvent: OnNodesEvent,
    id: ID,
    selected: boolean,
    camera: Camera
}

type InputRefMap = Record<string, React.RefObject<HTMLDivElement>>;

function stopPropagation<T extends React.BaseSyntheticEvent>(e: T) {
    e.stopPropagation();
    return e;
}


export default class Node extends React.Component<NodeProps> {
    private params: InputRefMap = {};
    private outputs: InputRefMap = {};

    constructor(props: NodeProps) {
        super(props);

        const { params, outputs } = paramsOutputsOf(props.node);

        for(const param of params) {
            this.params[param.id] = React.createRef();
        }
        for(const param of outputs) {
            this.outputs[param.id] = React.createRef();
        }
    }

    mapper(ref: React.RefObject<HTMLDivElement>): Point {
        const boundingRect = ref.current!.getBoundingClientRect();
        return {
            x: boundingRect.x + boundingRect.width / 2,
            y: boundingRect.y + boundingRect.height / 2
        }
    }

    updateParamPositions = () => {
        this.props.updateParamPositions(map(this.params, this.mapper), map(this.outputs, this.mapper), this.props.node.id)
    }

    componentDidMount(): void {
        this.updateParamPositions();
    }

    componentDidUpdate(): void {
        this.updateParamPositions();
    }

    renderParam = (param: NodeParam, input: boolean) => {
        return (
            <div className="node-input" key={param.label}>
                <div
                    className="node-input-click-target"
                    onMouseDown={e => void this.props.onEvent('node.joint.mousedown', {
                        e: stopPropagation(e),
                        node: this.props.id,
                        target: this.props.node[input ? "params" : "outputs"][param.id]!
                    })}
                    onMouseUp={e => void this.props.onEvent('node.joint.mouseup', {
                        e: stopPropagation(e),
                        node: this.props.id,
                        target: this.props.node[input ? "params" : "outputs"][param.id]!
                    })}
                >
                    <div
                        className={conditional({
                            "node-input-connection": true,
                            "connection-sequence": param.type === 'sequence',
                            "connection-number": param.type === 'number',
                            "connection-boolean": param.type === 'boolean',
                            "connection-any": param.type === 'any'
                        })}
                        ref={input ? this.params[param.id] : this.outputs[param.id]}
                    />
                </div>
                <div className="node-input-label">{param.label}</div>
            </div>
        );
    }

    renderMutator = (node: NodeMutator) => {
        const mutator = mutators[node.mutator];
        return (
            <>
            <div className="node-header">
                <i className="bi bi-braces"/>
                {mutator.display}
            </div>
            <div className="node-body">
                <div className="node-inputs">
                    {mutator.params.map(p => this.renderParam(p, true))}
                </div>
                <div className="spacer"/>
                <div className="node-outputs">
                    {mutator.outputs.map(p => this.renderParam(p, false))}
                </div>
            </div>
            </>
        );
    }

    render() {
        const { node, id, camera } = this.props;
        const entry = (node.type === 'primitive' && Dynalist.primitives[node.primitive]) as PrimitiveEntry;

        return (
            <div
                className={conditional({
                    "node": true,
                    "selected": this.props.selected,
                    ...node.classes
                })}
                onMouseDown={e => void this.props.onEvent('node.mousedown', {
                    e: stopPropagation(e),
                    target: id
                })}
                onMouseUp={e => void this.props.onEvent('node.mouseup', {
                    e: stopPropagation(e),
                    target: id
                })}
                style={{
                    top: `${node.y - camera.y}px`,
                    left: `${node.x - camera.x}px`,
                }}
            >
                {
                    node.type === 'mutator' ? this.renderMutator(node) : (
                        <entry.component
                            node={node}
                            setState={console.log}
                            params={
                                <div className="node-inputs">{entry.info.params.map(p => this.renderParam(p, true))}</div>
                            }
                            outputs={
                                <div className="node-outputs">{entry.info.outputs.map(p => this.renderParam(p, false))}</div>
                            }
                        />
                    )
                }
            </div>
        );
    }
}