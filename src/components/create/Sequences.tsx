import React from 'react';
import { DragDropContext, Draggable, Droppable, DropResult } from 'react-beautiful-dnd';
import './Sequences.scss';
import SequencesItem, { SequencesItemOption } from './SequencesItem';
import ModalEdit from './ModalEdit';
import { generateID } from '../../module/uid';

export interface SequencesProps {

}

interface SequencesState {
    videos: {
        id: string,
        options: SequencesItemOption[]
    }[],
    modalEditOpen: boolean
}

export default class Sequences extends React.Component<SequencesProps, SequencesState> {
    private modalEditRequest: (option: SequencesItemOption) => void;
    private modalEditOption: SequencesItemOption;
    private label: string;

    constructor(props) {
        super(props);
        document.title = 'Playlist | Dynascore';

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
        if(result.destination) {
            this.setState(({ videos }) => {
                const [ item ] = videos.splice(result.source.index, 1);
                videos.splice(result.destination.index, 0, item);
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

    updateWithModal = (i: number, option: number) => {
        this.setState({
            modalEditOpen: true
        });
        this.modalEditOption = this.state.videos[i].options[option];
        this.label = 'Edit Source';
        this.modalEditRequest = newOption => {
            const videoSet = this.state.videos[i];
            videoSet.options[option] = newOption;
            this.update(i, this.state.videos[i].options);
        }
    }

    createOption: () => Promise<SequencesItemOption> = () => {
        return new Promise(resolve => {
            this.setState({ modalEditOpen: true });
            this.modalEditOption = {
                id: Math.random().toString(),
                title: '',
                type: 'video',
                weight: 1,
                url: ''
            };
            this.label = 'New Source'
            this.modalEditRequest = resolve;
        })
    }

    createSource = async () => {
        const option = await this.createOption();
        this.setState(({ videos }) => {
            videos.push({
                id: Math.random().toString(),
                options: [option]
            });
            return { videos };
        })
    }

    render() {
        return (
            <>
            <DragDropContext onDragEnd={this.onDragEnd}>
                <Droppable droppableId='sequences' direction='vertical'>
                    {provided => (
                        <div className="sequences-list" {...provided.droppableProps} ref={provided.innerRef}>
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
                                                        updateWithModal={index => void this.updateWithModal(i, index)}
                                                        createOption={this.createOption}
                                                    />
                                                </div>
                                            )}
                                        </Draggable>
                                    );
                                })
                            }
                            {provided.placeholder}
                            <div className="sequences-item sequences-item-blank" onClick={this.createSource}>
                                <i className="bi bi-plus-circle-fill"/>
                            </div>
                        </div>
                    )}
                </Droppable>
            </DragDropContext>
            <ModalEdit
                label={this.label}
                show={this.state.modalEditOpen}
                onClose={() => void this.setState({ modalEditOpen: false })}
                option={this.modalEditOption}
                onChange={this.modalEditRequest}/>
            </>
        );
    }
}