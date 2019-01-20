/*global document Promise Set*/
/*prettier-ignore*/
"use strict"

var fs = require("fs-extra")
var extname = require("path").extname
var join = require("path").join
var JSDOM = require("jsdom").JSDOM
var jsdom = new JSDOM()

global.document = jsdom.window.document

module.exports = function(dot, opts) {
  var state = dot.state

  if (state.render) {
    return
  }

  state.render = opts || {}

  dot.beforeAny("render", render)
  dot.beforeAny("renderCapture", renderCapture)
}

function render(prop, arg, dot) {
  var promise = Promise.resolve()
  var writes = []

  for (var path in arg.views) {
    var ext = extname(path),
      file = join(arg.outDir, path)

    var a = Object.assign({}, arg.views[path], {
      path: path,
    })

    var prepend =
      !ext || ext === ".html" ? "<!doctype html>" : ""

    promise = promise
      .then(view.bind(undefined, prop, a, dot))
      .then(function() {
        return prepend + jsdom.serialize()
      })

    if (arg.outDir) {
      writes.push(promise.then(writeFile.bind(file)))
    }
  }

  return Promise.all(writes.concat(promise))
}

function renderCapture(prop, arg, dot) {
  var events = new Set(dot.state.events)

  return function() {
    var arr = [],
      events2 = new Set(dot.state.events)

    events2.forEach(function(v) {
      if (!events.has(v)) {
        arr.push(v)
      }
    })

    return Promise.all(arr)
  }
}

function view(prop, arg, dot) {
  while (document.firstChild) {
    document.removeChild(document.firstChild)
  }

  var a = Object.assign({}, arg, {
    element: document,
    path: arg.path,
  })

  return dot[arg.event](a)
}

function writeFile(output) {
  var file = this
  return fs.ensureFile(file).then(function() {
    return fs.writeFile(file, output)
  })
}
