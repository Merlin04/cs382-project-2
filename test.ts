import { Graph } from "./graph.ts";
import { GMap, print_shortest_paths } from "./map.ts";
import { s_eq } from "./smap.ts";

const assert_eq = <T>(test: T, expected: T) => {
    if(test !== expected) {
        process.stderr.write(`Expected ${JSON.stringify(expected)}, but got ${JSON.stringify(test)}`);
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
        const m = new GMap(4, [[1, 1]]);
        const r = m.bfs_sssp([2, 1]);
        return assert_eq(print_shortest_paths(r), "3\t2\t1\t2\n4\t \t0\t1\n3\t2\t1\t2\n4\t3\t2\t3\n");
    }
}


export default function run_tests() {
    Object.entries(tests).forEach(([desc, f]) => {
        process.stdout.write((f() ? ":) " : " x ") + "- " + desc + "\n");
    })
}