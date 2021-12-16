import React from 'react';
import { generateID, MutatorUnevaluatedParameters, registry, Source } from '../store';
import Modal from './Modal';
import './ModalNewItem.scss';

export interface ModalNewItemProps {
    show: boolean,
    onChange?: (value: Source) => void,
    onClose?: () => void
}

type NewItem = ({
    type: 'primitive',
    primitive: 'video' | 'mp3'
} | {
    type: 'mutator',
    id: string
}) & {
    icon: string,
    display: string,
    index: number
}

const items: NewItem[] = [
    {
        type: 'primitive',
        primitive: 'video',
        display: 'Video',
        icon: 'box',
        index: 0
    },
    {
        type: 'primitive',
        primitive: 'mp3',
        display: 'Audio',
        icon: 'box',
        index: 1
    }
];
items.push(...(Object.keys(registry).map((key, i) => {
    const entry = registry[key];
    return {
        type: 'mutator',
        display: entry.info.display,
        id: key,
        icon: 'braces',
        index: i + 2
    } as NewItem;
})));

const dividers = [{
    index: 0,
    display: 'Basic'
}, {
    index: 2,
    display: 'Mutators'
}];

interface ModalNewItemState {
    selected: number,
    filter: string
}

export default class ModalNewItem extends React.Component<ModalNewItemProps, ModalNewItemState> {
    private ref: React.RefObject<HTMLInputElement>;

    constructor(props) {
        super(props);

        this.ref = React.createRef();

        this.state = {
            selected: 0,
            filter: null
        };
    }

    select = (index: number) => {
        if(this.props.onChange) {
            if(typeof index === 'number') {
                const id = generateID();
                const selected = items[index];

                if(selected.type === 'primitive') {
                    if(selected.primitive === 'video') {
                        this.props.onChange({
                            id,
                            primitive: 'video',
                            video: 'dQw4w9WgXcQ'
                        })
                    } else {
                        this.props.onChange({
                            id,
                            primitive: 'mp3',
                            url: ''
                        });
                    }
                } else {
                    const entry = registry[selected.id];
                    const parameters = entry.parameters;
                    let state: MutatorUnevaluatedParameters<any> = {};
                    Object.keys(entry.parameters).forEach(key => {
                        if(parameters[key].type === 'number') {
                            state[key] = 50;
                        } else {
                            state[key] = null;
                        }
                    });

                    this.props.onChange({
                        id,
                        type: selected.id,
                        info: entry.info,
                        parameters,
                        state
                    });
                }

                this.props.onClose();
            }
        }
    }

    regex(filter: string): RegExp {
        return new RegExp(filter.split('').join('.*'), 'i');
    }

    filter(filter: string): NewItem[] {
        if(!filter) {
            return items;
        } else {
            const regex = this.regex(filter);
            return items.filter(item => {
                return regex.test(item.display);
            });
        }
    }

    componentDidMount(): void {
        this.ref.current.focus();
    }

    componentDidUpdate(prevProps: Readonly<ModalNewItemProps>, prevState: Readonly<{}>, snapshot?: any): void {
        if(this.props.show) {
            this.ref.current.focus();
        }
    }

    handleKeyDown = (e: React.KeyboardEvent) => {
        const arrowUp = e.key === 'ArrowUp';
        const arrowDown = e.key === 'ArrowDown';
        
        if(arrowUp || arrowDown) {
            const filtered = this.filter(this.state.filter);
            if(filtered.length > 0) {
                if(this.state.selected === null) {
                    this.setState({ selected: filtered[0].index});
                } else {
                    const indexInFiltered = filtered.indexOf(items[this.state.selected]);
                    let index = indexInFiltered;
                    if(arrowUp) {
                        index--;
                        if(index < 0) {
                            index = filtered.length - 1;
                        }
                    } else {
                        index++;
                        if(index >= filtered.length) {
                            index = 0;
                        }
                    }
                    this.setState({ selected: filtered[index].index })
                }
            }
            e.preventDefault();
        }

        if(e.key === 'Enter') {
            this.select(this.state.selected);
            e.preventDefault();
        }

        if(e.key === 'Escape') {
            this.props.onClose?.();
        }
    }

    handleKeyUp = (e: React.KeyboardEvent) => {
        this.setState({ filter: this.ref.current.value.toLowerCase() });
    }

    render() {
        let foundAny = false;
        let nextDivider = 0;
        const regex = this.state.filter && this.regex(this.state.filter);

        return (
            <Modal
                show={this.props.show}
                onClose={this.props.onClose}
            >
                <h1 className="new-item-heading">New Item</h1>
                <input
                    type="text"
                    ref={this.ref}
                    className="new-item-filter"
                    placeholder="Filter..."
                    onKeyDown={this.handleKeyDown}
                    onKeyUp={this.handleKeyUp}
                />
                <div className="new-item-options">
                    {
                        items.map((item, i) => {
                            if(!this.state.filter || regex.test(item.display)) {
                                foundAny = true;
                                const divider = dividers[nextDivider];
                                const headerIndex = divider?.index;
                                const headerDisplay = divider?.display;

                                const renderHeader = headerIndex <= i;
                                if(renderHeader) {
                                    nextDivider++;
                                }

                                return (
                                    <React.Fragment key={item.type === 'primitive' ? item.primitive : item.id}>
                                    {
                                        renderHeader && !this.state.filter && (
                                            <div className="new-item-divider">
                                                {headerDisplay}
                                            </div>
                                        )
                                    }
                                    <div
                                        onClick={() => this.select(item.index)}
                                        className={`new-item-option ${i++ === this.state.selected ? 'selected' : ''}`}
                                    >
                                        <i className={`bi bi-${item.icon}`}/>
                                        {item.display}
                                    </div>
                                    </React.Fragment>
                                );
                            }
                        })
                    }
                    {
                        !foundAny && (
                            <div className="new-item-status">
                                <i className="bi bi-exclamation-circle-fill"/>
                                Nothing matched your filter.
                            </div>
                        )
                    }
                </div>
            </Modal>
        );
    }
}