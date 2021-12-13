import * as React from 'react';
import Sequences from './Sequences';
import Player from './Player';
import ActionBar from './ActionBar';
import { FilesState, SequenceID, SequencesState, store } from '../store';
import Viewport from './Viewport';
import { connect, MapStateToProps } from 'react-redux';
import '../styles/main.scss';

export interface AppProps {
    sequences: SequencesState,
    viewport: SequenceID,
    files: FilesState
}

class App extends React.Component<AppProps> {
    componentDidMount() {
        document.title = 'Playlist';
    }
    
    render() {
        if(this.props.viewport) {
            return (
                <main className="app">
                    <ActionBar/>
                    <div className="viewports">
                        <Viewport
                            sequence={this.props.viewport}
                            sources={this.props.sequences[this.props.viewport].sources}
                            dirs={this.props.files.dirs}
                            files={this.props.files.files}
                        />
                    </div>
                    <Sequences files={this.props.files.files}/>
                    <Player/>
                </main>    
            );
        } else {
            return (
                <main className="app">

                </main>
            );
        }
    }
}

const propMapper: MapStateToProps<AppProps, {}, ReturnType<typeof store['getState']>> = (state) => {
    return {
        sequences: state.sequences,
        viewport: state.viewport,
        files: state.files
    }
}

export default connect(propMapper)(App);