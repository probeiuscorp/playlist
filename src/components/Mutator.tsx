import React from 'react'
import { MutatorUnevaluatedParameters, MutatorInfo, MutatorParameters, Sources, SequenceID, store, actions, SequenceFiles, FileSequencesDirs, contentsOfDir, Source, registry } from '../store';
import Empty from './Empty';
import './Mutator.scss';
import SequenceVideo from './SequenceVideo';

export interface MutatorProps<T extends MutatorParameters> {
    info: MutatorInfo,
    params: T,
    state: MutatorUnevaluatedParameters<T>,
    files: SequenceFiles,
    dirs: FileSequencesDirs,
    update: (newState: MutatorUnevaluatedParameters<T>) => void,
    delete: () => void,
    requestCreate: () => Promise<Source>
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

    set = (key: keyof T, id: SequenceID) => {
        let state = {...this.props.state} as Record<keyof T, SequenceID>;
        state[key] = id;
        this.props.update(state as MutatorUnevaluatedParameters<T>);
    }

    requestCreate = (key: keyof T) => {
        this.props.requestCreate()
            .then(source => {
                if(this.props.params[key].type === 'sources') {
                    console.log(source);
                    let state = { ...this.props.state };
                    (state[key] as Sources) = [source];
                    this.props.update(state);
                }
            })
            .catch(() => {});
    }

    updateParam = (key: keyof T, state: MutatorUnevaluatedParameters<any>) => {
        let newState = { ...this.props.state };
        const item = newState[key];
        if(this.props.params[key].type === 'sources') {
            item[0] = state;
            this.props.update(newState);
        }
    }

    renderSources = (key: keyof T) => {
        const sources = this.props.state[key] as Sources | SequenceID;
        
        if(typeof sources === 'string') {
            return (
                <div className="mutator-link mutator-item" onClick={() => void store.dispatch(actions.viewport.set(sources))}>
                    <i className="bi bi-play-circle-fill"/>
                    <span className="mutator-link-to">{contentsOfDir({ dirs: this.props.dirs, files: this.props.files }, this.props.dirs[sources])[sources].name}</span>
                </div>
            )
        } else {
            if(sources === null) {
                return (
                    <Empty
                        set={id => void this.set(key, id)}
                        className="mutator-item"
                        onClick={() => void this.requestCreate(key)}
                    />
                )
            } else {
                return (
                    <SequenceVideo video={(sources[0] as any).video} delete={() => void this.deleteParam(key)}/>
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
                                    {
                                        this.props.params[key].type === 'sources' && (
                                            <div className="mutator-reset-param" onClick={() => void this.deleteParam(key)}>
                                                <i className="bi bi-x-circle-fill"/>
                                            </div>
                                        )
                                    }
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
                <div className="seq-video-controls">
                    <i className="bi bi-play-fill"></i>
                    <i className="bi bi-gear-fill"></i>
                    <i className="bi bi-trash-fill" onClick={this.props.delete}/>
                </div>
            </div>
        )
    }
}