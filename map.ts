import { Graph } from "./graph.ts";
import { Heap } from "./heap.ts";
import SMap, { s_eq } from "./smap.ts";

export type Point2 = [number, number]

type ShortestPathsData = { dist: number, parent: Point2 | null };
type ShortestPathsResult = SMap<Point2, ShortestPathsData>;
type Path = Point2[];

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

	str_map(): string[][] {
		const i = Array(this.size).fill(undefined);
		return i.map((_, y) => i.map((_, x) => this.is_obstacle([x, y]) ? "#" : "."));
	}

	print_str_map(m : string[][]) {
		return m.map(r => r.join(" ") + "\n").join("");
	}

	print_pretty(): string {
		return this.print_str_map(this.str_map());
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

	print_shortest_paths(s : ShortestPathsResult) : string {
		const m = this.str_map();
		for(const [[x, y], d] of s.entries()) {
			if(d.dist !== Infinity) {
				m[y][x] = d.dist.toString();
			}
		}
		return this.print_str_map(m);
	}

	bfs_spsp(source: Point2, dest: Point2) : Path {
		const r = this.bfs_sssp(source);
		const dest_d = r.get(dest);
		if(!dest_d) throw new Error("Destination not reachable from source");
		let v = dest_d;
		let a = [dest];
		while(v.dist !== 0) {
			a.unshift(v.parent!);
			v = r.get(v.parent!)!;
		}
		return a;
	}

	print_shortest_path(path: Path) : string {
		const m = this.str_map();
		path.forEach(([x, y], i) => {
			m[y][x] = i.toString();
		});
		return this.print_str_map(m);
	}

	dijkstra(source: Point2) : ShortestPathsResult {
		const m = new SMap<Point2, { dist : number, parent : Point2 | null }>();
		const get = (v: Point2) => m.get(v)!;
		for(const [point, _weight] of this.vertices) {
			m.set(point, { dist: s_eq(point, source) ? 0 : Infinity, parent: null });
		}
		const q = new Heap<Point2>((a: Point2, b: Point2) => get(a).dist < get(b).dist);
		q.push(source);

		let u; while(u = q.pop_min()) {
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

	wfs(
		source: Point2,
		heuristic: (
			map: this,
			point: Point2,
			m: SMap<Point2, { dist : number, parent : Point2 | null }>) => number
	) : ShortestPathsResult {
		const m = new SMap<Point2, { dist : number, parent : Point2 | null }>();
		const get = (v: Point2) => m.get(v)!;
		for(const [point, _weight] of this.vertices) {
			m.set(point, { dist: s_eq(point, source) ? 0 : Infinity, parent: null });
		}
		const q = new Heap<Point2>((a: Point2, b: Point2) => heuristic(this, a, m) < heuristic(this, b, m));
		q.push(source);

		let u; while(u = q.pop_min()) {
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
