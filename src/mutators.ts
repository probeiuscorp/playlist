import { register } from './store';

function shuffle<T>(array: T[]): T[] {
    let m = array.length, t: T, i: number;

    // While there remain elements to shuffle…
    while (m) {

        // Pick a remaining element…
        i = Math.floor(Math.random() * m--);

        // And swap it with the current element.
        t = array[m];
        array[m] = array[i];
        array[i] = t;
    }

    return array;
}

register('picker', {
    description: 'Randomly picks one source from a sequence.',
    display: 'Picker'
}, {
    sources: {
        type: 'sources',
        label: 'Pick one from:'
    }
}, ({ sources }) => {
    return [sources[Math.floor(Math.random()*sources.length)]];
});

register('pickn', {
    description: 'Randomly picks a given number of sources from a sequence.',
    display: 'Pick <n>'
}, {
    sources: {
        type: 'sources',
        label: 'Pick from:'
    },
    amount: {
        type: 'number',
        label: 'Pick <n> items:'
    }
}, ({ sources, amount }) => {
    let left = amount;
    let available = sources;
    let picked = [];
    while(left > 0 && available.length > 0) {
        const index = Math.floor(Math.random() * available.length);
        picked.push(available[index]);
        available.splice(index, 1);
        left--;
    }
    return picked;
});

register('shuffler', {
    description: 'Randomly reorders <sources>.',
    display: 'Shuffler'
}, {
    sources: {
        type: 'sources',
        label: 'Shuffle:'
    }
}, ({ sources }) => {
    return shuffle(sources);
});

register('inserter', {
    description: 'Inserts <insert> into a random location in <base>.',
    display: 'Inserter'
}, {
    sources: {
        type: 'sources',
        label: 'Base:'
    },
    inserted: {
        type: 'sources',
        label: 'Insert:'
    }
}, ({ sources, inserted }) => {
    sources.splice(Math.floor(Math.random() * sources.length), 0, ...inserted);
    return sources;
});

register('repeater', {
    description: 'Repeats <repeat> <n> times.',
    display: 'Repeater'
}, {
    sources: {
        type: 'sources',
        label: 'Repeat:'
    },
    amount: {
        type: 'number',
        label: '<n> times:'
    }
}, ({ sources, amount }) => {
    let output = [];
    for(let i=0;i<amount;i++) {
        output.push(...{...sources});
    }
    return output;
});