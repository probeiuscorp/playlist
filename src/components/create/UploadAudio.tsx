import React from 'react';
import { ExtractCallback, ExtractedCallback } from '../../entry';
import './UploadAudio.scss';

export type UploadAudioValue = Promise<{
    url: string
}> | null;
export interface UploadAudioProps {
    getValue?: ExtractCallback<UploadAudioValue>
}

interface UploadAudioState {
    valid: boolean,
    dropping: boolean,
    file: File | null
}

export default class UploadAudio extends React.Component<UploadAudioProps, UploadAudioState> {
    private container: React.RefObject<HTMLDivElement>;

    constructor(props) {
        super(props);

        this.container = React.createRef();

        this.state = {
            valid: true,
            dropping: false,
            file: null
        }

        this.props.getValue?.(this.getValue);
    }

    getValue: ExtractedCallback<UploadAudioValue> = () => {
        return new Promise(resolve => {
            if(this.state.file) {
                resolve({
                    url: `/audio/${this.state.file.name}`
                })
            } else {
                this.setState({ valid: false })
                resolve(null);
            }
        });
    }

    handleDragEnter = (e: React.DragEvent) => {
        this.setState({ dropping: true, valid: true });
        e.preventDefault();
    }

    handleDragLeave = (e: React.DragEvent) => {
        this.setState({ dropping: false });
    }

    handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    }

    handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        this.setState({ dropping: false });
        const file = e.dataTransfer.items[0];
        
        if(file.kind === 'file' && file.type === 'audio/mpeg') {
            this.setState({ file: file.getAsFile() });
        }
    }

    render() {
        return (
            <div
                onDragEnter={this.handleDragEnter}
                onDragLeave={this.handleDragLeave}
                onDragOver={this.handleDragOver}
                onDrop={this.handleDrop}
                ref={this.container}
                className={`upload-audio${!this.state.valid ? " invalid" : this.state.dropping ? " dropping" : ""}`}
            >
                {
                    this.state.file ? `chosen: "${this.state.file.name}"` : "Drop an audio file here"
                }
            </div>
        );
    }
}