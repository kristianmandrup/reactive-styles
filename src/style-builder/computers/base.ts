import {
  IPropsState, IStylesBuilder
} from '../'
import { IStyleResultHandler } from './handler';

export interface IStylesComputer {
  handler: IStyleResultHandler
  styler: IStylesBuilder
  compute(opts: IPropsState): any
}
