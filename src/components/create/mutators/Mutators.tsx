import { Camera } from '@client/types';
import React from 'react';
import Nodes from './Nodes';
import Paths from './Paths';

export interface MutatorsProps {

}

interface MutatorsState {
    camera: Camera
}

export default class Mutators extends React.Component<MutatorsProps, MutatorsState> {
    constructor(props: MutatorsProps) {
        super(props);

        this.state = {
            camera: {
                x: 0,
                y: 0,
                zoom: 1
            }
        }
    }

    render() {
        const { camera } = this.state;
        return (
            <>
                <Paths camera={camera} paths={[{from:{x:50,y:120},to:{x:80,y:350}}]}/>
                <Nodes camera={camera} nodes={[]}/>
            </>
        );
    }
}