---
id: getting-started-overview
title: Overview
---

StaticDeploy is an open-source platform for deploying and configuring static web
applications and websites. We can think about it as a
[Kubernetes](https://kubernetes.io/) for static content.

StaticDeploy was created with two objectives in mind:

- make it easy to configure a static app at runtime, as opposed to injecting the
  configuration into its static build

- make it easy to deploy multiple "versions" of a static app, specifically a
  version for each branch / pull request, so that frontend developers can show
  their work-in-progress and get early feedback from their clients

Before finding out how StaticDeploy reaches these goals, let's get an idea of
the entities StaticDeploy deals with.

## Entities

### Bundles

Bundles are tar.gz archives of static content (assets), plus associated metadata
describing the archives (a name, a tag, a description, etc.). Conceptually
bundles are equivalent to docker images.

Bundles must specify a fallback asset, an asset that will be served to requests
that don't match any other asset.

Bundles can be created with the `create-bundle` command of the StaticDeploy cli,
by giving it a folder that gets archived into a tar.gz and uploaded to the
StaticDeploy backend.

### Entrypoints

Entrypoints are the urls at which the StaticDeploy backend serves the static
content of bundles. Each entrypoint is characterized by two properties:

- `bundleId`: the id of the bundle to serve
- `urlMatcher`: a domain + path combination against which incoming requests are
  matched to determine wether or not they should be served the static content of
  the entrypoint's bundle

Entrypoints may specify a configuration, a `(string, string)` dictionary that is
injected at serve-time into the html files of the bundle.

Entrypoints can be created manually from StaticDeploy's admin console, or
automatically when deploying a bundle with the `deploy` command of the
StaticDeploy cli.

### Apps

Apps are groups of entrypoints. Apps define a default configuration to be used
for entrypoints which don't define one.

Apps can be created manually from StaticDeploy's admin console, or automatically
when deploying a bundle with the `deploy` command of the StaticDeploy cli.

## Reaching the goals

### Runtime configuration

As written above, each entrypoint has a configuration object that gets injected
into the html files of the entrypoint's bundle when they're being served. To
allow StaticDeploy to do so, we simply have to define - in the html files which
we want to be "configured" - a `<script>` element with id `app-config`.
StaticDeploy will inject into the element a javascript snippet defining the
global variable `window.APP_CONFIG` and assigning it the value of the
configuration object.

#### Example

<div class="splitter">
<div class="left">
Source html:

```html
<head>
  <script id="app-config"></script>
  <!-- ... -->
</head>
```

</div>
<div class="right">
Served html:

```html
<head>
  <script id="app-config">
    window.APP_CONFIG = { /* configuration */ };
  </script>
  <!-- ... -->
</head>
```

</div>
</div>

The [configuration page](/docs/getting-started.apps-configuration.html) of the
documentation goes in more details about how configuration works.

### Multiple versions

Bundles and entrypoints are very "cheap" objects in StaticDeploy: we can have
thousands of them without incurring into significant degradations of
performance.

This means we can create bundles for every commit of every app we deploy on
StaticDeploy. And we could deploy each bundle to a unique entrypoint, though we
might prefer to take different approaches, like having one entrypoint for each
branch of each app.

Creating a bundle is quite simple, and we would typically do it on our CI server
after building our app. For instance, for a
[react app](https://github.com/facebook/create-react-app) we would do something
like:

```sh
# Build the app, saving static artifacts into the build/ folder
npm run build
# Create a bundle from that folder
staticdeploy create-bundle \
  --from build/
  --name example-app \
  --tag $BRANCH \
  --description "Build of commit $COMMIT"
```

Deploying bundles is equally easy, and StaticDeploy allows us to choose
whichever url scheme we want for deploying our apps' versions. For instance, for
deploying each branch of the example react app above, in our CI server we'd run:

```sh
staticdeploy deploy
  --app example-app
  --entrypoint $BRANCH.example-app.com/
  --bundle example-app:$BRANCH
```

But we could choose different url schemes for the app's entrypoints, like
`prefix-$BRANCH.example-app.com/` or `example-app.com/$BRANCH/`.

The [workflow page](/docs/getting-started.cicd-workflows.html) of the
documentation explores different workflows for deploying static apps.
