---
id: use-with-vue-cli
title: Vue CLI
---

Generally speaking, apps created and built with
[Vue CLI](https://cli.vuejs.org/) can be deployed on StaticDeploy without any
modification.

However, you can take advantage of StaticDeploy's runtime configuration
injection to avoid having to specify your app's configuration at **build-time**
with environment variables.

The following build-time environment variables are used by Vue CLI for
configuration:

- `BASE_URL` (or the `publicPath` option in `vue.config.js`): specifies the path
  at which the app is deployed. It defaults to `/`, so you typically have to set
  it when your app is deployed at a non-root path, like `example.com/my-app/`
- `VUE_APP_*` variables: defined by the developer, they're used for injecting
  things like API urls, Google Analytics tracking ids, etc

When you're deploying with StaticDeploy, you can:

- build the app with `BASE_URL=./`. StaticDeploy's
  [smart routing algorithm](/docs/reference-requests-routing) will take care of
  serving the correct file even when the app is deployed at a non-root path

- add the snippet below in your `public/index.html`, and in your JS code replace
  `process.env.VUE_APP_*` with `window.APP_CONFIG.*`. You can then specify the
  variables in the Management Console when you deploy your app, and StaticDeploy
  will inject them **at runtime** in the html

  ```html
  <!-- public/index.html -->
  <script id="app-config">
    /* You can put the values to use in development here */
    window.APP_CONFIG = { ... };
  </script>
  ```

> **Note**: when using
> [Vue Router in history mode](https://router.vuejs.org/guide/essentials/history-mode.html),
> another bit of setup is needed to make the app completely
> runtime-configurable. Check out the
> [Using a client-side router](/docs/guides-using-a-client-side-router) guide
> for details
