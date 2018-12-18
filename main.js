// ESM syntax is supported.
import {get, set, has} from 'lodash'

class Node {
  constructor(ident, map) {
    this.ident = ident
    this.map = map
  }
}

class StyleScope {
  constructor() {
    this.refs = {}
    this.root = this
    this.tree = []
  }

  set(path, value, root) {
    if (root) {
      set(this.root, ['refs'].concat(path), value)
    } else {
      set(this.refs, path, value)
    }
  }

  get(path) {
    if (has(this.refs, path)) {
      return get(this.refs, path)
    }
    return get(this.parent, ['refs'].concat(path))
  }

  config(obj) {
    set(this.config)
  }

  addScope($) {
    return new class extends StyleScope {
      constructor() {
        super()
        this.parent = $
        const parentConfig = get(this.parent, 'config')
        this.config = {...parentConfig}
      }
    }
  }

  normalize(node) {
    if (typeof node === 'string') {

    }
  }

  addRules(node, func) {
    const scope = addScope(this)
    const n = this.normalize(node)
    this.tree.push([node, func.bind(scope)])
  }

  addRule(node, value) {
    this.tree.push([node, value])
  }
}