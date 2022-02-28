import React from 'react';
import { DragDropContext, Draggable, Droppable, DropResult } from 'react-beautiful-dnd';
import './Sequences.scss';
import SequencesItem, { SequencesItemOption } from './SequencesItem';
import { generateID } from '../../module/uid';
import { Modals } from '@client/module/modal';
import { conditional } from '@client/util';

export interface SequencesProps {
    hidden: boolean
}

interface SequencesState {
    videos: {
        id: string,
        options: SequencesItemOption[]
    }[],
    modalEditOpen: boolean
}

export default class Sequences extends React.Component<SequencesProps, SequencesState> {
    constructor(props) {
        super(props);

        const source: ['file' | 'video', string[] | string][] = [
            ['video', 'Never gonna give you up'],
            ['video', 'Terran theme 2'],
            ['file', 'Seoul'],
            ['video', ['Taswell', 'Aria math']],
            ['video', 'Aria math']
        ];

        this.state = {
            videos: source.map(([ type, content ]) => {
                return {
                    id: generateID(),
                    options: Array.isArray(content) ? (
                        content.map(title => {
                            return {
                                type,
                                title,
                                id: generateID(),
                                weight: -1,
                                url: ''
                            }
                        })
                    ) : (
                        [
                            {
                                type,
                                title: content,
                                id: generateID(),
                                weight: -1,
                                url: ''
                            }
                        ]
                    )
                }
            }),
            modalEditOpen: false
        }
    }

    onDragEnd = (result: DropResult) => {
        const destination = result.destination;
        if(destination) {
            this.setState(({ videos }) => {
                const [ item ] = videos.splice(result.source.index, 1);
                videos.splice(destination.index, 0, item);
                return {
                    videos
                };
            });
        }
    }

    delete = (i: number, option: number) => {
        this.setState(({ videos }) => {
            if(videos[i].options.length === 1) {
                videos.splice(i, 1);
                return {
                    videos
                }
            } else {
                videos[i].options.splice(option, 1);
                return {
                    videos
                }
            }
        });
    }

    update = (i: number, newState: SequencesItemOption[]) => {
        this.setState(({ videos }) => {
            videos[i].options = newState;
            return {
                videos
            }
        })
    }

    appendSource = async () => {
        const source = await Modals.open('sequence/edit', { option: null });
        if(source) {
            this.setState(old => {
                old.videos.push({
                    id: generateID(),
                    options: [source]
                });

                return {
                    videos: old.videos
                }
            })
        }
    }

    render() {
        return (
            <DragDropContext onDragEnd={this.onDragEnd}>
                <Droppable droppableId='sequences' direction='vertical'>
                    {provided => (
                        <div className={conditional({ "sequences-list": true, "hide": this.props.hidden })} {...provided.droppableProps} ref={provided.innerRef}>
                            {
                                this.state.videos.map((item, i) => {
                                    return (
                                        <Draggable key={item.id} draggableId={item.id} index={i}>
                                            {provided => (
                                                <div className="sequences-item" {...provided.draggableProps} ref={provided.innerRef}>
                                                    <SequencesItem
                                                        handleProps={provided.dragHandleProps}
                                                        options={item.options}
                                                        delete={option => void this.delete(i, option)}
                                                        update={state => void this.update(i, state)}
                                                    />
                                                </div>
                                            )}
                                        </Draggable>
                                    );
                                })
                            }
                            {provided.placeholder}
                            <div className="sequences-item sequences-item-blank" onClick={this.appendSource}>
                                <i className="bi bi-plus-circle-fill"/>
                            </div>
                        </div>
                    )}
                </Droppable>
            </DragDropContext>
        );
    }
}