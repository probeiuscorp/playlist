import NiceModal, { useModal as useNiceModal } from '@ebay/nice-modal-react';
import { ModalTypeData } from '@client/components/modals/DataModalTypes';

interface ModalController<T extends keyof ModalTypeData> {
    resolve: (value: ModalTypeData[T]["value"]) => void
}

function createModal<T extends keyof ModalTypeData>(modal: T, component: (props: ModalTypeData[T]["props"]) => JSX.Element) {
    NiceModal.register(modal, NiceModal.create(component));
}

function open<T extends keyof ModalTypeData>(modal: T, props: ModalTypeData[T]["props"]): Promise<ModalTypeData[T]["value"]> {
    return NiceModal.show(modal, props) as Promise<ModalTypeData[T]["value"]>;
}

export function useTypedModal<T extends keyof ModalTypeData>(id: T): ModalController<T> {
    const modal = useNiceModal();
    return {
        resolve: value => {
            modal.resolve(value);
            setTimeout(() => {
                modal.remove();
            }, 150);
        }
    }
}

export const Modals = {
    createModal,
    open
};