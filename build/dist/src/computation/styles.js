class StyleComputation {
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
//# sourceMappingURL=styles.js.map