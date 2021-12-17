import React from 'react';
import '../../styles/sequences';
import type { DraggableProvidedDragHandleProps } from 'react-beautiful-dnd';

export type SequenceHandleProps = DraggableProvidedDragHandleProps;
export interface AdditionalSequenceProps {
    handleEdit?: React.MouseEventHandler<HTMLDivElement>,
    delete: () => void
}

export type SequenceProps = React.PropsWithChildren<{
    icon: {
        className: string,
        bsIcon: string
    }
} & AdditionalSequenceProps>;

export default class Sequence extends React.Component<SequenceProps> {
    constructor(props) {
        super(props);
    }
    
    render() {
        return (
            <div className="sequence source" onDoubleClick={this.props.handleEdit}>
                <div className={`seq-icon seq-${this.props.icon.className}`}>
                    <i className={`bi bi-${this.props.icon.bsIcon}`}></i>
                </div>
                <div className="seq-content">
                    {this.props.children}
                </div>
                <div className="seq-video-controls">
                    <i className="bi bi-play-fill"></i>
                    <i className="bi bi-gear-fill"></i>
                    <i className="bi bi-trash-fill" onClick={this.props.delete}/>
                </div>
            </div>
        )
    }
}