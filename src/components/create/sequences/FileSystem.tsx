import React, { useState } from 'react';
import { ID } from '@client/types';
import { conditional } from '@client/util';
import './FileSystem.scss';

export type SequencesEntries = ID[];

export type SequenceEntry = ({
    type: 'sequence'
} | {
    type: 'directory',
    contents: SequencesEntries
}) & {
    display: string,
    id: ID
}

interface SequencesProps {
    sequences: Record<ID, SequenceEntry>,
    directory: SequencesEntries
}

export default function Sequences(props: SequencesProps) {
    const [ expanded, setExpanded ] = useState<Record<ID, boolean>>({});

    const toggleDir = (id: ID) => {
        console.log('toggling dir ' + id);
        const nextExpanded = { ...expanded };
        nextExpanded[id] = !nextExpanded[id];
        setExpanded(nextExpanded);
    }
    
    const renderContents = (contents: SequencesEntries) => {
        return contents.map(id => {
            const entry = props.sequences[id];
            const { type, display } = props.sequences[id];
            const isDirectory = type === 'directory';
            const isExpanded = isDirectory && expanded[id]
            return (
                <>
                <div className="sequences-file" onClick={isDirectory ? () => toggleDir(id) : undefined} key={id}>
                    <i
                        className={conditional({
                            "bi": true,
                            "bi-play-circle-fill": !isDirectory,
                            "bi-caret-up-fill": isExpanded,
                            "bi-caret-down-fill": !isExpanded
                        })}
                    />
                    {display}
                </div>
                {
                    entry.type === 'directory' && expanded[id] && (
                        <div className="sequences-directory">
                            {renderContents(entry.contents)}
                        </div>
                    )
                }
                </>
            )
        })
    }

    return (
        <div className="sequences">
            <h3>Sequences</h3>
            <div className="sequences-content">
                {renderContents(props.directory)}
            </div>
            <div className="sequences-toolbar">
            </div>
        </div>
    );
}