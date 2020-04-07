---
id: getting-started-apps-configuration
title: Apps configuration
---

StaticDeploy allows static applications to be configured at runtime, i.e. when
StaticDeploy serves them. Its strategy for doing so is very simple, and consists
in injecting into html pages a javascript snippet defining a configuration
object as a global variable (`window.APP_CONFIG`) that the application code can
then read.

A configuration object is a json `(string, string)` dictionary. Each entrypoint
has a configuration object associated with it, which will be injected into the
html pages of the entrypoint's bundle. The configuration object can either be
specific to the entrypoint, or be the default configuration object of the
entrypoint's app (both are defined by you, the StaticDeploy admin).

The configuration snippet is injected into an html page as content of a
`<script>` element with id `app-config` found in the page. If the page doesn't
contain any such element, nothing is injected.

StaticDeploy adds the following variables to the injected configuration object:

- `BASE_PATH`: the base path of the entrypoint at which the html page is being
  served

## Example

Suppose you have a bundle `example-app:master` containing the following
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

You deploy the bundle to entrypoint `example-app.com/base-path/`, for which you
have defined the following configuration object:

```json
{
  "EXAMPLE_CONFIG_KEY": "EXAMPLE_CONFIG_VALUE"
}
```

When you request `http://example-app.com/base-path/index.html` you get the
following html as response:

```html
<head>
  <title>Example app</title>
  <script id="app-config">
    window.APP_CONFIG = {
      // Configuration variables defined on the entrypoint
      EXAMPLE_CONFIG_KEY: "EXAMPLE_CONFIG_VALUE",
      // Configuration variables added by StaticDeploy
      BASE_PATH: "/base-path/",
    };
  </script>
  <script>
    // App code which accesses the configuration object
    console.log(window.APP_CONFIG);
  </script>
</head>
```

## Configuring the app during development

You have a few different possibilities to inject configuration into your apps
during development.

#### Basic approach

A very quick and simple approach is to define a default `window.APP_CONFIG` for
development directly inside the script:

```html
<script id="app-config">
  /* Development values */
  window.APP_CONFIG = { ... };
</script>
```

StaticDeploy will replace it on serve with the correct configuration of the
served entrypoint.

#### Flexible approach

Another more complex but more flexible approach is to use the `src` attribute of
the `app-config` script, pointing it to _something that returns a configuration
snippet_. One such thing is the
[dev-config-server](https://github.com/staticdeploy/app-config/blob/master/docs/dev-config-server-cli-options.md)
provided by
[@staticdeploy/app-config](https://github.com/staticdeploy/app-config), which
generates the configuration snippet from variables defined in a `.env` file and
serves it at `//localhost:3456/app-config.js`.

```html
<script id="app-config" src="//localhost:3456/app-config.js"></script>
```

The `src` approach is supported by StaticDeploy which strips the attribute from
the `<script>` element when serving it.
