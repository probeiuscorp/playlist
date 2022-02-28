import React, { useCallback } from 'react';
import { textboxCancels } from '@client/util';
import { Dynalist } from '../dynalist';

Dynalist.registerPrimitive({
    id: 'yield',
    display: 'Yield',
    description: 'Finalized output',
    params: [
        {
            id: 'input',
            label: '',
            type: 'sequence'
        }
    ],
    outputs: [],
    getValue: () => {
        return {};
    },
    initialState: ''
}, function(props) {
    const handleChange = useCallback(() => {

    }, [])

    return (
        <>
        <div className="node-header">
            <i className="bi bi-check-circle-fill green"/>
            Yield
        </div>
        <div className="node-body">
            {props.params}
            <div className="yield-container">
                Name
                <input
                    type="text"
                    placeholder="Main"
                    className="textbox small-textbox"
                    onInput={handleChange}
                    {...textboxCancels}
                />
            </div>
        </div>
        </>
    );
});