import React from 'react';
import * as ReactDOM from 'react-dom';
import './mutators';
import './styles/load';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Sequences from './components/create/Sequences';
import PageCreate from './components/create/PageCreate';
import Home from './components/home/Home';

ReactDOM.render(
    <BrowserRouter>
        <Route path="*" render={() => 
            // <Provider store={store}>
            //     <App/>
            // </Provider>}>
            <PageCreate/>
            // <Home/>
        }>
        </Route>
    </BrowserRouter>,
    document.getElementById('root')
);

export type ExtractCallback<T> = (cb: () => T) => void;
export type ExtractedCallback<T> = () => T;