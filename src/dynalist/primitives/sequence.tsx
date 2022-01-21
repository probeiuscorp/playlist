import React from 'react';
import { Dynalist } from '../dynalist';

Dynalist.registerPrimitive({
    id: 'sequence',
    display: 'Sequence',
    description: 'Links to a sequence and outputs it',
    params: [],
    outputs: [
        {
            id: 'sequence',
            type: 'sequence',
            label: ''
        }
    ],
    getValue: () => {
        return {
            sequences: true
        };
    }
}, function(props) {
    return (
        <div className="node-body round-all">
            <div className="prim-sequence-content">
                <i className="bi bi-play-circle-fill"/>
                <span className="prim-sequence-title">Terran themes</span>
            </div>
            {props.outputs}
        </div>
    );
})