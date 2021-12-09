import React from 'react';
import { SequenceFileItem } from '../store';
import './Sequences.scss';

export interface SequenceProps {
    files: SequenceFileItem[]
}

export default class Sequences extends React.Component<SequenceProps> {
    renderCollectionContents = (contents: SequenceFileItem[], line: boolean) => {
        contents.forEach(console.log);
        return contents.map((item) => {
            return (
                <div
                    key={item.id}
                >
                    {item.type === 'sequence' ? (
                        <div className="sequences-sequence" draggable onDragStart={e => void e.dataTransfer.setData('text/plain', item.id)}>
                            <i className={item.main ? "bi bi-star-fill" : "bi bi-play-circle-fill"}></i>
                            {item.name}
                        </div>
                    ) : (
                        <>
                        <div className="sequences-sequence" onClick={() => { item.expanded = !item.expanded; this.forceUpdate(); }}>
                            <i className={item.expanded ? "bi bi-chevron-down" : "bi bi-chevron-up"}></i>
                            {item.name}
                        </div>
                        <div className="collection-contents">
                            {
                                item.expanded ? this.renderCollectionContents(Object.keys(item.contents).map(key => item.contents[key]), true) : null
                            }
                        </div>
                        </>
                    )}
                </div>
            )
        });
    }
    
    render() {
        return (
            <div className="sequences">
                <h3>Sequences</h3>
                <div className="sequences-list">
                    {this.renderCollectionContents(this.props.files, false)}
                </div>
            </div>
        );
    }
}