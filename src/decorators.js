// @updateStyles
export function updateStyles(target, name, descriptor) {
  let oldHandler = target
  // console.log('updateStyles', target, name);

  function updateStyler(nextProps, nextState) {
    // console.log('updateStyler', this);
    if (name === 'componentWillMount') {
      this.initStyles(nextProps, nextState);
    } else {
      if (nextProps || nextState) {
        this.updateStyles(nextProps, nextState);
      }
    }
    oldHandler.apply(this, arguments)
  }

  if (typeof target === 'function') {
    return updateStyler
  }

  oldHandler = descriptor.value
  descriptor.value = updateStyler //.bind(target);

  // console.log('descriptor', descriptor);
  return descriptor
}

// @statefulStyles('native')
export function statefulStyling(type, styleBuilder) {
  return function(target) {
    // console.log('statefulStyling', target)
    // add function updateStyles to target (class ie. prototype)
    target.prototype.updateStyles = function(nextProps, nextState) {
      // console.log('updateStyles', nextProps, nextState, type);
      if (nextProps || nextState) {
        var styles = this.styler.computeFor(type)(nextProps, nextState);
        // if styles changed, update
        if (styles && Object.keys(styles).length) {
          // console.log('set styles', styles);
          this.setState({styles: styles});
        }
      }

      target.prototype.updateState = function(state) {
        // console.log('!!!updateState', state);
        this.state.stylesKey = '';
        this.setState(state);
      }
    }

    target.prototype.initStyles = function(nextProps, nextState) {
      // console.log('initStyles', nextProps || this.props, nextState || this.state);
      this.styler = styleBuilder.init(nextProps, nextState);
      this.updateStyles(nextProps, nextState);
    }

    return target
  }
}