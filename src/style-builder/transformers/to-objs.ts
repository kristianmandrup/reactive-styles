import {
  IStylesTransformer,
  BaseStylesTransformer
} from './base'

import {
  isFun
} from '../utils'

export class ToObjsStylesTransformer extends BaseStylesTransformer implements IStylesTransformer {
  _flatten: Function
  _shouldFlatten: Function
  styles: any

  constructor(protected opts?: any) {
    super(opts)
  }

  configure(opts: any): void {
    // overrides
    if (isFun(opts.flatten)) {
      this.flatten = opts.flatten
    }
    if (isFun(opts.shouldFlatten)) {
      this.shouldFlatten = opts.shouldFlatten
    }
  }

  /**
   * Transform computed styles into final styles
   * @param styles
   */
  transform(styles: any): any {
    this.styles = styles
    return Object.keys(this.styles).reduce(this.arraysToObj, {})
  }

  /**
   * Flatten an item by merging into accumulator object
   * @param acc
   * @param item
   */
  _flattenItem(acc: any, item: any) {
    Object.assign(acc, ...item)
  }

  /**
   * Flatten a list
   * @param list
   * @param key
   */
  flatten(list: any[], key: string): any {
    return list.reduce((acc, item) => {
      return this._flattenItem(acc, item)
    }, {})
  }

  /**
   * Determine if we should flatten the list for this key (style class)
   * @param key
   * @param list
   */
  shouldFlatten(key: string, list: any[]) {
    return false
  }

  /**
   * Converts arrays to object if configured to do so
   * @param result
   * @param key
   */
  arraysToObj(result: any, key: string): any {
    const value = this.styles[key]
    const obj = Array.isArray(value) ? this.flatten(value, key) : value
    return obj
  }
}
