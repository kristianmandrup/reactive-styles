import { BaseStylesTransformer } from '../transformers';
import { StyleResultHandler } from './handler';
import { isFun } from '../utils';
export class StylesComputer {
    constructor(styler, options) {
        this.styler = styler;
        options = options || {};
        this.options = options;
        this.propsOnly = !!options.propsOnly;
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
        this.prepareStyler();
        const transformed = this.transform(this.styleResult());
        this.handler.onTransformedStyleResults(transformed);
        this.results.transformed = transformed;
        return transformed;
    }
    prepareStyler() {
        if (this.styler.configure) {
            this.styler.configure(this.opts);
        }
    }
    get uniqueStyleClasses() {
        return Array.from(new Set(this.styler.styleClasses));
    }
    get stylerKeys() {
        return Object.keys(this.styler);
    }
    get styleClasses() {
        return this.styler.styleClasses ? this.uniqueStyleClasses : this.stylerKeys;
    }
    styleResult() {
        const styles = this.styleClasses.reduce(this.styleGenerator, {});
        this.handler.onStyleResults(styles);
        this.results.styles = styles;
        return styles;
    }
    // do any final transformation if transformer is set
    transform(result) {
        return this.transformer ? this.transformer.transform(result) : result;
    }
    callStylerFunction(styleFun, opts) {
        if (!isFun(styleFun))
            return null;
        return this.propsOnly ? styleFun(opts.props) : styleFun(opts);
    }
    /**
     *
     * @param result
     * @param key
     */
    styleGenerator(result, key) {
        const styleFun = this.styler[key];
        let styleResult = this.callStylerFunction(styleFun, this.opts);
        if (styleResult) {
            result[key] = styleResult;
        }
        this.handler.onStyleResult(result);
        return result;
    }
}
//# sourceMappingURL=computer.js.map