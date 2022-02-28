import React from 'react';
import { Dynalist, DynalistFiles } from '@client/dynalist/dynalist';
import './PageCreate.scss';
import Editor from './Editor';
import { generateID } from '@client/module/uid';
import SideBar from './sequences/SideBar';

export interface PageCreateProps {
    
}

export default class PageCreate extends React.Component<PageCreateProps> {
    private instance: Dynalist | null = null;

    constructor(props) {
        super(props);

        this.instance = new Dynalist({});

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

        (this.instance.files as DynalistFiles) = {
            top: ['000', '001'],
            items: {
                '000': {
                    display: 'Main',
                    id: '000',
                    type: 'sequence',
                    container: null
                },
                '001': {
                    display: 'Folder',
                    id: '001',
                    type: 'collection',
                    contents: [
                        '004',
                        '003',
                        '002'
                    ],
                    container: null,
                    expanded: true
                },
                '002': {
                    display: 'Starcraft II',
                    id: '002',
                    type: 'collection',
                    contents: [
                        '005',
                        '006'
                    ],
                    container: '001',
                    expanded: true
                },
                '003': {
                    display: 'Terran themes',
                    id: '003',
                    type: 'routine',
                    container: '001'
                },
                '004': {
                    display: 'Protoss themes',
                    id: '004',
                    type: 'sequence',
                    container: '001'
                },
                '005': {
                    display: 'Blades of Justice',
                    id: '005',
                    type: 'sequence',
                    container: '004'
                },
                '006': {
                    display: 'Heaven\'s devils',
                    id: '006',
                    type: 'sequence',
                    container: '004'
                }
            }
        }
    }

    render() {
        return (
            <main className="page-create">
                <div className="sidebar-main">
    
                </div>
                <Editor instance={this.instance}/>
                <SideBar instance={this.instance!}/>
            </main>
        )
    }
}