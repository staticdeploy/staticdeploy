---
id: getting-started-apps-configuration
title: Apps configuration
---

StaticDeploy allows to configure static applications at runtime, i.e. when
StaticDeploy serves them. Its strategy for doing so is very simple, and consists
in injecting into html pages a javascript snippet defining a configuration
object as a global variable (`window.APP_CONFIG`) that the application code can
then read.

A configuration object is a json `(string, string)` dictionary. Each entrypoint
has a configuration object associated with it, which will be injected into the
html pages of the entrypoint's bundle. The configuration object can either be
specific to the entrypoint, or be the default configuration object of the
entrypoint's app.

The configuration snippet is injected into an html page as content of a
`<script>` element with id `app-config` found in the page. If the page doesn't
contain any such element, nothing is injected.

## Example

Suppose we have a bundle `example-app:master` containing the following
`/index.html` file:

```html
<head>
  <title>Example app</title>
  <script id="app-config"></script>
  <script>
    // App code which accesses the configuration object
    console.log(window.APP_CONFIG);
  </script>
</head>
```

We deploy the bundle to entrypoint `example-app.com/`, which has the following
configuration object:

```json
{
  "EXAMPLE_CONFIG_KEY": "EXAMPLE_CONFIG_VALUE"
}
```

When we request `http://example-app.com/index.html` we get the following html as
response:

```html
<head>
  <title>Example app</title>
  <script id="app-config">
    window.APP_CONFIG = { "EXAMPLE_CONFIG_KEY": "EXAMPLE_CONFIG_VALUE" };
  </script>
  <script>
    // App code which accesses the configuration object
    console.log(window.APP_CONFIG);
  </script>
</head>
```

## Configuring the app during development

We have a few different possibilities to inject configuration into our apps
during development.

A very quick and simple approach is to define a default `window.APP_CONFIG` for
development directly inside the script. StaticDeploy will replace it on serve
with the correct configuration of the served entrypoint.

Another more complex but more flexible approach is to use the `src` attribute of
the `app-config` script, pointing it to _something_ that returns a configuration
snippet. One such _thing_ is the
[dev-config-server](https://github.com/staticdeploy/app-config/blob/master/docs/dev-config-server-cli-options.md)
provided by
[@staticdeploy/app-config](https://github.com/staticdeploy/app-config), which
generates the configuration snippet from variables defined in a `.env` file and
serves it at `//localhost:3456/app-config.js`.

The `src` approach is supported by StaticDeploy which strips the attribute from
the `<script>` element when serving it.
