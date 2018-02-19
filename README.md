# Reactive styles

Reactive styles for React, React Native and other frameworks or libraries based on props/state concept.

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
  this.styles = this.styler.compute({props: nextProps, state: nextState))
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
  this.styles = this.styler.compute({props: nextProps, state: nextState))
}

componentWillUpdate(nextProps: Props, nextState: State) {
  // previous componentWillUpdate logic
  this._computeNewStyles(nextProps, nextState)
}
```

## Example apps

- `React` Coming soon ;)
- `React Native` Coming soon ;)
- `StencilJS` Coming soon ;)

## Install

Install as runtime dependency via `npm` or `yarn`

`$ npm i -S reactive-styles`

`$ yarn add reactive-styles`

## Usage

Use `StylesBuilder.create` or `createStylesBuilder` to create a `StylesBuilder` instance for your component.

The `StylesBuilder` should be passed a `styler`, which is a map containing your reactive styling functions (think "reactive style classes"). `StylesBuilder` exposes a `compute({props, state})` function, which computes new `styles`.

## Stylers

You can define stylers using classes or simple function container objects.

### Object based styler

```js
import {
  styleHelpers as _
} from 'reactive-styles/styler'

export const styler = createStylesBuilder({
  // optional: uses all object keys by default
  // styleClasses: [
  //   'title',
  //   'heading'
  // ]

  title({state, props}) {
    return {
      color: _.toggle(state.todo.completed, 'red', 'green'),
      backgroundColor: _.toggle(() => props.count > 1, 'yellow' : 'white')
    }
  },
  heading({state}) {
    // ...
  }
})
```

### Class based styler

Class based stylers can be more verbose at first but may scale better for complex logic and more customizations.

```js
import {
  styleHelpers as _,
  Styler
} from 'Object.keystyles'

import { StylesBuilder } from 'reactive-styles'

// you can group toggle values for reuse
const theme = {
  color: {
    bgChoice: ['black', 'white'],
    borderChoice: ['blue', 'gray']
  }
}

// compose stylers using either mixin approach or via extends inheritance
class TodoStyler extends Styler {
  // list all styleClasses to be used
  styleClasses = [
    'title',
    'heading'
  ]

  // alternatively, mark each styleclass method using decorator
  @styleClass()
  title() {
    const { state, props, _ } = this
    return {
      borderDolor: _.toggle(state.todo.completed, theme.color.borderChoice),
      backgroundColor: _.gt(props.count, 1, theme.color.bgChoice)
    }
  }

  heading() {
    const { state, _ } = this
    return {
      color: _.toggle(state.on, )
    }
  }
}

export const styler = StylesBuilder.create(TodoStyler)
```

### Style helpers

The set of style helper functions are imported as `_` (or similar convenience identifier) by convention

```js
import {
  styleHelpers as _,
} from 'reactive-styles'
```

The following functions come pre-packaged:

boolean compare:

- `toggle` toggle on boolean state

number compare:

- `gt` >
- `gte` >=
- `lt` <
- `lte` <=>
- `eq` ==
- `neq` !==

The functions can be extended with your own as you see fit.
The helpers are more composable (ie. functions) and maintainable than using logical boolean expression directly

```js
backgroundColor: _.gt(props.count, 1, theme.color.bgChoice)
```

Elegant to compose

```js
backgroundColor: _.gt(props.count, 1, theme.color.bgChoice) || theme.color.bgDefault
```

Instead of the ugly:

```js
const { bgChoice, bgDefault } = theme.color
// ...
backgroundColor: props.count > 1 ? bgChoice[0] : bgChoice[1]
```

Which is event more ugly to compose

```js
backgroundColor: (props.count > 1 ? bgChoice[0] : bgChoice[1]) || bgDefault
```

### Combining Stylers

To combine multiple stylers, you can use either class inheritance, mixins (decorator?) or use the powerful `@useStyler` decorator as follows:

```js
@useStyler(mixinStyler, [
  // names of foreign styler functions to inject as instance methods
  'heading',
  'content',
  'text'
])
class TodoStyler extends Styler {
  // ...
}
```

For styler objects, you could use any kind of merge operation to achieve the same, such as `Object.assign()` or using `...` operator.

```js
const mixinStylerA = {
  // ...
}

const mixinStylerB = {
  // ...
}

const combiStyler = {
  ...mixinStylerA,
  ...mixinStylerB
}
```

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

You can pass a custom `transformer`, such as `ToObjsStylesTransformer` to transform Arrays to Objects, by merging each array item on top of the previous.

For React Native you can use [StyleSheet.flatten](https://facebook.github.io/react-native/docs/stylesheet.html#flatten) to achieve this.

```js
StyleSheet.flatten([styles.listItem, styles.selectedListItem]);
// returns { flex: 1, fontSize: 16, color: 'green' }
```

You can pass a custom flatten operation to be used by the transformer, by passing a `flatten` option

```js
import {
  createStylesBuilder
} from 'reactive-styles'

const flatten = StyleSheet.flatten
const transformer = new ToObjsStylesTransformer()

createStylesBuilder(styler, {
  transformer,
  flatten
})
```

## Props only mode

For stateless components that only have `props` you can set a `propsOnly` mode on the `StylesBuilder`

```js
createStylesBuilder(styler, {
  propsOnly: true
})
```

Then your styler functions can be simplified to take only a props argument:

```js
export const styler = createStylesBuilder({
  title(props) {
    return {
      backgroundColor: _.gt(props.count, 1, theme.bg.countColor)
    }
  },
  // ...
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
createStylesBuilder(styler, {
  transformer,
  handler
})
```

You can use this to log events in order to track style generation etc.

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

### useStyler

The `@useStyler` decorator can be used to inject/mixin stylers as follows

```js
@useStyler(mixinStyler, [
  // names of foreign styler functions to inject as instance methods
  // if no names argument, inject all
  'heading',
  'content',
  'text'
])
class TodoStyler extends Styler {
}
```

### reactiveStyles

The `@reactiveStyles` decorator:

- decoratates the class with `@styler` decorator
- decoratates the `componentWillUpdate` function with `@updateStyles` decorator

## Full Example

- `_common.js`
- `styler.js`
- `my-component.js`

### Common

It is (always) useful to have a `_common` file to re-export the most commonly used refs to keep things DRY.

```js
// _common.js

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
// styler.js

import {
  createStylesBuilder,
  IPropsState
} from 'reactive-styles'

// compose stylers using either mixin approach or via extends inheritance
class TodoStyler {
  title({state, props}) {
      const {
        todo
      } = state
    return {
      color: todo && todo.completed ? 'red' : 'green',
      backgroundColor: props.count > 1 ? 'yellow' : 'white'
    }
  }

  heading({state}) {
    return {
      color: state.on ? 'blue' : 'gray',
    }
  }
}

export const styler = createStylesBuilder(TodoStyler)
```

### Component

```js
// my-component.js

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
    // triggers new style
    this.setState({
      todo: {
        completed: false
      }
    })
  }

  @autobind
  handleCompleted() {
    // triggers new style
    this.setState({
        todo: {
            completed: true
        }
    });
  }

  @autobind
  handleStart() {
    // triggers new style
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
        <div style={styles.title}>My title</div>
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
import { StylesBuilder } from 'reactive-styles'
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

export default StylesBuilder.create(nativeStyler, {
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

