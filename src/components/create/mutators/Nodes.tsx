import { Camera, NodeAny } from '@client/types';
import React from 'react';
import Node from './Node';

export interface NodesProps {
    camera: Camera,
    nodes: NodeAny[]
}

export default class Nodes extends React.Component<NodesProps> {
    render() {
        return (
            <div className="nodes">
                {
                    this.props.nodes.map(node => {
                        return (
                            <Node node={node} ref={node.id}/>
                        )
                    })
                }
            </div>
        );
    }
}