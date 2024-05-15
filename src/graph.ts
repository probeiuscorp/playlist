export type Connection<TNode, TEdge> = {
    node: TNode;
    edge: TEdge;
}
export class Graph<TNode, TEdge> {
    private readonly nodes = new Map<TNode, Connection<TNode, TEdge>[]>();

    connect = (node: TNode) => {
        return new GraphEdger(node, this.addEdge);
    }

    pickRandomOrphan = () => this.nodes.toArray().filter(([, connections]) => connections.length === 0).pick();
    pickRandom = () => this.nodes.toArray().pick();

    addEdge = (from: TNode, to: TNode, edge: TEdge) => {
        const entry = this.nodes.get(from);
        const node: Connection<TNode, TEdge> = {
            node: to,
            edge,
        };

        if(entry) {
            entry.push(node);
        } else {
            this.nodes.set(from, [node]);
        }
    }

    getEdgesFrom(node: TNode) {
        return this.nodes.get(node) ?? [];
    }
}

export class GraphEdger<TNode, TEdge> {
    constructor(
        private readonly node: TNode,
        private readonly addEdge: (from: TNode, to: TNode, edge: TEdge) => void,
    ) {}

    with(node: TNode, edge: TEdge) {
        this.addEdge(this.node, node, edge);
        this.addEdge(node, this.node, edge);
        return this;
    }

    to(node: TNode, edge: TEdge) {
        this.addEdge(this.node, node, edge);
        return this;
    }
}