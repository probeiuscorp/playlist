import React from 'react';
import Modal from './Modal';
import { SequencesItemOption } from './SequencesItem';
import './ModalEditor';
import VideoInput, { VideoInputValue } from './VideoInput';
import UploadAudio, { UploadAudioValue } from './UploadAudio';
import { ExtractedCallback } from '../../entry';

export interface ModalEditProps {
    label: string,
    show: boolean,
    onClose: () => void,
    option: SequencesItemOption,
    onChange: (option: SequencesItemOption) => void
}

interface ModalEditState {
    open: 'video' | 'file'
}

export default class ModalEdit extends React.Component<ModalEditProps, ModalEditState> {
    private getAudio: ExtractedCallback<UploadAudioValue>;
    private getVideo: ExtractedCallback<VideoInputValue>;
    private weight: React.RefObject<HTMLInputElement>;
    private title: React.RefObject<HTMLInputElement>;

    constructor(props: ModalEditProps) {
        super(props);

        this.state = {
            open: 'video'
        }

        this.weight = React.createRef();
        this.title = React.createRef();
    }

    save = () => {
        const weightEl = this.weight.current;
        let weight = parseFloat(weightEl.value);
        if(isNaN(weight)) weight = 1;
        if([1, 2, 3, 4, 5, 6].indexOf(weight) !== -1) weight *= -1;

        if(this.state.open === 'file') {
            this.getAudio().then(value => {
                if(value) {
                    this.props.onClose();
                    this.props.onChange({
                        id: this.props.option.id,
                        title: this.title.current.value,
                        type: 'file',
                        weight,
                        url: value.url
                    })
                }
            });
        } else {
            this.getVideo().then(value => {
                if(value) {
                    this.props.onClose();
                    this.props.onChange({
                        id: this.props.option.id,
                        title: this.title.current.value,
                        type: 'video',
                        weight,
                        url: value.url
                    })
                }
            });
        }
    }

    onOpen = () => {
        this.title.current.focus();
        this.setState({ open: this.props.option.type })
    }

    render() {
        return (
            <Modal
                show={this.props.show}
                onClose={this.props.onClose}
                onOpen={this.onOpen}
            >
                {
                    this.props.option && (
                        <>
                        <h3>{this.props.label}</h3>
                        <p>Display name</p>
                        <input className="textbox" type="text" ref={this.title} defaultValue={this.props.option.title}/>
                        <p>Weight <span className="mono">(optional)</span></p>
                        <input
                            className="textbox"
                            type="number"
                            defaultValue={Math.abs(this.props.option.weight)}
                            min={1}
                            ref={this.weight}
                        />
                        <div className="tab-select">
                            <div className={this.state.open === 'video' ? 'tab active' : 'tab'} onClick={() => void this.setState({ open: 'video' })}>
                                <i className="bi bi-youtube"/>
                                Video
                            </div>
                            <div className={this.state.open === 'file' ? 'tab active' : 'tab'} onClick={() => void this.setState({ open: 'file' })}>
                                <i className="bi bi-soundwave"/>
                                Audio
                            </div>
                        </div>
                        {
                            this.state.open === 'video' ? (
                                <VideoInput getValue={cb => this.getVideo = cb} value={this.props.option.url}/>
                            ) : (
                                <UploadAudio getValue={cb => this.getAudio = cb}/>
                            )
                        }
                        <div className="button-row">
                            <button onClick={this.save}>Save</button>
                            <button onClick={this.props.onClose}>Cancel</button>
                        </div>
                        </>
                    )
                }
            </Modal>
        );
    }
}