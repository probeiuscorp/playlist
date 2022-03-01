import React from 'react';
import { Camera, Path } from '@client/types';
import './Paths.scss';

export interface PathsProps {
    camera: Camera,
    paths: Path[]
}

export default function Paths({ camera, paths }: PathsProps) {
    return (
        <svg className="paths">
            {
                paths.map(({ from, to }) => {
                    const x1 = from.x - camera.x;
                    const x2 = to.x - camera.x;
                    const y1 = from.y - camera.y;
                    const y2 = to.y - camera.y;
                    let center = (x1 + x2)/2
                    return (
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