import { configureStore, createAction, createSlice, PayloadAction } from '@reduxjs/toolkit';

const base64 = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-+';
let usedIDs = {};
export function generateID(): SequenceID {
    let s: string;
    
    do {
        s = '';
        for(let i=0;i<12;i++) s += base64[Math.floor(Math.random()*64)];
    } while(s in usedIDs);

    usedIDs[s] = 0;
    return s;
}
export function isID(str: string): str is SequenceID {
    return /^[0-9a-zA-Z-\+]{12}$/.test(str);
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
type FileExpandPayload = { id: SequenceID };
type FileMovePayload = { id: SequenceID, to?: SequenceID };
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
        promote: createAction<FilePromotePayload>('files/promote'),
        expand: createAction<FileExpandPayload>('files/expand'),
        move: createAction<FileMovePayload>('files/move')
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

export type FileSequencesDirs = Record<SequenceID, SequenceID[]>;
export interface FilesState {
    files: SequenceFiles,
    dirs: FileSequencesDirs
}
const filesInitialState: FilesState = {
    files: {},
    dirs: {}
};

export function contentsOfDir(state: FilesState, dirs: SequenceID[]): SequenceFiles {
    let left = dirs.slice();
    let dir = state.files;
    let valid = true;
    while(left.length > 0 && valid) {
        const item = dir[left.shift()];
        if(item && item.type === 'collection') {
            dir = item.contents;
        } else {
            valid = false;
        }
    }

    if(!valid) {
        return null;
    }
    
    return dir;
}

const filesSlice = createSlice({
    name: 'files',
    initialState: filesInitialState,
    reducers: {
        create: (state, action: PayloadAction<FileCreatePayload>) => {
            const { id, name, type, dirs } = action.payload;

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
            
            const dir = contentsOfDir(state, dirs);
            if(!dir) {
                console.error('[files/create] invalid payload:', action.payload);
            }
            dir[id] = item;
            state.dirs[id] = dirs;
            return state;
        },
        promote: (state, action: PayloadAction<FilePromotePayload>) => {
            const { id, main } = action.payload;
            
            const dir = contentsOfDir(state, state.dirs[id]);
            if(dir) {
                const item = dir[id];
                if(item.type === 'sequence') {
                    item.main = main;
                    return state;
                }
            }
            console.error('[files/promote] invalid payload:', action.payload);
        },
        expand: (state, action: PayloadAction<FileExpandPayload>) => {
            const { id } = action.payload;
            const dir = contentsOfDir(state, state.dirs[id]);
            if(dir) {
                const item = dir[id];
                if(item.type === 'collection') {
                    item.expanded = !item.expanded;
                    return state;
                }
            }

            console.error('[files/expand] invalid payload:', action.payload);
        },
        move: (state, action: PayloadAction<FileMovePayload>) => {
            const { id, to } = action.payload;

            if(id === to) return state;

            const dirsFrom = state.dirs[id];
            const dirFrom = contentsOfDir(state, dirsFrom);
            const copy = { ...dirFrom[id] };

            if(to === undefined) {
                delete dirFrom[id];
                state.files[id] = copy;
                state.dirs[id] = [];
                return state;
            }

            const dirsTo = state.dirs[to];

            let isMovingParentIntoChild = false;
            dirsTo.forEach(item => {
                if(item === id) isMovingParentIntoChild = true;
            });
            if(isMovingParentIntoChild) {
                return state;
            }
            
            const dirTo = contentsOfDir(state, dirsTo)[to];
            if(dirTo.type === 'collection') {
                delete dirFrom[id];
                dirTo.contents[id] = copy;
                state.dirs[id] = [ ...dirsTo, to ];
            }
            return state;
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
store.dispatch(actions.viewport.set(sequence));

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
const folderId = generateID();
store.dispatch(actions.files.create({
    dirs: [],
    id: folderId,
    name: 'Primitives',
    type: 'collection'
}));
store.dispatch(actions.files.create({
    dirs: [folderId],
    id: generateID(),
    name: 'Youtube Video',
    type: 'collection'
}));
store.dispatch(actions.files.create({
    dirs: [folderId],
    id: generateID(),
    name: 'MP3 File',
    type: 'sequence'
}));
store.dispatch(actions.files.promote({
    id: sequence,
    main: true
}));

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

(window as any).store = store;

function mapper(files: SequenceFiles, indent: number) {
    Object.keys(files).map(key => {
        const item = files[key];
        console.log('   '.repeat(indent) + '-> ' + item.name);
        if(item.type === 'collection') {
            mapper(item.contents, indent+1);
        }
    });
}

function update() {
    let state = store.getState();

    console.clear();
    mapper(state.files.files, 0);

    console.log('');

    Object.keys(state.files.dirs).map(key => {
        const item = state.files.dirs[key];
        console.log(`${key}: [${item.join(',')}]`);
    });
}

let playlist: any = {};

playlist.debug = () => {
    playlist.interval = setInterval(update, 1000);
}

(window as any).playlist = playlist;