import React from 'react';

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
        onClick: console.log
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
                    actions.map(action => {
                        return (
                            <div className="action" onClick={action.onClick}>
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