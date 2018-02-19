export class StyleBuilder {
    constructor(styles, opts = {}) {
        this.configure(opts);
        this.styles = styles;
        this.name = opts.name;
    }
    // factory
    static create($styles, opts = {}) {
        const styles = typeof $styles === 'function' ? new $styles() : $styles;
        return new StyleBuilder(styles, opts);
    }
    init(opts = {}) {
        const { props, state } = opts;
        this.configure(opts);
        this.props = props;
        this.state = state;
        this.styleResult = this.staticStyles(); // initially only static
        this.dependencyMap = new Map();
        this.typeMap = {
            any: new Set(),
            props: new Set(),
            state: new Set()
        };
        this.registerStyles();
        return this;
    }
    configure(opts = {}) {
        if (opts.styles) {
            this.styles = opts.styles;
        }
        // merge new computers
        this.computers = Object.assign(this.computers || {}, opts.computers || {});
        this.logger = opts.logger || console;
        this.logOn = !!opts.log;
    }
    log(msg, data) {
        if (!this.logOn)
            return;
        data ? this.logger.log(this.name, '::', msg, data) : this.logger.log(this.name, '::', msg);
    }
    staticStyles() {
        return this.staticMap || {};
    }
    computerFor(type) {
        return this.computers[type];
    }
    computeFor(type) {
        return (this.computerFor(type) || this.default).bind(this);
    }
    default(opts = {}) {
        let { props, state } = opts;
        this.log('default', opts);
        state = state || this.state;
        props = props || this.props;
        return this.compute({ state, props });
    }
    stateDiff(state) {
        const $state = this.state;
        const { stylesKey } = state;
        const $stylesKey = ($state || {}).stylesKey;
        this.log('stateDiff', { $state, state });
        if ($stylesKey === stylesKey) {
            this.log('matching stylesKey', {
                $stylesKey,
                stylesKey
            });
            return false;
        }
        return $state !== state;
    }
    propsDiff(props) {
        // console.log('propsDiff', this.props, props);
        // hack to avoid infinite recursion
        return this.props !== props;
    }
    bothDiff(opts = {}) {
        const { props, state } = opts;
        return this.stateDiff(state) && this.propsDiff(props);
    }
    anyDiff(opts = {}) {
        const { props, state } = opts;
        return this.stateDiff(state) || this.propsDiff(props);
    }
    computeStyles(opts = {}) {
        const { props, state } = opts;
        this.log('computeStyles', opts);
        // ignore static styles
        // ie. styleObj.static
        // https://esdiscuss.org/topic/es6-iteration-over-object-values
        // https://www.pandastrike.com/posts/20150717-iterators
        if (this.anyDiff(opts)) {
            this.log('compute on anyDiff');
            const keys = Array.from(this.typeMap.any);
            keys.map((key) => {
                let styleFun = this.styles[key];
                // check state/props dependency and only call if either one changed
                // res = styleFun({state: state, props: props})
                let res = styleFun(opts);
                this.styleResult[key] = res;
            });
        }
        // for this to work, each entry should be a Map, not just an Object!
        // should compare pointer of prev state (assume immutable)
        if (this.stateDiff(state)) {
            this.log('compute on stateDiff', this.styles);
            const keys = Array.from(this.typeMap.state);
            keys.map((key) => {
                let styleFun = this.styles[key];
                let style = styleFun(state);
                // console.log('style', key, style)
                // check state/props dependency and only call if either one changed
                this.styleResult[key] = style;
            });
        }
        if (this.propsDiff(props)) {
            this.log('compute on propsDiff');
            // should compare pointer of prev props (assume immutable)
            const keys = Array.from(this.typeMap.props);
            keys.map((key) => {
                let styleFun = this.styles[key];
                // check state/props dependency and only call if either one changed
                this.styleResult[key] = styleFun(props);
            });
        }
        this.log('styleResult', this.styleResult);
        return this.styleResult;
    }
}
//# sourceMappingURL=style-builder.js.map