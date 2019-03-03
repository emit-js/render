/*global Promise*/
/** @jsx el */
/* eslint-env jest */

var dot,
  el = require("attodom").el,
  fs = require("fs-extra"),
  log = require("@dot-event/log"),
  render = require("./")

function readFile(name) {
  return fs
    .readFileSync(__dirname + "/" + name + ".html")
    .toString()
}

beforeEach(function() {
  dot = require("dot-event")()
  render(dot)
  fs.removeSync(__dirname + "/test.html")
  fs.removeSync(__dirname + "/test2.html")
})

test("render", function() {
  expect.assertions(2)

  log(dot)

  var wait = function(ms) {
    return new Promise(function(r) {
      setTimeout(r, ms)
    })
  }

  dot.any("myView", function(prop, arg) {
    var dot = require("dot-event")()

    dot.any("testView", function() {
      return wait(10).then(function() {
        var element = el("html")
        arg.element.appendChild(element)
      })
    })

    dot.testView()

    return dot
  })

  return dot
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
