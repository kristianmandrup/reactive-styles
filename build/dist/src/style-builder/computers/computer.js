import { BaseStylesTransformer } from '../transformers';
import { StyleResultHandler } from './handler';
export class StylesComputer {
    constructor(styles, options) {
        this.styles = styles;
        options = options || {};
        this.options = options;
        this.transformer = options.transformer || this.defaultTransformer;
        this.transformer.configure(options);
        this.handler = options.handler || this.defaultHandler;
    }
    get defaultTransformer() {
        return new BaseStylesTransformer();
    }
    get defaultHandler() {
        return new StyleResultHandler();
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
        this.opts = opts;
        const transformed = this.transform(this.styleResult());
        this.handler.onTransformedStyleResults(transformed);
        this.results.transformed = transformed;
        return transformed;
    }
    styleResult() {
        const styles = Object.keys(this.styles).reduce(this.styleGenerator, {});
        this.handler.onStyleResults(styles);
        this.results.styles = styles;
        return styles;
    }
    // do any final transformation if transformer is set
    transform(result) {
        return this.transformer ? this.transformer.transform(result) : result;
    }
    /**
     *
     * @param result
     * @param key
     */
    styleGenerator(result, key) {
        const styleFun = this.styles[key];
        let res = styleFun(this.opts);
        result[key] = res;
        this.handler.onStyleResult(result);
        return result;
    }
}
//# sourceMappingURL=computer.js.map