import Tree, { TreeData, RenderItemParams, ItemId, mutateTree, TreeSourcePosition, TreeDestinationPosition } from '@atlaskit/tree';
import { Dynalist, DynalistCollectionItem, DynalistItem } from '@client/dynalist/dynalist';
import { generateID } from '@client/module/uid';
import { ID } from '@client/types';
import { conditional, map } from '@client/util';
import React, { useState } from 'react';
import './SideBar.scss';

const renderItem = (onClick: (id: ID) => void) => ({
    depth,
    item,
    provided,
    snapshot,
    onCollapse,
    onExpand
}: RenderItemParams) => {
    const { type, display } = item.data as DynalistItem;

    return (
        <div
            ref={provided.innerRef}
            onClick={type !== 'collection' ? () => onClick(item.id as ID) : item.isExpanded ? () => onCollapse(item.id) : () => onExpand(item.id)}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
        >
            <div
                className={conditional({
                    "sequences-file": true
                })}
            >
                <i
                    className={conditional({
                        "bi": true,
                        "bi-nut-fill": type === 'routine',
                        "bi-caret-up-fill": item.isExpanded,
                        "bi-caret-down-fill": item.hasChildren && !item.isExpanded,
                        "bi-play-circle-fill": type === 'sequence'
                    })}
                />
                {display}
            </div>
        </div>
    );
}

export interface TreeProps {
    instance: Dynalist
}

export default function SideBar({ instance }: TreeProps) {
    const [ root ] = useState(generateID())
    // const [ tree, setTree ] = useState<TreeData>(() => {
    //     return {
    //         items: map({
    //             ...instance.files.items,
    //             ':empty': {
    //                 id: ':empty',
    //                 type: 'collection',
    //                 container: null,
    //                 contents: instance.files.top,
    //                 display: '<empty directory>'
    //             },
    //             [root]: {
    //                 id: root,
    //                 type: 'collection',
    //                 container: null,
    //                 contents: instance.files.top,
    //                 display: 'top',
    //             }
    //         }, item => ({
    //             id: item.id,
    //             children: item.type === 'collection' ? (
    //                 item.contents.length === 0 ? (
    //                     [':empty']
    //                 ) : (
    //                     item.contents
    //                 )
    //             ) : [],
    //             hasChildren: item.type === 'collection',
    //             isExpanded: true,
    //             data: item
    //         })),
    //         rootId: root
    //     };
    // });

    const tree = {
        items: map({
            ...instance.files.items,
            ':empty': {
                id: ':empty',
                type: 'collection',
                container: null,
                contents: instance.files.top,
                display: '<empty directory>'
            },
            [root]: {
                id: root,
                type: 'collection',
                container: null,
                contents: instance.files.top,
                display: 'top',
            }
        }, item => ({
            id: item.id,
            children: item.type === 'collection' ? (
                item.contents.length === 0 ? (
                    [':empty']
                ) : (
                    item.contents
                )
            ) : [],
            hasChildren: item.type === 'collection',
            isExpanded: item.type === 'collection' ? (item as any).expanded: false,
            data: item
        })),
        rootId: root
    };

    const onExpand = (id: ItemId) => {
        // setTree(mutateTree(tree, id, { isExpanded: true }))
        (instance.files.items[id] as DynalistCollectionItem).expanded = true;
    };

    const onCollapse = (id: ItemId) => {
        (instance.files.items[id] as DynalistCollectionItem).expanded = true;
    };

    const onDragEnd = (source: TreeSourcePosition, destination?: TreeDestinationPosition) => {
        if(destination && typeof destination.index === 'number') {
            const parent = source.parentId === root ? instance.files.top : (instance.files.items[source.parentId] as DynalistCollectionItem).contents;
            const [ idOfChild ] = parent.splice(source.index, 1);

            if(destination.parentId === root) {
                instance.files.top.splice(destination.index, 0, idOfChild);
            } else {
                (instance.files.items[destination.parentId] as DynalistCollectionItem).contents.splice(destination.index, 0, idOfChild);
            }

            instance.markDirty();
        }
    }

    return (
        <div className="sidebar-sequences">
            <div className="sequences">
                <div className="sequences-content">
                    <Tree
                        tree={tree}
                        offsetPerLevel={24}
                        renderItem={renderItem(console.log)}
                        onExpand={onExpand}
                        onCollapse={onCollapse}
                        onDragEnd={onDragEnd}
                        isDragEnabled
                    />
                </div>
                <div className="sequences-toolbar">
                    <i className="bi bi-file-earmark-plus"/>
                    <i className="bi bi-folder-plus" onClick={() => {
                        const id = generateID();
                        instance.files.items[id] = {
                            type: 'collection',
                            container: null,
                            contents: [],
                            display: 'asd',
                            expanded: true,
                            id
                        }
                        instance.files.top.push(id);
                        instance.markDirty();
                    }}/>
                </div>
            </div>
        </div>
    )
}