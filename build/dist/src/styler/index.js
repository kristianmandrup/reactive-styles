import { styleHelpers } from './helpers';
export { styleHelpers };
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
//# sourceMappingURL=index.js.map