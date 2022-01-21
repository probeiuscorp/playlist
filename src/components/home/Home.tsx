import React from 'react';
import './Home.scss'

export default class Home extends React.Component {
    render() {
        return (
            <main className="home">
                <h1 className="title">Meet the<b className="title-emphasis">dynamic</b>playlist</h1>
                <div className="img-group">
                    <div className="img-group-item">
                        <img src="/public/800x600_placeholder.png"/>
                    </div>
                    <div className="img-group-item">
                        <img src="/public/800x600_placeholder.png"/>
                    </div>
                    <div className="img-group-item">
                        <img src="/public/800x600_placeholder.png"/>
                    </div>
                </div>
            </main>
        );
    }
}