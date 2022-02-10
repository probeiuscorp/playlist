import React from 'react';
import { Modals, useTypedModal } from '@client/module/modal';
import { conditional } from '@client/util';
import { useRef, useState } from 'react';
import Modal from './Modal';
import { generateID } from '@client/module/uid';
import './ModalEdit.scss';

interface SourceProps {
    error: boolean,
    onChange: (url: string) => void
}

const isOk = /^(https:\/\/)?(www\.)?(youtube.com\/watch\?v=)?[A-Za-z0-9_\-]{11}$/;
function VideoInput(props: SourceProps) {
    const [ value, setValue ] = useState('');
    const [ valid, setValid ] = useState(false);

    const handleChange: React.EventHandler<React.ChangeEvent> = e => {
        const el = e.target as HTMLInputElement;
        const content = el.value;
        setValue(content);
        props.onChange(content);
        setValid(VideoInput.isValid(content));
    }

    return (
        <div className="video-input-wrapper">
            <i className={conditional({
                "bi": true,
                "bi-x-circle-fill invalid": !valid && value !== '',
                "bi-check-circle-fill valid": !props.error && valid,
                "bi-dash-circle-fill unset": value === ''
            })}/>
            <input
                placeholder="Complete url or video ID"
                type="text"
                value={value}
                onChange={handleChange}
                className={conditional({
                    "textbox video-input": true,
                    "invalid": props.error
                })}
            />
        </div>
    )
}

VideoInput.isValid = (str: string) => isOk.test(str);

function UploadAudio(props: SourceProps) {
    const [ dropping, setDropping ] = useState(false);
    const [ file, setFile ] = useState<File | null>(null);

    return (
        <div
            className={conditional({
                "upload-audio": true,
                "dropping": dropping,
                "invalid": props.error
            })}
            onDragEnter={e => { setDropping(true); e.preventDefault(); }}
            onDragOver={e => e.preventDefault()}
            onDragEnd={e => { setDropping(false) }}
        >
            {
                file === null ? "Drop an audio file here" : (
                    <div>You uploaded file "{file.name}"</div>
                )
            }
        </div>
    )
}

UploadAudio.isValid = (str: string) => true

Modals.createModal('sequence/edit', props => {
    const modal = useTypedModal('sequence/edit');
    const [ tab, setTab ] = useState<'video' | 'file'>('video');
    const [ error, setError ] = useState(false);
    const title = useRef<HTMLInputElement>(null);
    const weight = useRef<HTMLInputElement>(null);
    const url = useRef<string>();
    const option = props.option;

    const save = () => {
        const value = url.current;
        if(value) {
            const valid = tab === 'video' ? VideoInput.isValid(value) : UploadAudio.isValid(value);
            if(!valid) {
                setError(true);
                return;
            }
            
            let wgt = weight.current!.valueAsNumber;
            if(isNaN(wgt)) return;

            if(wgt >= 1 && wgt <= 6) {
                wgt = -wgt;
            }
            
            modal.resolve({
                id: option?.id ?? generateID(),
                title: title.current!.value,
                type: tab,
                url: value,
                weight: wgt
            });
        } else setError(true);
    }

    const handleChange = (value: string) => {
        setError(false);
        url.current = value;
    }
    
    return (
        <Modal
            onClose={() => modal.resolve(null)}
        >
            <h3>{option ? 'Edit source' : 'Create new source'}</h3>
            <p>Display name</p>
            <input
                className="textbox"
                type="text"
                ref={title}
                defaultValue={option ? option.title : undefined}
            />
            <p>Weight <span className="mono">(optional)</span></p>
            <input
                className="textbox"
                type="number"
                defaultValue={option ? Math.abs(option.weight) : 1}
                min={1}
                step={1}
                ref={weight}
            />
            <div className="tab-select">
                <div
                    className={conditional({
                        "tab": true,
                        "active": tab === 'video'
                    })}
                    onClick={() => void setTab('video')}
                >
                    <i className="bi bi-youtube"/>
                    Video
                </div>
                <div
                    className={conditional({
                        "tab": true,
                        "active": tab === 'file'
                    })}
                    onClick={() => void setTab('file')}
                >
                    <i className="bi bi-soundwave"/>
                    Audio
                </div>
            </div>
            {
                tab === 'video' ? (
                    <VideoInput
                        error={error}
                        onChange={handleChange}
                    />
                ) : (
                    <UploadAudio
                        error={error}
                        onChange={handleChange}
                    />
                )
            }
            <div className="button-row">
                <button onClick={save}>Save</button>
                <button onClick={() => void modal.resolve(null)}>Cancel</button>
            </div>
        </Modal>
    );
});