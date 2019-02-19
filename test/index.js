let jessCLR = require('..')

const styles = config => {
  let {$, ...rest} = config
  /**
   * variables are stripped of $ or @
   * $.set calls are hoisted to top of block for Less transpilation
   *
   * Less: `@blah: #555;`
   */
  $.set('blah', '#555');

  /**
   * will register as '.some-mixin` and 'some-mixin' as fallback
   *
   * --Less--
    .some-mixin(@val) {
      bar: @val;
    }
   */
  $.function('.some-mixin', ['val'], $ => {
    $.declaration('bar', $.e($ => $.get('val')))
  })

  /**
   *  Rules will be added as function call for Less
   *
    .box {
      color: @blah;
      .some-mixin(@val: bar);
      .sub {
        foo: bar;
      }
    }
   */
  $.rules('.box', $ => {
    $.declaration('color', $.e($ => $.get('blah')))
    $.call('.some-mixin', {['val']: 'bar'})
    $.rules('.sub', $ => {
      $.declaration('foo', 'bar')
    })
  })

  return {$, ...rest}
}

let $ = new jessCLR.StyleScope()
styles({$})
$.eval()
console.log($)