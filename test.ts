import { Graph } from "./graph.ts";
import { GMap, Point2 } from "./map.ts";
import { s_eq } from "./smap.ts";

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
        const m = new GMap(4, [[1, 1]]);
        m.print_pretty();
        m.add_obstacle(0, 1);
        m.remove_obstacle(1, 1);
        return m.is_obstacle(0, 1);
    }
}


export default function run_tests() {
    Object.entries(tests).forEach(([desc, f]) => {
        process.stdout.write((f() ? ":) " : " x ") + "- " + desc + "\n");
    })
}