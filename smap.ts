// serialized map so we can compare keys by serialized form instead of instances
export default class SMap<TKey, TValue> implements Map<TKey, TValue> {
    private m : Map<string, TValue>;
    constructor() {
        this.m = new Map<string, TValue>();
    }

    get(key : TKey) {
        return this.m.get(JSON.stringify(key));
    }

    set(key: TKey, value: TValue): this {
        this.m.set(JSON.stringify(key), value);
        return this;
    }

    has(key: TKey): boolean {
        return this.m.has(JSON.stringify(key));
    }

    delete(key: TKey): boolean {
        return this.m.delete(JSON.stringify(key));
    }

    entries(): IterableIterator<[TKey, TValue]> {
        const entries = this.m.entries();
        return (function*() {
            for (const [k, v] of entries) {
                yield [JSON.parse(k), v];
            }
        })();
    }

    forEach(callbackfn: (value: TValue, key: TKey, map: Map<TKey, TValue>) => void, thisArg?: any) {
        this.m.forEach((v: TValue, k: string) =>
            callbackfn(v, JSON.parse(k), this), thisArg);
    }

    keys(): IterableIterator<TKey> {
        const keys = this.m.keys();
        return (function*() {
            for (const k of keys) {
                yield JSON.parse(k);
            }
        })();
    }

    values(): IterableIterator<TValue> {
        return this.m.values();
    }

    get size(): number {
        return this.m.size;
    }

    clear() {
        this.m.clear();
    }

    [Symbol.iterator](): IterableIterator<[TKey, TValue]> {
        return this.entries();
    }

    [Symbol.toStringTag] = "SMap";
}