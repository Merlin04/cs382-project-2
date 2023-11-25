import { Graph } from "./graph.ts";

type Point2 = [number, number]

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
		return this.vertices.get([x, y]) !== undefined;
	}
}
