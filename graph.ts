export class Graph<TKey, TValue> {
    get_weight(k_u: TKey, k_v: TKey) : number | null {
        throw "Unimplemented";
    }

    add_vertex(k: TKey, v: TValue, neighbors : TKey[] = []) : void {
        throw "Unimplemented";
    }

    delete_vertex(k: TKey) : void {
        throw "Unimplemented";
    }

    add_edge(k_u: TKey, k_v: TKey) : void {
        throw "Unimplemented";
    }

    delete_edge(k_u: TKey, k_v: TValue) : void {
        throw "Unimplemented";
    }
}