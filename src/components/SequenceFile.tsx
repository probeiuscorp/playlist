import React from 'react';
import Sequence from './Sequence';

export default class SequenceFile extends React.Component {
    render() {
        return (
            <Sequence icon={{
                bsIcon: 'soundwave',
                className: 'file'
            }}>

            </Sequence>
        );
    }
}