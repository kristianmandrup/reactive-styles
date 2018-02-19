export interface IStylesTransformer {
  transform(styles: any): any
  configure(options: any): any
}

export class BaseStylesTransformer implements IStylesTransformer {
  constructor(opts?: any) {
    this.configure(opts || {})
  }

  configure(opts: any): void {
  }

  transform(styles: any): any {
    return styles
  }
}
