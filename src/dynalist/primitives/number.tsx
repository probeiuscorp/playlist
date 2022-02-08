import { textboxCancels } from '@client/util';
import React, { useCallback, useRef } from 'react';
import { Dynalist } from '../dynalist';

Dynalist.registerPrimitive({
    id: 'number',
    display: 'Number',
    description: 'Manually input number',
    getValue: (node, state) => {
        return {
            output: state
        };
    },
    outputs: [{
        id: 'output',
        label: '',
        type: 'number'
    }],
    params: [],
    initialState: 1
}, function(props) {
    const ref = useRef<HTMLInputElement>(null);
    const handleInput = useCallback(() => {
        props.setState(parseFloat(ref.current.value))
    }, []);

    return (
        <div className="node-body round-all">
            <input
                ref={ref}
                type="number"
                className="textbox small-textbox"
                onInput={handleInput}
                {...textboxCancels}
            />
            {props.outputs}
        </div>
    )
})