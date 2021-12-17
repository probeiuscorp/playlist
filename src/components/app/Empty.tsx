import React from 'react';
import { generateID, isID, MutatorUnevaluatedParameters, SequenceID, Source } from '../../store';
import './Empty.scss';

export interface EmptyProps {
    requestCreate: () => Promise<Source>,
    create: (source: Source) => void,
    className: string
}

export default class Empty extends React.Component<EmptyProps> {
    private ref: React.RefObject<HTMLDivElement>;

    constructor(props) {
        super(props);
        
        this.ref = React.createRef();
    }

    handleDragEnter = (e: React.DragEvent) => {
        this.ref.current.classList.add('dropping');
        e.preventDefault();
    }

    handleDragLeave = (e: React.DragEvent) => {
        this.ref.current.classList.remove('dropping');
    }

    handleDrop = (e: React.DragEvent) => {
        const data = e.dataTransfer.getData('text/plain');
        if(isID(data)) {
            this.props.create({
                id: generateID(),
                link: data
            });
        }
        this.handleDragLeave(e);
    }

    handleClick = () => {
        this.props.requestCreate()
            .then(this.props.create)
            .catch(() => {})
    }

    render() {
        return (
            <div    
                className={"empty " + this.props.className}
                onDragEnter={this.handleDragEnter}
                onDragLeave={this.handleDragLeave}
                onDragOver={e => void e.preventDefault()}
                onDrop={this.handleDrop}
                ref={this.ref}
                onClick={this.handleClick}
            >
                <i className="bi bi-plus-circle-fill"/>
            </div>
        );
    }
}