/*global Promise*/
/** @jsx el */
/* eslint-env jest */

var el = require("attodom").el,
  emit,
  fs = require("fs-extra"),
  log = require("@emit-js/log"),
  render = require("./")

function readFile(name) {
  return fs
    .readFileSync(__dirname + "/" + name + ".html")
    .toString()
}

beforeEach(function() {
  emit = require("@emit-js/emit")()
  render(emit)
  fs.removeSync(__dirname + "/test.html")
  fs.removeSync(__dirname + "/test2.html")
})

test("render", function() {
  expect.assertions(2)

  log(emit)

  var wait = function(ms) {
    return new Promise(function(r) {
      setTimeout(r, ms)
    })
  }

  emit.any("myView", function(arg) {
    var emit = require("@emit-js/emit")()

    emit.any("testView", function() {
      return wait(10).then(function() {
        var element = el("html")
        arg.element.appendChild(element)
      })
    })

    emit.testView()

    return emit
  })

  return emit
    .render({
      outDir: "./",
      views: {
        "test.html": { event: "myView" },
        "test2.html": { event: "myView" },
      },
    })
    .then(function() {
      expect(readFile("test")).toBe(
        "<!doctype html><html></html>"
      )
      expect(readFile("test2")).toBe(
        "<!doctype html><html></html>"
      )
    })
})
