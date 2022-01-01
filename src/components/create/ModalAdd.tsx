import React from 'react';
import Modal from './Modal';

export interface ModalAddProps {
    show: boolean,
    onClose: () => void
}

export default class ModalAdd extends React.Component<ModalAddProps> {
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