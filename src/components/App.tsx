import * as React from 'react';
import Sequences from './Sequences';

export default class App extends React.Component {
    componentDidMount() {
        document.title = 'Playlist';
    }
    
    render() {
        return (
            <Sequences/>
        );
    }
}