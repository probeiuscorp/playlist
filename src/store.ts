import { configureStore, createAction, createSlice, PayloadAction } from '@reduxjs/toolkit';

const base64 = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-+';
let usedIDs = {};
function generateID(): SequenceID {
    let s: string;
    
    do {
        s = '';
        for(let i=0;i<12;i++) s += base64[Math.floor(Math.random()*64)];
    } while(s in usedIDs);

    usedIDs[s] = 0;
    return s;
}

export type SequenceID = string & {};

export type SequenceFileItem = ({
    type: 'collection',
    contents: SequenceFiles,
    expanded: boolean
} | {
    type: 'sequence',
    main: boolean
}) & {
    id: SequenceID,
    name: string
};
export type SequenceFiles = Record<SequenceID, SequenceFileItem>;

export type SourceParameterType = 'number' | 'sources';
export type Source = ({
    type: string,
    info: MutatorInfo,
    parameters: MutatorParameters,
    state: MutatorUnevaluatedParameters<any>
} | {
    primitive: 'video',
    video: string
} | {
    primitive: 'mp3',
    url: string
}) & {
    id: string
};
export type Sources = Source[];

export interface MutatorInfo {
    id: string,
    display: string,
    description: string
}
export type MutatorParameters = Record<string, {
    label: string,
    type: SourceParameterType
}>
export type MutatorEvaluatedParameters<T extends MutatorParameters> = {
    [P in keyof T]: T[P]['type'] extends 'number' ? number : Sources;
}
export type MutatorUnevaluatedParameters<T extends MutatorParameters> = {
    [P in keyof T]: T[P]['type'] extends 'number' ? number : Sources | SequenceID;
}

export const registry: Record<string, MutatorParameters> = {};
export function register<T extends MutatorParameters>(type: string, parameters: T, transformer: (sources: MutatorEvaluatedParameters<T>) => Sources) {
    registry[type] = parameters;
}

export type SequencesState = Record<SequenceID, {
    sources: Sources,
    name: string
}>;

interface SequencePayload {
    sequence: SequenceID,
    index: number
}

const sequenceInitialState: SequencesState = {};

type SequencesCreatePayload = { id: SequenceID, name: string };
type SequenceAppendPayload = { sequence: SequenceID, source: Source };
type SequenceUpdatePayload = SequencePayload & { updated: Source }
type SequenceDeletePayload = SequencePayload;
type SequenceMovePayload = { sequence: SequenceID, indexFrom: number, indexTo: number };

const sequencesSlice = createSlice({
    name: 'sequences',
    initialState: sequenceInitialState,
    reducers: {
        create: (state, action: PayloadAction<SequencesCreatePayload>) => {
            const { id, name } = action.payload;
            state[id] = {
                name,
                sources: []
            }
            return state;
        },
        append: (state, action: PayloadAction<SequenceAppendPayload>) => {
            const { sequence, source } = action.payload;
            state[sequence].sources.push(source);
            return state;
        },
        update: (state, action: PayloadAction<SequenceUpdatePayload>) => {
            const { index, sequence, updated } = action.payload;
            state[sequence].sources[index] = updated;
            return state;
        },
        move: (state, action: PayloadAction<SequenceMovePayload>) => {
            const { sequence, indexFrom, indexTo } = action.payload;
            const sources = state[sequence].sources;
            const [ item ] = sources.splice(indexFrom, 1);
            sources.splice(indexTo, 0, item);
            return state;
        },
        delete: (state, action: PayloadAction<SequenceDeletePayload>) => {
            const { sequence, index } = action.payload;
            state[sequence].sources.splice(index, 1);
            return state;
        }
    }
});

type FileCreatePayload = { id: SequenceID, name: string, dirs: SequenceID[], type: 'collection' | 'sequence' };
type FileRemovePayload = { id: SequenceID };
type FilePromotePayload = { id: SequenceID, main: boolean };
type FileExpandPayload = { id: SequenceID, expanded: boolean };
export const actions = {
    sequences: {
        create: createAction<SequencesCreatePayload>('sequences/create'),
        append: createAction<SequenceAppendPayload>('sequences/append'),
        update: createAction<SequenceUpdatePayload>('sequences/update'),
        move: createAction<SequenceMovePayload>('sequences/move'),
        delete: createAction<SequenceDeletePayload>('sequences/delete')
    },
    viewport: {
        set: createAction<SequenceID>('viewport/set')
    },
    files: {
        create: createAction<FileCreatePayload>('files/create'),
        promite: createAction<FilePromotePayload>('files/promote'),
        expand: createAction<FileExpandPayload>('files/expand')
    }
};

export type ViewportState = SequenceID;
const viewportInitialState: ViewportState = null;

const viewportSlice = createSlice({
    name: 'viewport',
    initialState: viewportInitialState,
    reducers: {
        set: (state, action: PayloadAction<SequenceID>) => {
            state = action.payload;
            return state;
        }
    }
});

export interface FilesState {
    files: SequenceFiles,
    flat: Record<SequenceID, SequenceFileItem>
}
const filesInitialState: FilesState = {
    files: {},
    flat: {}
};

const filesSlice = createSlice({
    name: 'files',
    initialState: filesInitialState,
    reducers: {
        create: (state, action: PayloadAction<FileCreatePayload>) => {
            const { id, name, type, dirs } = action.payload;

            let left = dirs.slice();
            let dir = state.files;
            let valid = true;
            while(left.length > 0 && valid) {
                const item = dir[left.shift()];
                if(item.type === 'collection') {
                    dir = item.contents;
                } else {
                    valid = false;
                }
            }

            let item: SequenceFileItem = null;
               
            if(type === 'collection') {
                item = {
                    type: 'collection',
                    contents: {},
                    id,
                    expanded: false,
                    name
                };
            } else {
                item = {
                    type: 'sequence',
                    id,
                    name,
                    main: false
                };
            }
            state.flat[id] = item;
            dir[id] = item;
            return state;
        },
        promote: (state, action: PayloadAction<FilePromotePayload>) => {
            const { id, main } = action.payload;
            const item = state.flat[id];
            if(item.type === 'sequence') {
                item.main = main;
            }
        },
        expand: (state, action: PayloadAction<FileExpandPayload>) => {
            const { id, expanded } = action.payload;
            const item = state.flat[id];
            if(item.type === 'collection') {
                item.expanded = expanded;
            }
        }
    }
})

export const store = configureStore({
    reducer: {
        sequences: sequencesSlice.reducer,
        viewport: viewportSlice.reducer,
        files: filesSlice.reducer
    }
});

// TESTING

const sequence = generateID();
store.dispatch(actions.sequences.create({
    id: sequence,
    name: 'a sequence'
}));
store.dispatch(actions.files.create({
    dirs: [],
    id: sequence,
    name: 'a sequence',
    type: 'sequence'
}));

store.dispatch(actions.viewport.set(sequence));

store.dispatch(actions.sequences.append({
    sequence,
    source: {
        type: 'inserter',
        info: {
            description: 'Inserts an item into something',
            display: 'Inserter',
            id: 'inserter'            
        },
        state: {
            base: null,
            inserted: null,
            chance: 50
        },
        parameters: {
            base: {
                type: 'sources',
                label: 'Base'
            },
            inserted: {
                type: 'sources',
                label: 'Insert:'
            },
            chance: {
                type: 'number',
                label: 'Chance:'
            }
        },
        id: generateID()
    }
}));

store.dispatch(actions.sequences.append({
    sequence,
    source: {
        primitive: 'video',
        video: 'dQw4w9WgXcQ',
        id: generateID()        
    }
}));