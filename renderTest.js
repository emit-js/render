/*global Promise*/
/** @jsx el */
/* eslint-env jest */

var dot = require("dot-event")()
var log = require("@dot-event/log")
var el = require("attodom").el
var fs = require("fs-extra")
var render = require("./")

function readFile(name) {
  return fs
    .readFileSync(__dirname + "/" + name + ".html")
    .toString()
}

beforeEach(function() {
  dot.reset()
  render(dot)
  fs.removeSync(__dirname + "/test.html")
  fs.removeSync(__dirname + "/test2.html")
})

test("render", function(done) {
  var viewCalled

  expect.assertions(3)

  log(dot)

  dot.beforeAny("myView", function(prop, arg) {
    viewCalled = true
    var element = el("html")
    arg.element.appendChild(element)
    return element
  })

  dot
    .render({
      outDir: "./",
      views: {
        "test.html": { event: "myView" },
        "test2.html": { event: "myView" },
      },
    })
    .then(function() {
      expect(viewCalled).toBe(true)
      expect(readFile("test")).toBe(
        "<!doctype html><html></html>"
      )
      expect(readFile("test2")).toBe(
        "<!doctype html><html></html>"
      )
      done()
    })
})

test("renderCapture", function() {
  var wait = function(ms) {
    return new Promise(function(r) {
      setTimeout(r, ms)
    })
  }

  dot.any("wait10", wait.bind(null, 10))
  dot.any("wait20", wait.bind(null, 20))

  dot.wait20()
  expect(dot.state.events.size).toBe(1)

  var finish = dot.renderCapture()
  expect(dot.state.events.size).toBe(2)

  dot.wait10()
  expect(dot.state.events.size).toBe(3)

  return finish().then(function() {
    expect(dot.state.events.size).toBe(1)
  })
})
