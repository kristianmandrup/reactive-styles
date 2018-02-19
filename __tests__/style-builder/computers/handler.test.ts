import {
  StyleResultHandler,
  StylesBuilder
} from '../..'

class MyStyleResultHandler extends StyleResultHandler {
}

const blueResult = {
  color: 'blue'
}

const styles = {
  heading(props: any) {
    return blueResult
  }
}

describe('StylesResultHandler', () => {
  let styler: any
  let handler: any
  beforeEach(() => {
    handler = new MyStyleResultHandler()
    styler = new StylesBuilder(styles, {
      propsOnly: true,
      handler
    })
  })
  const callbacks = ['onStyleResult', 'onStyleResults', 'onTransformedStyleResults']

  // creates full test for each callback
  callbacks.map((callbackName: string) => {
    describe(callbackName, () => {
      it(`calls ${callbackName} of handler`, (done) => {
        handler[callbackName] = (results: any) => {
          expect(results).toEqual(blueResult)
          done()
        }
        styler.compute()
      })
    })
  })
})
