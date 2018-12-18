// ESM syntax is supported.
import {set as lset, get, has, merge} from 'lodash'

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

export class StyleScope {
  constructor() {
    this.refs = {}
    this.root = this
    this.tree = []
    this.path = []
  }

  set(path, value, root) {
    if(typeof path === 'string') {
      path = [path]
    }
    if (root) {
      set(this.root, ['refs'].concat(path), value)
    } else {
      set(this.refs, path, value)
      if (this.parent) {
        set(this.root, ['refs'].concat(this.path).concat(path), value)
      }
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
        this.tree = []
        const parentConfig = get(this.parent, 'config')
        this.config = {...parentConfig}
      }
    }
  }

  rules(node, func) {
    const scope = this.addScope(this)
    this.tree.push([node, func.bind(scope)])
  }

  declaration(node) {
    this.tree.push(node)
  }

  function(path, args, func, condition) {
    const scope = this.addScope(this, [path])
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
    console.log(val)
    val.forEach(funcDef => {
      const $ = funcDef[1]
      $.set(path)
    })
  }

  eval(tree = this.tree) {
    tree.forEach(node => {
      if (typeof node[1] === 'function') {
        node[1]()
        // todo
      }
    })
  }
}