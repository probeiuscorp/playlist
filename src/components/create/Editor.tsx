import { Dynalist } from '@client/dynalist/dynalist';
import { conditional } from '@client/util';
import React, { useState } from 'react';
import { useEffect } from 'react';
import Mutators from './mutators/Mutators';
import Sequences from './Sequences';

export interface EditorProps {
    instance: Dynalist | null
}

export default function Editor({ instance }: EditorProps) {
    const [ tab, setTab ] = useState<'sequences' | 'mutators'>('mutators');

    useEffect(() => {
        const listener = (e: KeyboardEvent) => {
            if(e.key === '.' || e.key === ',') {
                setTab(tab === 'sequences' ? 'mutators' : 'sequences');
            }
        }

        document.addEventListener('keyup', listener);

        return () => {
            document.removeEventListener('keyup', listener);
        }
    })

    if(instance) {
        return (
            <div className="create">
                <div className="tabs">
                    <div className={conditional({
                        "tab": true,
                        "active": tab === 'sequences'
                    })} onClick={() => void setTab('sequences')}>
                        Sequences
                    </div>
                    <div className={conditional({
                        "tab": true,
                        "active": tab === 'mutators'
                    })} onClick={() => void setTab('mutators')}>
                        Mutators
                    </div>
                </div>
                <div className={conditional({
                    "create-viewport": true,
                    "viewport-sequences": tab === 'sequences',
                    "viewport-mutators":  tab === 'mutators'
                })}>
                    <Sequences
                        hidden={tab !== 'sequences'}
                    />
                    <Mutators
                        instance={instance}
                        hidden={tab !== 'mutators'}    
                    />
                </div>
            </div>
        );
    } else {
        return (
            <div className="loading"/>
        );
    }
}