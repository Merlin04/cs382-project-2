import SMap, { s_eq } from "./smap.ts";

export class Graph<TKey, TValue> {
    vertices: Map<TKey, TValue>
    edges: Map<[TKey, TKey], number>

    constructor() {
        this.vertices = new SMap<TKey, TValue>();
        this.edges = new SMap<[TKey, TKey], number>();
    }

    get_weight(k_u: TKey, k_v: TKey) : number | null {
        return this.edges.get([k_u, k_v]) ?? null;
    }

    add_vertex(k: TKey, v: TValue, neighbors : TKey[] = []) : void {
        this.vertices.set(k, v);
        // FIXME: Weight of edge
        for (const neighbor of neighbors) {
            this.edges.set([k, neighbor], 1);
            this.edges.set([neighbor, k], 1);
        }
    }

    delete_vertex(k: TKey) : void {
        for (const [[k_u, k_v], _] of this.edges) {
            if (s_eq(k, k_u) || s_eq(k, k_v)) {
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

    get_adj(k_u: TKey) : TKey[] {
        return Array.from(this.edges.keys())
            .filter(([f, _]) => s_eq(f, k_u))
            .map(([_, t]) => t);
    }
}
