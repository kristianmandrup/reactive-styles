import {
  StyleBuilder
} from '../src/style-builder'

const styles = {
}

describe('StyleBuilder', () => {
  describe('create w styles', () => {
    let builder: any
    beforeEach(() => {
      builder = new StyleBuilder(styles)
    })
    it('should create a StyleBuilder object', () => {
      expect(builder).toBeDefined()
    })

    it('has the styles object assigned', () => {
      expect(builder.styles).toBe(styles)
    })
  })

  describe('create w styles and name', () => {
    let builder: StyleBuilder
    const name = 'my-builder'
    beforeEach(() => {
      builder = new StyleBuilder(styles, {
        name
      })
    })

    it('has the styles object assigned', () => {
      expect(builder.name).toBe(name)
    })
  })

  describe('init', () => {
    let builder: StyleBuilder
    const props = {
      x: 2
    }
    const state = {
      a: 1
    }
    beforeEach(() => {

      builder = new StyleBuilder(styles, {
        name
      }).init({
        props,
        state
      })
    })

    it('sets state to passed state', () => {
      expect(builder.state).toBe(state)
    })

    it('sets props to passed props', () => {
      expect(builder.props).toBe(props)
    })

    it('initializes styleResult', () => {
      expect(builder.styleResult).toBeDefined()
    })

    it('initializes dependencyMap', () => {
      expect(builder.dependencyMap).toBeDefined()
    })

    it('initializes typeMap', () => {
      expect(builder.typeMap).toBeDefined()
    })

    it('sets styles', () => {
      expect(builder.styles).toBeDefined()
    })

    it('sets styles', () => {
      expect(builder.styles).toBeDefined()
    })

    it('sets computers', () => {
      expect(builder.computers).toBeDefined()
    })

    it('sets logger', () => {
      expect(builder.computers).toBeDefined()
    })

    it('sets logOn', () => {
      expect(builder.logOn).toBeDefined()
    })

    it('registers dependencies', () => {
      expect(builder.dependenciesRegistered).toBe(true)
    })
  })
})
