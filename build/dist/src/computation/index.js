class Computation {
    computerFor(type) {
        return this.computers[type];
    }
    computeFor(type) {
        return (this.computerFor(type) || this.default).bind(this);
    }
    compute(opts = {}) {
        const { props, state } = opts;
        if (!this.stateDiff(state) && !this.propsDiff(props)) {
            this.log('abort compute');
            return null;
        }
        let result = this.computeStyles({ state, props });
        if (this.stateDiff(state)) {
            this.state = state;
            // hack to avoid infinite recursion
            this.state.stylesKey = shortid.generate();
        }
        if (this.propsDiff(props)) {
            this.props = props;
        }
        return result;
    }
}
//# sourceMappingURL=index.js.map