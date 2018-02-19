import { IPropsState } from '../style-builder/index'
import {
  styleHelpers
} from './helpers'
export {
  styleHelpers
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
