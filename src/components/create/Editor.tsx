import { Dynalist } from '@client/dynalist/dynalist';
import { conditional } from '@client/util';
import React, { useState } from 'react';
import Mutators from './mutators/Mutators';
import Sequences from './Sequences';

export interface EditorProps {
    instance: Dynalist | null
}

export default function Editor({ instance }: EditorProps) {
    const [ tab, setTab ] = useState<'sequences' | 'mutators'>('mutators');

    if(instance) {
        return (
            <div className="create">
                <div className="tabs">
                    <div className={conditional({
                        "tab": true,
                        "active": tab === 'sequences'
                    })} onClick={() => void setTab('mutators')}>
                        Sequences
                    </div>
                    <div className={conditional({
                        "tab": true,
                        "active": tab === 'mutators'
                    })} onClick={() => void setTab('sequences')}>
                        Mutators
                    </div>
                </div>
                <div className={conditional({
                    "create-viewport": true,
                    "viewport-sequences": tab === 'sequences',
                    "viewport-mutators":  tab === 'mutators'
                })}>
                    {
                        tab === 'sequences' ? (
                            <Sequences/>
                        ) : (
                            <Mutators instance={instance}/>
                        )
                    }
                </div>
            </div>
        );
    } else {
        return (
            <div className="loading"/>
        );
    }
}