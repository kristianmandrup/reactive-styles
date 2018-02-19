export interface IPropsState {
  props?: any
  state?: any
}

import {
  IStylesComputer,
  StylesComputer
} from './computers'

export function createStylesBuilder(styles: any, opts?: any) {
  return StylesBuilder.create(styles, opts)
}

export interface IStylesBuilder {
  compute(opts: IPropsState): any
}

export class StylesBuilder {
  name: any
  styles: any
  computer: IStylesComputer

  constructor(styles: any, opts?: any) {
    opts = opts || {}
    styles = typeof styles === 'function' ? new styles() : styles
    this.styles = styles;
    this.name = styles.name || opts.name || this.defaultName
    this.computer = this.buildComputer(opts) || this.defaultComputer
  }

  protected buildComputer(opts: any) {
    return this.createComputer(opts) || this.createComputerFromClass(opts)
  }

  protected createComputer(opts: any) {
    return opts.createComputer && opts.createComputer(this, opts)
  }

  protected createComputerFromClass(opts: any) {
    return opts.computerClass && new opts.computerClass(this, opts)
  }


  /**
   * Name to be used for logging, debugging etc
   */
  protected get defaultName() {
    return this.constructor.name
  }

  /**
   * Factory
   * @param styles
   * @param opts
   */
  static create(styles: any, opts = {}) {
    return new StylesBuilder(styles, opts)
  }

  /**
   * Default computr to be used
   */
  protected get defaultComputer(): IStylesComputer {
    return new StylesComputer(this.styles)
  }

  /**
   * Use a Styles Computer to compute new styles
   * @param opts
   */
  compute(opts: IPropsState): any {
    return this.computer.compute(opts)
  }
}
