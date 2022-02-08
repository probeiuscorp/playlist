import { NodeAny } from '@client/types';
import { SequencesItemOption } from '../create/SequencesItem';

export interface ModalTypeData {
    "sequence/edit": {
        value: SequencesItemOption,
        props: {
            option: SequencesItemOption | null
        }
    },
    "mutator/new": {
        value: NodeAny | null,
        props: {}
    }
}