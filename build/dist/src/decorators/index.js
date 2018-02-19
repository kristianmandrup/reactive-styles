export function styleClass(target, name, descriptor) {
    target.$styles = target.styles || [];
    target.$styles.push(name);
    return descriptor;
}
// @updateStyles
export function updateStyles(target, name, descriptor) {
    let oldHandler = target;
    function updateStyler(nextProps, nextState) {
        // requires that component has an updateStyles method
        if (!target._computeNewStyles) {
            console.error('@updateStyles error: missing _computeNewStyles method on Component', target);
        }
        target._computeNewStyles(nextProps, nextState);
        oldHandler.apply(target, arguments);
    }
    if (typeof target === 'function') {
        return updateStyler;
    }
    oldHandler = descriptor.value;
    descriptor.value = updateStyler;
    return descriptor;
}
export function styler(styleBuilder) {
    return function (target) {
        target.styler = styleBuilder;
    };
}
export function useStylers(styler, names) {
    return function (target) {
        const classStylers = names || styler.styleClasses || Object.keys(styler);
        classStylers.map((name) => {
            const classStyler = styler[name];
            if (typeof classStyler !== 'function')
                return;
            // create instance method on class that wraps call to standalone function
            target.prototype[name] = function () {
                const opts = { props: this.props, state: this.state };
                styler.callStylerFunction(classStyler, opts);
            };
        });
    };
}
export function reactiveStyles(styleBuilder) {
    return function (target) {
        target.styler = styleBuilder;
        // add function _computeNewStyles to target (class ie. prototype)
        target.prototype._computeNewStyles = function (nextProps, nextState) {
            this.styles = this.styler.compute({ props: nextProps, state: nextState });
        };
        const componentWillUpdateDescriptor = Object.getOwnPropertyDescriptor(target, 'componentWillUpdate');
        if (componentWillUpdateDescriptor) {
            updateStyles(target, 'componentWillUpdate', componentWillUpdateDescriptor);
        }
        return target;
    };
}
//# sourceMappingURL=index.js.map