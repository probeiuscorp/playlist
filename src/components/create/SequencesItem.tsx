import Tooltip from 'rc-tooltip';
import React from 'react';
import { DraggableProvidedDragHandleProps } from 'react-beautiful-dnd';
import { Modals } from '@client/module/modal';
import { split } from '@client/util';
import 'rc-tooltip/assets/bootstrap.css';

export interface SequencesItemOption {
    type: 'video' | 'file',
    title: string,
    id: string,
    weight: number,
    url: string
}

export interface SequencesItemProps {
    handleProps: DraggableProvidedDragHandleProps | undefined,
    delete: (option: number) => void,
    update: (newState: SequencesItemOption[]) => void,
    options: SequencesItemOption[]
}

export default class SequencesItem extends React.Component<SequencesItemProps> {
    handleWeightClick = (i: number, e: React.MouseEvent) => {
        const option = this.props.options[i];
        if(e.ctrlKey) {
            option.weight = -1;
        } else if(e.shiftKey) {
            option.weight++;
            if(option.weight === 0) option.weight = -6;
        } else {
            option.weight %= 6;
            option.weight--;
        }
        this.props.update(this.props.options);
    }

    handleAdd = (i: number) => {
        Modals.open('sequence/edit', {
            option: null
        }).then(option => {
            if(option) {
                const [ before, after ] = split(this.props.options, i);
                this.props.update([
                    ...before,
                    option,
                    ...after
                ]);
            }
        });
    }

    handleEdit = (i: number) => {
        Modals.open('sequence/edit', {
            option: this.props.options[i]
        }).then(option => {
            if(option) {
                this.props.options[i] = option;
                this.props.update(this.props.options);
            }
        })
    }

    render() {
        return (
            <>
            <div className="sequences-item-drag" {...this.props.handleProps}>
                <i className="sequences-item-draghandle bi-grip-vertical bi"/>
            </div>
            <div className="sequences-item-details">
                {
                    this.props.options.map(({ type, title, id, weight }, i) => {
                        return (
                            <div className="sequences-item-option" key={id}>
                                <div className="sequences-item-detail">
                                    <i className={"sequences-item-icon bi " + (type === 'video' ? "bi-youtube" : "bi-soundwave")}/>
                                    {title}
                                </div>
                                <div className="sequences-item-actions">
                                    <span className="sequences-item-actions-hide">
                                        <i className="bi bi-plus-circle-fill" onClick={() => void this.handleAdd(i)}/>
                                        <i className="bi bi-pencil-fill" onClick={() => void this.handleEdit(i)}/>
                                        <i className="bi bi-trash-fill" onClick={() => void this.props.delete(i)}/>
                                    </span>
                                    {
                                        this.props.options.length > 1 && (weight < 0 ? (
                                            <Tooltip overlay={<>Weight of this option.<br/>Chance out of total sum.</>} placement="left" mouseEnterDelay={0.8}>
                                                <i className={`bi bi-dice-${weight*-1}-fill`} onClick={e => void this.handleWeightClick(i, e)}/>
                                            </Tooltip>
                                        ) : (
                                            <span className="sequences-weight">{weight}</span>
                                        ))
                                    }
                                </div>
                            </div>
                        )
                    })
                }
            </div>
            </>
        );
    }
}