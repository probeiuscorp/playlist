import React from 'react';
import Modal from './Modal';
import './ModalAudioVideo.scss'

export interface ModalVideoProps {
    show: boolean,
    onClose: () => void,
    onChange: (video: string) => void
}

interface ModalVideoState {
    valid: boolean,
    annoyed: boolean
}

export class ModalVideo extends React.Component<ModalVideoProps, ModalVideoState> {
    private readonly isOk = /^(https:\/\/)?(www\.)?(youtube.com\/watch\?v=)?[A-Za-z0-9_\-]{11}$/;
    private input: React.RefObject<HTMLInputElement>;

    constructor(props) {
        super(props);

        this.input = React.createRef();

        this.state = {
            valid: null,
            annoyed: false
        };
    }

    componentDidUpdate(prevProps: Readonly<ModalVideoProps>, prevState: Readonly<{}>, snapshot?: any): void {
        if(this.props.show) {
            this.input.current.focus();
        }
    }

    handleTextChanged = (e: React.KeyboardEvent) => {
        const ok = this.isOk.test(this.input.current.value);

        this.setState({
            valid: ok,
            annoyed: false
        });

        if(e.key === 'Enter') {
            this.submit();
        }
    }

    close = () => {
        this.input.current.value = '';
        this.props.onClose();
    }

    submit = () => {
        if(this.state.valid) {
            this.props.onChange(this.input.current.value.slice(-11));
            this.close();
        } else {
            this.setState({ annoyed: true });
        }
    }

    render() {
        return (
            <Modal
                show={this.props.show}
                onClose={this.close}
            >
                <h1>Select video</h1>
                <div className="modal-video-row">
                    <i className={`bi bi-${
                        this.state.valid === false ? 'x-circle-fill invalid' :
                        this.state.valid === true ? 'check-circle-fill valid' :
                        'dash-circle-fill unset'
                    }`}/>
                    <input
                        className={`video-input${this.state.annoyed ? ' invalid' : ''}`}
                        placeholder="Complete url or video id"
                        type="text"
                        ref={this.input}
                        onKeyUp={this.handleTextChanged}
                    />
                </div>
                <div className="modal-video-btns">
                    <button onClick={this.submit}>
                        Select
                    </button>
                    <button onClick={this.close}>
                        Cancel
                    </button>
                </div>
            </Modal>
        );
    }
}

export interface ModalAudioProps {
    show: boolean,
    onClose: () => void,
    onChange: (url: string) => void
}

export class ModalAudio extends React.Component<ModalAudioProps> {
    render() {
        return (
            <Modal
                show={this.props.show}
                onClose={this.props.onClose}
            >

            </Modal>
        );
    }
}