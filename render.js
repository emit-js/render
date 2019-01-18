/*global document Promise*/
/*prettier-ignore*/
"use strict"

var fs = require("fs-extra")
var join = require("path").join
var JSDOM = require("jsdom").JSDOM
var jsdom = new JSDOM()

global.document = jsdom.window.document

module.exports = function(dot, opts) {
  var state = dot.state

  if (state.render) {
    return
  }

  state.render = Object.assign(
    { promises: Promise.resolve() },
    opts
  )

  dot.beforeAny("render", render)
}

function render(prop, arg, dot) {
  var promise = Promise.resolve()
  var writes = []

  for (var path in arg.views) {
    var file = join(arg.outDir, path)

    var a = Object.assign({}, arg.views[path], {
      path: path,
    })

    promise = promise
      .then(view(prop, a, dot))
      .then(function() {
        return jsdom.serialize()
      })

    if (arg.outDir) {
      writes.push(promise.then(writeFile(file)))
    }
  }

  return Promise.all(writes.concat(promise))
}

function view(prop, arg, dot) {
  return function() {
    while (document.firstChild) {
      document.removeChild(document.firstChild)
    }

    var a = Object.assign({}, arg, {
      element: document,
      path: arg.path,
    })

    return dot[arg.event](a)
  }
}

function writeFile(file) {
  return function(output) {
    return fs.ensureFile(file).then(function() {
      return fs.writeFile(file, output)
    })
  }
}
