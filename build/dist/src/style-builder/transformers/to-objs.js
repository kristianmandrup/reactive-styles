import { BaseStylesTransformer } from './base';
function isFun(fun) {
    return typeof fun === 'function';
}
export class ToObjsStylesTransformer extends BaseStylesTransformer {
    constructor(opts) {
        super(opts);
        this.opts = opts;
    }
    configure(opts) {
        // overrides
        if (isFun(opts.flatten)) {
            this.flatten = opts.flatten;
        }
        if (isFun(opts.shouldFlatten)) {
            this.shouldFlatten = opts.shouldFlatten;
        }
    }
    /**
     * Transform computed styles into final styles
     * @param styles
     */
    transform(styles) {
        this.styles = styles;
        return Object.keys(this.styles).reduce(this.arraysToObj, {});
    }
    /**
     * Flatten an item by merging into accumulator object
     * @param acc
     * @param item
     */
    _flattenItem(acc, item) {
        Object.assign(acc, ...item);
    }
    /**
     * Flatten a list
     * @param list
     * @param key
     */
    flatten(list, key) {
        return list.reduce((acc, item) => {
            return this._flattenItem(acc, item);
        }, {});
    }
    /**
     * Determine if we should flatten the list for this key (style class)
     * @param key
     * @param list
     */
    shouldFlatten(key, list) {
        return false;
    }
    /**
     * Converts arrays to object if configured to do so
     * @param result
     * @param key
     */
    arraysToObj(result, key) {
        const value = this.styles[key];
        const obj = Array.isArray(value) ? this.flatten(value, key) : value;
        return obj;
    }
}
//# sourceMappingURL=to-objs.js.map