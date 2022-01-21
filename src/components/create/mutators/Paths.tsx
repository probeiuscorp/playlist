import React from 'react';
import { Camera, Path } from '@client/types';
import './Paths.scss';

export interface PathsProps {
    paths: Path[]
}

export default class Paths extends React.Component<PathsProps> {
    render() {
        return (
            <svg className="paths">
                {
                    this.props.paths.map(({ from: { x: x1, y: y1 }, to: { x: x2, y: y2 } }) => {
                        let center = (x1 + x2)/2
                        return (
                            // <line
                            //     ref={`${x1},${y1}:${x2},${y2}`} // if the coordinates don't change then might as well keep it
                            //     x1={x1}
                            //     y1={y1}
                            //     x2={x2}
                            //     y2={y2}
                            //     style={{
                            //         transform: `translate(${x}px, ${y}px) scale(${zoom})`
                            //     }}
                            // />
                            <path
                                d={`M${x1} ${y1} C${center} ${y1}, ${center} ${y2}, ${x2} ${y2}`}
                                key={`${x1},${y1}:${x2},${y2}`}
                            />
                        );
                    })
                }
            </svg>
        );
    }
}