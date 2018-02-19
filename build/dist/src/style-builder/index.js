import { StylesComputer } from './computers';
export function createStyleBuilder(styles, opts) {
    return StyleBuilder.create(styles, opts);
}
export class StyleBuilder {
    constructor(styles, opts) {
        opts = opts || {};
        styles = typeof styles === 'function' ? new styles() : styles;
        this.styles = styles;
        this.name = styles.name || opts.name || this.defaultName;
        this.computer = opts.computer || this.defaultComputer;
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
        return new StyleBuilder(styles, opts);
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