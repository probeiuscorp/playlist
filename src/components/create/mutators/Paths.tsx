import React from 'react';
import { Camera, Path } from '@client/types';
import './Paths.scss';

export interface PathsProps {
    camera: Camera,
    paths: Path[]
}

export default class Paths extends React.Component<PathsProps> {
    render() {
        const { x, y, zoom } = this.props.camera;

        return (
            <svg className="paths" style={{
                transform: `translate(${x}px, ${y}px) scale(${zoom})`
            }}>
                {
                    this.props.paths.map(({ from: { x: x1, y: y1 }, to: { x: x2, y: y2 } }) => {
                        return (
                            <line
                                ref={`${x1},${y1}:${x2},${y2}`} // if the coordinates don't change then might as well keep it
                                x1={x1}
                                y1={y1}
                                x2={x2}
                                y2={y2}
                            />
                        );
                    })
                }
            </svg>
        );
    }
}