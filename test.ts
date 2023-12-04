import { Graph } from "./graph.ts";
import { GMap } from "./map.ts";
import { s_eq } from "./smap.ts";

const assert_eq = <T>(test: T, expected: T) => {
    if(test !== expected) {
        process.stderr.write(`Expected:
${expected}
but got:
${test}`);
    }
    return test === expected;
}

const tests: Record<string, (() => boolean)> = {
    "graph basic ops": () => {
        const g = new Graph<string, null>();
        g.add_vertex("hello", null);
        g.add_vertex("world", null);
        g.add_vertex("friend", null);
        g.add_edge("hello", "world", 1);
        g.add_edge("hello", "friend", 1);
        g.add_edge("world", "friend", 2);
        g.add_vertex("oomfie", null);
        g.add_edge("hello", "oomfie", 1);
        g.add_edge("world", "oomfie", 0.5);
        g.delete_edge("friend", "world");
        return g.get_weight("friend", "world") === null
            && g.get_weight("oomfie", "world") === 0.5
            && s_eq(g.get_adj("world").sort(), ["hello", "oomfie"].sort());
    },
    "map basic ops": () => {
        const m = new GMap(4, [[2, 1]]);
        return assert_eq(m.print_pretty(), `. . . .
. . # .
. . . .
. . . .
`) && (
        m.add_obstacle([0, 1]),
        m.remove_obstacle([1, 1]),
        m.is_obstacle([0, 1]));
    },
    "bfs_sssp": () => {
        const m = new GMap(5, [[2, 0], [1, 1]]);
        const r = m.bfs_sssp([4, 0]);
        return assert_eq(m.print_shortest_paths(r), "8 9 # 1 0\n7 # 3 2 1\n6 5 4 3 2\n7 6 5 4 3\n8 7 6 5 4\n");
    },
    "bfs_spsp": () => {
        const m = new GMap(5, [[2, 0], [1, 1]]);
        const p = m.bfs_spsp([1, 0], [4, 0]);
        return assert_eq(m.print_shortest_path(p), "1 0 # 8 9\n2 # 6 7 .\n3 4 5 . .\n. . . . .\n. . . . .\n");
    },
    "dijkstra's algorithm": () => {
        const m = new GMap(5, [[2, 0], [1, 1]]);
        const r = m.dijkstra([4, 0]);
        return assert_eq(m.print_shortest_paths(r), "8 9 # 1 0\n7 # 3 2 1\n6 5 4 3 2\n7 6 5 4 3\n8 7 6 5 4\n");
    }
}


export default function run_tests() {
    Object.entries(tests).forEach(([desc, f]) => {
        process.stdout.write((f() ? ":) " : " x ") + "- " + desc + "\n");
    })
}