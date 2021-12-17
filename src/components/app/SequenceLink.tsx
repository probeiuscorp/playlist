import React from 'react';
import { SequenceID } from '../store';
import Sequence, { AdditionalSequenceProps } from './Sequence';

export type SequenceLinkProps = AdditionalSequenceProps & { link: SequenceID };

export default class SequenceLink extends React.Component<SequenceLinkProps> {
    render() {
        return (
            <Sequence
                icon={{
                    bsIcon: "link",
                    className: ""
                }}
                {...this.props}
            >
                {this.props.children}
            </Sequence>
        );
    }
}