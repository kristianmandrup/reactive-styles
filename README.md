# Reactive style builder

A Reactive style builder for React and React Native

## Architecture

*Reactive styles* is an extension which makes it easy to do declarative reactive styling of components.

The extension has been designed to be used with React or any "react-like" frameworks/libraries such as React Native or StencilJS etc.

Style "classes" are registered as functions that can re-compute styles.

When `state` or `props` change, the lifecycle method `componentWillUpdate` is triggered just before re-rendering. The `styler` of the component will then re-compute new styles based on the new "state" before re-rendering.

### componentWillUpdate

The `componentWillUpdate()` is a chance for us to handle configuration changes and prepare for the next render. If we want to access the old props or state, we can call this.props or this.state. We can then compare them to the new values and make changes/calculations as required.

Unlike `componentWillMount()`, we should not call `this.setState()` here. The reason we do not call `this.setState()` is that the method triggers another `componentWillUpdate()`. If we trigger a state change in `componentWillUpdate()` we will end up in an infinite loop 1.

### Enhancing componentWillUpdate

The flow requires that the component sets the new computed styles in `this.styles` before re-rendering. We achieve this by "hijacking" into `componentWillUpdate()`.

```js
componentWillUpdate(nextProps: Props, nextState: State) {
  const state = this.layoutState || nextState
  this.styles = this.styler.compute({props: nextProps, state))
}
```

We call compute with the new `props` and the internal `layoutState` or `newState` to re-compute `styles` which will then be available for `render` method.

We can achieve the same with decorator `@updateStyles`

```js
@updateStyles()
componentWillUpdate(nextProps: Props, nextState: State) {
}
```

This decorates the component with:

```js
_computeNewStyles() {
  const state = this.layoutState || nextState
  this.styles = this.styler.compute({props: nextProps, state))
}

componentWillUpdate(nextProps: Props, nextState: State) {
  // previous componentWillUpdate logic
  this._computeNewStyles(nextProps, nextState)
}
```

## Using layoutState

We pass `layoutState` by default, in order to allow a more flexible distinction between application and layout (only) state, if needed.

Sample implementation:

```js
setState(newState) {
  this.layoutState = newState
  this.appState = newState
  super.setState(this.appState)
}

set layoutState(newState) {
  this._layoutState = // some state filtering
}

set appState(newState) {
  this._appState = // some state filtering
}
```

## Example app

See:

- [react demo app](https://github.com/kristianmandrup/react-smart-styles-demo)
- [react native demo app](https://github.com/kristianmandrup/react-native-style-builder-demo)

For full usage examples ;)

## Getting Started

`$ npm i -S reactive-style-builder`

## Usage

Use `StyleBuilder.create` or `createStyleBuilder` to create a `StyleBuilder` instance for your component.

The `StyleBuilder` should be passed a `styler`, which is a map containing your reactive styling functions (think "reactive style classes").

The `StyleBuilder` exposes a `compute({props, state})` function, which computes new `styles`.

### styles

The `styles` result can be used in any context, such as in React or React Native.
The styles return an Object with keys, such as:

```js
styles = {
  heading: {
    fontSize: '18',
    color: 'green'
  },
  footer: {
    backgroundColor: 'darkgrey'
  }
}
```

Here, `styles.heading` and `styles.footer` are refered to as "style classes".

The style classes can be either an Object or an Array, depending on the context the styles are used in. For React Native, the style classes will often contain an array referencing one or more `StyleSheet` classes created via `StyleSheet.create(styleSheerObj)`

You can pass a custom transformer, such as `ToObjsStylesTransformer` to transform Arrays to Objects, by merging each array item on top of the previous.

For React Native you can use [StyleSheet.flatten](https://facebook.github.io/react-native/docs/stylesheet.html#flatten) to achieve this.

```js
StyleSheet.flatten([styles.listItem, styles.selectedListItem]);
// returns { flex: 1, fontSize: 16, color: 'green' }
```

You can pass a custom the flattening operation by passing a `flatten` option

```js
import {
  createStyleBuilder
} from 'reactive-styles'

const flatten = StyleSheet.flatten
const transformer = new ToObjsStylesTransformer()

createStyleBuilder(styler, {
  transformer,
  flatten
})
```

## Handlers

You can add a handler to handle the main compute events:

Implement the `IStyleResultHandler` interface

```js
export interface IStyleResultHandler {
  onStyleResult(result: any): void
  onStyleResults(styles: any): void
  onTransformedStyleResults(transformed: any): void
}
```

or sublclass `StyleResultHandler`

Use the `handler` by passing it as an option:

```js
createStyleBuilder(styler, {
  transformer,
  handler
})
```

You can use this to log events in order to track style generation etc.

## Stylers

We recommend defining stylers using classes, though you can use simple objects with functions as well.

```js
import { StyleBuilder } from 'reactive-style-builder'

// compose stylers using either mixin approach or via extends inheritance
class TodoStyler {
  name = 'MyTodoStyler' // implicit class name (ie. constructor.name)

  title({state, props}: IPropsState) {
      const {
        todo
      } = state
    return {
      color: todo && todo.completed ? 'red' : 'green',
      backgroundColor: props.count > 1 ? 'yellow' : 'white'
    }
  }

  heading({state}: IPropsState) {
    return {
      color: state.on ? 'blue' : 'gray',
    }
  }
}

export const styler = StyleBuilder.create(TodoStyler)
```

To combine multiple stylers, you can use either class inheritance or mixins (fx. via a mixin decorator).

## Component usage: Decorators

- `styler` (class)
- `updateStyles` (function)
- `reactiveStyles` (class)

### styler

The `@styler` decorator will simply inject a styler into the component as `this.styler`

```js
@styler(myStyler)
export default class MyComponent extends Component {
  //...
}
```

### updateStyles

Use the `@updateStyles` decorator on `componentWillUpdate`. This ensures that `_computeNewStyles()` is called whenever the component is about to re-render (after a state/props change). This will then re-calculate the `styles` instance var based on the changes.

### reactiveStyles

The `@reactiveStyles` decorator:

- decoratates the class with `@styler` decorator
- decoratates the `componentWillUpdate` function with `@updateStyles` decorator

## Full Example

- `_common.ts`
- `styler.ts`
- `my-component.ts`

### Common

It is (always) useful to have a `_common` file to re-export the most commonly used refs to keep things DRY.

```js
// _common.ts

export {
  reactiveStyles
} from 'reactive-styles'

import * as React from 'React'
export {
  Component
} from 'react'
export {
  React
}

export {
  autobind
} from 'core-decorators'
```

### Styler

```js
// styler.ts

import {
  createStyleBuilder,
  IPropsState
} from 'reactive-styles'

// compose stylers using either mixin approach or via extends inheritance
class TodoStyler {
  name = 'MyTodoStyler' // implicit class name (ie. constructor.name)

  title({state, props}: IPropsState) {
      const {
        todo
      } = state
    return {
      color: todo && todo.completed ? 'red' : 'green',
      backgroundColor: props.count > 1 ? 'yellow' : 'white'
    }
  }

  heading({state}: IPropsState) {
    return {
      color: state.on ? 'blue' : 'gray',
    }
  }
}

export const styler = createStyleBuilder(TodoStyler)
```

### Component

```js
// my-component.ts

import { styler } from './styler'
import {
  React,
  Component,
  statefulStyling,
  updateStyles,
  autobind
} from './_common'

@reactiveStyles({
  styler
})
export default class MyComponent extends Component {

  constructor(props) {
    super(props);

    // set initial local component state
    this.setState({
      todo: {
        completed: false // triggers new style
      }
    })
  }

  @autobind
  handleCompleted() {
    this.setState({
        todo: {
            completed: true // triggers new style
        }
    });
  }

  @autobind
  handleStart() {
    this.setState({
        todo: {
            completed: false
        }
    });
  }

  render() {
    const {
      styles
    } = this
    return (
      <div style={styles.header}>
        <div style={styles.title}>Blip</div>
        <button onClick={this.handleCompleted}>Complete</button>
        <button onClick={this.handleStart}>Start</button>
      </div>
    )
  }
}
```

## React Native

For React Native you need to register a special `native` computer, which wraps the built style result in a `StyleSheet` instance.

```js
import { StyleBuilder } from 'reactive-style-builder'
import { StyleSheet } from 'react-native'

const styles = StyleSheet.create({
  heading: {
    flex: 1
    fontSize: 32,
  },
  alert: {
    color: 'red'
  }
  footer: {
    flex: 3
    color: 'blue'
  }
})

class NativeStyler {
  // reference special React Native stylesheet "classes"
  heading({props, state}) {
    return props.alert ? [styles.heading, styles.alert] : [styles.heading]
  },
  // ...
}

export default StyleBuilder.create(nativeStyler, {
  // optional: use React Native stylesheet flatten
  flatten: StyleSheet.flatten,
  shouldFlatten: () => true
});
```

## Development

TypeScript is used to compile into ES5.

## Testing

Jest is pre-configured

`jest`

## Contributing

Please submit all issues and pull requests to the [kristianmandrup/style-builder](https://github.com/kristianmandrup/style-builder) repository!

## Support

If you have any problem or suggestion please open an issue [here](https://github.com/kristianmandrup/style-builder/issues).

## License

The MIT License

Copyright (c) 2018, Kristian Mandrup

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

