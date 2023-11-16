export class Graph<TKey, TValue> {
    vertices: Map<TKey, TValue>
    edges: Map<[TKey, TKey], number>

    constructor() {
        this.vertices = new Map<TKey, TValue>();
        this.edges = new Map<[TKey, TKey], number>();
    }

    get_weight(k_u: TKey, k_v: TKey) : number | null {
        return this.edges.get([k_u, k_v]) ?? null;
    }

    add_vertex(k: TKey, v: TValue, neighbors : TKey[] = []) : void {
        this.vertices.set(k, v);
        // FIXME: Weight of edge
        for (var neighbor of neighbors) {
            this.edges.set([k, neighbor], 1);
            this.edges.set([neighbor, k], 1);
        }
    }

    delete_vertex(k: TKey) : void {
        for (var [[k_u, k_v], _] of this.edges) {
            if (k === k_u || k === k_v) {
                this.edges.delete([k_u, k_v]);
            }
        }
    }

    add_edge(k_u: TKey, k_v: TKey, w: number) : void {
        this.edges.set([k_u, k_v], w);
        this.edges.set([k_v, k_u], w);
    }

    delete_edge(k_u: TKey, k_v: TKey) : void {
        this.edges.delete([k_u, k_v]);
        this.edges.delete([k_v, k_u]);
    }
}
