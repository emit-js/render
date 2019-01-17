/** @jsx el */
/* eslint-env jest */

var dot = require("dot-event")()
var log = require("@dot-event/log")
var el = require("attodom").el
var fs = require("fs-extra")
var render = require("./")

beforeEach(function() {
  dot.reset()
  log(dot)
  render(dot)
  fs.removeSync(__dirname + "/test.html")
  fs.removeSync(__dirname + "/test2.html")
})

test("hello", function() {
  var viewCalled

  dot.beforeAny("myView", function(prop, arg) {
    viewCalled = true
    arg.element.appendChild(el("html"))
  })

  dot.render({
    outDir: "./",
    views: {
      "test.html": { event: "myView" },
      "test2.html": { event: "myView" },
    },
  })

  expect(viewCalled).toBe(true)
  expect(
    fs.readFileSync(__dirname + "/test.html").toString()
  ).toBe("<html></html>")
  expect(
    fs.readFileSync(__dirname + "/test2.html").toString()
  ).toBe("<html></html>")
})
