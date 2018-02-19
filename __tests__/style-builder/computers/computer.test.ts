import {
  StylesBuilder,
  StylesComputer
} from '../..'

const blueResult = {
  color: 'blue'
}

const styles = {
  heading(props: any) {
    return blueResult
  }
}

describe('StylesComputer', () => {
  describe('styler', () => {
    let styler: any
    let computer: any

    const opts = {

    }

    beforeEach(() => {
      styler = new StylesBuilder(styles, {
        propsOnly: true
      })

      computer = new StylesComputer(styler, opts)
    })

    it('is a computer', () => {
      expect(computer).toBeInstanceOf(StylesComputer)
    })

    describe('compute', () => {
      it('computes and transforms styles via computer', () => {
        const props = {
          a: 12
        }
        const result = computer.compute({ props })
        expect(result).toEqual(blueResult)
      })
    })
  })
})
