import React from 'react';
import Sequences from './Sequences';
import Mutators from './mutators/Mutators';
import FileSystem from './sequences/FileSystem';
import './PageCreate.scss';

export interface PageCreateProps {

}

interface PageCreateState {
    tab: 'sequences' | 'mutators'
}

export default class PageCreate extends React.Component<PageCreateProps, PageCreateState> {
    constructor(props: PageCreateProps) {
        super(props);

        this.state = {
            tab: 'mutators'
        }
    }
    
    render() {
        return (
            <main className="page-create">
                <div className="sidebar-main">

                </div>
                <div className="create">
                    <div className="tabs">
                        <div className={`tab${this.state.tab === 'sequences' ? " active" : ""}`} onClick={() => void this.setState({ tab: 'sequences' })}>
                            Sequences
                        </div>
                        <div className={`tab${this.state.tab === 'mutators' ? " active" : ""}`} onClick={() => void this.setState({ tab: 'mutators' })}>
                            Mutators
                        </div>
                    </div>
                    <div className="create-viewport">
                        {this.state.tab === 'sequences' ? <Sequences/> : <Mutators/>}
                    </div>
                </div>
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
        );
    }
}