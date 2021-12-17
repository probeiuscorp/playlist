import React from 'react';
import { evaluate, reduce } from '../../evaluate';
import { sequence, store } from '../../store';
import './ActionBar.scss';

interface ActionBarAction {
    icon: string,
    name: string,
    onClick: () => void
}
const actions: ActionBarAction[] = [
    {
        icon: 'house-fill',
        name: 'Home',
        onClick: console.log
    },
    {
        icon: 'headphones',
        name: 'Listen',
        onClick: () => {
            const state = store.getState();
            const evaluated = evaluate(reduce(state.files.files, state.sequences), [sequence]);
            console.log(evaluated[Object.keys(evaluated)[0]]);
        }
    },
    {
        icon: 'plus-circle-fill',
        name: 'Create',
        onClick: console.log
    }
]

export default class ActionBar extends React.Component {
    render() {
        return (
            <div className="action-bar">
                {
                    actions.map((action, i) => {
                        return (
                            <div className="action" onClick={action.onClick} key={i}>
                                <i className={`bi bi-${action.icon}`}/>
                                {action.name}
                            </div>
                        );
                    })
                }
            </div>
        );
    }
}