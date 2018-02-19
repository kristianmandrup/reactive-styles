export interface IStyleResultHandler {
  onStyleResult(result: any): void
  onStyleResults(styles: any): void
  onTransformedStyleResults(transformed: any): void
}

export class StyleResultHandler implements IStyleResultHandler {
  /**
   * Callback to handle each style result
   * Can be used to log or monitor style results as they are being generated
   * @param result
   */
  onStyleResult(result: any): void {
  }

  /**
   * Callback to handle the complete style results
   * Can be used to log or monitor complete style results when generated
   * @param styles
   */
  onStyleResults(styles: any): void {
  }

  /**
   * Callback to handle the complete transformed style results
   * Can be used to log or monitor complete transformed style results when generated
   * @param transformed
   */
  onTransformedStyleResults(transformed: any): void {
  }
}
