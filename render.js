/*global document Promise Set window*/
/*prettier-ignore*/
"use strict"

var fs = require("fs-extra")
var extname = require("path").extname
var join = require("path").join
var JSDOM = require("jsdom").JSDOM
var jsdom = new JSDOM()

global.window = jsdom.window
global.document = window.document

module.exports = function(emit) {
  if (emit.render) {
    return
  }

  emit.any("render", render)
}

function render(arg, prop, emit) {
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
      .then(view.bind(null, a, prop, emit))
      .then(waitForEvents)
      .then(function() {
        return prepend + jsdom.serialize()
      })

    if (arg.outDir) {
      writes.push(promise.then(writeFile.bind(file)))
    }
  }

  return Promise.all(writes.concat(promise))
}

function view(arg, prop, emit) {
  while (document.firstChild) {
    document.removeChild(document.firstChild)
  }

  var a = Object.assign({}, arg, {
    element: document,
    path: arg.path,
  })

  return emit[arg.event](a)
}

function waitForEvents(emit) {
  var arr = [],
    events = new Set(emit.state.events)

  events.forEach(function(v) {
    arr.push(v)
  })

  return Promise.all(arr)
}

function writeFile(output) {
  var file = this
  return fs.ensureFile(file).then(function() {
    return fs.writeFile(file, output)
  })
}
