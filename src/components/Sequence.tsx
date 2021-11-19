import React from 'react';
import '../styles/sequences';

export type SequenceProps = React.PropsWithChildren<{
    icon: {
        className: string,
        bsIcon: string
    },
    handleEdit?: React.MouseEventHandler<HTMLDivElement>;
}>;

export default class Sequence extends React.Component<SequenceProps> {
    render() {
        return (
            <div className="sequence" draggable="true" onDoubleClick={this.props.handleEdit}>
                <div className="seq-row">
                    <div className={`seq-icon seq-${this.props.icon.className}`}>
                        <i className={`bi bi-${this.props.icon.bsIcon}`}></i>
                    </div>
                    <div className="seq-content">
                        {this.props.children}
                    </div>
                    <div className="seq-video-controls">
                        <i className="bi bi-play-fill"></i>
                        <i className="bi bi-pause-fill"></i>
                        <i className="bi bi-arrow-counterclockwise"></i>
                    </div>
                </div>
            </div>
        )
    }
}