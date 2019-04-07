# @emit-js/render

[emit](https://github.com/emit-js/emit#readme) server side renderer

![render](render.gif)

## Install

```bash
npm install @emit-js/emit @emit-js/render
```

## Setup

```js
const emit = require("@emit-js/emit")()
require("@emit-js/render")(emit)
```

## Usage

The render call creates HTML files from event(s) that return a DOM element:

```js
require("./layoutPage")(emit)

emit.render({
  outDir: "./bundle",
  views: {
    "index.html": {
      event: "layoutPage",
    },
  },
})
```

> ℹ️ The renderer waits for all [emit promises](https://github.com/emit-js/emit#wait-for-pending-events) to complete before writing the final output.

> ⚠️ Render calls should be made synchronously. Use separate processes if you need concurrency.

> ⚠️ This library is not meant to be bundled with client assets.

## Related composers

| Library    | Description    | URL                                          |
| ---------- | -------------- | -------------------------------------------- |
| controller | DOM controller | https://github.com/emit-js/controller#readme |
| el         | DOM elements   | https://github.com/emit-js/el#readme         |
| view       | DOM view       | https://github.com/emit-js/view#readme       |
