import { IPropsState } from '../style-builder/index'
import {
  styleHelpers
} from './helpers'
export {
  styleHelpers
}

export interface IStyler {
  state?: any
  props: any
  styleClasses: string[]
  configure(opts: IPropsState): void
}

export interface IStylerConfig extends IPropsState {
  styleClasses?: string[]
}

export abstract class Styler {
  state: any
  props: any
  _ = styleHelpers
  // only methods listed here will be used for styling classes
  styleClasses: string[] = []

  constructor(opts: IStylerConfig) {
    this.configure(opts)
  }

  configure(opts: IStylerConfig): void {
    const { state, props, styleClasses } = opts
    this.state = state || {}
    this.props = props || {}
    this.styleClasses = styleClasses || this.styleClasses || []
  }
}
