
```less
/** A rule */
.selector {
  property: value;
  prop@{var}: ;
  & .inner {
    color: black + 1;
  }
  .mixinCall(value, @var: value);
}
```
```js
/** Creates an intermediate representation */
import { __add, __color } from 'jess/runtime'

/**
 * _S = scope variable
 */
[
  _S => _S(['.selector'], null, _S => [
    // Doesn't look up anything
    _S`property``value`,
    // Looks up a value
    _S => [`prop${_S.var}`, ''],
    // Defines a new selector
    (_S, d) => d(['&', '.inner'], null, _S => [
      _S`color``${__add(__color('black'), 1)}`
    ])
    // Mixin call with parameters
    _S => _S['.mixinCall']({
      0: 'value',
      '@var': 'value'
    })
  ])
]
```
Maybe variables can be reactive / stateful?
Such that changes to variables can be tracked into which functions need to be re-executed based on dependencies,
which would then patch only certain sections of the CSS.

The Jess runtime should be written in AssemblyScript, such that for in-browser use,
the common language output could also be pre-compiled into WASM. (Is this tree-shakeable?)


End result:
```less
// Call Sass+ from Less+

// mixin.scss
@mixin sass-mixin() {
  .foo {
    bar: value;
  }
}

// main.less
@import "mixin.scss";
.sass-mixin();
```

```less
// Call Less+ from Sass+

// mixin.less
.sass-mixin() {
  .foo {
    bar: value;
  }
}

// main.scss
@import "mixin.less";
@include sass-mixin();
```
