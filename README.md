# Style-builder [![Build Status](https://secure.travis-ci.org/kristianmandrup/style-builder.png?branch=master)](http://travis-ci.org/kristianmandrup/style-builder) [![NPM version](https://badge-me.herokuapp.com/api/npm/style-builder.png)](http://badges.enytc.com/for/npm/style-builder)

> Style builder for React and React Native

## Rationale

*Style builder* is a React plugin which makes it easy to do stateful styling of components. Styles are registered as functions, which depend on change to either `state`, `props` change or either. Whenever `state` or `props` change, the StyleBuilder is re-evaluated for the relevant style functions and the component is auto-matically re-rendered with the new (generated) style.


## Getting Started

`$ npm i -S style-builder`

## Usage

## React

```js
import { StyleBuilder } from 'style-builder.js'

const TodoMixin = {
  title(state, props) {
    return {
      color: state.todo && state.todo.completed ? 'red' : 'green',
      backgroundColor: props.count > 1 ? 'yellow' : 'white'
    }
  },
  heading(state) {
    return {
      color: state.on ? 'blue' : 'gray',
    }
  }
};

export default StyleBuilder.create(TodoMixin, {
    name: 'MyComponent'
});
```

Alternatively use a class and apply f.ex one or more class mixins to "mix and match" global and local styles if needed...
You can also use `Object.assign` or `_.merge` to merge objects directly.

```js
@mixin(TodoMixin)
class Styles {
}

export default StyleBuilder.create(new Styles(), {name: 'App'});
```


## React Native

For React Native you need to register a special `native` computer, which wraps the built style result in a `StyleSheet` instance.

```js
import { StyleBuilder } from 'style-builder.js'
import { StyleSheet } from 'react-native'

function native(state, props) {
    return StyleSheet.create(this.browser())
}

export default StyleBuilder.create(TodoMixin, {
    name: 'MyComponent'
    computers: {
        native: native
    }
});
```

## Component usage

```js
import Styler from './Styler.js'
import { statefulStyling, updateStyles } from 'style-builder'
import { injectProps } from 'relpers'

import React, {
  Component
} from 'react'

// use 'native' to use 'native' computer
@statefulStyling('browser', Styler)
export default class MyComponent extends Component {

  constructor(props) {
    super(props);
    this.state = {
      todo: {
        completed: false
      }
    }
  }

  @updateStyles
  componentWillMount() {
  }

  @updateStyles
  componentWillUpdate() {
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (this.props === nextProps && this.state === nextState) {
      return false;
    }
    return true;
  }

  _completed() {
    this.updateState({todo: {completed: true}});
  }

  _start() {
    this.updateState({todo: {completed: false}});
  }

  // https://github.com/goncalvesjoao/relpers
  @injectProps('state', 'props')
  render({ styles = {} }) {
    // console.log('render styles', styles);
    return (
      <div style={styles.header}>
        <div style={styles.title}>Blip</div>
        <button onClick={this._completed.bind(this)} >Complete</button>
        <button onClick={this._start.bind(this)} >Start</button>
      </div>
    )
  }
}
```

## Development

Babel6 is used to compile into ES5.

`npm compile`

## Testing

Mocha with chai is used for testing in `/test`

`npm test`

## Contributing

Please submit all issues and pull requests to the [kristianmandrup/style-builder](https://github.com/kristianmandrup/style-builder) repository!

## Support
If you have any problem or suggestion please open an issue [here](https://github.com/kristianmandrup/style-builder/issues).

## License 

The MIT License

Copyright (c) 2016, Kristian Mandrup

Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the "Software"), to deal in the Software without
restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following
conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.

