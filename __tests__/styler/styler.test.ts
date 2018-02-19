import {
  Styler,
} from '../';

class MyStyler extends Styler {
  heading() {
    return {
      color: 'blue'
    }
  }
}

describe('Styler', () => {
  describe('create', () => {
    const props: any = {
      x: 2
    }

    const state: any = {
      a: 1
    }

    const styleClasses = [
      'heading'
    ]

    const opts: any = {
      state,
      props,
      styleClasses
    }

    let styler: any
    beforeEach(() => {
      styler = new MyStyler(opts)
    })
    it('creates a Styler object', () => {
      expect(styler).toBeDefined()
    })

    it('sets state', () => {
      expect(styler.state).toBe(state)
    })

    it('sets props', () => {
      expect(styler.props).toBe(props)
    })

    it('sets styleClasses', () => {
      expect(styler.styleClasses).toBe(styleClasses)
    })

    it('exposes _ as styleHelpers', () => {
      expect(styler._).toBeDefined()
    })

    describe('configure', () => {
      const newProps = {
        x: 27,
        y: 32
      }

      beforeEach(() => {
        styler.configure({ props: newProps })
      })

      it('sets props to new props', () => {
        expect(styler.props).toBe(newProps)
      })
    })
  })
})
