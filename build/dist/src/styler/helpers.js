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
//# sourceMappingURL=helpers.js.map