import React from 'react';
import SequenceEnd from './SequenceEnd';
import SequenceFile from './SequenceFile';
import SequenceStart from './SequenceStart';
import SequenceVideo from './SequenceVideo';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import Mutator from './Mutator';
import { actions, FileSequencesDirs, generateID, MutatorUnevaluatedParameters, SequenceFiles, SequenceID, Sources, store } from '../store';
import Empty from './Empty';

export type ISequence = ({
    type: 'video',
    video: string
} | {
    type: 'file'
}) & {
    id: string,
    beingDragged: boolean
}

interface ViewportProps {
    sequence: SequenceID,
    sources: Sources,
    files: SequenceFiles,
    dirs: FileSequencesDirs
}

export default class Viewport extends React.Component<ViewportProps> {
    static nextId = 0;
    private container: React.RefObject<HTMLDivElement>;
    private id: number;

    constructor(props) {
        super(props);
        this.id = Viewport.nextId++;

        this.container = React.createRef();
    }

    handleDragEnd = (result: DropResult) => {
        if(result.destination) {   
            store.dispatch(actions.sequences.move({
                sequence: this.props.sequence,
                indexFrom: result.source.index,
                indexTo: result.destination.index
            }));
        }
    }

    handleChildRequestedUpdate = (index: number, newState: MutatorUnevaluatedParameters<any>) => {
        const source = {...this.props.sources[index]};
        if('type' in source) {
            source.state = newState;
            store.dispatch(actions.sequences.update({
                sequence: this.props.sequence,
                index,
                updated: source
            }));
        }
    }

    handleChildRequestedDeletion = (index: number) => {
        store.dispatch(actions.sequences.delete({
            index,
            sequence: this.props.sequence
        }));
    }

    appendItem = (id: SequenceID) => {
        store.dispatch(actions.sequences.append({
            sequence: this.props.sequence,
            source: {
                primitive: 'video',
                video: 'dQw4w9WgXcQ',
                id: generateID()
            }
        }));
    }

    render() {
        return (
            <div className="sequence-viewport" ref={this.container}>
                <DragDropContext onDragEnd={this.handleDragEnd}>
                    <Droppable droppableId={`sequences-${this.id}`} direction="horizontal">
                        {(provided) => (
                            <div className="viewport" {...provided.droppableProps} ref={provided.innerRef}>
                                <SequenceStart/>
                                {
                                    this.props.sources.map((source, i) => {
                                        let element: JSX.Element;

                                        if('type' in source) {
                                            element = (
                                                <Mutator
                                                    info={source.info}
                                                    params={source.parameters}
                                                    state={source.state}
                                                    files={this.props.files}
                                                    dirs={this.props.dirs}
                                                    update={newState => void this.handleChildRequestedUpdate(i, newState)}
                                                    delete={() => void this.handleChildRequestedDeletion(i)}
                                                />    
                                            );
                                        } else {
                                            if(source.primitive === 'mp3') {
                                                element = <SequenceFile/>;
                                            } else if(source.primitive === 'video') {
                                                element = (
                                                    <SequenceVideo
                                                        video={source.video}
                                                    />
                                                )
                                            }
                                        }
                                        return (
                                            <Draggable key={source.id} draggableId={source.id} index={i}>
                                                {(provided) => (
                                                    <div {...provided.draggableProps} ref={provided.innerRef} {...provided.dragHandleProps}>
                                                        {element}
                                                    </div>
                                                )}
                                            </Draggable>
                                        )    
                                    })
                                }
                                {provided.placeholder}
                                <Empty
                                    set={this.appendItem}
                                    className="empty-source source-shadow"
                                />
                                <SequenceEnd/>
                            </div>
                        )}
                    </Droppable>
                </DragDropContext>
            </div>
        );
    }
}