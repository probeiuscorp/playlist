import { Modals, useTypedModal } from '@client/module/modal';
import { conditional } from '@client/util';
import { useRef, useState } from 'react';
import UploadAudio, { UploadAudioValue } from '../create/UploadAudio';
import VideoInput from '../create/VideoInput';
import Modal from './Modal';
import './ModalEdit.scss';

Modals.createModal('sequence/edit', props => {
    const modal = useTypedModal('sequence/edit');
    const [ tab, setTab ] = useState<'video' | 'file'>('video');
    const title = useRef<HTMLInputElement>();
    const weight = useRef<HTMLInputElement>();
    const option = props.option;
    let getValue: () => UploadAudioValue;

    async function save() {
        const value = await getValue();
        let wgt = weight.current.valueAsNumber;
        if(wgt >= 1 && wgt <= 6) {
            wgt = -wgt;
        }

        // if(value) {
        //     modal.resolveHide({
        //         id: option.id,
        //         title: title.current.value,
        //         type: title.current.value,
        //         url: value.url,
        //         weight: wgt
        //     } as EditModal.Value);
        // }
        if(value) {
            modal.resolve({
                id: option.id,
                title: title.current.value,
                type: tab,
                url: value.url,
                weight: wgt
            });
        }
    }

    return (
        <Modal>
            <h3>{option ? 'Edit' : 'New'}</h3>
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
                    <VideoInput getValue={cb => getValue = cb} value={option ? option.url : ''}/>
                ) : (
                    <UploadAudio getValue={cb => getValue = cb}/>
                )
            }
            <div className="button-row">
                <button onClick={save}>Save</button>
                <button onClick={() => void modal.resolve(null)}>Cancel</button>
            </div>
        </Modal>
    );
});