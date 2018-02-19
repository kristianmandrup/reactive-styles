import { IPropsState } from "./style-builder/index";

function resolveValues(truthyVal: any, falsyVal: any) {
  if (Array.isArray(truthyVal)) {
    return truthyVal
  }
  return [truthyVal, falsyVal]
}


export const styleHelpers = {
  toggle(value: any, truthy: any, falsy: any) {
    const [t, f] = resolveValues(truthy, falsy)
    return value ? t : f
  },
  eq(value: number, compareVal: number, truthy: any, falsy: any) {
    const [t, f] = resolveValues(truthy, falsy)
    return value == compareVal ? t : f
  },
  neq(value: number, compareVal: number, truthy: any, falsy: any) {
    const [t, f] = resolveValues(truthy, falsy)
    return value !== compareVal ? t : f
  },
  gt(value: number, compareVal: number, truthy: any, falsy: any) {
    const [t, f] = resolveValues(truthy, falsy)
    return value > compareVal ? t : f
  },
  gte(value: number, compareVal: number, truthy: any, falsy: any) {
    const [t, f] = resolveValues(truthy, falsy)
    return value >= compareVal ? t : f
  },
  lte(value: number, compareVal: number, truthy: any, falsy: any) {
    const [t, f] = resolveValues(truthy, falsy)
    return value <= compareVal ? t : f
  },
  lt(value: number, compareVal: number, truthy: any, falsy: any) {
    const [t, f] = resolveValues(truthy, falsy)
    return value < compareVal ? t : f
  }
}

export class Styler {
  state: any
  props: any

  _ = styleHelpers

  // only methods listed here will be used for styling classes
  styleClasses = []

  constructor(opts: IPropsState) {
    this.configure(opts)
  }

  configure({ state, props }: IPropsState) {
    this.state = state
    this.props = props
  }
}
