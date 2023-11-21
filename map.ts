import { Graph } from "./graph.ts";

type Point2 = [number, number]

export class Map<TKey, TValue> extends Graph<TKey, TValue> {
    size: number
    constructor(n: number, obstacles: Point2[] = []) {
	this.size = n
	this.add_vertex(k:[0,0],v:0)
	
	for (const i of [...Array(size-1).keys()]) {
	    this.add_vertex(k:[i+1,0],v:0, neighbors:[[i,0]])
	}

	for (const i of [...Array(size-1).keys()]) {
	    this.add_vertex(k:[0,i+1],v:0, neighbors:[[0,i]])      
	}

	for (const i of [...Array(size-1).keys()]) {
	    for (const j of [...Array(size-1).keys()]) {
		this.add_vertex(k: [i+1,j+1], v: 0, neighbors:[[i,j+1],[i+1,j]])
	    }   
	}
	for (const i of obstacles){
	    [x,y] = i
	    add_obstacle(x, y)
	}
	
        super();
    }

    print_pretty() : void {
	for(let  y of Array(this.size).fill(this.size-1).map((x, y) => x - y)){
	    for(let x of Array(this.size).fill(this.size-1).map((x,y) => x + y)){
		if(this.is_obstacle(x,y)){
		    process.stdout.write("# ")
		}
		else{
		    process.stdout.write(". ")
		}
	    }
	    process.stdout.write("\n")
	}
    }
    
    add_obstacle(x: number, y: number) : void {
	this.delete_vertex(x,y)
    }

    remove_obstacle(x: number, y: number) : void {
        this.add_vertex([x,y], 0)
	if(x !== 0){
	    add_edge([x,y],[x-1,y],1)
	}
	if(y !== 0){
	    add_edge([x,y],[x,y-1],1)
	}
	if(x !== size){
	    add_edge([x,y],[x+1,y],1)
	}
	if(y !== size){
	    add_edge([x,y],[x,y+1],1)
	}
    }

    is_obstacle(x: number, y: number) : boolean {
	if(this.vertices.get(x,y) !== undefined){
	    return true
	}
	return false
}
