import { getArgs } from './util';
import shortid from 'shortid';

export default class StyleBuilder {
  constructor(styles, opts = {}) {
    this.configure(opts);
    this.styles = styles;
    this.name = opts.name;
  }

  init(props, state, opts = {}) {
    this.configure(opts);
    this.props = props
    this.state = state
    this.styleResult = this.staticStyles(); // initially only static
    this.dependencyMap = new Map()
    this.typeMap = {
      any: new Set(),
      props: new Set(),
      state: new Set()
    }
    this.registerStyles();
    return this;
  }

  configure(opts) {
    if (opts.styles) {
      this.styles = opts.styles
    }
    // merge new computers
    this.computers = Object.assign(this.computers || {}, opts.computers || {})
    this.logger = opts.logger || console;
    this.logOn = opts.log
  }

  log(msg) {
    if (this.logOn) {
      this.logger.log(this.name, '::', msg);
    }
  }

  // TODO: find functions in styles with no state/props dependency
  staticStyles() {
    return this.staticMap || {};
  }

  registerStyles(styles) {
    styles = styles || this.styles
    // iterate all functions of styles Object
    for (let style in styles) {
      var args = getArgs(styles[style]);
      this.registerDependencies(style, args)
    }
  }

  // We have two different dependency maps
  // one keyed per type, one per name
  // ie. to allow styleObj.state
  registerDependencies(name, propertyNames) {
    this.dependencyMap.set(name, propertyNames)

    if (propertyNames.length == 0) {
      this.staticMap = this.staticMap || {};
      this.staticMap[name] = this.styles[name]();
      return this.typeMap.static.add(name) // list
    }

    if (propertyNames.length == 2) {
      return this.typeMap.any.add(name) // list
    }

    for (let prop of propertyNames) {
      this.typeMap[prop].add(name) // list
    }
  }

  computerFor(type) {
    return this.computers[type].bind(this);
  }

  computeFor(type) {
    return this.computerFor(type) || this.default
  }

  default(props, state) {
    this.log('default', state, props);
    state = state || this.state;
    props = props || this.props;
    return this.compute(state, props)
  }

  compute(state, props) {
    if (!this.stateDiff(state) && !this.propsDiff(props)) {
      this.log('abort compute');
      return null;
    }

    let result = this.computeStyles(state, props)

    if (this.stateDiff(state)) {
      this.state = state
      // hack to avoid infinite recursion
      this.state.stylesKey = shortid.generate();
    }

    if (this.propsDiff(props)) {
      this.props = props;
    }
    return result
  }

  stateDiff(state) {
    this.log('stateDiff', this.state, state);
    if (this.state && this.state.stylesKey) {
      if (this.state.stylesKey === state.stylesKey) {
        this.log('matching stylesKey', this.state.stylesKey, state.stylesKey);
        return false;
      }
    }

    return this.state !== state
  }

  propsDiff(props) {
    // console.log('propsDiff', this.props, props);
    // hack to avoid infinite recursion
    return this.props !== props
  }

  bothDiff(state, props) {
    return this.stateDiff(state) && this.propsDiff(props)
  }

  anyDiff(state, props) {
    return this.stateDiff(state) || this.propsDiff(props)
  }

  computeStyles(state, props) {
    this.log('computeStyles', state, props);

    // ignore static styles
    // ie. styleObj.static

    // https://esdiscuss.org/topic/es6-iteration-over-object-values
    // https://www.pandastrike.com/posts/20150717-iterators

    if (this.anyDiff(state, props)) {
      this.log('compute on anyDiff');
      for (let key of this.typeMap.any) {
        let styleFun = this.styles[key]
        // check state/props dependency and only call if either one changed
        // res = styleFun({state: state, props: props})
        let res = styleFun(state, props);
        this.styleResult[key] = res
      }
    }

    // for this to work, each entry should be a Map, not just an Object!
    // should compare pointer of prev state (assume immutable)
    if (this.stateDiff(state)) {
      this.log('compute on stateDiff', this.styles);
      for (let key of this.typeMap.state) {
        let styleFun = this.styles[key]
        let style = styleFun(state);
        // console.log('style', key, style)
        // check state/props dependency and only call if either one changed
        this.styleResult[key] = style
      }
    }

    if (this.propsDiff(props)) {
      this.log('compute on propsDiff');
      // should compare pointer of prev props (assume immutable)
      for (let key of this.typeMap.props) {
        let styleFun = this.styles[key]
        // check state/props dependency and only call if either one changed
        this.styleResult[key] = styleFun(props)
      }
    }
    this.log('styleResult', this.styleResult);
    return this.styleResult
  }
}

StyleBuilder.create = function(styles, opts = {}) {
  let styleBuilder = new StyleBuilder(styles, opts);
  return styleBuilder;
}
