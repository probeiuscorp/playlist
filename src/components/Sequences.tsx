import React from 'react';
import SequenceEnd from './SequenceEnd';
import SequenceFile from './SequenceFile';
import SequenceLine from './SequenceLine';
import SequenceStart from './SequenceStart';
import SequenceVideo from './SequenceVideo';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { SequenceHandleProps } from './Sequence';

export type ISequence = ({
    type: 'video',
    video: string
} | {
    type: 'file'
}) & {
    id: string,
    beingDragged: boolean
}

interface SequencesState {
    sequences: ISequence[]
}

export default class Sequences extends React.Component<{}, SequencesState> {
    protected static nextId = 0;
    private id: number;

    constructor(props) {
        super(props);

        this.id = Sequences.nextId++;

        this.state = {
            sequences: [
                {
                    type: 'video',
                    video: 'dQw4w9WgXcQ',
                    id: 'nevergonnagiveyouup',
                    beingDragged: false
                }, {
                    type: 'video',
                    video: 'rTgj1HxmUbg',
                    id: 'nevergonnaletyoudown',
                    beingDragged: false
                }
            ]
        }

        for(let i=0;i<15;i++) {
            this.state.sequences.push({
                type: 'file',
                id: i.toString(),
                beingDragged: false
            });
        }
    }

    handleDragEnd = (result: DropResult) => {
        if(!result.destination) return;

        const items = Array.from(this.state.sequences);
        const [ item ] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, item);

        this.setState({ sequences: items });
    }

    render() {
        return (
            <div className="sequence-viewport">
                <DragDropContext onDragEnd={this.handleDragEnd}>
                    <Droppable droppableId={`sequences-${this.id}`} direction="horizontal">
                        {(provided) => (
                            <div className="sequences" {...provided.droppableProps} ref={provided.innerRef}>
                                <SequenceStart/>
                                {/* <SequenceLine key="line-start"/> */}
                                {
                                    this.state.sequences.map((sequence, i) => {
                                        let element: JSX.Element;
                                        if(sequence.type === 'file') {
                                            element = <SequenceFile/>;
                                        } else if(sequence.type === 'video') {
                                            element = (
                                                <SequenceVideo
                                                    video={sequence.video}
                                                />
                                            )
                                        }
                                        return [
                                            <Draggable key={sequence.id} draggableId={sequence.id} index={i}>
                                                {(provided) => (
                                                    <div {...provided.draggableProps} ref={provided.innerRef} {...provided.dragHandleProps}>
                                                        {element}
                                                    </div>
                                                )}
                                            </Draggable>,
                                            // <SequenceLine key={`line-${sequence.id}`}/>
                                        ];
                                    })
                                }
                                {provided.placeholder}
                                <SequenceEnd/>
                            </div>
                        )}
                    </Droppable>
                </DragDropContext>
            </div>
        );
    }
}