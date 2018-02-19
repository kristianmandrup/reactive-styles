// @updateStyles
export function updateStyles(target: any, name: string, descriptor: PropertyDescriptor) {
  let oldHandler = target

  function updateStyler(nextProps: any, nextState: any) {
    const ctx: any = target
    // requires that component has an updateStyles method
    if (!ctx._computeNewStyles) {
      console.error('@updateStyles error: missing _computeNewStyles method on Component', target)
    }
    ctx._computeNewStyles(nextProps, nextState)
    oldHandler.apply(ctx, arguments)
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

export function reactiveStyles(styleBuilder: any) {
  return function (target: any) {
    target.styler = styleBuilder

    // add function _computeNewStyles to target (class ie. prototype)
    target.prototype._computeNewStyles = function (nextProps: any, nextState: any) {
      const state = this.layoutState || nextState
      target.styles = target.styler.compute({ props: nextProps, state })
    }
    const componentWillUpdateDescriptor: PropertyDescriptor | undefined = Object.getOwnPropertyDescriptor(target, 'componentWillUpdate')
    if (componentWillUpdateDescriptor) {
      updateStyles(target, 'componentWillUpdate', componentWillUpdateDescriptor)
    }
    return target
  }
}
