class Computer {
    constructor(styles) {
    }
    /**
     * Returns a style object such as:
     * {
     *   heading: {
     *     color: 'black'
     *     // // more ...
     *   },
     *   title: {
     *     color: blue,
     *     // more ...
     *   }
     * }
     * @param opts
     */
    compute(opts = {}) {
        const generate = this.createGenerator(opts);
        const result = Object.keys(this.styles).reduce(generate, {});
        this.transform(result);
        return result;
    }
    // do any final transformation
    transform(result) {
        return result;
    }
    transformToObjs(styles) {
        function arrayToObj(list) {
            return list.reduce((acc, item) => {
                return Object.assign(acc, ...item);
            }, {});
        }
        function arraysToObj(result, key) {
            const value = styles[key];
            const obj = Array.isArray(value) ? arrayToObj(value) : value;
            return obj;
        }
        return Object.keys(styles).reduce(arraysToObj, {});
    }
    createGenerator(opts = {}) {
        const { props, state, } = opts;
        return (result, key) => {
            const styleFun = this.styles[key];
            let res = styleFun({ state, props });
            result[key] = res;
            return result;
        };
    }
}
//# sourceMappingURL=computer.js.map