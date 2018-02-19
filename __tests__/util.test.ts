import {
  getArgs
} from '../src/util'

const { log } = console
describe('getArgs', () => {
  it('should get all function arguments', () => {
    function hasOneArg(x: string) {
    }

    const argsList = getArgs(hasOneArg)
    expect(argsList).toEqual(['x'])
  })
})
