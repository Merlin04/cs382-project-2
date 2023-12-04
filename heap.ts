export class Heap<T> {
    private values: Array<T>;
    private lt: (a: T, b: T) => boolean;

    get length(): number {
        return this.values.length;
    }

    constructor(cmp: (a: T, b: T) => boolean) {
        this.values = [];
        this.lt = cmp;
    }

    push(x: T) {
        this.values.push(x);
        this.shift_up();
    }

    peek_min(): T | undefined {
        return this.values.at(0);
    }

    pop_min(): T | undefined {
        if (this.values.length === 1) {
            return this.values.pop();
        }
        const val = this.values.at(0);
        const pop = this.values.pop();
        if (pop !== undefined) {
            this.values[0] = pop;
            this.shift_down();
        }
        return val;
    }

    shift_down(i: number = 0) {
        // Start by dealing with out-of-bounds cases
        if (2*i+1 >= this.length) {
            return;
        } else if (2*i+2 >= this.length) {
            if (this.lt(this.values[2*i+1], this.values[i])) {
                [this.values[i], this.values[2*i+1]] = [this.values[2*i+1], this.values[i]];
                // No need to recurse here since we know this is the last value
            }
            return;
        }
        if (this.lt(this.values[2*i+1], this.values[i])
            || this.lt(this.values[2*i+2], this.values[i])) {
            let idx = this.lt(this.values[2*i+1], this.values[2*i+2]) ? 2*i+1 : 2*i+2;
            [this.values[i], this.values[idx]] = [this.values[idx], this.values[i]];
            this.shift_down(idx);
        }
    }

    shift_up(n: number | null = null) {
        const i = n ?? this.length - 1;
        if (i === 0) {
            return;
        }
        let parent = Math.floor((i-1)/2);
        if (this.lt(this.values[i], this.values[parent])) {
            [this.values[i], this.values[parent]] = [this.values[parent], this.values[i]];
            this.shift_up(parent);
        }
    }
}
