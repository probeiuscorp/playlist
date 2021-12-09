import React from 'react'
import { MutatorUnevaluatedParameters, MutatorInfo, MutatorParameters, Sources, SequenceID, store, actions } from '../store';
import './Mutator.scss';
import SequenceVideo from './SequenceVideo';

export interface MutatorProps<T extends MutatorParameters> {
    info: MutatorInfo,
    params: T,
    state: MutatorUnevaluatedParameters<T>,
    update: (newState: MutatorUnevaluatedParameters<T>) => void,
    delete: () => void
}

type RefMap<T> = Record<string, React.RefObject<T>>;

export default class Mutator<T extends MutatorParameters> extends React.Component<MutatorProps<T>> {
    private empties: RefMap<HTMLDivElement> = {};
    private inputs: RefMap<HTMLInputElement> = {};

    constructor(props) {
        super(props);

        for(const key of Object.keys(this.props.params)) {
            if(this.props.params[key].type === 'number') {
                this.inputs[key] = React.createRef();
            } else {
                this.empties[key] = React.createRef();
            }
        }
    }

    deleteParam = (key: keyof T) => {
        const state = { ...this.props.state };
        
        if(this.props.params[key].type === 'sources') {
            state[key] = null;
            this.props.update(state);
        }
    }

    handleDragEnter = (key: keyof T, e: React.DragEvent) => {
        this.empties[key as string].current.classList.add('dropping');
        e.preventDefault();
    }

    handleDragLeave = (key: keyof T, e: React.DragEvent) => {
        this.empties[key as string].current.classList.remove('dropping');
    }

    handleDrop = (key: keyof T, e: React.DragEvent) => {
        let state = {...this.props.state} as Record<keyof T, SequenceID>;
        const data = e.dataTransfer.getData('text/plain');
        if(data.startsWith(''))
        state[key] = data;
        this.props.update(state as MutatorUnevaluatedParameters<T>);
        this.handleDragLeave(key, e);
    }

    renderSources = (key: keyof T) => {
        const sources = this.props.state[key] as Sources | SequenceID;
        
        if(typeof sources === 'string') {
            return (
                <div className="mutator-link mutator-item" onClick={() => void store.dispatch(actions.viewport.set(sources))}>
                    <i className="bi bi-play-circle-fill"/>
                    <span className="mutator-link-to">{}</span>
                </div>
            )
        } else {
            if(sources === null) {
                return (
                    <div
                        className="mutator-empty mutator-item"
                        ref={this.empties[key as string]}
                        onDragEnter={e => void this.handleDragEnter(key, e)}
                        onDragLeave={e => void this.handleDragLeave(key, e)}
                        onDragOver={e => void e.preventDefault()}
                        onDrop={e => void this.handleDrop(key, e)}
                    >
                        <i className="bi bi-plus-circle-fill"/>
                    </div>
                )
            } else {
                return (
                    <SequenceVideo video={sources[0].id}/>
                )
            }
        }
    }

    renderNumber = (key: string) => {
        const v = this.props.state[key] as number;
        return (
            <input
                ref={this.inputs[key]}
                type="number"
                defaultValue={v}
                min={0}
                max={100}
                step={5}
            />
        )
    }

    render() {
        return (
            <div className="mutator source">
                <div className="mutator-title">
                    {this.props.info.display}
                </div>
                <div className="mutator-parameters">
                    {
                        Object.keys(this.props.params).map(key => {
                            const { label, type } = this.props.params[key];
                            return (
                                <div className="mutator-param" key={key}>
                                    <div className="mutator-reset-param" onClick={() => void this.deleteParam(key)}>
                                        <i className="bi bi-x-circle-fill"/>
                                    </div>
                                    <div className="mutator-param-label">
                                        {label}
                                    </div>
                                    {
                                        type === 'number' && this.renderNumber(key)
                                    }
                                    {
                                        type === 'sources' && this.renderSources(key)
                                    }
                                </div>
                            );
                        })
                    }
                </div>
            </div>
        )
    }
}