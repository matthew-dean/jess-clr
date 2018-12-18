// ESM syntax is supported.
import {set as lset, has, merge} from 'lodash'

class Node {
  constructor(ident, map) {
    this.ident = ident
    this.map = map
  }
}

const set = (obj, path, value) => {
  const val = get(obj, path)
  if (val !== undefined) {
    lset(obj, path, val.concat(value))
  } else {
    lset(obj, path, [value])
  }
}

class StyleScope {
  constructor() {
    this.refs = {}
    this.root = this
    this.tree = []
    this.functions = {}
    this.path = []
  }

  set(path, value, root) {
    if (root) {
      set(this.root, ['refs'].concat(path), value)
    } else {
      set(this.refs, path, value)
      set(this.root, ['refs'].concat(this.path).concat(path), value)
    }
  }

  _get(path) {
    if (has(this.refs, path)) {
      return get(this.refs, path)
    }
    return get(this.parent, ['refs'].concat(path))
  }

  get(path) {
    return this._get(path)
  }

  config(obj) {
    merge(this.config, obj)
  }

  addScope($, path) {
    return new class extends StyleScope {
      constructor() {
        super()
        this.parent = $
        this.path = path
        const parentConfig = get(this.parent, 'config')
        this.config = {...parentConfig}
      }
    }
  }

  rule(node, func) {
    const scope = addScope(this)
    this.tree.push([node, func.bind(scope)])
  }

  decl(node) {
    this.tree.push(node)
  }

  function(path, args, func, condition) {
    const scope = addScope(this, path)
    this.set(path, [func, scope, args, condition])
  }

  /**
   * $.call('.mixin', [['val', 3]])
   * $.call(['#ns', '.mixin'], [3])
   *
   * @param {*} path 
   */
  call(path, args) {
    const val = this._get(path)
    val.forEach(funcDef => {
      const $ = funcDef[1]
      $.set(path)
    })
  }
}