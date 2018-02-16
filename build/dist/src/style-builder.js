import { getArgs } from './util';
import * as shortid from 'shortid';
var StyleBuilder = /** @class */ (function () {
    function StyleBuilder(styles, opts) {
        if (opts === void 0) { opts = {}; }
        this.configure(opts);
        this.styles = styles;
        this.name = opts.name;
    }
    // factory
    StyleBuilder.create = function (styles, opts) {
        if (opts === void 0) { opts = {}; }
        var styleBuilder = new StyleBuilder(styles, opts);
        return styleBuilder;
    };
    StyleBuilder.prototype.init = function (opts) {
        if (opts === void 0) { opts = {}; }
        var props = opts.props, state = opts.state;
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
    };
    StyleBuilder.prototype.configure = function (opts) {
        if (opts === void 0) { opts = {}; }
        if (opts.styles) {
            this.styles = opts.styles;
        }
        // merge new computers
        this.computers = Object.assign(this.computers || {}, opts.computers || {});
        this.logger = opts.logger || console;
        this.logOn = opts.log;
    };
    StyleBuilder.prototype.log = function (msg, data) {
        if (!this.logOn)
            return;
        data ? this.logger.log(this.name, '::', msg, data) : this.logger.log(this.name, '::', msg);
    };
    // TODO: find functions in styles with no state/props dependency
    StyleBuilder.prototype.staticStyles = function () {
        return this.staticMap || {};
    };
    StyleBuilder.prototype.registerStyles = function (styles) {
        styles = styles || this.styles;
        // iterate all functions of styles Object
        for (var style in styles) {
            var args = getArgs(styles[style]);
            this.registerDependencies(style, args);
        }
    };
    // We have two different dependency maps
    // one keyed per type, one per name
    // ie. to allow styleObj.state
    StyleBuilder.prototype.registerDependencies = function (name, propertyNames) {
        this.dependencyMap.set(name, propertyNames);
        if (propertyNames.length == 0) {
            this.staticMap = this.staticMap || {};
            this.staticMap[name] = this.styles[name]();
            return this.typeMap.static.add(name); // list
        }
        if (propertyNames.length == 2) {
            return this.typeMap.any.add(name); // list
        }
        for (var _i = 0, propertyNames_1 = propertyNames; _i < propertyNames_1.length; _i++) {
            var prop = propertyNames_1[_i];
            this.typeMap[prop].add(name); // list
        }
    };
    StyleBuilder.prototype.computerFor = function (type) {
        return this.computers[type];
    };
    StyleBuilder.prototype.computeFor = function (type) {
        return (this.computerFor(type) || this.default).bind(this);
    };
    StyleBuilder.prototype.default = function (opts) {
        if (opts === void 0) { opts = {}; }
        var props = opts.props, state = opts.state;
        this.log('default', opts);
        state = state || this.state;
        props = props || this.props;
        return this.compute({ state: state, props: props });
    };
    StyleBuilder.prototype.compute = function (opts) {
        if (opts === void 0) { opts = {}; }
        var props = opts.props, state = opts.state;
        if (!this.stateDiff(state) && !this.propsDiff(props)) {
            this.log('abort compute');
            return null;
        }
        var result = this.computeStyles({ state: state, props: props });
        if (this.stateDiff(state)) {
            this.state = state;
            // hack to avoid infinite recursion
            this.state.stylesKey = shortid.generate();
        }
        if (this.propsDiff(props)) {
            this.props = props;
        }
        return result;
    };
    StyleBuilder.prototype.stateDiff = function (state) {
        var $state = this.state;
        var stylesKey = state.stylesKey;
        var $stylesKey = ($state || {}).stylesKey;
        this.log('stateDiff', { $state: $state, state: state });
        if ($stylesKey === stylesKey) {
            this.log('matching stylesKey', {
                $stylesKey: $stylesKey,
                stylesKey: stylesKey
            });
            return false;
        }
        return $state !== state;
    };
    StyleBuilder.prototype.propsDiff = function (props) {
        // console.log('propsDiff', this.props, props);
        // hack to avoid infinite recursion
        return this.props !== props;
    };
    StyleBuilder.prototype.bothDiff = function (opts) {
        if (opts === void 0) { opts = {}; }
        var props = opts.props, state = opts.state;
        return this.stateDiff(state) && this.propsDiff(props);
    };
    StyleBuilder.prototype.anyDiff = function (opts) {
        if (opts === void 0) { opts = {}; }
        var props = opts.props, state = opts.state;
        return this.stateDiff(state) || this.propsDiff(props);
    };
    StyleBuilder.prototype.computeStyles = function (opts) {
        var _this = this;
        if (opts === void 0) { opts = {}; }
        var props = opts.props, state = opts.state;
        this.log('computeStyles', opts);
        // ignore static styles
        // ie. styleObj.static
        // https://esdiscuss.org/topic/es6-iteration-over-object-values
        // https://www.pandastrike.com/posts/20150717-iterators
        if (this.anyDiff(opts)) {
            this.log('compute on anyDiff');
            var keys = Array.from(this.typeMap.any);
            keys.map(function (key) {
                var styleFun = _this.styles[key];
                // check state/props dependency and only call if either one changed
                // res = styleFun({state: state, props: props})
                var res = styleFun(opts);
                _this.styleResult[key] = res;
            });
        }
        // for this to work, each entry should be a Map, not just an Object!
        // should compare pointer of prev state (assume immutable)
        if (this.stateDiff(state)) {
            this.log('compute on stateDiff', this.styles);
            var keys = Array.from(this.typeMap.state);
            keys.map(function (key) {
                var styleFun = _this.styles[key];
                var style = styleFun(state);
                // console.log('style', key, style)
                // check state/props dependency and only call if either one changed
                _this.styleResult[key] = style;
            });
        }
        if (this.propsDiff(props)) {
            this.log('compute on propsDiff');
            // should compare pointer of prev props (assume immutable)
            var keys = Array.from(this.typeMap.props);
            keys.map(function (key) {
                var styleFun = _this.styles[key];
                // check state/props dependency and only call if either one changed
                _this.styleResult[key] = styleFun(props);
            });
        }
        this.log('styleResult', this.styleResult);
        return this.styleResult;
    };
    return StyleBuilder;
}());
export { StyleBuilder };
//# sourceMappingURL=style-builder.js.map