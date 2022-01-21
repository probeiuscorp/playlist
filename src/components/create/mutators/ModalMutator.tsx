import Alert from '@client/components/Alert';
import { Dynalist } from '@client/dynalist/dynalist';
import { generateID } from '@client/module/uid';
import { mutators } from '@client/mutators';
import { MutatorInfo, NodeAny } from '@client/types';
import { conditional } from '@client/util';
import Tooltip from 'rc-tooltip';
import React, { useRef, useState, useCallback } from 'react';
import Modal from '../Modal';
import './ModalMutator.scss';

export interface ModalMutatorProps {
    show: boolean,
    onCreate: (node: NodeAny) => void,
    onClose: () => void
}

const replaceUnsafeRegex = /[-[\]{}()*+?.,\\^$|#\s]/g;

interface Entry {
    title: string,
    description: string,
    type: 'mutator' | 'primitive',
    createNode: (x: number, y: number) => NodeAny
}

const entries: Entry[] = [
    ...Object.values(Dynalist.primitives).map(({ info }) => {
        return {
            title: info.display,
            description: info.description,
            type: 'primitive',
            createNode: (x, y) => ({
                id: generateID(),
                x,
                y,
                type: 'primitive',
                primitive: info.id,
                params: Object.fromEntries(info.params.map(param => [param.id, generateID()])),
                outputs: Object.fromEntries(info.outputs.map(mutator => [mutator.id, null])),
                classes: {},
                state: info.initialState ?? null
            })
        } as Entry
    }),
    ...Object.entries(mutators).map(([ id, mutator ]) => {
        return {
            title: mutator.display,
            description: mutator.description,
            type: 'mutator',
            createNode: (x, y) => ({
                id: generateID(),
                x,
                y,
                mutator: id,
                params: Object.fromEntries(mutator.params.map(param => [param.id, generateID()])),
                outputs: Object.fromEntries(mutator.outputs.map(mutator => [mutator.id, null])),
                type: 'mutator',
                classes: {}
            })
        } as Entry
    })
];

interface EntryMatch {
    entry: Entry,
    match: string[]
}

const ModalMutator: React.FC<ModalMutatorProps> = (props) => {
    const [ filter, setFilter ] = useState('');
    const input = useRef<HTMLInputElement>(null);

    const handleChange = () => {
        const v = input.current.value;
        if(filter !== v) setFilter(v);
    }

    const regex = new RegExp('^(.*?)('+filter.split('').map(str => str.replace(replaceUnsafeRegex, '\\$&')).join(')(.*?)(')+')(.*?)$', 'i');

    const handleEntryClick = (entry: Entry) => {
        props.onCreate(entry.createNode(100, 100));
        props.onClose();
    }
    
    const filtered = entries
        .map((entry) => {
            const match = entry.title.match(regex)?.slice?.(1);
            if(!match) {
                return {
                    entry: entry,
                    match: [entry.title]
                } as EntryMatch;
            }
            let merged = [match[0]];
            let running = '';
            for(let i=1;i<match.length;i++) {
                if(i % 2 === 0) {
                    if(match[i].length > 0) {
                        merged.push(running);
                        merged.push(match[i]);
                        running = '';
                    }
                } else {
                    running += match[i];
                }
            }
            if(running) merged.push(running);
            
            return {
                entry: entry,
                match: merged
            } as EntryMatch
        })
        .filter(({ match }) => match.length > 1);

    return (
        <Modal
            show={props.show}
            onClose={props.onClose}
            onOpen={input.current?.focus}
        >
            <h3>Add Node</h3>
            <input
                className="textbox"
                type="text"
                placeholder="Filter"
                onChange={handleChange}
                ref={input}
            />
            <hr/>
            <div className="modal-mutator-entries">
                {
                    filtered.length === 0 ? (
                        <Alert variant="error">
                            Nothing matched your filter
                        </Alert>
                    ) : (
                        filtered
                            .map(({ match, entry }) => {
                                return (
                                    <Tooltip overlay={entry.description} key={entry.title} mouseEnterDelay={0.2}>
                                        <div className="modal-mutator-entry" onClick={() => handleEntryClick(entry)}>
                                            <i className={conditional({
                                                "bi": true,
                                                "bi-braces": entry.type === 'mutator',
                                                "bi-box": entry.type === 'primitive'
                                            })}/>
                                            {
                                                match.map((text, i) => {
                                                    return i % 2 === 0 ? (
                                                        text
                                                    ) : (
                                                        text && <span className="mutator-match-token" key={Math.random()}>{text}</span>
                                                    )
                                                })
                                            }
                                        </div>
                                    </Tooltip>
                                )
                            }
                        )
                    )
                }
            </div>
        </Modal>
    );
}

export default ModalMutator;