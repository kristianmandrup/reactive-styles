class Diff {
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
}
//# sourceMappingURL=index.js.map