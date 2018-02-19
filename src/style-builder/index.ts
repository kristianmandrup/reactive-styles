export interface IPropsState {
  props?: any
  state?: any
}

import {
  IStylesComputer,
  StylesComputer
} from './computers'

export function createStyleBuilder(styles: any, opts?: any) {
  return StyleBuilder.create(styles, opts)
}

export class StyleBuilder {
  name: any
  styles: any
  computer: IStylesComputer

  constructor(styles: any, opts?: any) {
    opts = opts || {}
    styles = typeof styles === 'function' ? new styles() : styles
    this.styles = styles;
    this.name = styles.name || opts.name || this.defaultName
    this.computer = opts.computer || this.defaultComputer
  }

  /**
   * Name to be used for logging, debugging etc
   */
  get defaultName() {
    return this.constructor.name
  }

  /**
   * Factory
   * @param styles
   * @param opts
   */
  static create(styles: any, opts = {}) {
    return new StyleBuilder(styles, opts)
  }

  /**
   * Default computr to be used
   */
  get defaultComputer(): IStylesComputer {
    return new StylesComputer(this.styles)
  }

  /**
   * Use a Styles Computer to compute new styles
   * @param opts
   */
  compute(opts: IPropsState) {
    return this.computer.compute(opts)
  }
}
