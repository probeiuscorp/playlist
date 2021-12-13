import React from 'react';
import ReactDOM, { render } from 'react-dom';
import './Modal.scss';

const modals = document.getElementById('modals');

export interface ModalProps {
    show: boolean,
    onClose?: () => void,
    onKeyDown?: React.KeyboardEventHandler
}

export interface NameProps extends ModalProps {
    onChange?: (value: string) => void;
}

export default class Modal extends React.Component<ModalProps> {
    static Name = class extends React.Component<NameProps> {
        private ref: React.RefObject<HTMLInputElement>;

        constructor(props) {
            super(props);

            this.ref = React.createRef();
        }

        componentDidUpdate(prevProps: Readonly<NameProps>, prevState: Readonly<{}>): void {
            if(this.props.show) {
                this.ref.current.focus();
            }
        }

        handleKeyDown = (e: React.KeyboardEvent) => {
            if(e.key === 'Escape') {
                this.cancel();
            } else if(e.key === 'Enter') {
                this.create();
            }
        }

        create = () => {
            this.props.onChange?.(this.ref.current.value);
            this.props.onClose?.();
        }

        cancel = () => {
            this.props.onChange?.(null);
            this.props.onClose?.();
        }

        render() {
            return (
                <Modal show={this.props.show} onClose={this.props.onClose} onKeyDown={this.handleKeyDown}>
                    <div className="modal-section">
                        <div className="modal-label">
                            Name:
                        </div>
                        <input ref={this.ref} className="modal-input" type="text" autoFocus={true}/>
                    </div>
                    <div className="modal-buttons">
                        <button onClick={this.create}>
                            Create
                        </button>
                        <button onClick={this.cancel}>
                            Cancel
                        </button>
                    </div>
                </Modal>
            );
        }
    }

    private ref: React.RefObject<HTMLDivElement>;

    constructor(props) {
        super(props);

        this.ref = React.createRef();
    }

    render() {
        const classes = this.props.show ? " show" : "";
        return ReactDOM.createPortal(
            (
                <>
                <div className={"modal-background" + classes}/>
                <div className={"modal" + classes} ref={this.ref} onKeyDown={this.props.onKeyDown}>
                    {this.props.children}
                </div>
                </>
            ),
            modals
        );
    }
}