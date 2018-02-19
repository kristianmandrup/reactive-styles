export function styleClass(target: any, name: string, descriptor: PropertyDescriptor) {
  target.$styles = target.styles || []
  target.$styles.push(name)
  return descriptor
}




// @updateStyles
export function updateStyles(target: any, name: string, descriptor: PropertyDescriptor) {
  let oldHandler = target

  function updateStyler(nextProps: any, nextState: any) {
    // requires that component has an updateStyles method
    if (!target._computeNewStyles) {
      console.error('@updateStyles error: missing _computeNewStyles method on Component', target)
    }
    target._computeNewStyles(nextProps, nextState)
    oldHandler.apply(target, arguments)
  }

  if (typeof target === 'function') {
    return updateStyler
  }

  oldHandler = descriptor.value
  descriptor.value = updateStyler

  return descriptor
}

export function styler(styleBuilder: any) {
  return function (target: any) {
    target.styler = styleBuilder
  }
}

export function useStylers(styler: any, names?: string[]) {
  return function (target: any) {
    const classStylers = names || styler.styleClasses || Object.keys(styler)
    classStylers.map((name: string) => {
      const classStyler = styler[name]
      if (typeof classStyler !== 'function') return
      // create instance method on class that wraps call to standalone function
      target.prototype[name] = function () {
        const opts = { props: this.props, state: this.state }
        styler.callStylerFunction(classStyler, opts)
      }
    })
  }
}


export function reactiveStyles(styleBuilder: any) {
  return function (target: any) {
    target.styler = styleBuilder

    // add function _computeNewStyles to target (class ie. prototype)
    target.prototype._computeNewStyles = function (nextProps: any, nextState: any) {
      this.styles = this.styler.compute({ props: nextProps, state: nextState })
    }
    const componentWillUpdateDescriptor: PropertyDescriptor | undefined = Object.getOwnPropertyDescriptor(target, 'componentWillUpdate')
    if (componentWillUpdateDescriptor) {
      updateStyles(target, 'componentWillUpdate', componentWillUpdateDescriptor)
    }
    return target
  }
}
