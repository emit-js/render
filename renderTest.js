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
  log(dot)
  render(dot)
  fs.removeSync(__dirname + "/test.html")
  fs.removeSync(__dirname + "/test2.html")
})

test("hello", function(done) {
  var viewCalled

  expect.assertions(3)

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
      expect(readFile("test")).toBe("<html></html>")
      expect(readFile("test2")).toBe("<html></html>")
      done()
    })
})
