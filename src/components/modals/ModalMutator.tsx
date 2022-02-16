import { Dynalist } from '@client/dynalist/dynalist';
import { Modals, useTypedModal } from '@client/module/modal';
import Alert from '@client/components/Alert';
import { generateID } from '@client/module/uid';
import { mutators } from '@client/mutators';
import { NodeAny } from '@client/types';
import { conditional, ModalProps } from '@client/util';
import Tooltip from 'rc-tooltip';
import React, { useEffect, useRef, useState } from 'react';
import Modal from './Modal';
import { cancel } from '@client/util';
import './ModalMutator.scss';

const replaceUnsafeCharsRegex = /[-[\]{}()*+?.,\\^$|#\s]/g;

interface Entry {
    title: string,
    description: string,
    type: 'mutator' | 'primitive',
    createNode: () => NodeAny
}

const entries: Entry[] = [
    ...Object.values(Dynalist.primitives).map(({ info }) => {
        return {
            title: info.display,
            description: info.description,
            type: 'primitive',
            createNode: () => ({
                id: generateID(),
                x: 0,
                y: 0,
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
            createNode: () => ({
                id: generateID(),
                x: 0,
                y: 0,
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

console.log(Modals);
export default Modals.createModal('mutator/new', () => {
    const modal = useTypedModal('mutator/new');
    const [ filter, setFilter ] = useState('');
    const [ current, setCurrent ] = useState(0);
    const input = useRef<HTMLInputElement>(null);

    const handleKey = (e: React.KeyboardEvent) => {
        if(e.key === 'ArrowUp') {
            setCurrent(current ? current - 1 : filtered.length - 1);
        } else if(e.key === 'ArrowDown') {
            setCurrent((current + 1) % filtered.length);
        } else if(e.key === 'Enter') {
            handleEntryClick(filtered[Math.min(current, filtered.length-1)].entry);
        } else if(e.key === 'Escape') {
            modal.resolve(null);
        }
        e.stopPropagation();
    }

    const handleChange = () => {
        const v = input.current!.value;
        if(filter !== v) setFilter(v);
    }

    const regex = new RegExp('^(.*?)('+filter.split('').map(str => str.replace(replaceUnsafeCharsRegex, '\\$&')).join(')(.*?)(')+')(.*?)$', 'i');

    const handleEntryClick = (entry: Entry) => {
        modal.resolve(entry.createNode());
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
    
    useEffect(() => {
        input.current!.focus();
    }, [input]);

    return (
        <Modal
            onClose={() => modal.resolve(null)}
        >
            <h3>Add Node</h3>
            <input
                className="textbox"
                type="text"
                placeholder="Filter"
                onChange={handleChange}
                onKeyDown={handleKey}
                onKeyUp={cancel}
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
                            .map(({ match, entry }, i) => {
                                return (
                                    <Tooltip overlay={entry.description} key={entry.title} mouseEnterDelay={0.2}>
                                        <div className={conditional({
                                            "modal-mutator-entry": true,
                                            "focused": i === current || (i === filtered.length - 1 && i < current)
                                        })} onClick={() => handleEntryClick(entry)}>
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
});