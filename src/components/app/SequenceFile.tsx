import React from 'react';
import Sequence, { AdditionalSequenceProps } from './Sequence';

export default class SequenceFile extends React.Component<AdditionalSequenceProps> {
    render() {
        return (
            <Sequence icon={{
                bsIcon: 'soundwave',
                className: 'file',
            }} delete={this.props.delete}>

            </Sequence>
        );
    }
}