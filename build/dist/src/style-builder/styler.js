export const styleHelpers = {
    toggle(value, truthyVal, falsyVal) {
        return value ? truthyVal : falsyVal;
    }
};
export class Styler {
    constructor(state, props) {
        this.state = state;
        this.props = props;
        this._ = styleHelpers;
    }
}
//# sourceMappingURL=styler.js.map