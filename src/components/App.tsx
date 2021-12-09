import * as React from 'react';
import Sequences from './Sequences';
import Player from './Player';
import ActionBar from './ActionBar';
import { SequenceFileItem, SequenceID, SequencesState, store } from '../store';
import Viewport from './Viewport';
import { connect, MapStateToProps } from 'react-redux';
import '../styles/main.scss';

export interface AppProps {
    sequences: SequencesState,
    viewport: SequenceID,
    files: SequenceFileItem[]
}

class App extends React.Component<AppProps> {
    componentDidMount() {
        document.title = 'Playlist';
    }
    
    render() {
        return (
            <main className="app">
                <ActionBar/>
                <div className="viewports">
                    <Viewport sequence={this.props.viewport} sources={this.props.sequences[this.props.viewport].sources}/>
                </div>
                <Sequences files={this.props.files}/>
                <Player/>
            </main>    
        );
    }
}

const propMapper: MapStateToProps<AppProps, {}, ReturnType<typeof store['getState']>> = (state) => {
    const files = Object.keys(state.files).map(key => state.files[key]);
    console.log(files);
    return {
        sequences: state.sequences,
        viewport: state.viewport,
        files
    }
}

export default connect(propMapper)(App);