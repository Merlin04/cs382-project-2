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

    delete_vertex(k: TKey) : boolean {
        for (const [[k_u, k_v], _] of this.edges) {
            if (s_eq(k, k_u) || s_eq(k, k_v)) {
                this.edges.delete([k_u, k_v]);
            }
        }
        return this.vertices.delete(k);
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

    debug_generate_graphviz() : string {
        // generate a simple graphviz representation of the graph
        // seems to work best with neato engine
        // and render here: https://dreampuf.github.io/GraphvizOnline/
        const d = <T>(o: T) => JSON.stringify(JSON.stringify(o));
        let s = "digraph {\n";
        for (const [k, _] of this.vertices) {
            s += `    ${d(k)}\n`;
        }
        for (const [[k_u, k_v], _] of this.edges) {
            s += `    ${d(k_u)} -> ${d(k_v)}\n`;
        }
        s += "}";
        return s;
    }
}
