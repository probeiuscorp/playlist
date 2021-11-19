import React from 'react';
import Sequence from './Sequence';

export interface VideoProps {
    video: string
}
export default class SequenceVideo extends React.Component<VideoProps> {
    render() {
        return (
            <Sequence icon={{
                bsIcon: 'youtube',
                className: 'youtube'
            }}>
                <img className="thumbnail" src={`https://i.ytimg.com/vi/${this.props.video}/mqdefault.jpg`} draggable="false"></img>
            </Sequence>
        );
    }
}