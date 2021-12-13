import React from 'react';
import { actions, isID, SequenceFileItem, SequenceID, store } from '../store';

export interface SequencesItemProps {
    id: SequenceID,
    item: SequenceFileItem
}

export default class SequencesItem extends React.Component<SequencesItemProps> {
    private ref: React.RefObject<HTMLDivElement>;

    constructor(props) {
        super(props);

        this.ref = React.createRef();
    }


    handleDragEnter = (e: React.DragEvent, id: SequenceID) => {
        this.ref.current.classList.add('dropping');
    }

    handleDragLeave = (e: React.DragEvent, id: SequenceID) => {
        this.ref.current.classList.remove('dropping');
    }

    onDragDrop = (e: React.DragEvent, id: SequenceID) => {
        const data = e.dataTransfer.getData('text/plain');
        if(isID(data)) {
            store.dispatch(actions.files.move({
                id: data,
                to: id
            }));
        }
        this.handleDragLeave(e, id);
        e.preventDefault();
    }

    setViewport = (id: SequenceID) => {
        store.dispatch(actions.viewport.set(id));
    }

    openDir = (id: SequenceID) => {
        store.dispatch(actions.files.expand({ id }));
    }

    render() {
        const { id, item } = this.props;
        if(item.type === 'sequence') {
            return (
                <div
                    className="sequences-sequence"
                    onClick={() => void this.setViewport(id)}
                    draggable
                    onDragStart={e => void e.dataTransfer.setData('text/plain', id)}
                >
                    <i className={item.main ? "bi bi-star-fill" : "bi bi-play-circle-fill"}></i>
                    {item.name}
                </div>
            );
        } else {
            return (
                <div
                    className="sequences-sequence"
                    onClick={() => void this.openDir(id)}
                    onDragEnter={e => void this.handleDragEnter(e, item.id)}
                    onDragLeave={e => void this.handleDragLeave(e, item.id)}
                    onDragOver={e => void e.preventDefault()}
                    onDrop={e => void this.onDragDrop(e, item.id)}
                    ref={this.ref}
                >
                    <i className={item.expanded ? "bi bi-chevron-up" : "bi bi-chevron-down"}></i>
                    {item.name}
                </div>
            );
        }
    }
}