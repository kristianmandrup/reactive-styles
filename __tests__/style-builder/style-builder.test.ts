import {
  StylesBuilder,
  StyleResultHandler,
  ToObjsStylesTransformer,
  StylesComputer
} from '../';

const styles = {
}

describe('StylesBuilder', () => {
  describe('create w styles only', () => {
    let styler: any
    beforeEach(() => {
      styler = new StylesBuilder(styles)
    })
    it('should create a StylesBuilder object', () => {
      expect(styler).toBeDefined()
    })

    it('has the styles object assigned', () => {
      expect(styler.styles).toBe(styles)
    })
  })

  describe('create w styles and options', () => {
    let styler: StylesBuilder
    const name = 'my-styler'
    const propsOnly = true
    const handler = new StyleResultHandler()
    const transformer = new ToObjsStylesTransformer()
    const computerClass = StylesComputer

    beforeEach(() => {
      styler = new StylesBuilder(styles, {
        name,
        propsOnly,
        computerClass,
        handler,
        transformer
      })
    })

    it('has the styles object assigned', () => {
      expect(styler.name).toBe(name)
    })

    it('sets styles', () => {
      expect(styler.styles).toBeDefined()
    })

    it('sets computer', () => {
      expect(styler.computer).toBeInstanceOf(StylesComputer)
    })

    it('sets styler on computer', () => {
      expect(styler.computer.styler).toBe(styler)
    })

    it('sets handler on computer', () => {
      expect(styler.computer.handler).toBe(handler)
    })
  })

  describe('compute', () => {
    let styler: StylesBuilder

    const props: any = {
      x: 2
    }

    const state: any = {
      a: 1
    }

    beforeEach(() => {

      styler = new StylesBuilder(styles, {
        name
      })
    })

    it('computes new styles', () => {
      const opts = {
        props,
        state
      }
      const styles = styler.compute(opts)
      expect(styles).toBeDefined()
    })
  })
})
