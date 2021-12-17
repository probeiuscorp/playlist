import React from 'react'
import { MutatorUnevaluatedParameters, MutatorInfo, MutatorParameters, Sources, SequenceID, SequenceFiles, FileSequencesDirs, Source, generateID } from '../../store';
import './Mutator.scss';
import { renderSource } from './Viewport';

export interface MutatorProps<T extends MutatorParameters> {
    info: MutatorInfo,
    params: T,
    state: MutatorUnevaluatedParameters<T>,
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

    // requestCreate = (key: keyof T) => {
        // console.log('hi');
        // this.props.requestCreate()
        //     .then(source => {
        //         if(this.props.params[key].type === 'sources') {
        //             console.log(source);
        //             let state = { ...this.props.state };
        //             (state[key] as Source) = source;
        //             this.props.update(state);
        //         }
        //     })
        //     .catch(() => {});
    // }

    updateParam = (key: keyof T, value: number | Source) => {
        let newState = { ...this.props.state };
        if(this.props.params[key].type === 'sources') {
            (newState[key] as number | Source) = value;
            this.props.update(newState);
        }
    }

    renderSources = (key: keyof T) => {
        const source = this.props.state[key] as Source;
        return renderSource({
            source: source,
            onDelete: () => void this.deleteParam(key),
            onUpdate: source => void this.updateParam(key, source),
            onCreate: this.props.requestCreate,
            empty: {
                onCreate: source => void this.updateParam(key, source)
            }
        });
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
                onChange={e => void this.updateParam(key, parseFloat(e.target.value))}
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