import React from 'react';
import Sequence, { AdditionalSequenceProps } from './Sequence';

export interface VideoProps extends AdditionalSequenceProps {
    video: string
}
export default class SequenceVideo extends React.Component<VideoProps> {
    render() {
        return (
            <Sequence icon={{
                bsIcon: 'youtube',
                className: 'youtube'
            }} {...this.props}>
                <img className="thumbnail" src={`https://i.ytimg.com/vi/${this.props.video}/mqdefault.jpg`} draggable="false"></img>
            </Sequence>
        );
    }
}