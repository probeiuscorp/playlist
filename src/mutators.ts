import { MutatorInfo, Sequence } from './types';
import { shuffle } from './util';

export const mutators: Record<string, MutatorInfo> = {
    shuffle: {
        display: 'Shuffle',
        description: 'Randomly reorders a sequence',
        handler: params => {
            const input = params.shuffle as Sequence;
            return {
                shuffled: shuffle(input)
            };
        },
        params: [
            {
                label: 'Shuffle',
                id: 'shuffle',
                type: 'sequence'
            }
        ],
        outputs: [
            {
                label: 'Shuffled',
                id: 'shuffled',
                type: 'sequence'
            }
        ]
    },
    conditional: {
        display: 'Conditional',
        description: 'Outputs a sequence if a condition is true',
        handler: params => {
            const output = params.output as Sequence;
            const when = params.if as boolean;
            return {
                output: when ? output : []
            }
        },
        params: [
            {
                label: 'Output',
                id: 'output',
                type: 'sequence'
            }, {
                label: 'If',
                id: 'if',
                type: 'boolean'
            }
        ],
        outputs: [
            {
                label: 'Output',
                id: 'output',
                type: 'sequence'
            }
        ]
    },
    splitter: {
        display: 'Splitter',
        description: 'Takes one connection and turns it into 2',
        handler: ({ input }) => ({ a: input, b: input }),
        params: [
            {
                label: 'Input',
                id: 'input',
                type: 'any'
            }
        ],
        outputs: [
            {
                label: 'A',
                id: 'a',
                type: 'any'
            }, {
                label: 'B',
                id: 'b',
                type: 'any'
            }
        ]
    },
    splitter4: {
        display: 'Splitter 4',
        description: 'Takes one connection and turns it into 4',
        handler: ({ input }) => ({ a: input, b: input, c: input, d: input }),
        params: [
            {
                label: 'Input',
                id: 'input',
                type: 'any'
            }
        ],
        outputs: [
            {
                label: 'A',
                id: 'a',
                type: 'any'
            }, {
                label: 'B',
                id: 'b',
                type: 'any'
            }, {
                label: 'C',
                id: 'c',
                type: 'any'
            }, {
                label: 'D',
                id: 'd',
                type: 'any'
            }
        ]
    },
    merge: {
        display: 'Merge',
        description: 'Appends a sequence to another',
        handler: params => {
            const first = params.first as Sequence;
            const last = params.last as Sequence;
            return {
                merged: [...first, ...last]
            }
        },
        params: [
            {
                label: 'First',
                id: 'first',
                type: 'sequence'
            }, {
                label: 'Last',
                id: 'last',
                type: 'sequence'
            }
        ],
        outputs: [
            {
                label: 'Merged',
                id: 'merged',
                type: 'sequence'
            }
        ]
    },
    random: {
        display: 'Random',
        description: 'Randomly, with equal odds, outputs true or false',
        handler: () => ({ output: Math.random() < 0.5 }),
        params: [],
        outputs: [
            {
                label: 'Chance',
                id: 'output',
                type: 'boolean'
            }
        ]
    },
    oneIn: {
        display: 'One in',
        description: 'Outputs true one in N times',
        handler: params => {
            const input = params.input as number;
            return {
                output: Math.random() < 1 / input
            }
        },
        params: [
            {
                label: 'N',
                id: 'input',
                type: 'number'
            }
        ],
        outputs: [
            {
                label: 'Chance',
                id: 'output',
                type: 'boolean'
            }
        ]
    },
    weight2: {
        display: 'Weight',
        description: 'Randomly outputs a boolean with true and false weighed',
        handler: params => {
            const True = params.true as number;
            const False = params.false as number;
            return {
                output: Math.random() < True / (True + False)
            }
        },
        params: [
            {
                label: 'True',
                id: 'true',
                type: 'number'
            }, {
                label: 'False',
                id: 'false',
                type: 'number'
            }
        ],
        outputs: [
            {
                label: 'Chance',
                id: 'output',
                type: 'boolean'
            }
        ]
    },
    pick: {
        display: 'Pick 1',
        description: 'Randomly picks one source from a sequence',
        handler: params => {
            const input = params.input as Sequence;
            return {
                source: [input[Math.floor(Math.random()*input.length)]]
            }
        },
        params: [
            {
                label: 'Sequence',
                id: 'input',
                type: 'sequence'
            }
        ],
        outputs: [
            {
                label: 'Source',
                id: 'source',
                type: 'sequence'
            }
        ]
    },
    pickN: {
        display: 'Pick N',
        description: 'Randomly picks N sources from a sequence',
        handler: params => {
            const sequence = (params.sequence as Sequence).slice();
            const n = params.n as number;
            if(n >= sequence.length) return { output: sequence }

            let output: Sequence = [];
            for(let i=0;i<n;i++) {
                sequence.push(sequence.splice(Math.floor(Math.random()*sequence.length), 1)[0]);
            }

            return {
                output
            };
        },
        params: [
            {
                label: 'Sequence',
                id: 'sequence',
                type: 'sequence'
            }, {
                label: 'N',
                id: 'n',
                type: 'number'
            }
        ],
        outputs: [
            {
                label: 'Output',
                id: 'output',
                type: 'sequence'
            }
        ]
    },
    not: {
        display: 'Invert',
        description: 'Turns true into false and false into true',
        handler: params => ({ output: !params.input }),
        params: [
            {
                label: 'X',
                id: 'input',
                type: 'boolean'
            }
        ],
        outputs: [
            {
                label: 'Y',
                id: 'output',
                type: 'boolean'
            }
        ]
    },
    and: {
        display: 'AND',
        description: 'Logical AND: Outputs true only when both inputs are true',
        handler: params => ({ output: params.a && params.b }),
        params: [
            {
                label: 'A',
                id: 'a',
                type: 'boolean'
            }, {
                label: 'B',
                id: 'b',
                type: 'boolean'
            }
        ],
        outputs: [
            {
                label: 'Y',
                id: 'output',
                type: 'boolean'
            }
        ]
    },
    or: {
        display: 'OR',
        description: 'Logical OR: Outputs true if either input is true',
        handler: params => ({ output: params.a || params.b }),
        params: [
            {
                label: 'A',
                id: 'a',
                type: 'boolean'
            }, {
                label: 'B',
                id: 'b',
                type: 'boolean'
            }
        ],
        outputs: [
            {
                label: 'Y',
                id: 'output',
                type: 'boolean'
            }
        ]
    },
    nand: {
        display: 'NAND',
        description: 'Logical NAND: Inverted AND',
        handler: params => ({ output: !(params.a && params.b) }),
        params: [
            {
                label: 'A',
                id: 'a',
                type: 'boolean'
            }, {
                label: 'B',
                id: 'b',
                type: 'boolean'
            }
        ],
        outputs: [
            {
                label: 'Y',
                id: 'output',
                type: 'boolean'
            }
        ]
    },
    nor: {
        display: 'NOR',
        description: 'Logical NOR: Inverted OR',
        handler: params => ({ output: !(params.a || params.b) }),
        params: [
            {
                label: 'A',
                id: 'a',
                type: 'boolean'
            }, {
                label: 'B',
                id: 'b',
                type: 'boolean'
            }
        ],
        outputs: [
            {
                label: 'Y',
                id: 'output',
                type: 'boolean'
            }
        ]
    },
    xor: {
        display: 'XOR',
        description: 'Logical XOR: Outputs true if the inputs are different',
        handler: params => ({ output: params.a !== params.b }),
        params: [
            {
                label: 'A',
                id: 'a',
                type: 'boolean'
            }, {
                label: 'B',
                id: 'b',
                type: 'boolean'
            }
        ],
        outputs: [
            {
                label: 'Y',
                id: 'output',
                type: 'boolean'
            }
        ]
    },
    xnor: {
        display: 'XNOR',
        description: 'Logical XNOR: Outputs true if the inputs are the same',
        handler: params => ({ output: params.a !== params.b }),
        params: [
            {
                label: 'A',
                id: 'a',
                type: 'boolean'
            }, {
                label: 'B',
                id: 'b',
                type: 'boolean'
            }
        ],
        outputs: [
            {
                label: 'Y',
                id: 'output',
                type: 'boolean'
            }
        ]
    }
};