import React from 'react';
import SequenceFile from './SequenceFile';
import SequenceLine from './SequenceLine';
import SequenceVideo from './SequenceVideo';

export default class Sequences extends React.Component {
    render() {
        return (
            <div className="sequences">
                <SequenceVideo video="dQw4w9WgXcQ"/>
                <SequenceLine/>
                <SequenceVideo video="rTgj1HxmUbg"/>
                <SequenceLine/>
                <SequenceFile/>
            </div>
        );
    }
}