import { Graph } from "./graph.ts";

type Point2 = [number, number]

export class Map<TKey, TValue> extends Graph<TKey, TValue> {
    constructor(n: number, obstacles: Point2[] = []) {
        throw "Unimplemented";
        super();
    }

    print_pretty() : void {
        throw "Unimplemented";
    }

    add_obstacle(x: number, y: number) : void {
        throw "Unimplemented";
    }

    remove_obstacle(x: number, y: number) : void {
        throw "Unimplemented";
    }

    is_obstacle(x: number, y: number) : boolean {
        throw "Unimplemented";
    }
}