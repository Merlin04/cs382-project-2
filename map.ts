import { Graph } from "./graph.ts";
import SMap, { s_eq } from "./smap.ts";

export type Point2 = [number, number]

type ShortestPathsData = { dist: number, parent: Point2 | null };
type ShortestPathsResult = SMap<Point2, ShortestPathsData>;

export const print_shortest_paths = (s : ShortestPathsResult) : string => {
	let v : Record<number, [number, ShortestPathsData][]> = {};
	for(const [[x, y], d] of s.entries()) {
		(v[y] ?? (v[y] = [])).push([x, d]);
	}
	let res = "";
	for(const [_, d] of Object.entries(v)
		.sort((a, b) => Number(a[0]) - Number(b[0]))) {
		const r = d.sort((a, b) => a[0] - b[0]);
		res += Array.from({ length: r.at(-1)![0] + 1 }, (_, y) =>
			r.find(v => v[0] === y)?.[1].dist ?? " "
		).join("\t") + "\n";
	}
	return res;
};

// can't conflict with builtin Map class
export class GMap extends Graph<Point2, number> {
	size: number;

	constructor(n: number, obstacles: Point2[] = []) {
		super();

		this.size = n;
		this.add_vertex([0, 0], 0);

		for (const i of [...Array(this.size - 1).keys()]) {
			this.add_vertex([i + 1, 0], 0, [[i, 0]]);
		}

		for (const i of [...Array(this.size - 1).keys()]) {
			this.add_vertex([0, i + 1], 0, [[0, i]]);
		}

		for (const i of [...Array(this.size - 1).keys()]) {
			for (const j of [...Array(this.size - 1).keys()]) {
				this.add_vertex([i + 1, j + 1], 0, [[i, j + 1], [i + 1, j]]);
			}
		}
		for (const i of obstacles) {
			this.add_obstacle(i);
		}
	}

	print_pretty(): string {
		const i = Array(this.size).fill(undefined);
		return i.map((_, y) => i.map((_, x) =>
			this.is_obstacle([x, y]) ? "#" : ".").join(" ") + "\n").join("");
	}

	add_obstacle(p: Point2): void {
		this.delete_vertex(p);
	}

	remove_obstacle([x, y]: Point2): void {
		this.add_vertex([x, y], 0);
		if (x !== 0) {
			this.add_edge([x, y], [x - 1, y], 1);
		}
		if (y !== 0) {
			this.add_edge([x, y], [x, y - 1], 1);
		}
		if (x !== this.size) {
			this.add_edge([x, y], [x + 1, y], 1);
		}
		if (y !== this.size) {
			this.add_edge([x, y], [x, y + 1], 1);
		}
	}

	is_obstacle(p: Point2): boolean {
		return this.vertices.get(p) === undefined;
	}

	bfs_sssp(source: Point2) : ShortestPathsResult {
		const m = new SMap<Point2, { dist : number, parent : Point2 | null }>();
		const get = (v: Point2) => m.get(v)!;
		for(const [point, _weight] of this.vertices) {
			m.set(point, { dist: s_eq(point, source) ? 0 : Infinity, parent: null });
		}
		const q = [source];

		let u; while(u = q.shift()) {
			for(const v of this.get_adj(u)) {
				if(get(v).dist === Infinity) {
					get(v).dist = get(u).dist + 1;
					get(v).parent = u;
					q.push(v);
				}
			}
		}

		return m;
	}
}
