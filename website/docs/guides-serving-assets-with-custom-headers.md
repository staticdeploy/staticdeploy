---
id: guides-serving-assets-with-custom-headers
title: Serving assets with custom headers
---

StaticDeploy allows you to specify custom headers to use when serving assets.
For example, if you have a bundle containing assets `index.html` and `index.js`,
you can tell StaticDeploy to serve `index.html` with header
`Cache-Control: must-revalidate`, and `index.js` with `Cache-Control: public`.

Custom headers are specified per-asset when creating a bundle, using the
`headers` options of the StaticDeploy CLI `bundle` command. Example (using a
config file):

```js
module.exports = {
  bundle: {
    // ... other options
    headers: {
      "**/*.html": {
        "Cache-Control": "must-revalidate"
      },
      "**/*.js": {
        "Cache-Control": "public"
      }
    }
  }
};
```

The `headers` option is a `(asset matcher, headers)` map. `asset matcher` is a
[glob pattern](https://github.com/micromatch/micromatch) used to match assets'
paths, while the `headers` object containing the headers to use when serving the
matching assets.

Common use cases for custom headers are:

- specifying caching policies
- specifying security headers
- overriding an asset's `Content-Type`
