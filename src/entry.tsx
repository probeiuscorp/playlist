import React from 'react';
import * as ReactDOM from 'react-dom';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import PageCreate from './components/create/PageCreate';
import NiceModal from '@ebay/nice-modal-react';
import './components/modals/ModalEdit';
import './components/modals/ModalEdit';
import './mutators';
import './styles/load';

ReactDOM.render(
    <NiceModal.Provider>
        <BrowserRouter>
            <Route path="*" render={() => {
                return <PageCreate/>
            }}>
            </Route>
        </BrowserRouter>
    </NiceModal.Provider>,
    document.getElementById('root')
);

export type ExtractCallback<T> = (cb: () => T) => void;
export type ExtractedCallback<T> = () => T;