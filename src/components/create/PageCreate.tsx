import React, { useState } from 'react';
import Sequences from './Sequences';
import Mutators from './mutators/Mutators';
import FileSystem from './sequences/FileSystem';
import { conditional } from '@client/util';
import { Dynalist } from '@client/dynalist/dynalist';
import './PageCreate.scss';
import Editor from './Editor';
import { generateID } from '@client/module/uid';

export interface PageCreateProps {
    
}

export default class PageCreate extends React.Component<PageCreateProps> {
    private instance: Dynalist | null = null;

    constructor(props) {
        super(props);

        this.instance = new Dynalist({
            onNewIteration: console.log
        });

        this.instance.camera = {
            x: -(innerWidth / 2 - 250),
            y: -(innerHeight / 2 - 50),
            zoom: 1
        };

        const Sequence = generateID();
        const Connection = generateID();
        const Yield = generateID();

        this.instance.nodes = {
            [Sequence]: {
                id: Sequence,
                x: -200,
                y: -15,
                type: 'primitive',
                primitive: 'sequence',
                params: {},
                outputs: {
                    sequence: Connection
                },
                classes: {},
                state: 'Main'
            },
            [Yield]: {
                id: Yield,
                x: 35,
                y: -40,
                type: 'primitive',
                primitive: 'yield',
                params: {
                    input: Connection
                },
                outputs: {},
                classes: {},
                state: 'Main'
            }
        };
    }

    render() {
        return (
            <main className="page-create">
                <div className="sidebar-main">
    
                </div>
                <Editor instance={this.instance}/>
                <div className="sidebar-sequences">
                    <FileSystem
                        directory={[
                            '000',
                            '001'
                        ]}
                        sequences={{
                            '000': {
                                display: 'Main',
                                id: '000',
                                type: 'sequence'
                            },
                            '001': {
                                display: 'Folder',
                                id: '001',
                                type: 'directory',
                                contents: [
                                    '004',
                                    '003',
                                    '002'
                                ]
                            },
                            '002': {
                                display: 'Starcraft II',
                                id: '002',
                                type: 'directory',
                                contents: [
                                    '005',
                                    '006',
                                    '006'
                                ]
                            },
                            '003': {
                                display: 'Terran themes',
                                id: '003',
                                type: 'sequence'
                            },
                            '004': {
                                display: 'Protoss themes',
                                id: '004',
                                type: 'sequence'
                            },
                            '005': {
                                display: 'Blades of Justice',
                                id: '005',
                                type: 'sequence'
                            },
                            '006': {
                                display: 'Heaven\'s devils',
                                id: '006',
                                type: 'sequence'
                            }
                        }}
                    />
                </div>
            </main>
        )
    }
}