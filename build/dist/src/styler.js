function resolveValues(truthyVal, falsyVal) {
    if (Array.isArray(truthyVal)) {
        return truthyVal;
    }
    return [truthyVal, falsyVal];
}
export const styleHelpers = {
    toggle(value, truthy, falsy) {
        const [t, f] = resolveValues(truthy, falsy);
        return value ? t : f;
    },
    eq(value, compareVal, truthy, falsy) {
        const [t, f] = resolveValues(truthy, falsy);
        return value == compareVal ? t : f;
    },
    neq(value, compareVal, truthy, falsy) {
        const [t, f] = resolveValues(truthy, falsy);
        return value !== compareVal ? t : f;
    },
    gt(value, compareVal, truthy, falsy) {
        const [t, f] = resolveValues(truthy, falsy);
        return value > compareVal ? t : f;
    },
    gte(value, compareVal, truthy, falsy) {
        const [t, f] = resolveValues(truthy, falsy);
        return value >= compareVal ? t : f;
    },
    lte(value, compareVal, truthy, falsy) {
        const [t, f] = resolveValues(truthy, falsy);
        return value <= compareVal ? t : f;
    },
    lt(value, compareVal, truthy, falsy) {
        const [t, f] = resolveValues(truthy, falsy);
        return value < compareVal ? t : f;
    }
};
export class Styler {
    constructor(opts) {
        this._ = styleHelpers;
        // only methods listed here will be used for styling classes
        this.styleClasses = [];
        this.configure(opts);
    }
    configure({ state, props }) {
        this.state = state;
        this.props = props;
    }
}
//# sourceMappingURL=styler.js.map