import {
  StylesBuilder,
  ToObjsStylesTransformer
} from '../..'

const blueResult = {
  color: 'blue'
}

const styles = {
  heading(props: any) {
    return blueResult
  }
}

describe('ToObjsStylesTransformer', () => {
  describe('styler', () => {
    let styler: any
    let transformer: any
    const opts = {

    }

    beforeEach(() => {
      styler = new StylesBuilder(styles, {
        propsOnly: true
      })

      transformer = new ToObjsStylesTransformer(opts)
    })

    it('is a Transformer', () => {
      expect(styler.transformer).toBeInstanceOf(ToObjsStylesTransformer)
    })

    describe('transform', () => {
      describe('no arrays', () => {

        it('transforms style result to same if no arrays', () => {
          const styleResult = {
            color: 'red'
          }
          const result = transformer.transform(styleResult)
          expect(result).toEqual(styleResult)
        })
      })

      describe('with array', () => {
        // TODO
      })
    })
  })
})



