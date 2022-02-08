import React, { useState } from 'react';
import { ID, Point } from '@client/types';
import { conditional } from '@client/util';
import { ControlledMenu, MenuItem, useMenuState } from '@szhsin/react-menu';
import './FileSystem.scss';
import '@szhsin/react-menu/dist/index.css';
import '@szhsin/react-menu/dist/theme-dark.css';
import '@szhsin/react-menu/dist/transitions/slide.css';

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
    const [ anchor, setAnchor ] = useState<Point>({ x: 0, y: 0 });
    const { toggleMenu, ...menuProps } = useMenuState();

    const toggleDir = (id: ID) => {
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
            <div className="sequences-content" onContextMenu={e => {
                e.preventDefault();
                setAnchor({ x: e.clientX, y: e.clientY });
                toggleMenu(true);
            }}>
                {renderContents(props.directory)}
            </div>
            <div className="sequences-toolbar">
            </div>
            
            <ControlledMenu {...menuProps} anchorPoint={anchor} onClose={() => toggleMenu(false)}>
                <MenuItem>Delete</MenuItem>
                <MenuItem>Reorder</MenuItem>
                
            </ControlledMenu>
        </div>
    );
}