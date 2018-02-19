import { StylesComputer, } from './computers';
export { StylesComputer, };
export { StyleResultHandler } from './computers';
export { BaseStylesTransformer, ToObjsStylesTransformer } from './transformers';
export function createStylesBuilder(styles, opts) {
    return StylesBuilder.create(styles, opts);
}
export class StylesBuilder {
    constructor(styles, opts) {
        opts = opts || {};
        styles = typeof styles === 'function' ? new styles() : styles;
        this.styles = styles;
        this.name = styles.name || opts.name || this.defaultName;
        this.computer = this.buildComputer(opts) || this.defaultComputer;
    }
    buildComputer(opts) {
        return this.createComputer(opts) || this.createComputerFromClass(opts);
    }
    createComputer(opts) {
        return opts.createComputer && opts.createComputer(this, opts);
    }
    createComputerFromClass(opts) {
        return opts.computerClass && new opts.computerClass(this, opts);
    }
    /**
     * Name to be used for logging, debugging etc
     */
    get defaultName() {
        return this.constructor.name;
    }
    /**
     * Factory
     * @param styles
     * @param opts
     */
    static create(styles, opts = {}) {
        return new StylesBuilder(styles, opts);
    }
    /**
     * Default computr to be used
     */
    get defaultComputer() {
        return new StylesComputer(this.styles);
    }
    /**
     * Use a Styles Computer to compute new styles
     * @param opts
     */
    compute(opts) {
        return this.computer.compute(opts);
    }
}
//# sourceMappingURL=index.js.map