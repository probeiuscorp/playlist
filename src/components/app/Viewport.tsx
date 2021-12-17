import React from 'react';
import SequenceEnd from './SequenceEnd';
import SequenceFile from './SequenceFile';
import SequenceStart from './SequenceStart';
import SequenceVideo from './SequenceVideo';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import Mutator from './Mutator';
import { actions, FileSequencesDirs, SequenceFiles, SequenceID, Source, Sources, store } from '../../store';
import Empty from './Empty';
import ModalNewItem from './ModalNewItem';
import SequenceLink from './SequenceLink';

interface RenderSourceParameters {
    source: Source,
    onDelete: () => void,
    onUpdate: (newState: Source) => void,
    /**
     * Handler to get a Source from the modal.
     */
    onCreate: () => Promise<Source>,
    empty: {
        /**
         * When a new item is made from an empty item.
         */
        onCreate: (source: Source) => void
    }
}
export function renderSource({ source, onDelete, onUpdate, onCreate, empty }: RenderSourceParameters): React.ReactNode {
    if(source === null) {
        return (
            <Empty
                className="mutator-item"
                requestCreate={onCreate}
                create={empty.onCreate}
            />
        );
    } else if('type' in source) {
        return (
            <Mutator
                info={source.info}
                params={source.parameters}
                state={source.state}
                update={state => {
                    let newSource = { ...source };
                    newSource.state = state;
                    onUpdate(newSource);
                }}
                delete={onDelete}
                requestCreate={onCreate}
            />    
        );
    } else if('primitive' in source) {
        if(source.primitive === 'mp3') {
            return (
                <SequenceFile
                    delete={onDelete}
                />
            );
        } else if(source.primitive === 'video') {
            return (
                <SequenceVideo
                    video={source.video}
                    delete={onDelete}
                />
            )
        }
    } else {
        return (
            <SequenceLink
                link={source.link}
                delete={onDelete}
            />
        )
    }
}

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

interface ViewportState {
    modal: boolean
}

export default class Viewport extends React.Component<ViewportProps, ViewportState> {
    static nextId = 0;
    private container: React.RefObject<HTMLDivElement>;
    private id: number;
    private request: null | ((source: Source | null) => void) = null;

    constructor(props) {
        super(props);
        this.id = Viewport.nextId++;

        this.container = React.createRef();

        this.state = {
            modal: false
        };
    }

    componentDidMount(): void {
        document.body.addEventListener('keyup', this.handleKeyDown);
    }

    componentWillUnmount(): void {
        document.body.removeEventListener('keyup', this.handleKeyDown);
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

    handleChildRequestedUpdate = (index: number, source: Source) => {
        console.log(source);
        store.dispatch(actions.sequences.update({
            sequence: this.props.sequence,
            index,
            updated: source
        }));
    }

    handleChildRequestedDeletion = (index: number) => {
        store.dispatch(actions.sequences.delete({
            index,
            sequence: this.props.sequence
        }));
    }

    handleChildRequestedCreate: () => Promise<Source> = () => {
        this.setState({ modal: true });
        return new Promise((resolve, reject) => {
            this.request = (source) => {
                if(!!source) {
                    resolve(source);
                } else {
                    reject(source);
                }
                this.request = null;
            }
        });
    }

    handleKeyDown = (e: KeyboardEvent) => {
        if(e.key === 'q' && e.ctrlKey) {
            this.setState({ modal: true });
            e.preventDefault();
        }
    }

    handleModalChange = (source: Source) => {
        if(!!this.request) {
            this.request(source);
        } else {
            store.dispatch(actions.sequences.append({
                source,
                sequence: this.props.sequence
            }));
        }
    }

    appendItem = (source: Source) => {
        store.dispatch(actions.sequences.append({
            sequence: this.props.sequence,
            source
        }));
    }

    render() {
        return (
            <div className="sequence-viewport"
                ref={this.container}
            >
                <DragDropContext onDragEnd={this.handleDragEnd}>
                    <Droppable droppableId={`sequences-${this.id}`} direction="horizontal">
                        {(provided) => (
                            <div id="viewport" className="viewport" {...provided.droppableProps} ref={provided.innerRef}>
                                <SequenceStart/>
                                {
                                    this.props.sources.map((source, i) => {
                                        
                                        return (
                                            <Draggable key={source.id} draggableId={source.id} index={i}>
                                                {(provided) => (
                                                    <div {...provided.draggableProps} ref={provided.innerRef} {...provided.dragHandleProps}>
                                                        {
                                                            renderSource({
                                                                source,
                                                                onDelete: () => void this.handleChildRequestedDeletion(i),
                                                                onUpdate: source => void this.handleChildRequestedUpdate(i, source),
                                                                onCreate: this.handleChildRequestedCreate,
                                                                empty: {
                                                                    onCreate: null /** Does not apply here */
                                                                }
                                                            })
                                                        }
                                                    </div>
                                                )}
                                            </Draggable>
                                        )    
                                    })
                                }
                                {provided.placeholder}
                                <Empty
                                    requestCreate={this.handleChildRequestedCreate}
                                    create={this.appendItem}
                                    className="empty-source source-shadow"
                                />
                                <SequenceEnd/>
                            </div>
                        )}
                    </Droppable>
                </DragDropContext>
                <ModalNewItem
                    show={this.state.modal}
                    onClose={() => void this.setState({ modal: false})}
                    onChange={this.handleModalChange}
                />
            </div>
        );
    }
}