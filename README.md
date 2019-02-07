# @dot-event/render

[dot-event](https://github.com/dot-event/dot-event2#readme) server side renderer

![render](render.gif)

## Install

```bash
npm install dot-event @dot-event/render
```

## Setup

```js
const dot = require("dot-event")()
require("@dot-event/render")(dot)
```

## Usage

The render call creates HTML files from event(s) that return a DOM element:

```js
require("./layoutPage").default(dot)

dot.render({
  outDir: "./bundle",
  views: {
    "index.html": {
      event: "layoutPage",
    },
  },
})
```

> ℹ️ The renderer waits for all [dot-event promises](https://github.com/dot-event/dot-event2#wait-for-pending-events) to complete before writing the final output.

> ⚠️ Render calls should be made synchronously. Use separate processes if you need concurrency.

> ⚠️ This library is not meant to be bundled with client assets.

## Related composers

| Library    | Description    | URL                                            |
| ---------- | -------------- | ---------------------------------------------- |
| controller | DOM controller | https://github.com/dot-event/controller#readme |
| el         | DOM elements   | https://github.com/dot-event/el#readme         |
| view       | DOM view       | https://github.com/dot-event/view#readme       |
