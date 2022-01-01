import React from 'react';
import { ExtractCallback, ExtractedCallback } from '../../entry';
import './VideoInput.scss';

export type VideoInputValue = Promise<{
    url: string
} | null>;

export interface VideoInputProps {
    getValue: ExtractCallback<VideoInputValue>,
    value?: string
}

interface VideoInputState {
    valid: boolean,
    annoyed: boolean
}

export default class VideoInput extends React.Component<VideoInputProps, VideoInputState> {
    private readonly isOk = /^(https:\/\/)?(www\.)?(youtube.com\/watch\?v=)?[A-Za-z0-9_\-]{11}$/;
    private input: React.RefObject<HTMLInputElement>;

    constructor(props: VideoInputProps) {
        super(props);

        this.state = {
            valid: null,
            annoyed: false
        }

        this.input = React.createRef();
    
        this.props.getValue(this.getValue);
    }

    getValue: ExtractedCallback<VideoInputValue> = () => {
        return new Promise(resolve => {
            if(this.state.valid) {
                resolve({
                    url: this.input.current.value.slice(-11)
                })
            } else {
                this.setState({ annoyed: true, valid: false });
                resolve(null);
            }
        });
    }

    handleTextChanged = (e: React.KeyboardEvent) => {
        const ok = this.isOk.test(this.input.current.value);

        this.setState({
            valid: ok,
            annoyed: false
        });
    }

    render() {
        return (
            <div className="video-input-wrapper">
                <i className={`bi bi-${
                    this.state.valid === false ? 'x-circle-fill invalid' :
                    this.state.valid === true ? 'check-circle-fill valid' :
                    'dash-circle-fill unset'
                }`}/>
                <input
                    className={`textbox video-input${this.state.annoyed ? ' invalid' : ''}`}
                    placeholder="Complete url or video id"
                    type="text"
                    ref={this.input}
                    onKeyUp={this.handleTextChanged}
                    defaultValue={this.props.value || undefined}
                />
            </div>
        );
    }
}