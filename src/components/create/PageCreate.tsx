import React from 'react';
import Sequences from './Sequences';
import './PageCreate.scss';
import Mutators from './mutators/Mutators';

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

                </div>
            </main>
        );
    }
}