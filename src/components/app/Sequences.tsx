import React from 'react';
import { actions, generateID, isID, SequenceFileItem, SequenceFiles, SequenceID, store } from '../../store';
import Modal from './Modal';
import './Sequences.scss';
import SequencesItem from './SequencesItem';

type KeyTuple = [SequenceID, SequenceFileItem];
function sort(a: KeyTuple, b: KeyTuple): number {
    if(a[1].name > b[1].name) return 1;
    else if(a[1].name < b[1].name) return -1;
    return 0;
}
function split(contents: SequenceFiles): SequenceID[] {
    let sequences: KeyTuple[] = [];
    let collections: KeyTuple[] = [];
    Object.keys(contents).forEach(key => {
        const item = contents[key];
        if(item.type === 'collection') collections.push([key, item]);
        else sequences.push([key, item]);
    });
    collections.sort(sort).push(...sequences.sort(sort));
    return collections.map(item => item[0]);
}

export interface SequenceProps {
    files: SequenceFiles
}
interface SequencesState {
    nameModalOpen: boolean
}

export default class Sequences extends React.Component<SequenceProps, SequencesState> {
    private opened: 'sequence' | 'collection' = null;

    constructor(props) {
        super(props);

        this.state = {
            nameModalOpen: false
        }
    }

    renderCollectionContents = (contents: SequenceFiles) => {
        return split(contents).map(key => {
            const item = contents[key];
            return (
                <div
                    key={item.id}
                >
                    {item.type === 'sequence' ? (
                        <SequencesItem id={key} item={item}/>
                    ) : (
                        <>
                            <SequencesItem id={key} item={item}/>
                            <div className="collection-contents">
                                {
                                    item.expanded ? this.renderCollectionContents(item.contents) : null
                                }
                            </div>
                        </>
                    )}
                </div>
            )
        });
    }

    handleDrop = (e: React.DragEvent) => {
        const id = e.dataTransfer.getData('text/plain');
        if(isID(id) && (e.target as HTMLDivElement).classList.contains('sequences-list')) {
            store.dispatch(actions.files.move({
                id
            }))
        }
    }

    openFile = () => {
        this.setState({ nameModalOpen: true });
        this.opened = 'sequence';
    }

    openCollection = () => {
        this.setState({ nameModalOpen: true });
        this.opened = 'collection';
    }

    onChange = (value: string) => {
        if(value) {
            const id = generateID();
            if(this.opened === 'sequence') {
                store.dispatch(actions.files.create({
                    id,
                    dirs: [],
                    name: value,
                    type: 'sequence'
                }));
                store.dispatch(actions.sequences.create({
                    id,
                    name: value
                }));
            } else {
                store.dispatch(actions.files.create({
                    id,
                    dirs: [],
                    name: value,
                    type: 'collection'
                }));
            }
        }
    }
    
    render() {
        return (
            <>
            <div className="sequences">
                <div className="sequences-header">
                    <h3>Sequences</h3>
                </div>
                <div
                    className="sequences-list"
                    onDragEnter={e => void e.preventDefault()}
                    onDragOver={e => void e.preventDefault()}
                    onDrop={this.handleDrop}
                >
                    {this.renderCollectionContents(this.props.files)}
                </div>
                <div className="sequences-footer">
                    <i className="bi bi-file-earmark-plus" onClick={this.openFile}/>
                    <i className="bi bi-folder-plus" onClick={this.openCollection}/>
                </div>
            </div>
            <Modal.Name
                show={this.state.nameModalOpen}
                onClose={() => this.setState({ nameModalOpen: false })}
                onChange={this.onChange}
            />
            </>
        );
    }
}