import { NodeAny, NodeEnd, NodeMutator, NodeSequence } from '@client/types';
import React from 'react';
import './Node.scss';

interface MutatorInfo {
    display: string,
    params: {
        label: string,
        type: 'sequence' | 'number' | 'chance'
    }[]
}

const mutators: Record<string, MutatorInfo> = {
    'shuffle': {
        display: 'Shuffle',
        params: [
            {
                label: 'Shuffle:',
                type: 'sequence'
            }
        ]
    }
};

export interface NodeProps {
    node: NodeAny
}

export default class Node extends React.Component<NodeProps> {
    renderEnd = (node: NodeEnd) => {
        return (
            <>
            </>
        );
    }

    renderSequence = (node: NodeSequence) => {
        return (
            <>
            </>
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

            </div>
            </>
        );
    }

    render() {
        const { node } = this.props;
        
        return (
            <div className="node" style={{ top: `${node.y}px`, left: `${node.x}px` }}>
                {
                    node.type === 'end' ? this.renderEnd(node) :
                    node.type === 'sequences' ? this.renderSequence(node) :
                    node.type === 'mutator' ? this.renderMutator(node) : null
                }
            </div>
        );
    }
}