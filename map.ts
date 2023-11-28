import { Graph } from "./graph.ts";
import SMap, { s_eq } from "./smap.ts";

export type Point2 = [number, number]

type ShortestPathsData = { dist: number, parent: Point2 | null };
type ShortestPathsResult = SMap<Point2, ShortestPathsData>;

const print_shortest_paths = (s : ShortestPathsResult) => {
	let v : Record<number, [number, ShortestPathsData][]> = {};
	for(const [[x, y], d] of s.entries()) {
		(v[x] ?? (v[x] = [])).push([y, d]);
	}
	for(const [_, d] of Object.entries(v)
		.sort((a, b) => Number(a[0]) - Number(b[0]))) {
		process.stdout.write(d
			.sort((a, b) => a[0] - b[0])
			.map(d => d[1].dist)
			.join(" ")
			+ "\n"
		);
	}
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
			const [x, y] = i;
			this.add_obstacle(x, y);
		}
	}

	print_pretty(): void {
		for (let y of Array(this.size).fill(this.size - 1).map((x, y) => x - y)) {
			for (let x of Array(this.size).fill(this.size - 1).map((x, y) => x + y)) {
				if (this.is_obstacle(x, y)) {
					process.stdout.write("# ");
				} else {
					process.stdout.write(". ");
				}
			}
			process.stdout.write("\n");
		}
	}

	add_obstacle(x: number, y: number): void {
		this.delete_vertex([x, y]);
	}

	remove_obstacle(x: number, y: number): void {
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

	is_obstacle(x: number, y: number): boolean {
		return this.vertices.get([x, y]) === undefined;
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
